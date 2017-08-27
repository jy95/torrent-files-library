import TorrentLibrary from "../lib/TorrentLibrary";
import videosExtension from 'video-extensions';
import assert from "assert";
import path from "path";
import fs from "fs";
import nameParser from 'torrent-name-parser';
import _ from "lodash";

// just a cross plateform way to remove folder recursively
function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

describe("TorrentLibrary tests", function () {

    let libInstance;
    let folders = [path.join(__dirname, "folder1"), path.join(__dirname, "folder2")];
    let files = [
        path.join(__dirname, "folder1", "The.Blacklist.S04E21.FRENCH.WEBRip.XviD.avi"),
        path.join(__dirname, "folder2", "The.Blacklist.S04E14.FRENCH.WEBRip.XviD.avi"),
        path.join(__dirname, "folder1", "Bad.Ass.2012.LiMiTED.TRUEFRENCH.DVDRiP.XviD-www.zone-telechargement.ws.avi")
    ];

    // initialization
    before(function () {
        libInstance = new TorrentLibrary();
    });

    describe("Static methods", function () {

        context("listVideosExtension()", function () {

            it("should provide the same list of videos extensions", function () {
                assert.deepEqual(JSON.stringify(videosExtension), JSON.stringify(TorrentLibrary.listVideosExtension()), "Not the same JSON");
            });

        });

        context("Constants", function () {

            it("MOVIES_TYPE", function () {
                assert.equal(TorrentLibrary.MOVIES_TYPE, "MOVIES", "Someone changed this constant value !");
            });

            it("TV_SERIES_TYPE", function () {
                assert.equal(TorrentLibrary.TV_SERIES_TYPE, "TV_SERIES", "Someone changed this constant value !");
            });

        });

    });

    describe("Instance Methods", function () {

        context("addNewPath()", function () {

            it("missing parameter", function (done) {
                libInstance.addNewPath()
                    .then(() => {
                        done(new Error("Missing parameter"));
                    })
                    .catch(() => {
                        done();
                    })
            });

            it("inexistent Path", function (done) {
                libInstance.addNewPath(path.join(__dirname, "wrongPath"))
                    .then(() => {
                        done(new Error("This path should not exist or be readable"));
                    })
                    .catch(() => {
                        done();
                    })
            });


            it("existent paths", function (done) {
                libInstance.addNewPath(...folders)
                    .then(() => {
                        done()
                    }).catch((err) => {
                        done(err);
                    })
            });
        });

        context("scan() (and sub methos related)", function () {
            this.timeout(15000);

            it("Scan without user provided paths must work",function (done) {
               let tempInstance = new TorrentLibrary();
                tempInstance.scan().then(function () {
                    done();
                }).catch((err) => {
                    done(err);
                });
            });

            it("Scan with user provided paths must work", function (done) {
                libInstance.scan().then(function () {
                    done();
                }).catch((err) => {
                    done(err);
                });
            });

            it("allMovies()",function () {
                let expectedSet = new Set([
                    Object.assign(nameParser( path.basename(files[2])), {"filePath": files[2]})
                ]);
                let resultedSet = libInstance.allMovies;
                assert.equal(_.isEqual(expectedSet,resultedSet),true, "Not the same");
            });

            it("allTvSeries()", function () {
                let expectedMap = new Map([
                   [ nameParser(path.basename(files[0])).title, new Set([
                       Object.assign(nameParser( path.basename(files[0])), {"filePath": files[0]}),
                       Object.assign(nameParser( path.basename(files[1])), {"filePath": files[1]})
                   ]) ]
                ]);
                let resultedMap = libInstance.allTvSeries;
                assert.equal(_.isEqual(expectedMap,resultedMap),true ,"Not the same");
            });

            it("allFiles()", function () {
                let expectedMap = new Map([
                   [ files[0], TorrentLibrary.TV_SERIES_TYPE ],
                    [ files[1], TorrentLibrary.TV_SERIES_TYPE ],
                    [ files[2], TorrentLibrary.MOVIES_TYPE ],
                ]);
                let resultedMap = libInstance.allFilesWithCategory;
                assert.equal(_.isEqual(expectedMap,resultedMap),true ,"Not the same");
            });
        })

    });

});
