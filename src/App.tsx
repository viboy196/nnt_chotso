import React from 'react';

import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
// redux
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import store, {persistor} from './redux/store/store';

// react native paper
import {MD3LightTheme, Provider as PaperProvider} from 'react-native-paper';
import {RootSiblingParent} from 'react-native-root-siblings';
import {mainColor} from './constants/Colors';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SqliteContext} from './context/SqliteContext';

import {StatusBar} from 'react-native';
import {enablePromise} from 'react-native-sqlite-storage';
import useCachedSql from './hooks/useCachedSql';

const theme = {
  ...MD3LightTheme, // or MD3DarkTheme
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    primary: mainColor,
    secondary: '#f1c40f',
    tertiary: '#a1b2c3',
  },
};
enablePromise(true);
export default function App() {
  const colorScheme = useColorScheme();
  const {isLoadingComplete, customerSqlite, regionSqlite} = useCachedSql();
  if (isLoadingComplete) {
    return (
      <SqliteContext.Provider value={{customerSqlite, regionSqlite}}>
        <PaperProvider theme={theme}>
          <RootSiblingParent>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <SafeAreaProvider>
                  <Navigation colorScheme={colorScheme} />
                  <StatusBar />
                </SafeAreaProvider>
              </PersistGate>
            </Provider>
          </RootSiblingParent>
        </PaperProvider>
      </SqliteContext.Provider>
    );
  }
}
