import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice.js';
import moduleReducer from './moduleSlice.js'

import { 
  persistReducer, 
  persistStore, 
  FLUSH, 
  REHYDRATE, 
  PAUSE, 
  PERSIST, 
  PURGE, 
  REGISTER 
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';



const isPersistCorrupted = () => {
  try {
    const persistRoot = localStorage.getItem('persist:root');
    if (!persistRoot) return false;
    
    JSON.parse(persistRoot);
    return false;
  } catch (error) {
    console.error('Corrupted persist:root detected:', error);
    return true;
  }
};

if (isPersistCorrupted()) {
  try {
    console.warn('Clearing corrupted Redux persistence data');
    localStorage.removeItem('persist:root');
    sessionStorage.clear();
  } catch (e) {
    console.error('Failed to clear corrupted storage:', e);
  }
}

const rootReducer = combineReducers({
  user: userReducer,
  module: moduleReducer
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['user'],
  blacklist: [],
  writeFailHandler: (error) => {
    console.error('Redux Persist write failure:', error);
  },
};

const createPersistedReducer = () => {
  try {
    return persistReducer(persistConfig, rootReducer);
  } catch (error) {
    console.error('Failed to create persisted reducer:', error);
    return rootReducer;
  }
};

const persistedReducer = createPersistedReducer();

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      store => next => action => {
        try {
          return next(action);
        } catch (error) {
          console.error('Redux action error:', error);
          if (error.message?.includes('persist') || error.message?.includes('storage')) {
            try {
              localStorage.removeItem('persist:root');
              sessionStorage.clear();
            } catch (e) {
              console.error('Failed to clear storage:', e);
            }
          }
          throw error;
        }
      }
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = (() => {
  try {
    const persistor = persistStore(store);
    persistor.subscribe(() => {
      const { bootstrapped } = persistor.getState();
   
    });
    
    return persistor;
  } catch (error) {
    console.error('Failed to create persistor:', error);
    try {
      localStorage.removeItem('persist:root');
      sessionStorage.clear();
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
    return null;
  }
})();

if (process.env.NODE_ENV !== 'production') {
  window.__RESET_PERSISTED_STATE__ = () => {
    try {
      localStorage.removeItem('persist:root');
      sessionStorage.clear();
      window.location.reload();
      return true;
    } catch (e) {
      console.error('Failed to reset persisted state:', e);
      return false;
    }
  };
}

window.addEventListener('storage', (event) => {
  if (event.key === 'persist:root' && event.newValue === null) {
    console.warn('Redux persist storage was cleared externally');
    window.location.reload();
  }
});

