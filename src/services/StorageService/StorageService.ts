import AsyncStorage from '@react-native-async-storage/async-storage';

export const getItem = async (key: any) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    return null;
  }
};

export const setItem = async (key: any, value: any) => {
  try {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    return await AsyncStorage.setItem(key, value);
  } catch (e) {
    return {error: e};
  }
};

export const removeItem = async (key: any) => {
  try {
    return await AsyncStorage.removeItem(key);
  } catch (e) {
    return {error: e};
  }
};

export const removeAllItem = async () => {
  try {
    return await AsyncStorage.clear();
  } catch (e) {
    return {error: e};
  }
};

export const getAllItem = async () => {
  try {
    return await AsyncStorage.getItem('');
  } catch (e) {
    return {error: e};
  }
};

export default {getItem, setItem, removeItem, getAllItem, removeAllItem};
