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

export function excludeDefaultStringProperties(searchObject) {
  let {
    title, resolution, codec, audio, group, region, container, language, source,
    ...rest
  } = searchObject;
  return rest;
}

function filterFunctionByType(property, expected, object) {
  switch (Array.isArray(expected)) {
    case true:
      return expected.includes(object[property]);
    default:
      // simple equal
      return object[property] === expected;
  }
}

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
