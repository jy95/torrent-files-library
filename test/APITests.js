import TorrentLibrary from "../lib/TorrentLibrary";
import videosExtension from 'video-extensions';
import assert from "assert";

describe("TorrentLibrary tests",function () {

    let libInstance;

    // initialization
    before(function () {
        libInstance = new TorrentLibrary();
    });

    describe("Static methods", function () {

        context("listVideosExtension()", function () {

            it("should provide the same list of videos extensions", function () {
                assert.deepEqual(JSON.stringify(videosExtension), JSON.stringify(TorrentLibrary.listVideosExtension()), "Not the same JSON" );
            });

        });

        context("Constants", function () {

            it("MOVIES_TYPE", function () {
                assert.equal(TorrentLibrary.MOVIES_TYPE,  "MOVIES", "Someone changed this constant value !");
            });

            it("TV_SERIES_TYPE", function () {
                assert.equal(TorrentLibrary.TV_SERIES_TYPE,  "TV_SERIES", "Someone changed this constant value !");
            });

        });

    });

    describe("Instance Methods - To be implemented", function () {

        /*
        context("addNewPath()", function () {

            it("missing parameter",function (done) {
                return libInstance.addNewPath()
                    .then( () => {
                        done(new Error("Missing parameter"));
                    })
                    .catch( (err) => {
                        done();
                    })
            })

        });
        */

    });

});
