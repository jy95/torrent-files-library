import TorrentLibrary from "../lib/TorrentLibrary";
import videosExtension from 'video-extensions';
import assert from "assert";

describe("TorrentLibrary tests",function () {

    let libInstance;

    // initialization
    before(function () {
        libInstance = new TorrentLibrary();
    });

    context("listVideosExtension()", function () {

        it("should provide the same list of videos extensions", function () {
            assert.deepEqual(JSON.stringify(videosExtension), JSON.stringify(TorrentLibrary.listVideosExtension()), "Not the same JSON" );
        });

    });
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
