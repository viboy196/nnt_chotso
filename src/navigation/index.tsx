import {
  NavigationContainer,
  DefaultTheme,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {ColorSchemeName} from 'react-native';

import {RootStackParamList} from './types';
import {mainColor} from '../constants/Colors';

// screens
import LoginScreen from '../screens/login.screen';
import MainScreen from '../screens/main';
import StartScreen from '../screens/start.screen';
import LoadingScreen from '../screens/loading.screen';

export const navigationRef =
  React.createRef<NavigationContainerRef<RootStackParamList>>();

export default function Navigation({}: {colorScheme?: ColorSchemeName}) {
  return (
    <NavigationContainer
      ref={navigationRef}
      theme={{...DefaultTheme, dark: false}}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  // const { username } = useAppSelector((state) => state.user);
  // React.useEffect(() => {
  //   if (navigationRef.current?.isReady()) {
  //     if (username === undefined) {
  //       navigationRef.current?.dispatch(StackActions.replace("Login"));
  //       return;
  //     }
  //     if (username !== undefined) {
  //       navigationRef.current?.dispatch(StackActions.replace("Main"));
  //       return;
  //     }
  //   }
  // }, [username]);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: mainColor},
        headerTintColor: '#fff',
      }}>
      <Stack.Screen
        name="Start"
        component={StartScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Loading"
        component={LoadingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
