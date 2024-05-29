/* eslint-disable curly */
/* eslint-disable no-undef */
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import {constants} from 'src/common';
import {consoleLog, showToastMessage} from 'src/utils/Helpers/HelperFunction';
import apiConfigs from 'src/network/apiConfig';
import NavigationService from 'src/services/NavigationService/NavigationService';

const Network = (
  endpoint: string,
  method: string,
  payload?: object,
  authToken?: string | null | undefined,
) => {
  const API_URL = constants.API_URL;
  consoleLog('Network Request==>', {
    payload: JSON.stringify(payload),
    authToken,
    endpoint: `${API_URL}${endpoint}`,
  });

  return new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        // const __headers = {
        //   'Content-Type':
        //     payload instanceof FormData
        //       ? 'multipart/form-data'
        //       : 'application/json',
        //   Accept: 'application/json',
        //   Authorization: `Bearer ${authToken}`,
        // };

        const __headers = getHeaders(payload, authToken);
        const __payload = method !== METHODS.GET ? {data: payload} : {};

        axios({
          method,
          url: `${API_URL}${endpoint}`,
          headers: __headers,
          ...__payload,
        })
          .then(function (response) {
            // consoleLog('Network response==>', JSON.stringify(response?.data));

            const __response =
              typeof response?.data == 'object'
                ? response?.data
                : API_ERROR_RESPONSES.NO_RESPONSE;

            if (typeof __response?.code !== 'undefined' && __response?.code) {
              if (__response?.code == 401) {
                NavigationService.resetAllAction('Login', {
                  referrer: 'Unauthenticated',
                });
              }
            }
            resolve(__response);
          })
          .catch(function (error) {
            consoleLog('Network Error: ', JSON.stringify(error));
            if (error.response) {
              // console.log(error.response.data);
              // console.log(error.response.status);
              // console.log(error.response.headers);
              if (error?.response?.status == 401) {
                NavigationService.resetAllAction('Login', {
                  referrer: 'Unauthenticated',
                });
              } else {
                resolve({
                  status: false,
                  message: error?.response?.data?.message,
                  error: error?.response?.data?.error,
                  data: {},
                });
              }
            } else {
              resolve(API_ERROR_RESPONSES.SERVER_ERROR_RESPONSE);
            }
          });
      } else {
        resolve(API_ERROR_RESPONSES.NO_INTERNET_RESPONSE);
      }
    });
  });
};

export default Network;

export const METHODS = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export const API_ERROR_RESPONSES: any = {
  NO_RESPONSE: {
    status: false,
    message: 'No response from server',
    data: {},
  },
  NO_INTERNET_RESPONSE: {
    status: false,
    message: 'No internet',
    data: {},
  },
  SERVER_ERROR_RESPONSE: {
    status: false,
    message: 'Server error',
    data: {},
  },
  SOMETHING_WENT_WRONG_ERROR_RESPONSE: {
    status: false,
    message: 'Something went wrong',
    data: {},
  },
};

export interface ResponseType {
  status?: boolean;
  data?: object[] | object;
  message: string;
  error?: any;
}

const getHeaders = (payload: any, authToken: string | null | undefined) => ({
  Accept: 'application/json',
  'Content-Type':
    payload instanceof FormData ? 'multipart/form-data' : 'application/json',
  device_type: apiConfigs.device_type,
  app_system_version: apiConfigs.app_system_version,
  app_build_number: apiConfigs.app_build_number,
  default_auth_token: apiConfigs.default_auth_token,
  device_token: apiConfigs.device_token,
  app_version: apiConfigs.app_version,
  language: apiConfigs.language,
  Authorization: `Bearer ${authToken}`,
  Organization: payload?.organization ?? '',
});
