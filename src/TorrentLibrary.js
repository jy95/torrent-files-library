/**
 * module for exploring directories
 * @see {@link https://nspragg.github.io/filehound/}
 */
import FileHound from 'filehound';

/**
 * Access method from module fs (node) with constants
 * @see {@link https://nodejs.org/api/fs.html#fs_fs_access_path_mode_callback}
 * @see {@link https://nodejs.org/api/fs.html#fs_fs_constants_1}
 */
import {
  access,
  constants as FsConstants,
} from 'fs';

/**
 * Basename and normalize methods from module path (node)
 * @see {@link https://nodejs.org/api/path.html#path_path_basename_path_ext}
 * @see {@link https://nodejs.org/api/path.html#path_path_normalize_path}
 */
import { basename, normalize } from 'path';


/**
 * uniq and difference methods from Lodash
 * @see {@link https://lodash.com/docs/4.17.4#uniq}
 * @see {@link https://lodash.com/docs/4.17.4#difference}
 * @see {@link https://lodash.com/docs/4.17.4#partition}
 * @see {@link https://lodash.com/docs/4.17.4#cloneDeep}
 */
import { uniq, difference, partition, cloneDeep } from 'lodash';

/**
 * A promise object provided by the bluebird promise library.
 * @external Promise http://bluebirdjs.com/docs/api-reference
 */
import PromiseLib from 'bluebird';

/**
 * List of video file extensions
 * @see {@link https://github.com/sindresorhus/video-extensions}
 */
import videosExtension from 'video-extensions';

/**
 * Parser for media files name
 * @see {@link https://github.com/clement-escolano/parse-torrent-title}
 */
import { parse as nameParser } from 'parse-torrent-title';

/**
 * @external EventEmitter https://nodejs.org/api/events.html#events_class_eventemitter
 */
import EventEmitter from 'events';

/**
 * Boolean properties filter
 */
import {
  filterDefaultBooleanProperties,
  filterByBoolean,
  excludeDefaultBooleanProperties,
} from './filters/filterBooleanProperty';

/**
 * Number properties filter
 */
import {
  convertToValidExpression,
  excludeDefaultNumberProperties,
  filterDefaultNumberProperties,
  filterByNumber,
} from './filters/filterNumberProperty';

/**
 * String properties filter
 */
import {
  excludeDefaultStringProperties,
  filterDefaultStringProperties,
  filterByString,
} from './filters/filterStringProperty';

/**
 * check if an object has these properties and they are not undefined
 * @param {Object} obj The object
 * @param {Array} properties The properties array
 * @return {boolean} The result
 */
function checkProperties(obj, properties) {
  return properties.every(x => x in obj && obj[x]);
}

/**
 * rejected promise when someone doesn't provide
 * @return {Promise} The rejected promise
 */
function missingParam() {
  return new PromiseLib(((resolve, reject) => {
    reject(new Error('Missing parameter'));
  }));
}

/**
 * Bluebird seems to have an issue with fs.access - Workaround function
 * @private
 * @param {string} path a path
 * @returns {Promise} an Promise object resolved or rejected
 * @see {@link https://github.com/petkaantonov/bluebird/issues/1442}
 */
function promisifiedAccess(path) {
  return new PromiseLib(((resolve, reject) => {
    access(path, FsConstants.F_OK | FsConstants.R_OK, (err) => {
      if (err) reject(err);
      resolve();
    });
  }));
}

/**
 * Class representing the TorrentLibrary
 */
export default class TorrentLibrary extends EventEmitter {
  /**
     * constant for movie category
     * @since 0.0.0
     * @type {string}
     * @static
     */
  static get MOVIES_TYPE() {
    return 'MOVIES';
  }

  /**
     * constant for tv series category
     * @type {string}
     * @since 0.0.0
     * @static
     */
  static get TV_SERIES_TYPE() {
    return 'TV_SERIES';
  }

  /**
     * Create a TorrentLibrary
     * @since 1.0.4
     * @param {Object} [config] - the config object
     * @param {(String)} [config.defaultPath=process.cwd()] - the default path
     * @param {(String[])} [config.paths=[]] - the paths where we are looking the media files
     * @param {(Map<string,string>)} [config.allFilesWithCategory=new Map()] - Mapping filepath => category
     * @param {(Set<TPN_Extended>)} [config.movies=new Set()] - the movies files
     * @param {(Map<string, Set<TPN_Extended>>)} [config.series=new Map()] - the serie files
     */
  constructor({
    defaultPath = process.cwd()
    /* istanbul ignore next: tired of writing tests */,
    paths = [] /* istanbul ignore next: tired of writing tests */,
    allFilesWithCategory = new Map()
    /* istanbul ignore next: tired of writing tests */,
    movies = new Set() /* istanbul ignore next: tired of writing tests */,
    series = new Map() /* istanbul ignore next: tired of writing tests */,
  } = {} /* istanbul ignore next: tired of writing tests */) {
    super();
    /**
         * just an easy way to scan the current directory path, if not other paths provided
         * @type  {string}
         * @since 0.0.0
         */
    this.defaultPath = defaultPath;
    /**
         * the paths where we are looking the media files
         * @type {String[]}
         * @since 0.0.0
         * @example
         * // after have added some paths ...
         * [ "D:\somePath", "D:\anotherPath" ]
         */
    this.paths = paths;
    /**
         * The variable where we store all kind of media files found in paths
         * @type {StoreVar}
         * @since 0.0.0
         */
    this.stores = new Map([
      [TorrentLibrary.MOVIES_TYPE, movies],
      [TorrentLibrary.TV_SERIES_TYPE, series],
    ]);
    /**
         * Mapping filepath => category
         * @type {Map<string,string>}
         * @since 0.0.0
         * @example
         * { "D:\somePath\Captain Russia The Summer Soldier (2014) 1080p BrRip x264.MKV" => TorrentLibrary.MOVIES_TYPE }
         */
    this.categoryForFile = allFilesWithCategory;
    /**
         * Private method for adding new files
         * @private
         * @returns {Promise} an resolved or reject promise
         * @param {string[]} files An array of filePath
         */
    this.addNewFiles = function addNewFiles(files) {
      const that = this;

      return new PromiseLib((resolve, reject) => {
        try {
          // find the new files to be added
          const alreadyFoundFiles = [...that.categoryForFile.keys()];
          const newFiles = difference(files, alreadyFoundFiles);

          // temp var for new files before adding them to stores var
          const moviesSet = new Set();
          const tvSeriesSet = new Set();

          // get previous result of stores var
          let newMovies = that.allMovies;
          const newTvSeries = that.allTvSeries;

          // process each file
          for (const file of newFiles) {
            // get data from nameParser lib
            // what we need is only the basename, not the full path
            const jsonFile = nameParser(basename(file));
            // extend this object in order to be used by this library
            Object.assign(jsonFile, { filePath: file });
            // find out which type of this file
            // if it has not undefined properties (season and episode) => TV_SERIES , otherwise MOVIE
            const fileCategory =
                (checkProperties(jsonFile, ['season', 'episode']))
                  ? TorrentLibrary.TV_SERIES_TYPE : TorrentLibrary.MOVIES_TYPE;
            // add it in found files
            that.categoryForFile.set(file, fileCategory);
            // also in temp var
            if (fileCategory !== TorrentLibrary.TV_SERIES_TYPE) {
              moviesSet.add(jsonFile);
            } else {
              tvSeriesSet.add(jsonFile);
            }
          }

          // add the movies into newMovies
          newMovies = new Set([...newMovies, ...moviesSet]);

          // add the tv series into newTvSeries
          // First step : find all the series not in newTvSeries and add them to newTvSeries
          difference(
            uniq([...tvSeriesSet].map(tvSeries => tvSeries.title)),
            ...newTvSeries.keys(),
          ).forEach((tvSeriesToInsert) => {
            newTvSeries.set(tvSeriesToInsert, new Set());
          });

          // Second step : add the new files into the correct tvSeries Set
          uniq([...tvSeriesSet].map(tvSeries => tvSeries.title))
            .forEach((tvSerie) => {
            // get the current set for this tvSerie
              const currentTvSerie = newTvSeries.get(tvSerie);

              // find all the episodes in the new one for this serie
              const episodes = [...tvSeriesSet]
                .filter(episode => episode.title === tvSerie);

              // add them and updates newTvSeries
              newTvSeries.set(
                tvSerie,
                new Set([...currentTvSerie, ...episodes]),
              );
            });

          // updates the stores var
          that.stores.set(TorrentLibrary.MOVIES_TYPE, newMovies);
          that.stores.set(TorrentLibrary.TV_SERIES_TYPE, newTvSeries);
          resolve();
        } catch (err) {
          /* istanbul ignore next */
          reject(err);
        }
      });
    };
  }

  /**
     * Provides the array of files extensions considered to be media extensions
     * @return {string[]} array of files extensions
     * @since 0.0.0
     * @example
     * // Returns [..., 'webm', 'wmv']
     * TorrentLibrary.listVideosExtension()
     */
  static listVideosExtension() {
    return videosExtension;
  }

  /**
     * Add the path(s) to be analyzed by the library if they exist and are readable
     * @param {...string} paths - A or more path(s)
     * @since 0.0.0
     * @example
     * // return resolved Promise "All paths were added!"
     * TorrentLibraryInstance.addNewPath("C:\Users\jy95\Desktop\New folder","C:\Users\jy95\Desktop\New folder2");
     * @return {Promise}  On success the promise will be resolved with "All paths were added!"<br>
     * On error the promise will be rejected with an Error object "Missing parameter" if the argument is missing<br>
     * or an Error object from fs <br>
     * @emits Events#missing_parameter
     * @emits Events#error_in_function
     * @emits Events#addNewPath
     */
  addNewPath(...paths) {
    // the user should provide us at lest a path
    if (paths.length === 0) {
      this.emit('missing_parameter', {
        functionName: 'addNewPath',
      });
      return missingParam();
    }

    const that = this;
    return new PromiseLib(((resolve, reject) => {
      PromiseLib.map(paths, path => promisifiedAccess(path)).then(() => {
        // keep only unique paths
        // use normalize for cross platform's code
        that.paths = uniq([...that.paths, ...paths.map(normalize)]);
        that.emit('addNewPath', { paths: that.paths });
        resolve('All paths were added!');
      }).catch((e) => {
        that.emit('error_in_function', {
          functionName: 'addNewPath',
          error: e.message,
        });
        reject(e);
      });
    }));
  }

  /**
     * Tell us if the user has provided us paths
     * @since 0.0.0
     * @returns {boolean} Has user provided us paths ?
     * @example
     * TorrentLibraryInstance.addNewPath("C:\Users\jy95\Desktop\New folder","C:\Users\jy95\Desktop\New folder2");
     * TorrentLibraryInstance.hasPathsProvidedByUser() // TRUE
     */
  hasPathsProvidedByUser() {
    return this.paths.length !== 0;
  }

  /**
     * Scans the paths in search for new files to be added inside this lib
     * @since 0.0.0
     * @return {Promise}  On success the promise will be resolved with "Scanning completed"<br>
     * On error the promise will be rejected with an Error object from sub modules<br>
     * @emits Events#scan
     * @emits Events#error_in_function
     */
  scan() {
    const foundFiles = FileHound.create()
      .paths((this.paths.length === 0) ? this.defaultPath : this.paths)
      .ext(videosExtension)
      .find();
    const that = this;

    return new PromiseLib((resolve, reject) => {
      foundFiles
        .then(files => that.addNewFiles(files)).then(() => {
          that.emit('scan', { files: foundFiles });
          resolve('Scanning completed');
        }).catch(/* istanbul ignore next */ (err) => {
        /* istanbul ignore next */
          that.emit('error_in_function', {
            functionName: 'scan',
            error: err.message,
          });
          /* istanbul ignore next */
          reject(err);
        });
    });
  }


  /**
     * Removes files stored in this library
     * @param {...string} files An array of filePath (for example the keys of allFilesWithCategory)
     * @since 1.0.3
     * @return {Promise} an resolved or rejected promise<br>
     * On success, the resolve will contain an message and the removed filePaths<br>
     * On error the promise will be rejected with an Error object from sub modules<br>
     * @example
     * // with multiples files
     * TorrentLibraryInstance.removeOldFiles(
     *    "D:\somePath\Captain Russia The Summer Soldier (2014) 1080p BrRip x264.MKV",
     *    "D:\\workspaceNodeJs\\torrent-files-library\\test\\folder1\\The.Blacklist.S04E21.FRENCH.WEBRip.XviD.avi"
     * )
     * @emits Events#removeOldFiles
     * @emits Events#error_in_function
     */
  removeOldFiles(...files) {
    const that = this;
    return new PromiseLib((resolve, reject) => {
      try {
        // get the data to handle this case
        // in the first group, we got all the tv series files and in the second, the movies
        const processData = partition(files, file =>
          that.categoryForFile.get(file) === TorrentLibrary.TV_SERIES_TYPE);

        // for movies, just an easy removal
        that.stores.set(
          TorrentLibrary.MOVIES_TYPE,
          new Set([...that.allMovies]
            .filter(movie => !(processData[1].includes(movie.filePath)))),
        );

        // for the tv-series, a bit more complicated
        // first step : find the unique tv series of these files
        const tvSeriesShows = uniq(processData[0]
          .map(file => nameParser(basename(file)).title));

        // second step : foreach each series in tvSeriesShows
        const newTvSeriesMap = that.allTvSeries;

        for (const serie of tvSeriesShows) {
          // get the set for this serie
          const filteredSet = new Set([...newTvSeriesMap.get(serie)]
            .filter(episode =>
              !(processData[0].includes(episode.filePath))));
          // if the filtered set is empty => no more episodes for this series
          if (filteredSet.size === 0) {
            newTvSeriesMap.delete(serie);
          } else newTvSeriesMap.set(serie, filteredSet);
        }

        // save the updated map
        that.stores.set(TorrentLibrary.TV_SERIES_TYPE, newTvSeriesMap);

        // remove the mapping
        files.forEach((file) => {
          that.categoryForFile.delete(file);
        });
        that.emit('removeOldFiles', { files });
        resolve({
          message: 'The files have been deleted from the library',
          files,
        });
        /* istanbul ignore next */
      } catch (err) {
        /* istanbul ignore next */
        that.emit('error_in_function', {
          functionName: 'removeOldFiles',
          error: err.message,
        });
        /* istanbul ignore next */
        reject(err);
      }
    });
  }

  /**
     * Getter for all found movies
     * @since 0.0.0
     * @type {Set<TPN_Extended>}
     * @example
     * // an JSON stringified example of this method
     * [
     *  {
     *   "year":2012,
     *   "source":"dvdrip",
     *   "codec":"xvid",
     *   "group":"-www.zone-telechargement.ws.avi",
     *   "container":"avi",
     *   "language":"truefrench",
     *   "title":"Bad Ass",
     *   "filePath":"D:\\workspaceNodeJs\\torrent-files-library\\test\\folder1\\Bad.Ass.2012.LiMiTED.TRUEFRENCH.DVDRiP.XviD-www.zone-telechargement.ws.avi"
     *  }
     * ]
     */
  get allMovies() {
    return cloneDeep(this.stores.get(TorrentLibrary.MOVIES_TYPE));
  }

  /**
     * Getter for all found tv-series
     * @since 0.0.0
     * @type {Map<string, Set<TPN_Extended>>}
     * @example
     * // an JSON stringified example of this method
     * {
   * "The Blacklist":[
   *    {
   *      "season":4,
   *      "episode":21,
   *      "source":"webrip",
   *      "codec":"xvid",
   *      "container":"avi",
   *      "language":"french",
   *      "title":"The Blacklist",
   *      "filePath":"D:\\workspaceNodeJs\\torrent-files-library\\test\\folder1\\The.Blacklist.S04E21.FRENCH.WEBRip.XviD.avi"
   *   },
   *   {
   *      "season":4,
   *      "episode":14,
   *      "source":"webrip",
   *      "codec":"xvid",
   *      "container":"avi",
   *      "language":"french",
   *      "title":"The Blacklist",
   *      "filePath":"D:\\workspaceNodeJs\\torrent-files-library\\test\\folder2\\The.Blacklist.S04E14.FRENCH.WEBRip.XviD.avi"
   *   }
   * ]
* }
     */
  get allTvSeries() {
    return cloneDeep(this.stores.get(TorrentLibrary.TV_SERIES_TYPE));
  }

  /**
     * Getter for the mapping between filepaths and category
     * @type {Map<string,string>}
     * @since 0.0.0
     * @example
     * { "D:\somePath\Captain Russia The Summer Soldier (2014) 1080p BrRip x264.MKV" => TorrentLibrary.MOVIES_TYPE }
     */
  get allFilesWithCategory() {
    return cloneDeep(this.categoryForFile);
  }

  /**
     * Returns an JSON stringified of the current state
     * @since 1.0.3
     * @see {@link https://github.com/jy95/torrent-files-library/tree/master/tests/fixtures/example.json}
     * @return {string} json - the JSON stringified
     */
  toJSON() {
    const tvSeries = this.allTvSeries;
    return `{
    "paths":${JSON.stringify([...this.paths])},
    "allFilesWithCategory":${JSON.stringify([...this.allFilesWithCategory])},
    "movies":${JSON.stringify([...this.allMovies])},
    "tv-series":${JSON.stringify([...tvSeries].map(serie =>
    // serie[0] contains the title and [1] the wrong JSON ; let fix it
    [serie[0], [...tvSeries.get(serie[0])]]))}
    }`;
  }

  /**
     * Creates an instance of TorrentLibrary
     * @param {Object} [json] - the JSON object of toJSON() string
     * @param {(String[])} json.paths - the paths where we are looking the media files
     * @param {(Array.<Array.<String,String>>)} json.allFilesWithCategory - Mapping filepath => category
     * @param {(TPN_Extended[])} json.movies - the movies files
     * @param {(Array.<Array.<String,TPN_Extended[]>>)} json.tv-series - the serie files
     * @see {@link https://github.com/jy95/torrent-files-library/tree/master/test/example.json} for an param example
     * @since 1.2.0
     * @return {TorrentLibrary} an TorrentLibrary instance
     * @example
     * // creates an new instance from another one
     *   const createdInstance = TorrentLibrary.createFromJSON(
     *      JSON.parse(libInstance.toJSON()),
     *   );
     */
  static createFromJSON(json) {
    let config = json;
    // transform the param
    /* istanbul ignore else */
    if (json.allFilesWithCategory) {
      config.allFilesWithCategory = new Map(json.allFilesWithCategory);
    }
    /* istanbul ignore else */
    if (json.movies) {
      config.movies = new Set(json.movies);
    }
    /* istanbul ignore else */
    if (json['tv-series']) {
      let createdMap = new Map();
      for (let [serieTitle, setSerie] of json['tv-series']) {
        createdMap.set(serieTitle, new Set(setSerie));
      }
      config.series = createdMap;
    }
    return new TorrentLibrary(config);
  }

  /**
   * Filter the movies based on search parameters
   * @param {searchParameters} searchParameters - search parameters.
   * @return {Set<TPN_Extended>} the filtered movie set
   * @since 1.3.0
   */
  filterMovies(searchParameters = {
    // boolean properties
    extended: undefined,
    unrated: undefined,
    proper: undefined,
    repack: undefined,
    convert: undefined,
    hardcoded: undefined,
    retail: undefined,
    remastered: undefined,
    // number properties
    season: undefined,
    episode: undefined,
    year: undefined,
    // string properties
    title: undefined,
    resolution: undefined,
    codec: undefined,
    audio: undefined,
    group: undefined,
    region: undefined,
    container: undefined,
    language: undefined,
    source: undefined,
    // new properties
    additionalProperties: [],
  }) {
    // organize search based on field type : boolean - string - number
    // eslint-disable-next-line max-len
    const booleanFieldsSearchMap = filterDefaultBooleanProperties(searchParameters);
    // eslint-disable-next-line max-len
    let leftSearchParameters = excludeDefaultBooleanProperties(searchParameters);

    // eslint-disable-next-line max-len
    const numberFieldsSearchMap = filterDefaultNumberProperties(leftSearchParameters);
    leftSearchParameters = excludeDefaultNumberProperties(leftSearchParameters);

    // eslint-disable-next-line max-len
    const stringFieldsSearchMap = filterDefaultStringProperties(leftSearchParameters);
    leftSearchParameters = excludeDefaultStringProperties(leftSearchParameters);

    let { additionalProperties } = leftSearchParameters;
    // add the optional new properties , optionally provided by user
    /* istanbul ignore else */
    if (additionalProperties !== undefined) {
      additionalProperties
        .filter(newProperty => newProperty.type === 'boolean')
        .forEach((newProperty) => {
          booleanFieldsSearchMap.set(newProperty.name, newProperty.value);
        });

      additionalProperties
        .filter(newProperty => newProperty.type === 'number')
        .forEach((newProperty) => {
          let expression = convertToValidExpression(newProperty.value);
          /* istanbul ignore else */
          if (expression !== undefined) {
            numberFieldsSearchMap.set(newProperty.name, expression);
          }
        });

      additionalProperties
        .filter(newProperty => newProperty.type === 'string')
        .forEach((newProperty) => {
          stringFieldsSearchMap.set(newProperty.name, [...newProperty.value]);
        });
    }

    // apply params based on types
    let result = filterByBoolean(this.allMovies, booleanFieldsSearchMap);
    result = filterByNumber(result, numberFieldsSearchMap);
    result = filterByString(result, stringFieldsSearchMap);
    return result;
  }
}
