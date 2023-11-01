import {
  View,
  Text,
  Linking,
  Image,
  ImageRequireSource,
  StyleSheet,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Camera, CameraPermissionStatus} from 'react-native-vision-camera';
import Layout, {CONTENT_SPACING, SAFE_AREA_PADDING} from '../constants/Layout';
import DeviceInfo from 'react-native-device-info';

const BANNER_IMAGE = require('../assets/img/logo.png') as ImageRequireSource;

export default function PermissionsPage(props: {
  setCameraPermission: React.Dispatch<
    React.SetStateAction<CameraPermissionStatus | undefined>
  >;
}): React.ReactElement {
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>('not-determined');

  const requestCameraPermission = useCallback(async () => {
    if (cameraPermissionStatus !== 'granted') {
      console.log('Requesting camera permission...');
      const permission = await Camera.requestCameraPermission();
      if (permission === 'denied') {
        Linking.openSettings();
      }
      setCameraPermissionStatus(permission);
    }

    props.setCameraPermission('granted');
  }, [props, cameraPermissionStatus]);

  return (
    <View style={styles.container}>
      <Image source={BANNER_IMAGE} style={styles.banner} resizeMode="center" />
      <Text style={styles.welcome}>NNT CHOT SO</Text>
      <View style={styles.permissionsContainer}>
        {cameraPermissionStatus !== 'granted' && (
          <Text style={styles.permissionText}>
            {DeviceInfo.getApplicationName()} cần{' '}
            <Text style={styles.bold}>truy cập Camera</Text>.
            <Text style={styles.hyperlink} onPress={requestCameraPermission}>
              Cho phép
            </Text>
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 38,
    fontWeight: 'bold',
    maxWidth: '80%',
  },
  banner: {
    position: 'absolute',
    opacity: 0.4,

    padding: 'auto',
    width: Layout.window.width,
    height: Layout.window.height,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    ...SAFE_AREA_PADDING,
  },
  permissionsContainer: {
    marginTop: CONTENT_SPACING * 2,
  },
  permissionText: {
    fontSize: 17,
  },
  hyperlink: {
    color: '#007aff',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
});
