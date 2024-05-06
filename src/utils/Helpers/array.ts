import {consoleLog} from './HelperFunction';

export function arrayMoveMutable(array: any, fromIndex: any, toIndex: any) {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex;

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex;

    const [item] = array.splice(fromIndex, 1);
    array.splice(endIndex, 0, item);
  }
}

export function arrayMoveImmutable(
  array: any[],
  fromIndex: number,
  toIndex: number,
) {
  const newArray = [...array];
  arrayMoveMutable(newArray, fromIndex, toIndex);
  return newArray;
}

export function mapAsString(options: number[]) {
  return options.map(value => value?.toString());
}

interface NameValueArray {
  name: string;
  value: string;
}

export function createNameValueArray(options: string[]): NameValueArray[] {
  return options.map(value => ({
    value,
    name: value?.charAt(0)?.toUpperCase() + value?.slice(1),
  }));
}

export const isObjectEmpty = (objectName: object | undefined | null) => {
  if (!objectName) return true;
  if (typeof objectName != 'object') return true;
  // consoleLog("objectName", Object.keys(objectName));
  return (
    Object.keys(objectName).length === 0 && objectName.constructor === Object
  );
};

/**
 *
 * @param {*} value
 * @param {Array<Object>} data
 * @param {any} options
 * @returns find object
 */
export function findObject(
  value: any,
  data: Array<Object>, //object[],
  options: any,
) {
  var result: any = undefined;
  if (
    value &&
    data &&
    options &&
    Array.isArray(data) &&
    data?.length &&
    typeof options?.searchKey !== 'undefined'
  ) {
    result = data.find((item: any) => {
      return item[options?.searchKey] == value;
    });
  }
  return result;
}

/**
 *
 * @param {*} value
 * @param {Array<Object>} data
 * @param {any} options
 * @returns find object
 */
export function findInArray(
  value: any,
  data: Array<string | number>, //object[],
) {
  var result: any = undefined;
  if (value && data && Array.isArray(data) && data?.length) {
    result = data.find((item: any) => {
      return item == value;
    });
  }
  return result;
}

/**
 *
 * @param {*} value
 * @param {Array<Object>} data
 * @param {any} options
 * @returns find object
 */
export const arrayRange = (start: number, stop: number, step: number) =>
  Array.from(
    {length: (stop - start) / step + 1},
    (value, index) => start + index * step,
  );

/**
 *
 * @param {*} value
 * @param {Array<Object>} data
 * @param {any} options
 * @returns find object
 */
export const chunk = (arr: any[], size: number) =>
  Array.from({length: Math.ceil(arr.length / size)}, (v, i) =>
    arr.slice(i * size, i * size + size),
  );
