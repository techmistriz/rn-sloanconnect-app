export function only(obj: object, keys: string[]) {
  return keys.map( k => k in obj ? { [k]: obj[k] } : {} ).reduce((res, o) => Object.assign(res, o), {});
}

export function except(obj: object, keys: string[]) {
  const vkeys = Object.keys(obj).filter(k => !keys.includes(k));

  return only(obj, vkeys);
}

export function isObject(value: any) {
  return (
    value
    && typeof value === 'object'
    && !Array.isArray(value)
  )
}

export const $object = (obj: Record<string, any>) => ({
  only(keys: string[]) {
    return only(obj, keys)
  },
  except(keys: string[]) {
    return except(obj, keys)
  }
})