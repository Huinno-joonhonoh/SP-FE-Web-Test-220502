import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import rootReducer from 'redux/rootReducer';
import rootSaga from 'redux/rootSaga';

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: [],
};

const config = () => {
  // Create the saga middleware
  const sagaMiddleware = createSagaMiddleware();
  //
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  // Enhancer setting for Redux Devtools, ONLY in development env.
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // Specify extension’s options like name, actionsDenylist, actionsCreators, serialize...
        })
      : compose;
  const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));
  // Mount it on the Store
  const store = createStore(persistedReducer, enhancer);
  // then run the sagas
  sagaMiddleware.run(rootSaga);

  //
  const persistor = persistStore(store);
  return { store, persistor };
};

export default config;
