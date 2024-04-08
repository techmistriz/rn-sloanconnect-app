// import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStore, applyMiddleware} from 'redux';
import {combinedReducers} from './reducers';
import rootSaga from './sagas';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['AuthReducer', 'DeviceSettingsReducer'],
};

// const persistedReducer = persistReducer(persistConfig, authReducer);
const persistedReducer = persistReducer(persistConfig, combinedReducers);

const sagaMiddlewareObj = createSagaMiddleware();
const middlewares = [sagaMiddlewareObj];

const store = createStore(persistedReducer, applyMiddleware(...middlewares));

sagaMiddlewareObj.run(rootSaga);

export default store;

export const persistor = persistStore(store);
