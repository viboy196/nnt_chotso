import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootTabParamList} from '../../navigation/types';
import {mainColor} from '../../constants/Colors';
import {ImageSourcePropType} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Image} from '@rneui/base';
import ListFlowScreen from './listFlow';
import QRScanningScreen from './QRScanning';
import CameraScanningScreen from './CameraScanning';

export default function Main() {
  const BottomTab = createBottomTabNavigator<RootTabParamList>();

  return (
    <BottomTab.Navigator
      initialRouteName="listFlow"
      screenOptions={{
        tabBarActiveTintColor: mainColor,
      }}>
      <BottomTab.Screen
        name="listFlow"
        component={ListFlowScreen}
        options={() => ({
          title: 'Danh sách',
          headerShown: false,
          tabBarIcon: ({color}) => <TabBarIcon name="list" color={color} />,
        })}
      />
      <BottomTab.Screen
        name="QRScanning"
        component={QRScanningScreen}
        options={{
          title: 'Quét QR',
          headerShown: false,
          tabBarIcon: ({color}) => <TabBarIcon name="qrcode" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="CameraScanning"
        component={CameraScanningScreen}
        options={{
          title: 'Quét mã ĐH',
          headerShown: false,
          tabBarIcon: ({color}) => <TabBarIcon name="camera" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  imageSource?: ImageSourcePropType;
}) {
  if (props.imageSource) {
    return (
      <Image
        source={props.imageSource}
        resizeMode="cover"
        style={{width: 30, height: 30, tintColor: props.color}}
      />
    );
  }
  return <FontAwesome size={30} style={{marginBottom: -3}} {...props} />;
}
