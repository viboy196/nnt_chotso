import React, {useState, useEffect, useRef, useMemo} from 'react';
import {Alert, View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Camera,
  CameraPermissionStatus,
  TakePhotoOptions,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from 'react-native-vision-camera';
import {RootTabScreenProps} from '../../../navigation/types';
import TextRecognition from 'react-native-text-recognition';

import Layout from '../../../constants/Layout';
import {useSqliteContext} from '../../../context/SqliteContext';
import Spinner from 'react-native-loading-spinner-overlay';
import {Customer} from '../../../utils/model';
import {useIsFocused} from '@react-navigation/native';
import PermissionsPage from '../../../components/Permissions';
const CameraScanningScreen = ({
  navigation,
}: RootTabScreenProps<'CameraScanning'>) => {
  const {customerSqlite} = useSqliteContext();
  const device = useCameraDevice('back');

  const {requestPermission} = useCameraPermission();
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus>();
  const format = useCameraFormat(device, [
    {
      videoResolution: {
        width: 400,
        height: 600,
      },
    },
  ]);

  const [viewCamera, setViewCamera] = useState<boolean>(true);

  const [loading, setLoading] = useState<{status: boolean; text?: string}>({
    status: false,
  });

  const camera = useRef<Camera>(null);

  const isFocused = useIsFocused();
  useEffect(() => {
    // @ts-ignore
    (async () => {
      const cameraPermissionStatus = await Camera.requestCameraPermission();
      setCameraPermission(cameraPermissionStatus);
    })();

    const unsubscribe = navigation.addListener('focus', () => {
      setViewCamera(true);
      requestPermission();
    });

    const unsubscribe1 = navigation.addListener('blur', () => {
      setViewCamera(false);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return () => {
      unsubscribe();
      unsubscribe1();
    };
  }, [device, navigation, requestPermission]);
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

  const takePicture = async () => {
    if (camera.current) {
      setLoading({status: true, text: 'Đang chụp'});
      const photo = await camera.current.takePhoto(takePhotoOptions);

      if (!photo) {
        Alert.alert(
          'Không tìm thấy mã đồng hồ',
          'Vui lòng chụp lại hoặc tìm kiếm thủ công',
          [
            {text: 'Chụp lại', onPress: () => setLoading({status: false})},
            {
              text: 'Quay về',
              onPress: () => {
                setLoading({status: false});
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  navigation.replace('Main', {screen: 'listFlow'});
                }
              },
            },
          ],
        );
        return;
      }

      const result = await TextRecognition.recognize('file://' + photo.path);
      console.log(result);

      // 2010068574 kkjhjkhkhkhkhk
      try {
        if (customerSqlite) {
          setLoading({status: true, text: 'Đang nhận dạng'});
          let str = result.join(',');
          str = str.replace(/\\s/g, '').replace(/\\r?\\n/g, '');
          const res = await customerSqlite.getFiltered(
            `SELECT * FROM Customer WHERE INSTR('|${str}|' , madongho) > 0 and madongho <> ''`,
          );
          setLoading({status: false, text: undefined});
          if (res.code === '00') {
            const customer = res.result[0] as Customer;
            if (customer) {
              Alert.alert(
                'Thông báo',
                `Tìm thấy khách hàng : ${customer.Tenkhachhang} \nMã đồng hồ : ${customer.Madongho}\n`,
                [
                  {
                    text: 'Tiếp thục',
                    onPress: () => {
                      navigation.navigate('listFlow', {
                        screen: 'CustomerDetail',
                        params: {data: customer},
                      });
                    },
                  },
                  {
                    text: 'Chụp lại',
                    onPress: () => setLoading({status: false}),
                  },
                ],
                {cancelable: false},
              );
            } else {
              Alert.alert(
                'Không tìm thấy mã đồng hồ',
                'Vui lòng chụp lại hoặc tìm kiếm thủ công',
                [
                  {
                    text: 'Chụp lại',
                    onPress: () => setLoading({status: false}),
                  },
                  {
                    text: 'Quay về',
                    onPress: () => {
                      setLoading({status: false});
                      if (navigation.canGoBack()) {
                        navigation.goBack();
                      } else {
                        navigation.replace('Main', {screen: 'listFlow'});
                      }
                    },
                  },
                ],
                {cancelable: false},
              );
            }
          }
        }
      } catch (error) {
        setLoading({status: false, text: undefined});
        Alert.alert(
          'Không tìm thấy mã đồng hồ',
          'Vui lòng chụp lại hoặc tìm kiếm thủ công',
          [
            {text: 'Chụp lại', onPress: () => setLoading({status: false})},
            {
              text: 'Quay về',
              onPress: () => {
                setLoading({status: false});
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  navigation.replace('Main', {screen: 'listFlow'});
                }
              },
            },
          ],
          {cancelable: false},
        );
      }
      setLoading({status: false, text: undefined});
    }
  };

  const renderDetectorContent = () => {
    if (device && cameraPermission === 'granted') {
      return (
        <>
          {viewCamera && (
            <Camera
              isActive={isFocused}
              style={{
                height: Layout.window.height - 20,
                width: (3 * (Layout.window.height - 20)) / 4,
                left:
                  (Layout.window.width -
                    (3 * (Layout.window.height - 20)) / 4) /
                  2,
                position: 'absolute',
              }}
              format={format}
              device={device}
              ref={camera}
              photo={true}
            />
          )}
        </>
      );
    }
    return <PermissionsPage setCameraPermission={setCameraPermission} />;
  };

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      {loading.status && (
        <Spinner
          animation="fade"
          visible={true}
          textStyle={{color: '#FFF'}}
          textContent={loading.text}
        />
      )}
      <>
        {renderDetectorContent()}
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

export default CameraScanningScreen;
