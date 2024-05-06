import {NavigationActions, StackActions} from '@react-navigation/compat';
import {
  CommonActions,
  createNavigationContainerRef,
  StackActions as StackActionsNative,
} from '@react-navigation/native';
import _ from 'lodash';

let _navigator = createNavigationContainerRef() as any;
export let globalNavRef = createNavigationContainerRef() as any;
/**
 *
 * @param {*} navigatorRef
 * set the navigator ref to local ref from NavigationRoot file
 */
function setTopLevelNavigator(navigatorRef: any) {
  _navigator = navigatorRef;
  globalNavRef = navigatorRef;
}

/**
 *
 * @param {*} routeName
 * @param {*} params
 * provide navigation to given routename
 */
function navigate(routeName: string, params?: any) {
  if (
    routeName == ''
  ) {
    // return false;
  }
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

/**
 *
 * @param {*} routeName
 * @param {*} params
 * provide navigation to given routename
 */
function replace(routeName: string, params?: any) {
  _navigator.dispatch(StackActionsNative.replace(routeName, params));
}

/**
 *
 * @returns navigation state
 */
function getState() {
  return _navigator.state.nav;
}

/**
 *
 * @returns get current route name
 */
function getCurrentRoute() {
  return _navigator?.getCurrentRoute();
}

/**
 *
 * @param {*} navigationState
 * @returns get current route name
 */
function getCurrentRouteNested(navigationState: any) {
  const route = navigationState?.routes[navigationState?.index];
  // dive into nested navigators
  if (route?.routes) {
    return getCurrentRouteNested(route);
  }
  return route;
}

/**
 *
 * @param {*} params
 * sets the custom params to route navigation
 */
function setParams(params: any) {
  const currentRoute = getCurrentRouteNested(getState());
  let {key} = currentRoute;
  _navigator.dispatch(
    NavigationActions.setParams({
      key,
      params,
    }),
  );
}

/** goback method */
function goBack() {
  _navigator.dispatch(NavigationActions.back({}));
}

/**
 * navigation pop method
 */
function pop(n: number = 1) {
  _navigator.dispatch(StackActionsNative.pop(n));
}

/**
 * navigation popToTop method
 */
function popToTop() {
  _navigator.dispatch(StackActions.popToTop());
}

/** stack reset action method */
function resetAction(routeName: any, params?: any, index: number = 0) {
  _navigator.dispatch(
    CommonActions.reset({
      // index: index,
      routes: [{name: routeName, params}],
    }),
  );
}

/** stack reset action method */
function resetAllAction(routeName: any, params?: any, index: number = 0) {
  _navigator.dispatch(
    CommonActions.reset({
      index: index,
      routes: [{name: routeName, params}],
    }),
  );
}

/**
 *
 * @param {*} mainTabRouteName
 * @param {*} nestedRouteName
 * @param {*} params
 * stack reset action handling
 */
function resetActionForNotification(
  mainTabRouteName: any,
  nestedRouteName: any,
  params: any,
) {
  _navigator.navigate(mainTabRouteName, {
    screen: nestedRouteName,
    params,
  });
}

/**
 *
 * @param {*} mainTabRouteName
 * @param {*} nextScreenName
 * @param {*} params
 * stack reset handling
 */
function stackReset(mainTabRouteName: any, nextScreenName: any, params: any) {
  const resetAction = CommonActions.reset({
    index: 0,
    routeNames: [mainTabRouteName],
  });
  _navigator.dispatch(resetAction);
  const screenActions = NavigationActions.navigate({
    routeName: nextScreenName,
    params: params,
  });
  _navigator.dispatch(screenActions);
}

/**
 * Navigation Service Facility for provide different Kind of routing
 */
export default {
  goBack,
  navigate,
  replace,
  getState,
  setParams,
  pop,
  popToTop,
  resetAction,
  resetAllAction,
  getCurrentRoute,
  getCurrentRouteNested,
  setTopLevelNavigator,
  resetActionForNotification,
  stackReset,
};
