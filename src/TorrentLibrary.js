// module for exploring directories
import FileHound  from 'filehound';

// module fs from node
import {access} from 'fs';

// Promise lib
import PromiseLib from 'bluebird'

// List of video file extensions
import videosExtension from 'video-extensions';

// event emitter , if state changes
import {
    EventEmitter
} from 'events';

class TorrentLibrary extends EventEmitter {

    constructor() {
        super();
        // just an easy way to scan the current directory path, if not other paths provided
        this.defaultPath = process.cwd();
        // the paths where we are looking the media files
        this.paths = [];
    }

    static listVideosExtension(){
        return videosExtension;
    }

    addNewPath(...paths){
        // the user should provide us at lest a path
        if (paths.length === 0)
            return missingParam();

        let that = this;
        return new PromiseLib(function (resolve,reject) {

            return new PromiseLib.map(paths, function (path) {
                // https://nodejs.org/api/fs.html#fs_fs_access_path_mode_callback
                // check if directory exists and is readable
                return access(path, fs.constants.F_OK | fs.constants.R_OK);
            }).then(function () {
                that.paths = [...that.paths, ...paths];
                resolve("All paths were added!");
            }).catch(e => {
                reject("Cannot find/read a path");
            })

        });

    }

    hasPathsProvidedByUser(){
        return this.paths.length === 0;
    }

    scan(){

        const files = FileHound.create()
            .paths( (this.paths.length === 0) ? this.defaultPath : this.paths)
            .ext(videosExtension)
            .find();

        return files;

    }

}

// rejected promise when someone doesn't provide
function missingParam() {
    return new PromiseLib(function (resolve,reject) {
       reject("Missing parameter");
    });
}

export default TorrentLibrary;