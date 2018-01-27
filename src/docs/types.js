// ESDoc custom typedef

/**
 * The result of parsing file name
 * @typedef {Object} TPN
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
 * @typedef {TPN} TPN_Extended
 * @property {string} filePath - additionnal property useful for this library
 */

/**
 * The variable where we store all kind of media files found in paths
 * @typedef {Map<string, {( Set<TPN_Extended>| Map<string,Set<TPN_Extended>> )}>} StoreVar
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

/**
 * The search syntax for number properties : a operator follows by a number
 * @typedef {string} numberSearchSyntax
 * @example
 * '<=25'
 * @example
 * '=25'
 */

/**
 * search parameters object
 * @typedef {Object} searchParameters - search parameters.
 * @property {boolean} [extended=undefined] - extended ?
 * @property {boolean} [unrated=undefined] - unrated ?
 * @property {boolean} [proper=undefined] - proper ?
 * @property {boolean} [repack=undefined] - repack ?
 * @property {boolean} [convert=undefined] - convert ?
 * @property {boolean} [hardcoded=undefined] - hardcoded ?
 * @property {boolean} [retail=undefined] - retail ?
 * @property {boolean} [remastered=undefined] - remastered ?
 * @property {numberSearchSyntax} [season=undefined] - the season
 * @property {numberSearchSyntax} [episode=undefined] - the episode
 * @property {numberSearchSyntax} [year=undefined] - the year
 * @property {string|string[]} [title=undefined] - the title
 * @property {string|string[]} [resolution=undefined] - the resolution
 * @property {string|string[]} [codec=undefined] - the codec
 * @property {string|string[]} [audio=undefined] - the audio
 * @property {string|string[]} [group=undefined] - the group
 * @property {string|string[]} [region=undefined] - the region
 * @property {string|string[]} [container=undefined] - the container
 * @property {string|string[]} [language=undefined] - the language
 * @property {string|string[]} [source=undefined] - the source
 */
