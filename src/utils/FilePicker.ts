import {Alert, Platform} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
// import RNFetchBlob from 'rn-fetch-blob';
import FileViewer from 'react-native-file-viewer';
import {consoleLog, showToastMessage} from './Helpers/HelperFunction';

/**
 ***********************************************************
 ***********************************************************
 ***********************************************************
 **********************File Picker Functions**************
 ***********************************************************
 ***********************************************************
 ***********************************************************
 */

/**
 *
 * @param {*} filename
 * return extention of Any kind of file
 */
export const getFileName = (string: string) => {
  // file:///storage/emulated/0/Android/data/com.enquiryapp/files/Pictures/efbd823f-0fad-4139-b449-dda0f5c578ae.jpg
  var filename = string.substring(string.lastIndexOf('/') + 1);
  return filename;
};

/**
 *
 * @param {*} filename
 * return extention of Any kind of file
 */
export const getFileNameWithoutExtension = (filename: any) => {
  const response = filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  return response;
};

/**
 *
 * @param {*} filename
 * return extention of Any kind of file
 */
export const getFileExtension = async (filename: any) => {
  const response = filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  return response;
};

/**
 *
 * @param {*} value
 * @returns radion from degree
 */
export const selectFile = async () => {
  return new Promise((resolve, reject) => {
    DocumentPicker.pickSingle({
      // Provide which type of file you want user to pick
      type: [DocumentPicker.types.allFiles],
      copyTo: 'cachesDirectory',
      // There can me more options as well
      // DocumentPicker.types.allFiles
      // DocumentPicker.types.images
      // DocumentPicker.types.plainText
      // DocumentPicker.types.audio
      // DocumentPicker.types.pdf
    })
      .then(res => {
        resolve({status: true, data: res});
        consoleLog('DocumentPicker res', res);
      })
      .catch(error => {
        consoleLog('DocumentPicker error', error);
        if (DocumentPicker.isCancel(error)) {
          resolve({status: false, data: null});
          // If user canceled the document selection
          // alert('Canceled');
        } else {
          // For Unknown Error
          // alert('Unknown Error: ' + JSON.stringify(error));
          // resolve(error);
          resolve({
            status: false,
            data: error,
            message: 'Something went wrong',
          });
        }
      });
  });
};

/**
 *
 * @param {*} value
 * @returns radion from degree
 */
export const selectFiles = async () => {
  return new Promise((resolve, reject) => {
    DocumentPicker.pick({
      // Provide which type of file you want user to pick
      type: [DocumentPicker.types.allFiles],
      copyTo: 'cachesDirectory',
      allowMultiSelection: true,
      // There can me more options as well
      // DocumentPicker.types.allFiles
      // DocumentPicker.types.images
      // DocumentPicker.types.plainText
      // DocumentPicker.types.audio
      // DocumentPicker.types.pdf
    })
      .then(res => {
        resolve({status: true, data: res});
        consoleLog('DocumentPicker res', res);
      })
      .catch(error => {
        consoleLog('DocumentPicker error', error);
        if (DocumentPicker.isCancel(error)) {
          resolve({status: false, data: null});
          // If user canceled the document selection
          // alert('Canceled');
        } else {
          // For Unknown Error
          // alert('Unknown Error: ' + JSON.stringify(error));
          // resolve(error);
          resolve({
            status: false,
            data: error,
            message: 'Something went wrong',
          });
        }
      });
  });
};

/**
 *
 * @param {*} value
 * @returns radion from degree
 */
export const openFileExternalViewer = (filePath: string) => {
  if (!filePath) {
    Alert.alert('INFO', 'File not found.');
    return false;
  }

  // Linking.canOpenURL(url)
  //   .then(supported => {
  //     if (!supported) {
  //       Alert.alert('Browser support not available');
  //     } else {
  //       return Linking.openURL(url);
  //     }
  //   })
  //   .catch(err => console.log(err));

  FileViewer.open(filePath, {showOpenWithDialog: true}) // absolute-path-to-my-local-file.
    .then(() => {
      // success
      consoleLog('FileViewer success');
    })
    .catch(error => {
      // error
      consoleLog('FileViewer error', error);
      showToastMessage(error?.message);
    });
};

/**
 *
 * @param {*} value
 * @returns radion from degree
 */
export const fileExist = (filePath: string) => {
  return new Promise(resolve => {
    RNFS.exists(filePath)
      .then(exists => {
        if (exists) {
          consoleLog('File exists');
          resolve(true);
        } else {
          consoleLog('File does not exist');
          resolve(false);
        }
      })
      .catch(error => {
        consoleLog('fileExist error==>', error);
        resolve(false);
      });
  });
};

/**
 *
 * @param {*} value
 * @returns radion from degree
 */
export const readFile = (filePath: string) => {
  return new Promise(resolve => {
    RNFS.readFile(filePath)
      .then(fileObj => {
        if (fileObj) {
          consoleLog('File readFile', fileObj);
          resolve(true);
        } else {
          consoleLog('File does not exist');
          resolve(false);
        }
      })
      .catch(error => {
        consoleLog('fileExist error==>', error);
        resolve(false);
      });
  });
};

/**
 *
 * @param {*} value
 * @returns radion from degree
 */
export const openOrDownloadFile = async (url: string, fileName: string) => {
  const path = RNFS.DownloadDirectoryPath;
  consoleLog("url", url);
  const filePath: any = Platform.select({
    ios: fileName,
    android: `${path}/${fileName}`,
  });
  // console.log('filePath==>', filePath);

  const isExist = await fileExist(filePath);
  // const _readFile = await readFile(filePath);

  if (isExist) {
    openFileExternalViewer(filePath);
  } else {
    RNFS.downloadFile({
      fromUrl: url,
      toFile: filePath,
      background: true, // Enable downloading in the background (iOS only)
      discretionary: true, // Allow the OS to control the timing and speed (iOS only)
      progress: res => {
        // Handle download progress updates if needed
        // const progress = (res.bytesWritten / res.contentLength) * 100;
        // consoleLog(`Progress: ${progress.toFixed(2)}%`);
      },
    })
      .promise.then(response => {
        // consoleLog('File downloaded!', response);
        showToastMessage(fileName + ' downloaded successfully.', 'success');
        openFileExternalViewer(filePath);
      })
      .catch(err => {
        consoleLog('Download error:', err);
      });
  }
};

/**
 *
 * @param {*} value
 * @returns radion from degree
 */
export const downloadFile = (url: string, fileName: string) => {
  const filePath = RNFS.DownloadDirectoryPath + '/' + fileName;
  RNFS.downloadFile({
    fromUrl: url,
    toFile: filePath,
    background: true, // Enable downloading in the background (iOS only)
    discretionary: true, // Allow the OS to control the timing and speed (iOS only)
    progress: res => {
      // Handle download progress updates if needed
      const progress = (res.bytesWritten / res.contentLength) * 100;
      consoleLog(`Progress: ${progress.toFixed(2)}%`);
    },
  })
    .promise.then(response => {
      consoleLog('File downloaded!', response);
      showToastMessage(fileName + ' downloaded successfully.', 'success');
    })
    .catch(err => {
      consoleLog('Download error:', err);
    });
};

// export const openOrDownloadFile2 = async (url: string, fileName: string) => {
//   const filePath = RNFS.DownloadDirectoryPath + '/' + fileName;
//   const isExist = await fileExist(filePath);
//   const _readFile = await readFile(filePath);
//   consoleLog('isExist', isExist);
//   consoleLog('_readFile', _readFile);
//   consoleLog('filePath', filePath);

//   if (1 === 2) {
//     // openFileExternalViewer('file://' + filePath);
//     // android.actionViewIntent(filePath, 'application/pdf');
//   } else {
//     RNFetchBlob.config({
//       path: filePath,
//       addAndroidDownloads: {
//         // useDownloadManager: true,
//         title: fileName,
//         description: 'test description',
//         mime: 'application/pdf',
//         mediaScannable: true,
//         notification: true,
//       },
//     })
//       .fetch('GET', url)
//       .then(res => {
//         consoleLog('res', res.path());
//         android.actionViewIntent(res.path(), 'application/pdf');
//       });
//   }
// };
