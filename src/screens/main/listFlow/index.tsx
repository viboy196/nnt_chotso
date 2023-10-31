import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ListFlowParamlist} from '../../../navigation/types';
import {mainColor} from '../../../constants/Colors';
import RegionScreen from './region.screen';
import CustomerScreen from './customer.screen';
import CustomerDetailScreen from './customerDeatail.screen';
import CameraScreen from './camera.only.screen';
import CustomerHistoryScreen from './customer.history.screen';

const Stack = createNativeStackNavigator<ListFlowParamlist>();
export default function ListFlowScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: mainColor},
        headerTintColor: '#fff',
      }}>
      <Stack.Screen
        name="Region"
        component={RegionScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Customer"
        component={CustomerScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CustomerDetail"
        component={CustomerDetailScreen}
        options={({route}) => ({
          title: route.params.data
            ? route.params.data.Tenkhachhang
            : 'Chi tiết',
        })}
      />
      <Stack.Screen
        name="CameraOnly"
        component={CameraScreen}
        options={({}) => ({
          title: 'Chụp ảnh',
        })}
      />
      <Stack.Screen
        name="CustomerHistory"
        component={CustomerHistoryScreen}
        options={({route}) => ({
          title: route.params.title ? route.params.title : 'Lịch sử',
        })}
      />
    </Stack.Navigator>
  );
}
