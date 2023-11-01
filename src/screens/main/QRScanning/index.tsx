import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Alert} from 'react-native';
import {RootTabScreenProps} from '../../../navigation/types';
import {useSqliteContext} from '../../../context/SqliteContext';
import {Customer} from '../../../utils/model';
import {
  Camera,
  CameraPermissionStatus,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';
import PermissionsPage from '../../../components/Permissions';

const QRScanningScreen = ({navigation}: RootTabScreenProps<'QRScanning'>) => {
  const {customerSqlite} = useSqliteContext();

  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus>();
  const isFocused = useIsFocused();
  const [viewCamera, setViewCamera] = useState<boolean>(true);

  const findQRcode = async (qrdata: string) => {
    try {
      if (qrdata === undefined) {
        return;
      }
      const restResult = await customerSqlite?.getFiltered(
        `Qrcode = '${qrdata}'`,
      );
      if (restResult?.code === '00') {
        const arr = restResult.result as Customer[];
        const customerResult = arr.at(0);
        if (customerResult === undefined) {
          Alert.alert(
            'Thông báo',
            `Mã qr quét : ${qrdata} không khớp với dữ liệu của bạn , bạn muốn map mã qr này dữ liệu hợp đồng ?`,
            [
              {
                text: 'Có',
                onPress: () => {
                  navigation.navigate('listFlow', {
                    screen: 'QRAssign',
                    params: {qrcode: qrdata},
                  });
                  setViewCamera(false);
                },
              },
              {
                text: 'Quét lại',
                onPress: () => {
                  setViewCamera(true);
                },
              },
            ],
          );
        } else {
          navigation.navigate('listFlow', {
            screen: 'CustomerDetail',
            params: {data: customerResult},
          });
        }
      }
    } catch (err) {
      console.warn(err);
      Alert.alert(
        'Thông báo',
        `Mã qr quét : ${qrdata} không khớp với dữ liệu của bạn , bạn muốn map mã qr này dữ liệu hợp đồng ?`,
        [
          {
            text: 'Có',
            onPress: () => {
              navigation.navigate('listFlow', {
                screen: 'QRAssign',
                params: {qrcode: qrdata},
              });
              setViewCamera(false);
            },
          },
          {
            text: 'Quét lại',
            onPress: () => {
              setViewCamera(true);
            },
          },
        ],
      );
    }
  };

  useEffect(() => {
    (async () => {
      const cameraPermissionStatus = await Camera.requestCameraPermission();
      setCameraPermission(cameraPermissionStatus);
    })();
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('focus');
      setViewCamera(true);
    });

    const unsubscribe1 = navigation.addListener('blur', () => {
      console.log('blur');
      setViewCamera(false);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return () => {
      unsubscribe();
      unsubscribe1();
    };
  }, [navigation, cameraPermission]);
  console.log('viewCamera', viewCamera);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      console.log(`Scanned ${codes.length} codes!`);
      if (codes.at(0)?.value) {
        //@ts-ignore
        findQRcode(codes.at(0)?.value);
        setViewCamera(false);
      }

      // findQRcode(data);
    },
  });
  const device = useCameraDevice('back');
  const renderDetectorContent = () => {
    if (device && cameraPermission === 'granted') {
      return (
        <>
          {viewCamera && (
            <Camera
              codeScanner={codeScanner}
              style={{
                flex: 1,
              }}
              device={device}
              isActive={isFocused}
            />
          )}
          <View style={{width: '100%', height: '100%', position: 'absolute'}}>
            <View style={{height: 140, backgroundColor: 'rgba(0,0,0,0.5)'}} />

            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{width: 60, backgroundColor: 'rgba(0,0,0,0.5)'}} />
              <View style={{flex: 1}} />
              <View style={{width: 60, backgroundColor: 'rgba(0,0,0,0.5)'}} />
            </View>
            <View style={{height: 140, backgroundColor: 'rgba(0,0,0,0.5)'}} />
          </View>
          <View style={styles.strokeArea1} />
          <View style={styles.strokeArea2} />
          <View style={styles.strokeArea3} />
          <View style={styles.strokeArea4} />
          <View style={styles.strokeArea5} />
          <View style={styles.strokeArea6} />
          <View style={styles.strokeArea7} />
          <View style={styles.strokeArea8} />
          <Text style={styles.descArea}>
            Đưa camera đến vùng chứa QR để quét
          </Text>
        </>
      );
    }
    return <PermissionsPage setCameraPermission={setCameraPermission} />;
  };

  return (
    <>
      <View style={{flex: 1, justifyContent: 'center'}}>
        {renderDetectorContent()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  fadingArea: {
    flex: 1,
    width: '100%',
    height: '100%',

    borderTopWidth: 140,
    borderBottomWidth: 140,
    borderLeftWidth: 60,
    borderRightWidth: 60,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    position: 'absolute',
  },
  descArea: {
    flex: 1,
    bottom: 120,
    width: '100%',
    textAlign: 'center',
    color: 'white',
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  strokeArea1: {
    top: 140,
    left: 60,
    flex: 1,
    width: 40,
    height: 2,
    alignSelf: 'center',
    backgroundColor: 'yellow',
    justifyContent: 'center',
    position: 'absolute',
  },
  strokeArea2: {
    top: 140,
    left: 60,
    flex: 1,
    width: 2,
    height: 40,
    alignSelf: 'center',
    backgroundColor: 'yellow',
    justifyContent: 'center',
    position: 'absolute',
  },
  strokeArea3: {
    top: 140,
    right: 60,
    flex: 1,
    width: 2,
    height: 40,
    alignSelf: 'center',
    backgroundColor: 'yellow',
    justifyContent: 'center',
    position: 'absolute',
  },
  strokeArea4: {
    top: 140,
    right: 60,
    flex: 1,
    width: 40,
    height: 2,
    alignSelf: 'center',
    backgroundColor: 'yellow',
    justifyContent: 'center',
    position: 'absolute',
  },
  strokeArea5: {
    bottom: 140,
    right: 60,
    flex: 1,
    width: 2,
    height: 40,
    alignSelf: 'center',
    backgroundColor: 'yellow',
    justifyContent: 'center',
    position: 'absolute',
  },
  strokeArea6: {
    bottom: 140,
    right: 60,
    flex: 1,
    width: 40,
    height: 2,
    alignSelf: 'center',
    backgroundColor: 'yellow',
    justifyContent: 'center',
    position: 'absolute',
  },
  strokeArea7: {
    bottom: 140,
    left: 60,
    flex: 1,
    width: 2,
    height: 40,
    alignSelf: 'center',
    backgroundColor: 'yellow',
    justifyContent: 'center',
    position: 'absolute',
  },
  strokeArea8: {
    bottom: 140,
    left: 60,
    flex: 1,
    width: 40,
    height: 2,
    alignSelf: 'center',
    backgroundColor: 'yellow',
    justifyContent: 'center',
    position: 'absolute',
  },
});

export default QRScanningScreen;
