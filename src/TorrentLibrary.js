// module for exploring directories
import FileHound  from 'filehound';

// List of video file extensions
import videosExtension from 'video-extensions';

// event emitter , if state changes
import {
    EventEmitter
} from 'events';

class TorrentLibrary extends EventEmitter {

    constructor() {
        super();
    }

    static listVideosExtension(){
        return videosExtension;
    }

}

export default TorrentLibrary;