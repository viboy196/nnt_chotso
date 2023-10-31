import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Text,
} from 'react-native';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonsIcon from 'react-native-vector-icons/Ionicons';

import {Linking, ImageBackground} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {ScrollView} from 'react-native';
import {ListFlowScreenProps} from '../../../navigation/types';
import {useAppSelector} from '../../../redux/store/hooks';

import moment from 'moment';
import {Customer, Region} from '../../../utils/model';
import {useSqliteContext} from '../../../context/SqliteContext';
import {mainColor} from '../../../constants/Colors';
import Spinner from 'react-native-loading-spinner-overlay';

const CustomerDetailScreen = ({
  navigation,
  route,
}: ListFlowScreenProps<'CustomerDetail'>) => {
  const [chisomoi_not_update, setchisomoi_not_update] = useState<number>(-1);
  const {customerSqlite, regionSqlite} = useSqliteContext();
  const [customer, setCustomer] = useState<Customer>(route.params.data);
  const {username} = useAppSelector(s => s.user);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>();
  const [listMonth, setListMonth] =
    useState<{Date: number; Month: number; Year: number}[]>();
  const [mode, setMode] = useState<string>('NORMAL');

  const [textInfoImg, setTextInfoImg] = useState<string>(
    moment(
      customer.Ngaydocmoi !== ''
        ? customer.Ngaydocmoi
        : new Date().toLocaleString(),
      'MM/DD/YYYY hh:mm:ss A',
    ).format('DD/MM/YYYY HH:mm A') +
      '\n' +
      customer.Makhachhang +
      customer.Tenkhachhang +
      '\n' +
      'Mã ĐH: ' +
      customer.Madongho +
      '\n' +
      'Chỉ số: ' +
      customer.Chisomoi +
      '\n' +
      'Nhân viên đọc: ' +
      username,
  );

  const initListMonth = (mathoiky?: number) => {
    if (mathoiky === undefined) {
      return;
    }

    let arrCurData: {Date: number; Month: number; Year: number}[] = [];
    let curData = {
      Date: mathoiky,
      Month: mathoiky % 100,
      Year: Math.floor(mathoiky / 100),
    };
    let date = new Date();
    date.setMonth(curData.Month);
    date.setFullYear(curData.Year);

    for (let i = 0; i <= 6; i++) {
      let predate = new Date(date.getTime());
      predate.setMonth(predate.getMonth() - i);
      arrCurData.push({
        Year: predate.getFullYear(),
        Month: predate.getMonth(),
        Date: predate.getFullYear() * 100 + predate.getMonth(),
      });
    }

    setListMonth(arrCurData);
  };

  const saveCustomerData = async () => {
    try {
      if (isNaN(customer.Chisomoi) || customer.Chisomoi < customer.Chisocu) {
        setMessage('savewrong');
      } else {
        const restRegion = await regionSqlite?.getByPrimaryKey(
          customer.Makhuvuc,
        );
        const region = restRegion?.result as Region;
        if (region === undefined) {
          return;
        }

        if (chisomoi_not_update === -1) {
          await regionSqlite?.updateAsync({...region, Daghi: region.Daghi + 1});
        }
        setTextInfoImg(
          moment().format('MM/DD/YYYY hh:mm:ss A') +
            '\n' +
            customer.Makhachhang +
            customer.Tenkhachhang +
            '\n' +
            'Mã ĐH: ' +
            customer.Madongho +
            '\n' +
            'Chỉ số: ' +
            customer.Chisomoi +
            '\n' +
            'Nhân viên đọc: ' +
            username,
        );
        // cập nhật lại customer
        await customerSqlite?.updateAsync({
          ...customer,
          Dongbo: false,
          Ngaydocmoi: `${moment().format('MM/DD/YYYY hh:mm:ss A')}`,
        });
        setMessage('saveok');
      }
      setLoading(false);
    } catch (error) {
      setMessage('savefailed');
      setLoading(false);
    }
  };

  const announce = useCallback(() => {
    if (message == 'saveok') {
      showMessage({
        message: 'Lưu thành công',
        type: 'default',
        backgroundColor: 'green', // background color
        color: 'white', // text color
        duration: 1500,
      });
      setMessage('');
      if (mode == 'NORMAL') {
        new Promise(res => setTimeout(res, 1500)).then(() => {
          setLoading(false);
          navigation.goBack();
        });
      } else {
      }
    } else if (message == 'savefailed') {
      showMessage({
        message: 'Lưu dữ liệu thất bại',
        type: 'default',
        backgroundColor: 'red', // background color
        color: 'white', // text color
        duration: 1000,
      });
      setMessage('');
      new Promise(res => setTimeout(res, 1000)).then(() => {
        setLoading(false);
      });
    } else if (message == 'savewrong') {
      showMessage({
        message: 'Chỉ số mới không hợp lệ',
        type: 'default',
        backgroundColor: 'red', // background color
        color: 'white', // text color
        duration: 1000,
      });
      setMessage('');
      new Promise(res => setTimeout(res, 1000)).then(() => {
        setLoading(false);
      });
    }
    // else if (message == 'picturewrong') {
    //     showMessage({
    //         message: "Vui lòng chụp ảnh mặt đồng hồ",
    //         type: "default",
    //         backgroundColor: "red", // background color
    //         color: "white", // text color
    //         duration: 1000
    //     });
    //     setMessage('');
    //     new Promise(res => setTimeout(res, 1000)).then(() => { setLoading(false) });
    // }
    else if (message == 'savenopic') {
      showMessage({
        message: 'Yêu cầu phải có ảnh chụp',
        type: 'default',
        backgroundColor: 'red', // background color
        color: 'white', // text color
        duration: 1000,
      });
      setMessage('');
      new Promise(res => setTimeout(res, 1000)).then(() => {
        setLoading(false);
      });
    }
  }, [message, mode, navigation]);

  useEffect(() => {
    announce();
  }, [announce]);

  useEffect(() => {
    if (route.params.goCamera) {
      navigation.navigate('CameraOnly', {data: customer});
    }
    Geolocation.requestAuthorization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //if (customer == null || customer.Makhachhang != navigation.getParam('makhachhang') || navigation.getParam('prevScreen') == 'CameraOnly') {
  useEffect(() => {
    customerSqlite?.getByPrimaryKey(route.params.data.Makhachhang).then(res => {
      if (res.code === '00') {
        setchisomoi_not_update(res.result.Chisomoi);
      }
    });

    initListMonth(customer.Mathoiky);
    setCustomer(old => ({
      ...old,
      Picture: route.params.picture ? route.params.picture : customer.Picture,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  const save = () => {
    // if (customer.Picture === '') {
    //     setMessage('picturewrong');
    //     return
    // }
    if (customer.Chisomoi < 1) {
      showMessage({
        message: 'Chưa ghi chỉ số',
        type: 'default',
        backgroundColor: 'red', // background color
        color: 'white', // text color
        duration: 1000,
      });
      return;
    }
    setLoading(true);
    setMode('NORMAL');

    Geolocation.getCurrentPosition(pos => {
      setCustomer(old => {
        return {
          ...old,
          Latitude: `${pos.coords.latitude}`,
          Longitude: `${pos.coords.longitude}`,
        };
      });
      new Promise(res => setTimeout(res, 200)).then(() => saveCustomerData());
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {loading && <Spinner visible={loading} textStyle={{color: '#FFF'}} />}
        {customer === undefined ? null : (
          <View style={{flex: 1}}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingBottom: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <IonsIcon
                    name="water"
                    size={20}
                    color={mainColor}
                    style={{padding: 10}}
                  />
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: mainColor,
                      flex: 1,
                    }}>
                    <Text>Chỉ số cũ</Text>
                    <Text style={{color: mainColor, fontWeight: '700'}}>
                      {customer.Chisocu > 0 ? customer.Chisocu : ''}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 3,
                    paddingHorizontal: 10,
                  }}>
                  <IonsIcon
                    name="time"
                    size={20}
                    color={mainColor}
                    style={{padding: 10}}
                  />
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: mainColor,
                      flex: 1,
                    }}>
                    <Text>Mã Đồng hồ</Text>
                    <Text style={{color: mainColor, fontWeight: '700'}}>
                      {customer.Madongho}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{flexDirection: 'row', paddingBottom: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <IonsIcon
                    name="water"
                    size={20}
                    color={mainColor}
                    style={{padding: 10}}
                  />
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: mainColor,
                      flex: 1,
                    }}>
                    <Text>
                      Chỉ số mới :{' '}
                      {chisomoi_not_update > -1 ? chisomoi_not_update : ''}
                    </Text>
                    <TextInput
                      keyboardType="numeric"
                      onChangeText={text => {
                        setCustomer(old => {
                          return {...old, Chisomoi: Number(text)};
                        });
                      }}
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: mainColor,
                        flex: 1,
                      }}
                      value={
                        customer.Chisomoi > -1
                          ? customer.Chisomoi.toString()
                          : ''
                      }
                      placeholder="Nhập chỉ số"
                    />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    flex: 3,
                    paddingHorizontal: 10,
                    justifyContent: 'flex-end',
                  }}>
                  <TouchableOpacity
                    disabled={loading}
                    onPress={save}
                    style={{
                      padding: 10,
                      width: 120,
                      backgroundColor: mainColor,
                      borderRadius: 8,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}>
                      Lưu
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  height: 350,
                  marginBottom: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {customer.Picture !== '' && (
                  <ImageBackground
                    style={{
                      flex: 1,
                      height: 350,
                      margin: 10,
                      width: (350 * 2) / 3,
                      marginHorizontal: 'auto',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                    }}
                    resizeMode="contain"
                    source={{uri: customer.Picture}}>
                    <View
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.4)',
                        flexDirection: 'row',
                        position: 'absolute',
                        bottom: 10,
                        left: 10,
                      }}>
                      {customer.Chisomoi !== -1 && (
                        <Text
                          style={{
                            color: 'red',
                            fontSize: 10,
                            fontWeight: 'bold',
                            width: (350 * 2) / 3 - 20,
                          }}>
                          {textInfoImg}
                        </Text>
                      )}
                    </View>
                  </ImageBackground>
                )}
                <IonsIcon
                  name="camera"
                  style={{position: 'absolute', top: 10, left: 10}}
                  size={20}
                  color={mainColor}
                />
                <TouchableOpacity
                  onPress={() => {
                    setCustomer(old => ({...old, Picture: ''}));
                    navigation.navigate('CameraOnly', {data: customer});
                  }}
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    padding: 10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: mainColor,
                    borderRadius: 8,
                    marginHorizontal: 10,
                  }}>
                  <IonsIcon name="camera" size={18} color={'#fff'} />
                  <Text style={{color: '#fff', paddingLeft: 5}}>
                    {customer.Picture !== '' ? 'Chụp Ảnh' : 'Chụp lại'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  flex: 2,
                  marginBottom: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <IonsIcon
                  name="create"
                  size={20}
                  color={mainColor}
                  style={{padding: 10}}
                />
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: mainColor,
                    flex: 1,
                  }}>
                  <Text style={{}}>Thêm ghi chú</Text>
                  <TextInput
                    value={customer.Ghichu}
                    onChangeText={text => {
                      setCustomer(old => ({...old, Ghichu: text}));
                    }}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: mainColor,
                      flex: 1,
                    }}
                    placeholder="Nhập chỉ số"
                  />
                </View>
              </View>
            </View>
            <View>
              <Text style={{fontWeight: '700', fontSize: 20}}>
                thông tin khách hàng
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Icon
                  name="vcard-o"
                  size={20}
                  color={mainColor}
                  style={{padding: 10}}
                />
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: mainColor,
                    flex: 1,
                  }}>
                  <Text>Mã Khách hàng</Text>
                  <Text style={{color: mainColor, fontWeight: '700'}}>
                    {customer.Makhachhang}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  flex: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <IonsIcon
                  name="call"
                  size={20}
                  color={mainColor}
                  style={{padding: 10}}
                />
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: mainColor,
                    flex: 1,
                  }}>
                  <Text>Số điện thoại</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingBottom: 5,
                    }}>
                    <Text
                      style={{color: mainColor, fontWeight: '700', flex: 1}}>
                      {customer.Sodienthoai == -1 || customer.Sodienthoai == 0
                        ? 'Không có'
                        : '0' + customer.Sodienthoai}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(`tel:${'0' + customer.Sodienthoai}`);
                      }}
                      style={{
                        padding: 10,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: mainColor,
                        borderRadius: 8,
                        marginHorizontal: 10,
                      }}>
                      <IonsIcon name="call" size={18} color={'#fff'} />
                      <Text style={{color: '#fff', paddingLeft: 5}}>
                        Gọi ngay
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  flex: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <IonsIcon
                  name="navigate"
                  size={20}
                  color={mainColor}
                  style={{padding: 10}}
                />
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: mainColor,
                    flex: 1,
                  }}>
                  <Text>Địa chỉ</Text>
                  <Text style={{color: mainColor, fontWeight: '700'}}>
                    {customer.Diachi}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <IonsIcon
                  name="bookmarks"
                  size={20}
                  color={mainColor}
                  style={{padding: 10}}
                />
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: mainColor,
                    flex: 1,
                  }}>
                  <Text>Xem lịch sử sử dụng</Text>
                  <View style={{flexDirection: 'row'}}>
                    {listMonth &&
                      listMonth.map(item => (
                        <TouchableOpacity
                          key={item.Date}
                          onPress={() => {
                            navigation.navigate('CustomerHistory', {
                              data: customer,
                              title:
                                'Lịch sử tháng ' + item.Month + '/' + item.Year,
                              mathoiky: item.Date,
                            });
                          }}>
                          <Text style={styles.clickableText}>
                            T.{item.Month}
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <IonsIcon
                  name="color-fill"
                  size={20}
                  color={mainColor}
                  style={{padding: 10}}
                />
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: mainColor,
                    flex: 1,
                  }}>
                  <Text>Tiêu thụ</Text>
                  <Text style={{color: mainColor, fontWeight: '700'}}>
                    {customer.Muctieuthu > -1 && customer.Muctieuthu}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <IonsIcon
                  name="color-fill"
                  size={20}
                  color={mainColor}
                  style={{padding: 10}}
                />
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: mainColor,
                    flex: 1,
                  }}>
                  <Text>Tiêu thụ trung bình</Text>
                  <Text style={{color: mainColor, fontWeight: '700'}}>
                    {customer.Muctieuthu}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                paddingBottom: 10,
              }}>
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 8,
                  backgroundColor: mainColor,
                }}
                onPress={() => {
                  Alert.alert('Tính năng đang phát triển trên nên tảng ios');
                }}>
                <Text style={{color: '#fff'}}>In biên lai</Text>
              </TouchableOpacity>
            </View>

            {/* <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name='clock-o' size={15} color='rgb(23,78,166)' style={styles.icon} />
                                    <Text>Chỉ số cũ : {`${customer.Chisocu}`}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name='clock-o' size={15} color='rgb(23,78,166)' style={styles.icon} />
                                    <Text>Chỉ số mới : {chisomoi_not_update > -1 ? chisomoi_not_update : ''}</Text>
                                </View>
                                <Input
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    placeholder={(!customer.Chisomoi || customer.Chisomoi <= 0) ? "Nhập" : 'Sửa'}
                                    value={customer.Chisomoi > -1 ? customer.Chisomoi.toString() : ''}
                                    keyboardType='numeric'
                                    autoFocus={true}
                                    onChangeText={(text) => {
                                        setCustomer(old => {
                                            return { ...old, Chisomoi: Number(text) }
                                        })
                                    }}
                                    containerStyle={{ borderColor: 'black' }}
                                />

                            </View>
                            <View style={{ flex: 1 }}>
                                <Button disabled={loading} title={loading ? 'Đang lưu' : 'Lưu'} onPress={() => {
                                    if (customer.Picture === '') {
                                        setMessage('picturewrong');
                                        return
                                    }
                                    setLoading(true)
                                    setMode('NORMAL');
                                    Location.requestForegroundPermissionsAsync().then(res => {
                                        const { status } = res
                                        console.log('requestForegroundPermissionsAsync', res);

                                        Location.getCurrentPositionAsync()
                                            .then(locations => {
                                                console.log(locations);
                                                setCustomer(old => {
                                                    return {
                                                        ...old, Latitude: `${locations.coords.latitude}`,
                                                        Longitude: `${locations.coords.longitude}`
                                                    }
                                                })
                                                new Promise(res => setTimeout(res, 200)).then(() => saveCustomerData());
                                            });
                                    });
                                }} />
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name='clock-o' size={15} color='rgb(23,78,166)' style={styles.icon} />
                                    <Text>{customer.Madongho}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                    <Icon name='phone' size={15} color='rgb(23,78,166)' style={styles.icon} />
                                    <Text>{(customer.Sodienthoai == -1 || customer.Sodienthoai == 0) ? 'Không có' : '0' + customer.Sodienthoai}</Text>
                                    {customer.Sodienthoai == -1 ? <Text></Text> : <TouchableOpacity
                                        onPress={() => {
                                            Linking.openURL(`tel:${'0' + customer.Sodienthoai}`)
                                        }}
                                    >
                                        <Text style={styles.clickableText}>Gọi ngay</Text>
                                    </TouchableOpacity>}

                                </View>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-around', flex: 1 }}>
                            <Button style={styles.button} disabled={loading} title={'In tạm thu'} onPress={
                                () => {
                                    if (customer.Picture === undefined) {
                                        setMessage('picturewrong');
                                        return
                                    }
                                    setLoading(true);
                                    setMode('PRINTING');


                                    try {
                                        Location.requestForegroundPermissionsAsync().then(res => {
                                            if (res.status !== 'granted') {
                                                Location.getCurrentPositionAsync({ timeInterval: 60000 })
                                                    .then(locations => {
                                                        console.log(locations);
                                                        setCustomer(old => {
                                                            return {
                                                                ...old, Latitude: `${locations.coords.latitude}`,
                                                                Longitude: `${locations.coords.longitude}`
                                                            }
                                                        })
                                                        new Promise(res => setTimeout(res, 200)).then(() => saveCustomerData());
                                                    })
                                            }
                                            else {

                                                new Promise(res => setTimeout(res, 200)).then(() => saveCustomerData());
                                            }
                                        });
                                    } catch (err) {
                                        new Promise(res => setTimeout(res, 200)).then(() => saveCustomerData());
                                    }

                                }
                            } />
                            {
                                (customer.Chisomoi === undefined || customer.Chisomoi == -1) ? <></> :
                                    <Button style={styles.button} disabled={loading} title={'In biên lai'} onPress={
                                        () => {
                                            if (customer) {
                                                if (customer.Chisomoi != undefined && customer.Chisomoi != -1) navigation.navigate('BillPrint', { customer: customer });
                                                else alert("Chưa chốt số, không thể in biên lai");
                                            }


                                        }
                                    } />
                            }

                        </View>
                        <View style={{ flex: 3 }}>
                            {(customer.Picture == '' && route.params.picture === undefined)
                                ?
                                <View><Text style={{ justifyContent: 'center', color: 'red' }}>Chưa có ảnh chụp</Text>
                                    <Button title='Nhấn vào đây để chụp ảnh' onPress={
                                        () => {
                                            navigation.navigate('CameraOnly', { data: customer })
                                        }
                                    } />
                                </View>
                                : <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={
                                        () => {
                                            setCustomer(old => ({ ...old, Picture: '' }))
                                            navigation.navigate('CameraOnly', { data: customer })
                                        }}>

                                    {customer.Picture !== '' && <Image style={{ flex: 1, resizeMode: 'contain', height: 350, margin: 10 }} source={{ uri: customer.Picture }} />}
                                </TouchableOpacity>}
                            <View style={{ height: 10 }}></View>
                            <Input
                                autoCapitalize='none'
                                autoCorrect={false}
                                placeholder={customer.Ghichu == '' ? 'Nhập ghi chú' : customer.Ghichu}
                                value={customer.Ghichu}
                                onChangeText={(text) => {
                                    setCustomer(old => ({ ...old, Ghichu: text }))
                                }}
                                containerStyle={{ borderColor: 'black' }}
                            />
                        </View>


                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Icon name='home' size={15} color='rgb(23,78,166)' style={styles.icon} />
                            <Text >{customer.Diachi}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Icon name='history' size={15} color='rgb(23,78,166)' style={styles.icon} />
                            <Text >Lịch sử: </Text>

                            {listMonth && listMonth.map(item => <TouchableOpacity
                                key={item.Date}
                                onPress={() => {
                                    navigation.navigate('CustomerHistory', { data: customer, title: "Lịch sử tháng " + item.Month + "/" + item.Year, mathoiky: item.Date });
                                }}
                            >
                                <Text style={styles.clickableText}>T.{item.Month}</Text>
                            </TouchableOpacity>)}
                        </View> */}
          </View>
        )}
        <FlashMessage position="top" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  spacer: {
    margin: 25,
  },
  error: {
    color: 'red',
  },
  icon: {
    marginTop: 3,
    marginRight: 5,
  },
  clickableText: {
    marginLeft: 10,
    padding: 5,
    textDecorationLine: 'underline',
    color: mainColor,
    fontWeight: 'bold',
  },
  button: {
    //justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 10,
    flex: 1,
  },
});

export default CustomerDetailScreen;
