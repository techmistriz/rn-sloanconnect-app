const DROPDOWN_ITEM_HEIGHT = 50;
const DROPDOWN_PICKER_MIN_HEIGHT = 200;
const DROPDOWN_PICKER_MAX_HEIGHT = 600;
const EXTRA_HEIGHT = 100;


export const calculateDropdownHeight = (data: any) => {
  let dynamicHeight = DROPDOWN_PICKER_MIN_HEIGHT;
  if (typeof data.length !== 'undefined' && data.length != null) {
    dynamicHeight = data.length * DROPDOWN_ITEM_HEIGHT;
    dynamicHeight += EXTRA_HEIGHT;
  }
  return dynamicHeight > DROPDOWN_PICKER_MAX_HEIGHT
    ? DROPDOWN_PICKER_MAX_HEIGHT
    : dynamicHeight;
};
