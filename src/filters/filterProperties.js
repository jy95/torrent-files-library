/* eslint-disable no-useless-escape,max-len */
/**
 * Boolean properties filter
 */
import {
  filterDefaultBooleanProperties,
  filterByBoolean,
  excludeDefaultBooleanProperties,
} from './filterBooleanProperty';

/**
 * Number properties filter
 */
import {
  convertToValidExpression,
  excludeDefaultNumberProperties,
  filterDefaultNumberProperties,
  filterByNumber,
} from './filterNumberProperty';

/**
 * String properties filter
 */
import {
  excludeDefaultStringProperties,
  filterDefaultStringProperties,
  filterByString,
} from './filterStringProperty';

/**
 * Handle searchParameters provided by user to maps
 * @param {searchParameters} searchParameters - search parameters.
 * @return {{booleanFieldsSearchMap: Map<string, boolean>, numberFieldsSearchMap: Map<string, numberExpressionObject>, stringFieldsSearchMap: Map<string, string|string[]>}} an object that contains mapped properties for search
 */
function mapProperties(searchParameters) {
  // organize search based on field type : boolean - string - number
  const booleanFieldsSearchMap = filterDefaultBooleanProperties(searchParameters);
  let leftSearchParameters = excludeDefaultBooleanProperties(searchParameters);

  const numberFieldsSearchMap = filterDefaultNumberProperties(leftSearchParameters);
  leftSearchParameters = excludeDefaultNumberProperties(leftSearchParameters);

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

  return {
    booleanFieldsSearchMap,
    numberFieldsSearchMap,
    stringFieldsSearchMap,
  };
}

/**
 * Filter the movies based on search parameters
 * @param {searchParameters} searchParameters - search parameters.
 * @param {Set<TPN_Extended>} allMovies - the movies set
 * @return {Set<TPN>} the filtered movie set
 */
export function filterMoviesByProperties(searchParameters, allMovies) {
  const {
    booleanFieldsSearchMap, stringFieldsSearchMap,
    numberFieldsSearchMap,
  } = mapProperties(searchParameters);
  const propertiesWithAllProperties
    = [booleanFieldsSearchMap, stringFieldsSearchMap, numberFieldsSearchMap];
  let result = allMovies;
  [filterByBoolean, filterByString, filterByNumber]
    .forEach((filterFunction, index) => {
      result = filterFunction(result, propertiesWithAllProperties[index]);
    });
  return result;
}

/**
 * Filter the tv series based on search parameters
 * @param {searchParameters} searchParameters - search parameters.
 * @param {(Map<string, Set<TPN>>)} allTvSeries - the tvSeries map
 * @return {(Map<string, Set<TPN>>)} the filtered tvSeries map
 */
export function filterTvSeriesByProperties(searchParameters, allTvSeries) {
  const {
    booleanFieldsSearchMap, stringFieldsSearchMap,
    numberFieldsSearchMap,
  } = mapProperties(searchParameters);
  const propertiesWithAllProperties
    = [booleanFieldsSearchMap, stringFieldsSearchMap, numberFieldsSearchMap];
  let result = allTvSeries;
  // filtering stuff
  // it also removes all entries that have an empty Set so that we can clearly see only valid things

  [filterByBoolean, filterByString, filterByNumber]
    .forEach((filterFunction, index) => {
      result = new Map(Array
        .from(
          result.entries(),
          ([showName, showSet]) => [showName, filterFunction(showSet, propertiesWithAllProperties[index])],
        )
        // eslint-disable-next-line no-unused-vars
        .filter(([showName, showSet]) => showSet.size > 0));
    });

  return result;
}
