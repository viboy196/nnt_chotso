import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Linking} from 'react-native';
import {ListFlowScreenProps} from '../../../navigation/types';
import {useAppSelector} from '../../../redux/store/hooks';
import ApiRequest from '../../../utils/api/base/ApiRequest';
import {Customer} from '../../../utils/model';

import moment from 'moment';

const CustomerHistoryScreen = ({
  route,
}: ListFlowScreenProps<'CustomerHistory'>) => {
  const [customer, setCustomer] = useState<Customer | null>(route.params.data);
  const [Isloading, setIsloading] = useState(true);
  const {domain} = useAppSelector(s => s.user);
  const [textInfoImg, setTextInfoImg] = useState<string>();

  const loadHistoryData = (CustomerCode: string, DateIndex: number) => {
    if (domain === undefined) {
      return;
    }

    setIsloading(true);

    const dataSend = {
      makhachhang: CustomerCode,
      mathoiky: DateIndex,
    };
    ApiRequest.FindHistoryChiso(dataSend, domain)
      .then(response => {
        if (response.data === null) {
          setCustomer(null);
        } else {
          const timenow = moment(
            response.data[0].Ngaydocmoi,
            'MM/DD/YYYY hh:mm:ss A',
          ).format('DD/MM/YYYY HH:mm A');
          const _textInfoImg =
            timenow +
            '\n' +
            response.data[0].Makhachhang +
            response.data[0].Tenkhachhang +
            '\n' +
            'Mã ĐH: ' +
            response.data[0].Madongho +
            '\n' +
            'Chỉ số: ' +
            response.data[0].Chisomoi +
            '\n' +
            'Nhân viên đọc: ' +
            response.data[0].Manvghiso;
          setTextInfoImg(_textInfoImg);
          setCustomer(response.data[0]);
        }
        setIsloading(false);
      })
      .catch(err => {
        setCustomer(null);
        console.log(err);
        setIsloading(false);
      });
  };

  useEffect(() => {
    if (route.params.mathoiky && route.params.data.Makhachhang) {
      loadHistoryData(route.params.data.Makhachhang, route.params.mathoiky);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params.mathoiky]);

  return (
    <>
      {Isloading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.container}>
          {customer === null ? (
            <View>
              <Text style={{justifyContent: 'center', color: 'red'}}>
                Không có dữ liệu
              </Text>
            </View>
          ) : customer === undefined ? (
            <View>
              <Text style={{justifyContent: 'center', color: 'red'}}>
                Vui lòng mở kết nối internet để sử dụng chức năng này
              </Text>
            </View>
          ) : (
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <View style={{flexDirection: 'row'}}>
                    <Icon
                      name="clock-o"
                      size={15}
                      color="rgb(23,78,166)"
                      style={styles.icon}
                    />
                    <Text>Chỉ số cũ : {customer.Chisocu}</Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Icon
                      name="clock-o"
                      size={15}
                      color="rgb(23,78,166)"
                      style={styles.icon}
                    />
                    <Text>Chỉ số mới : {customer.Chisomoi}</Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Icon
                      name="clock-o"
                      size={15}
                      color="rgb(23,78,166)"
                      style={styles.icon}
                    />
                    <Text>
                      Tiêu thụ :{' '}
                      {Number(customer.Chisomoi) - Number(customer.Chisocu)}
                    </Text>
                  </View>
                </View>
                <View style={{flex: 1}}>
                  <View style={{flexDirection: 'row'}}>
                    <Icon
                      name="clock-o"
                      size={15}
                      color="rgb(23,78,166)"
                      style={styles.icon}
                    />
                    <Text>Mã ĐH: {customer.Madongho}</Text>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 8}}>
                    <Icon
                      name="phone"
                      size={15}
                      color="rgb(23,78,166)"
                      style={styles.icon}
                    />
                    <Text>
                      {customer.Sodienthoai == -1 || customer.Sodienthoai == 0
                        ? 'Không có'
                        : '0' + customer.Sodienthoai}
                    </Text>
                    {customer.Sodienthoai == -1 ? (
                      <Text />
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          Linking.openURL(`tel:${'0' + customer.Sodienthoai}`);
                        }}>
                        <Text
                          style={{
                            marginLeft: 5,
                            textDecorationLine: 'underline',
                            color: 'rgb(23,78,166)',
                            fontWeight: 'bold',
                          }}>
                          Gọi ngay
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Icon
                  name="home"
                  size={15}
                  color="rgb(23,78,166)"
                  style={styles.icon}
                />
                <Text>{customer.Diachi}</Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Icon
                  name="home"
                  size={15}
                  color="rgb(23,78,166)"
                  style={styles.icon}
                />
                <Text>Ghi chú: {customer.Ghichu} </Text>
              </View>
              <View style={{flex: 3}}>
                {customer.Picture == '' ? (
                  <View>
                    <Text style={{justifyContent: 'center', color: 'red'}}>
                      Tháng này không có ảnh chụp
                    </Text>
                  </View>
                ) : (
                  <ImageBackground
                    style={{flex: 1, margin: 10}}
                    resizeMode="contain"
                    source={{
                      uri: `data:image/jpeg;base64,${customer.Picture}`,
                    }}>
                    {customer.Mathoiky > 202309 && (
                      <View
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.5)',
                          padding: 10,
                          flexDirection: 'row',
                          position: 'absolute',
                          bottom: 40,
                          left: 40,
                        }}>
                        <Text
                          style={{
                            color: 'red',
                            fontSize: 12,
                            fontWeight: 'bold',
                          }}>
                          {textInfoImg}
                        </Text>
                      </View>
                    )}
                  </ImageBackground>
                )}
              </View>
            </View>
          )}
        </View>
      )}
    </>
  );
};

export default CustomerHistoryScreen;

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
});
