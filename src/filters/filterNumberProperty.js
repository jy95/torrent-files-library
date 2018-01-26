export function convertToValidExpression(myString) {
  const validExpression = /^(=|>|<|>=|<=)(\d+)$/;
  let result = myString.match(validExpression);
  let returnValue;
  /* istanbul ignore else */
  if (result.length === 3) {
    returnValue = {
      operator: result[1],
      number: Number(result[2]),
    };
  }
  return returnValue;
}

function resolveExpression(property, expressionObject, object) {
  let { operator, number } = expressionObject;
  // No : eval is not all evil but you should know what you are doing
  // eslint-disable-next-line no-eval
  return eval(`${object[property]}${operator}${number}`);
}

export function filterDefaultNumberProperties(searchObject) {
  const {
    season, episode, year,
  } = searchObject;


  const propertiesArray = [season, episode, year];
  const propertiesNames = ['season', 'episode', 'year'];

  return propertiesArray.reduce((propertiesMap, val, index) => {
    if (val !== undefined) {
      propertiesMap.set(propertiesNames[index], convertToValidExpression(val));
    }
    return propertiesMap;
  }, new Map());
}

export function excludeDefaultNumberProperties(searchObject) {
  const {
    season, episode, year,
    ...rest
  } = searchObject;
  return rest;
}

export function filterByNumber(set, propertiesMap) {
  // first step : get an array so that we can do filter/reduce stuff
  // second step : iterate the propertiesMap and do filter and return the filtered array
  // val[0] : the key ; val[1] : the value
  return new Set(Array
    .from(propertiesMap.entries())
    .reduce(
      // eslint-disable-next-line max-len
      (currentMoviesArray, val) => currentMoviesArray.filter(TPN => resolveExpression(val[0], val[1], TPN))
      , [...set],
    ));
}
