/**
 * Provides a map with valid default properties
 * @param {searchParameters} searchObject - search parameters
 * @return {Map<string, string|string[]>} the result map
 */
export function filterDefaultStringProperties(searchObject) {
  const {
    title, resolution, codec, audio, group, region, container, language, source,
  } = searchObject;


  const propertiesArray = [title, resolution, codec, audio, group,
    region, container, language, source];
  const propertiesNames = ['title', 'resolution', 'codec', 'audio', 'group',
    'region', 'container', 'language', 'source'];

  return propertiesArray.reduce((propertiesMap, val, index) => {
    if (val !== undefined) {
      propertiesMap.set(propertiesNames[index], val);
    }
    return propertiesMap;
  }, new Map());
}

/**
 * Remove the default string properties
 * @param {searchParameters} searchObject - search parameters
 * @return {searchParameters} searchParameters without these properties
 */
export function excludeDefaultStringProperties(searchObject) {
  let {
    title, resolution, codec, audio, group, region, container, language, source,
    ...rest
  } = searchObject;
  return rest;
}

/**
 * Filter function for filterByString
 * @param {string} property The property to be checked
 * @param {string[]|string} expected The expected result
 * @param {TPN} object the object to be checked
 * @return {boolean} the result
 */
function filterFunctionByType(property, expected, object) {
  if (Array.isArray(expected)) { return expected.includes(object[property]); }
  return object[property] === expected;
}

/**
 * Filter the set based on string properties
 * @param {Set<TPN>} set The TPN set
 * @param {Map<string, string|string[]>} propertiesMap The map from filterDefaultStringProperties
 * @return {Set<TPN>} the filtered set
 */
export function filterByString(set, propertiesMap) {
  // first step : get an array so that we can do filter/reduce stuff
  // second step : iterate the propertiesMap and do filter and return the filtered array
  // val[0] : the key ; val[1] : the value
  return new Set(Array
    .from(propertiesMap.entries())
    .reduce(
      // eslint-disable-next-line max-len
      (currentMoviesArray, val) => currentMoviesArray.filter(TPN => filterFunctionByType(val[0], val[1], TPN))
      , [...set],
    ));
}
