export const $string = (value: string) => ({
  afterLast(indentifier: string) {
    const index = value.lastIndexOf(indentifier);
    return index === -1 ? value : value.substring(index + 1);
  },
  replaceEmpty(replacement: string) {
    if (!value || value.trim() === "") {
      return replacement;
    }

    return value;
  },
  /** Capitalize from each word */
  capitalize() {
    return value
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  },
  truncate(num: number, appended = "...") {
    if (value !== null && value !== undefined) {
      return value.length > num ? value.substring(0, num) + appended : value;
    }

    return "";
  },
});
