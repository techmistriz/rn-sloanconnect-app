import {MutableRefObject} from 'react';
import {LoaderOverlayRefProp} from './types';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';

export default class LoaderOverlayController {
  static __loaderOverlayRef: MutableRefObject<LoaderOverlayRefProp>;
  static setLoaderOverlayRef = (ref: any) => {
    consoleLog('LoaderOverlayController setLoaderOverlayRef called');
    this.__loaderOverlayRef = ref;
  };

  static showLoaderOverlay = (message = 'Loading') => {
    consoleLog('LoaderOverlayController showLoaderOverlay called');
    this.__loaderOverlayRef.current?.showLoaderOverlay(message);
  };

  static hideLoaderOverlay = () => {
    consoleLog('LoaderOverlayController hideLoaderOverlay called');
    this.__loaderOverlayRef.current?.hideLoaderOverlay();
  };
}
