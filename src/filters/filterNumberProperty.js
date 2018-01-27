import { isString } from 'lodash';

/**
 * Convert the param to valid expression object for filter function
 * @param {number|numberSearchSyntax} param The param to be converted
 * @return {Object} If valid, returns a object. If not, returns undefined
 * @property {string} operator The operator for matching process
 * @property {number} number  The extracted number for matching process
 * @example
 * // returns { operator: '=' , number: 5 }
 * convertToValidExpression(5);
 * @example
 * // returns { operator: '>=' , number: 5 }
 * convertToValidExpression(">5");
 * @example
 * // returns undefined
 * convertToValidExpression(undefined);
 */
export function convertToValidExpression(param) {
  const validExpression = /^(=|>|<|>=|<=)(\d+)$/;
  let returnValue;
  // if it is a valid number expression like the regex
  if (isString(param)) {
    let result = param.match(validExpression);
    if (result.length === 3) {
      returnValue = {
        operator: result[1],
        number: Number(result[2]),
      };
    }
  }
  // if the param is a number
  if (Number.isInteger(param)) {
    returnValue = {
      operator: '=',
      number: param,
    };
  }
  return returnValue;
}

/**
 * Filter function for filterByNumber
 * @param {string} property The property to be checked
 * @param {Object} expressionObject The object from convertToValidExpression
 * @param {string} expressionObject.operator The operator for matching process
 * @param {number} expressionObject.number  The extracted number for matching process
 * @param {TPN} object the object to be checked
 * @return {boolean} the result
 */
function resolveExpression(property, expressionObject, object) {
  let { operator, number } = expressionObject;
  // No : eval is not all evil but you should know what you are doing
  // eslint-disable-next-line no-eval
  return eval(`${object[property]}${operator}${number}`);
}

/**
 * Provides a map with valid default properties
 * @param {searchParameters} searchObject - search parameters
 * @return {Map<string, numberExpressionObject>} the result map
 */
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

/**
 * Remove the default number properties
 * @param {searchParameters} searchObject - search parameters
 * @return {searchParameters} searchParameters without these properties
 */
export function excludeDefaultNumberProperties(searchObject) {
  const {
    season, episode, year,
    ...rest
  } = searchObject;
  return rest;
}

/**
 * Filter the set based on string properties
 * @param {TPN[]} set The TPN set
 * @param {Map<string, numberExpressionObject>} propertiesMap The map from filterDefaultStringProperties
 * @return {Set<TPN>} the filtered set
 */
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
