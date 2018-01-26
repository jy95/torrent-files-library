export function filterDefaultBooleanProperties(searchObject) {
  const {
    extended, unrated, proper, repack, convert, hardcoded, retail, remastered,
  } = searchObject;


  const propertiesArray = [extended, unrated, proper,
    repack, convert, hardcoded, retail, remastered];
  const propertiesNames = ['extended', 'unrated', 'proper', 'repack', 'convert',
    'hardcoded', 'retail', 'remastered'];

  return propertiesArray.reduce((propertiesMap, val, index) => {
    // eslint-disable-next-line max-len
    if (val === true || val === false) { propertiesMap.set(propertiesNames[index], val); }
    return propertiesMap;
  }, new Map());
}

export function excludeDefaultBooleanProperties(searchObject) {
  let {
    extended, unrated, proper, repack, convert, hardcoded, retail, remastered,
    ...rest
  } = searchObject;
  return rest;
}

export function filterByBoolean(set, propertiesMap) {
  // first step : get an array so that we can do filter/reduce stuff
  // second step : iterate the propertiesMap and do filter and return the filtered array
  // val[0] : the key ; val[1] : the value
  return new Set(Array
    .from(propertiesMap.entries())
    .reduce(
      // eslint-disable-next-line max-len
      (currentMoviesArray, val) => currentMoviesArray.filter(TPN => TPN[val[0]] === val[1])
      , [...set],
    ));
}
