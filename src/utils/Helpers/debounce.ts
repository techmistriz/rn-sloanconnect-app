export const debounce = (fn: any, ms = 300) => {
  let timeoutId: any;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};