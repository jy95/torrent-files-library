// JSDoc custom typedef

/**
 * The result of parsing file name
 * @typedef {Object} TorrentLibrary~TPN
 * @see {@link https://github.com/clement-escolano/parse-torrent-title}
 * @property {(string)} title - The file title
 * @property {(number)} [season] - The season number
 * @property {(number)} [episode] - The episode number
 * @property {(number)} [year] - The year
 * @property {(string)} [resolution] - The resolution
 * @property {(string)} [codec] - The codec
 * @property {(string)} [audio] - The audio
 * @property {(string)} [group] - The group that releases this file
 * @property {(string)} [region] - The region
 * @property {(string)} [container] - The container
 * @property {(string)} [language] - The file language
 * @property {(boolean)} [extended] - extended ?
 * @property {(boolean)} [unrated] - unrated ?
 * @property {(boolean)} [proper] - proper ?
 * @property {(boolean)} [repack] - repack ?
 * @property {(boolean)} [convert] - convert ?
 * @property {(boolean)} [hardcoded] - hardcoded ?
 * @property {(boolean)} [retail] - retail ?
 * @property {(boolean)} [remastered] - remastered ?
 * @property {(string)} [source] - the source
 */

/**
 * The extended TPN object
 * @typedef {TorrentLibrary~TPN} TorrentLibrary~TPN_Extended
 * @property {string} filePath - additionnal property useful for this library
 */

/**
 * The variable where we store all kind of media files found in paths
 * @typedef {Map.<string, {( Set<TorrentLibrary~TPN_Extended>| Map.<string,Set<TorrentLibrary~TPN_Extended>> )}>} TorrentLibrary~StoreVar
 * @example
 * // An example of the variable after the scan method
 * [
 *      "MOVIES" : [
 *         {
 *            "year": 2014,
 *            "resolution": '1080p',
 *            "source": 'brrip',
 *            "codec": 'x264',
 *            "container": 'mkv',
 *            "title": 'Captain Russia The Summer Soldier',
 *            "filePath": "D:\somePath\Captain Russia The Summer Soldier (2014) 1080p BrRip x264.MKV"
 *         }
 *      ],
 *      "TV_SERIES" : [
 *          "The Blacklist" : [
 *              {
 *                  "season": 4,
 *                  "episode": 21,
 *                  "source": "webrip",
 *                  "codec": "xvid",
 *                  "container": "avi",
 *                  "language": "french"
 *                  "filePath" : "D:\somePath\The.Blacklist.S04E21.FRENCH.WEBRip.XviD.avi"
 *              }
 *          ]
 *      ]
 * ]
 */