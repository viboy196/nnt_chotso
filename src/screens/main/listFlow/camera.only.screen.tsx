import React, {useState, useEffect, useMemo, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Camera,
  TakePhotoOptions,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from 'react-native-vision-camera';
import {ListFlowScreenProps} from '../../../navigation/types';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import Layout from '../../../constants/Layout';
import RNFS from 'react-native-fs';
import {mainColor} from '../../../constants/Colors';
import {useIsFocused} from '@react-navigation/native';
const CameraScreen = ({
  navigation,
  route,
}: ListFlowScreenProps<'CameraOnly'>) => {
  const {requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const format = useCameraFormat(device, [
    {
      videoResolution: {
        width: 400,
        height: 600,
      },
    },
  ]);
  const isFocused = useIsFocused();
  const takePhotoOptions = useMemo<TakePhotoOptions>(
    () => ({
      photoCodec: 'jpeg',
      qualityPrioritization: 'speed',
      flash: 'auto',
      quality: 90,
      enableShutterSound: false,
    }),
    [],
  );

  const [image, setImage] = useState<string>();
  useEffect(() => {
    // @ts-ignore
    if (device === undefined) {
      requestPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device]);

  const takePicture = async () => {
    if (camera.current) {
      const photo = await camera.current.takePhoto(takePhotoOptions);

      const manipResult = await ImageResizer.createResizedImage(
        'file://' + photo.path,
        400,
        600,
        'JPEG',
        100,
        0,
        undefined,
        false,
      );

      setImage(manipResult.uri);
    }
  };
  const sanpAgain = () => {
    setImage(undefined);
  };
  const continute = async () => {
    const fileName =
      'file://' +
      RNFS.DocumentDirectoryPath +
      '/' +
      route.params.data.Makhachhang +
      '_' +
      route.params.data.Mathoiky +
      '.jpg';

    if (fileName === image) {
      navigation.navigate('CustomerDetail', {
        data: route.params.data,
        picture: fileName,
      });
      return;
    }
    if (image) {
      await RNFS.moveFile(image, fileName);
    }
    setImage(fileName);
    navigation.navigate('CustomerDetail', {
      data: route.params.data,
      picture: fileName,
    });
  };
  if (!device) {
    return (
      <View style={{flex: 1}}>
        <Text style={{color: 'red'}}>Chưa cấp quyền camera</Text>
      </View>
    );
  }

  if (image) {
    return (
      <>
        <View style={{flex: 1}}>
          <Image source={{uri: image}} style={{flex: 1}} />
          <View style={{position: 'absolute', width: Layout.window.width}}>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  padding: 10,
                  marginRight: 20,
                  backgroundColor: '#7e7e7e',
                  borderRadius: 8,
                }}
                onPress={sanpAgain}>
                <Text style={{color: '#fff'}}>Chụp lại</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  padding: 10,
                  marginLeft: 20,
                  backgroundColor: mainColor,
                  borderRadius: 8,
                }}
                onPress={continute}>
                <Text style={{color: '#fff'}}>Chọn</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    );
  }

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <>
        <Camera
          style={{
            height: Layout.window.height - 20,
            width: (3 * (Layout.window.height - 20)) / 4,
            left:
              (Layout.window.width - (3 * (Layout.window.height - 20)) / 4) / 2,
            position: 'absolute',
          }}
          photo={true}
          ref={camera}
          isActive={isFocused}
          device={device}
          format={format}
        />
        <TouchableOpacity
          onPress={() => takePicture()}
          style={styles.btnCapture}>
          <Icon name="camera-iris" size={60} color="white" />
        </TouchableOpacity>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  btnCapture: {
    flex: 1,
    padding: 5,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 140, 255, 0.2)',
    justifyContent: 'center',
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 25,
    bottom: 40,
  },
});

export default CameraScreen;
