export default class JSFunctionUtils {
  /**
   * Returns a unique array from two arrays of `objects`.
   * The function first concates both the arrays into one and then removes the duplicates.
   * @param {any[]} array1
   * @param {any[]} array2
   * @param {string} uniquekey A key(like id) to identify an object uniquely. By default it's "id".
   * @param {{[key:string]:any}} extraObjectToApply Used to apply a key-value pair to a matched object.
   * @returns {any[]}
   */
  static uniqueArray(
    array1: any,
    array2: any,
    uniquekey: any = 'id',
    extraObjectToApply: any = null,
  ) {
    const a = array1.concat(array2);
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i][uniquekey] === a[j][uniquekey]) {
          if (extraObjectToApply) {
            for (const newKey in extraObjectToApply) {
              if (extraObjectToApply.hasOwnProperty(newKey)) {
                a[i][newKey] = extraObjectToApply[newKey];
                a[j][newKey] = extraObjectToApply[newKey];
              }
            }
          }
          a.splice(j--, 1);
        }
      }
    }

    return a;
  }

  /**
   * Sorts two objects by given key.
   * Created to use directly in the `array.sort(sortByKey)`.
   * @param {object} a
   * @param {object} b
   * @param {string} key
   */
  static sortByKey(a: any, b: any, key: any) {
    var textA = a[key].toUpperCase();
    var textB = b[key].toUpperCase();

    return textA < textB ? -1 : textA > textB ? 1 : 0;
  }

  /**
   * Returns flat array list by escaping the main item.
   * @param {any[]} array A list needs to convert into flat array list.
   * Given Array should be in the below format.
   * @example  [ 0:{ data:[ {....object keys} ] } ]
   * @returns {object[]}
   */
  static getFlatArray(array: any) {
    const items = [];

    for (const item of array) {
      if (item.data && item.data.length > 0) {
        for (const data of item.data) {
          items.push(data);
        }
      }
    }

    return items;
  }
}
