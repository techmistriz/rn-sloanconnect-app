import { arrayMoveImmutable } from "./array";
import { isUnset } from "./mix";

type SumFunction<T = any> = (a: any, b: any) => T[];

export function $collect<T = any>(items: T[]) {
  return {
    unique(fn: Function): T[] {
      return items.reduce((prev: T[], curr) => {
        if (!prev.some((x: any) => fn(curr, x))) prev.push(curr);
        return prev;
      }, []);
    },
    sum(keyOrFunction?: string | SumFunction<T>): number {
      if (isUnset(items)) {
        return 0;
      }

      if (!keyOrFunction) {
        return items.reduce((acc, val: any) => acc + val, 0)
      }

      return items.map(typeof keyOrFunction === "function" ? keyOrFunction : val => val[keyOrFunction])
        .reduce((acc, val) => acc + val, 0);
    },
    pluck<PT = any>(key: string): PT[] {
      if (!items?.length) {
        return []
      }

      return items.map((item: any) => item[key]);
    },
    sortBy(key: string) {
      return [...items].sort((a, b) => a[key] - b[key]);
    },
    /** Move by index */
    move(fromIndex: number, toIndex: number) {
      return arrayMoveImmutable(items, fromIndex, toIndex);
    },
    addOrFilter(source: any, key: string) {
      if (!items?.length) {
        return [source];
      }

      const found = items.find((item: any) => item[key] === source[key]);

      if (found) {
        return items.filter((item: any) => item[key] != source[key]);
      }

      return [...items, source];
    },
    groupBy(fn: any) {
      return items
        .map(typeof fn === "function" ? fn : val => val[fn])
        .reduce((acc: any, val: any, i) => {
          acc[val] = (acc[val] || []).concat(items[i]);
          return acc;
        }, {});
    }
  }
}

export function isObjectEmpty2(obj: Record<string, any> = {}) {
  return JSON.stringify(obj) === "{}";
}
