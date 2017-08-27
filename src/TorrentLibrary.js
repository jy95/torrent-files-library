// JSDoc custom typedef
/**
 * The result of parsing file name
 * @typedef {Object} TPN
 * @see {@link https://github.com/jy95/torrent-name-parser}
 * @property {(string)} title - The file title
 * @property {(number|undefined)} season - The season number
 * @property {(number|undefined)} episode - The episode number
 * @property {(string|undefined)} episodeName - The episode name
 * @property {(number|undefined)} year - The year
 * @property {(string|undefined)} resolution - The resolution
 * @property {(string|undefined)} quality - The quality
 * @property {(string|undefined)} codec - The codec
 * @property {(string|undefined)} audio - The audio
 * @property {(string|undefined)} group - The group that releases this file
 * @property {(string|undefined)} region - The quality
 * @property {(string|undefined)} extended - extended ?
 * @property {(string|undefined)} hardcoded - hardcoded ?
 * @property {(string|undefined)} proper - proper ?
 * @property {(string|undefined)} repack - repack ?
 * @property {(string|undefined)} container - The container
 * @property {(string|undefined)} website - The website that releases this file
 * @property {(string|undefined)} language - The file language
 * @property {(string|undefined)} excess - Unmatched text from filename
 */

/**
 * The extended TPN object
 * @typedef {TPN} TPN_Extended
 * @property {string} filePath - additionnal property useful for this library
 */

/**
 * The variable where we store all kind of media files found in paths
 * @typedef {Map.<string, {( Set<TPN_Extended>| Map.<string,Set<TPN_Extended>> )}>} StoreVar
 * @example
 * // An example of the variable after the scan method
 * [
 *      "MOVIES" : [
 *         {
 *            "year": 2014,
 *            "resolution": '1080p',
 *            "quality": 'BrRip',
 *            "codec": 'x264',
 *            "container": 'MKV',
 *            "title": 'Captain Russia The Summer Soldier',
 *            "filePath": "D:\somePath\Captain Russia The Summer Soldier (2014) 1080p BrRip x264.MKV"
 *         }
 *      ],
 *      "TV_SERIES" : [
 *          "The Blacklist" : [
 *              {
 *                  "season": 4,
 *                  "episode": 21,
 *                  "quality": "WEBRip",
 *                  "codec": "XviD",
 *                  "container": "avi",
 *                  "language": "FRENCH"
 *                  "filePath" : "D:\somePath\The.Blacklist.S04E21.FRENCH.WEBRip.XviD.avi"
 *              }
 *          ]
 *      ]
 * ]
 */


/**
 * module for exploring directories
 * @external FileHound
 * @see {@link https://nspragg.github.io/filehound/}
 */
import FileHound from 'filehound';

/**
 * Access method from module fs (node)
 * @external access
 * @see {@link https://nodejs.org/api/fs.html#fs_fs_access_path_mode_callback}
 */
import {access} from 'fs';

/**
 * Basename method from module path (node)
 * @external basename
 * @see {@link https://nodejs.org/api/path.html#path_path_basename_path_ext}
 */
import {basename} from 'path';

/**
 * uniq method from Lodash
 * @external uniq
 * @see {@link https://lodash.com/docs/4.17.4#uniq}
 */
import {uniq} from 'lodash';
/**
 * difference method from lodash
 * @external difference
 * @see {@link https://lodash.com/docs/4.17.4#difference}
 */
import {difference} from 'lodash';

/**
 * A promise object provided by the bluebird promise library.
 * @external Promise
 * @see {@link http://bluebirdjs.com/docs/api-reference.html}
 */
import PromiseLib from 'bluebird'

/**
 * List of video file extensions
 * @external videosExtension
 * @see {@link https://github.com/sindresorhus/video-extensions}
 */
import videosExtension from 'video-extensions';

/**
 * Parser for media files name
 * @external nameParser
 * @see {@link https://github.com/jy95/torrent-name-parser}
 */
import nameParser from 'torrent-name-parser'

/**
 * Constants for fs access
 */
import {
    constants as FsConstants
} from 'fs'

import {
    EventEmitter
} from 'events';

/**
 * Class representing the TorrentLibrary
 * @class
 * @extends EventEmitter
 * @see {@link https://nodejs.org/api/events.html#events_class_eventemitter } for further information.
 */
class TorrentLibrary extends EventEmitter {

    /**
     * constant for movie category
     * @since 0.0.0
     * @return {string} the movies constant
     * @static
     */
    static get MOVIES_TYPE() {
        return "MOVIES"
    }

    /**
     * constant for tv series category
     * @return {string} tv series constant
     * @since 0.0.0
     * @static
     */
    static get TV_SERIES_TYPE() {
        return "TV_SERIES"
    }

    /**
     * Create a TorrentLibrary
     */
    constructor() {
        super();
        /**
         * just an easy way to scan the current directory path, if not other paths provided
         * @member  {string}
         * @default the directory from which you invoked the node command
         */
        this.defaultPath = process.cwd();
        /**
         * the paths where we are looking the media files
         * @member {String[]}
         * @default []
         * @example
         * // after have added some paths ...
         * [ "D:\somePath", "D:\anotherPath" ]
         */
        this.paths = [];
        /**
         * The variable where we store all kind of media files found in paths
         * @member {StoreVar}
         */
        this.stores = new Map([
            [TorrentLibrary.MOVIES_TYPE, new Set()],
            [TorrentLibrary.TV_SERIES_TYPE, new Map()]
        ]);
        /**
         * Mapping filepath => category
         * @type {Map.<string,string>}
         * @example
         * { "D:\somePath\Captain Russia The Summer Soldier (2014) 1080p BrRip x264.MKV" => TorrentLibrary.MOVIES_TYPE }
         */
        this.categoryForFile = new Map();
        /**
         * Private method for adding new files
         * @private
         * @param files {string[]} An array of filePath
         */
        this.addNewFiles = function (files) {

            // find the new files to be added
            let alreadyFoundFiles = [...this.categoryForFile.keys()];
            let newFiles = difference(files, alreadyFoundFiles);

            // temp var for new files before adding them to stores var
            let moviesSet = new Set();
            let tvSeriesSet = new Set();

            // get previous result of stores var
            let newMovies = this.stores.get(TorrentLibrary.MOVIES_TYPE);
            let newTvSeries = this.stores.get(TorrentLibrary.TV_SERIES_TYPE);

            // process each file
            for (let file of newFiles) {
                // get data from nameParser lib
                // what we need is only the basename, not the full path
                let jsonFile = nameParser(basename(file));
                // extend this object in order to be used by this library
                Object.assign(jsonFile, {"filePath": file});
                // find out which type of this file
                // if it has not undefined properties (season and episode) => TV_SERIES , otherwise MOVIE
                let fileCategory = ( checkProperties(jsonFile, ["season", "episode"]) )
                    ? TorrentLibrary.TV_SERIES_TYPE : TorrentLibrary.MOVIES_TYPE;
                // add it in found files
                this.categoryForFile.set(file, fileCategory);
                // also in temp var
                (fileCategory === TorrentLibrary.TV_SERIES_TYPE) ? tvSeriesSet.add(jsonFile) : moviesSet.add(jsonFile);
            }

            // add the movies into newMovies
            newMovies = new Set([...newMovies, ...moviesSet]);

            // add the tv series into newTvSeries
            // First step : find all the series not in newTvSeries and add them to newTvSeries
            difference(
                uniq(
                    [...tvSeriesSet].map(function (tvSeries) {
                        return tvSeries.title;
                    })
                ),
                ...newTvSeries.keys()
            ).forEach(function (tvSeriesToInsert) {
                newTvSeries.set(tvSeriesToInsert, new Set());
            });

            // Second step : add the new files into the correct tvSeries Set
            uniq(
                [...tvSeriesSet].map(function (tvSeries) {
                    return tvSeries.title;
                })
            ).forEach(function (tvSerie) {

                // get the current set for this tvSerie
                let currentTvSerie = newTvSeries.get(tvSerie);

                // find all the episodes in the new one for this serie
                let episodes = [...tvSeriesSet].filter(function (episode) {
                    return episode.title === tvSerie;
                });

                // add them and updates newTvSeries
                newTvSeries.set(tvSerie, new Set([...currentTvSerie,...episodes]));

            });

            // updates the stores var
            this.stores.set(TorrentLibrary.MOVIES_TYPE, newMovies);
            this.stores.set(TorrentLibrary.TV_SERIES_TYPE, newTvSeries);
        }
    }

    /**
     * Provides the array of files extensions considered to be media extensions
     * @return {string[]} array of files extensions
     * @since 0.0.0
     * @example
     * // Returns [..., 'webm', 'wmv']
     * TorrentLibrary.listVideosExtension()
     * @static
     */
    static listVideosExtension() {
        return videosExtension;
    }

    /**
     * Add the path(s) to be analyzed by the library if they exist and are readable
     * @param {string} paths - A or more path(s)
     * @instance
     * @method
     * @since 0.0.0
     * @example
     * // return resolved Promise "All paths were added!"
     * TorrentLibraryInstance.addNewPath("C:\Users\jy95\Desktop\New folder","C:\Users\jy95\Desktop\New folder2");
     * @return {external:Promise}  On success the promise will be resolved with "All paths were added!"<br>
     * On error the promise will be rejected with an Error object "Missing parameter" if the argument is missing<br>
     * or an Error object from fs <br>
     */
    addNewPath(...paths) {
        // the user should provide us at lest a path
        if (paths.length === 0)
            return missingParam();

        let that = this;
        return new PromiseLib(function (resolve, reject) {

            PromiseLib.map(paths, function (path) {
                return promisifiedAccess(path);
            }).then(function () {
                // keep only unique paths
                that.paths = uniq([...that.paths, ...paths]);
                resolve("All paths were added!");
            }).catch(e => {
                reject(e);
            })

        });

    }

    /**
     * Tell us if the user has provided us paths
     * @instance
     * @method
     * @since 0.0.0
     * @returns {boolean} Has user provided us paths ?
     */
    hasPathsProvidedByUser() {
        return this.paths.length === 0;
    }

    /**
     * Scans the paths in search for new files to be added inside this lib
     * @instance
     * @method
     * @since 0.0.0
     * @return {external:Promise}  On success the promise will be resolved with "Scanning completed"<br>
     * On error the promise will be rejected with an Error object from sub modules<br>
     */
    scan() {

        const foundFiles = FileHound.create()
            .paths((this.paths.length === 0) ? this.defaultPath : this.paths)
            .ext(videosExtension)
            .find();
        let that = this;

        return new PromiseLib(function (resolve, reject) {
            foundFiles
                .then(function (files) {
                    that.addNewFiles(files);
                    resolve("Scanning completed");
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }

    /**
     * Getter for all found movies
     * @instance
     * @method
     * @since 0.0.0
     * @return {Set.<TPN_Extended>}
     * @example
     * // an JSON stringified example of this method
     * [
     *  {
     *   "year":2012,
     *   "quality":"DVDRiP",
     *   "codec":"XviD",
     *   "group":"-www.zone-telechargement.ws.avi",
     *   "container":"avi",
     *   "language":"TRUEFRENCH",
     *   "title":"Bad Ass",
     *   "excess":"LiMiTED",
     *   "filePath":"D:\\workspaceNodeJs\\torrent-files-library\\test\\folder1\\Bad.Ass.2012.LiMiTED.TRUEFRENCH.DVDRiP.XviD-www.zone-telechargement.ws.avi"
     *  }
     * ]
     */
    get allMovies() {
        return this.stores.get(TorrentLibrary.MOVIES_TYPE);
    }

    /**
     * Getter for all found tv-series
     * @instance
     * @method
     * @since 0.0.0
     * @return {Map.<string, Set.<TPN_Extended>>}
     * @example
     * // an JSON stringified example of this method
     * {
   * "The Blacklist":[
   *    {
   *      "season":4,
   *      "episode":21,
   *      "quality":"WEBRip",
   *      "codec":"XviD",
   *      "container":"avi",
   *      "language":"FRENCH",
   *      "title":"The Blacklist",
   *      "filePath":"D:\\workspaceNodeJs\\torrent-files-library\\test\\folder1\\The.Blacklist.S04E21.FRENCH.WEBRip.XviD.avi"
   *   },
   *   {
   *      "season":4,
   *      "episode":14,
   *      "quality":"WEBRip",
   *      "codec":"XviD",
   *      "container":"avi",
   *      "language":"FRENCH",
   *      "title":"The Blacklist",
   *      "filePath":"D:\\workspaceNodeJs\\torrent-files-library\\test\\folder2\\The.Blacklist.S04E14.FRENCH.WEBRip.XviD.avi"
   *   }
   * ]
* }
     */
    get allTvSeries() {
        return this.stores.get(TorrentLibrary.TV_SERIES_TYPE);
    }

    /**
     * return the mapping between filepaths and category
     * @return {Map.<string,string>}
     * @instance
     * @method
     * @since 0.0.0
     * @example
     * { "D:\somePath\Captain Russia The Summer Soldier (2014) 1080p BrRip x264.MKV" => TorrentLibrary.MOVIES_TYPE }
     */
    get allFilesWithCategory() {
        return this.categoryForFile;
    }

}

// rejected promise when someone doesn't provide
function missingParam() {
    return new PromiseLib(function (resolve, reject) {
        reject(new Error("Missing parameter"));
    });
}

// check if an object has these properties and they are not undefined
function checkProperties(obj, properties) {
    return properties.every(function (x) {
        return x in obj && obj[x];
    })
}

/**
 * Bluebird seems to have an issue with fs.access - Workaround function
 * @private
 * @param path {string}
 * @see {@link https://github.com/petkaantonov/bluebird/issues/1442}
 */
function promisifiedAccess(path) {
    return new PromiseLib(function (resolve,reject) {
        access(path, FsConstants.F_OK | FsConstants.R_OK, (err) => {
           if (err) reject(err);
           resolve();
        });
    })
}

export default TorrentLibrary;