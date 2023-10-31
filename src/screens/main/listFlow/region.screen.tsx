import React, {useState, useEffect, useCallback} from 'react';
import {
  Image,
  Alert,
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useAppDispatch, useAppSelector} from '../../../redux/store/hooks';
import {Text} from '@rneui/themed';
import {ListFlowScreenProps} from '../../../navigation/types';
import {logOut} from '../../../redux/features/userSlices';
import {Customer, Region} from '../../../utils/model';
import {useSqliteContext} from '../../../context/SqliteContext';
import {mainColor} from '../../../constants/Colors';
import {Menu, Searchbar} from 'react-native-paper';
import ApiRequest from '../../../utils/api/base/ApiRequest';
import Spinner from 'react-native-loading-spinner-overlay';
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';

const RegionScreen = ({navigation}: ListFlowScreenProps<'Region'>) => {
  const {domain} = useAppSelector(s => s.user);

  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const [totalUpload, setTotalUpload] = useState<number>(0);

  const [numUpload, setNumUpload] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [search, updateSearch] = useState<string>('');

  const {regionSqlite, customerSqlite} = useSqliteContext();

  const [regionData, setRegionData] = useState<Region[]>();

  const {username} = useAppSelector(s => s.user);

  const [chitso, setChitso] = useState<{
    daghi: number;
    mathoiky: string;
    chuaghi: number;
    mount: number;
  }>();

  const loadata = useCallback(async () => {
    const res1 = await regionSqlite?.getAll();
    if (res1?.code === '00') {
      if (res1.code === '00') {
        setRegionData(res1.result);
      }
    }

    const res = await customerSqlite?.FillChiSoScreenRegion();
    if (res?.code === '00') {
      const {daghi, chuaghi, mathoiky, mount} = res.result;
      setChitso({daghi, chuaghi, mathoiky, mount});
    }
  }, [customerSqlite, regionSqlite]);

  useEffect(() => {
    const anhdan1 = navigation.addListener('focus', () => {
      loadata();
    });
    return anhdan1;
  }, [loadata, navigation]);

  const dispatch = useAppDispatch();

  const askSync = () => {
    Alert.alert(
      'Đồng bộ dữ liệu ?',
      'Hãy chắc chắn bạn có kết nối internet trước khi đồng bộ',
      [
        {
          text: 'Bắt đầu',
          onPress: () => {
            getSyncData();
          },
        },
        {text: 'Thôi'},
      ],
      {cancelable: false},
    );
  };

  const askLogout = () => {
    Alert.alert(
      'Đăng xuất ?',
      'Tất cả dữ liệu khách hàng lưu trong ứng dụng sẽ bị xoá',
      [
        {
          text: 'Đồng ý',
          onPress: async () => {
            dispatch(logOut());
            await customerSqlite?.deleteAll();
            await regionSqlite?.deleteAll();
            navigation.replace('Login');
          },
        },
        {text: 'Quay lại'},
      ],
      {cancelable: false},
    );
  };

  const searchFilter = (search: string, item: Region) => {
    //if (customerData.length == 0 || state.isLoading) return;
    if (search.length === 0) {
      return true;
    } else {
      if (item.Makhuvuc.toLowerCase().indexOf(search.toLowerCase()) > -1) {
        return true;
      }
      if (
        item.Tenkhuvuc &&
        item.Tenkhuvuc.toLowerCase().indexOf(search.toLowerCase()) > -1
      ) {
        return true;
      }
      return false;
    }
  };

  const getSyncData = async () => {
    setLoading(true);
    const res = await customerSqlite?.getFiltered("Dongbo = 'false'");
    if (res !== undefined) {
      if (res.code === '00') {
        let syncData: any[] = [];
        const syncResult = res.result as Customer[];
        console.log('syncResult', syncResult);
        if (syncResult.length === 0) {
          setLoading(false);
          Alert.alert('Thông báo', 'Chưa có dữ liệu cần update');
          return;
        }

        for (let i = 0; i < syncResult.length; i++) {
          const element = syncResult[i];
          // if (element.Picture === '') {
          //   return
          // }
          const manipResult = await RNFS.readFile(element.Picture, 'base64');

          syncData.push({
            Makhachhang: element.Makhachhang,
            Chisomoi: element.Chisomoi,
            Ghichu: element.Ghichu,
            Lydodutchi: element.Lydodutchi,
            Ngaydocmoi: element.Ngaydocmoi,
            Picture: element.Picture === '' ? '' : manipResult,
            Madongho: element.Madongho,
            Qrcode: element.Qrcode,
            Longitude: element.Longitude,
            Latitude: element.Latitude,
            Maso: element.Maso,
            Manvghiso: element.Manvghiso,
            Tennvghiso: element.Tennvghiso,
            Ghichuoffline: element.Ghichuoffline,
          });
          setTotalUpload(syncData.length);
          beginUpload(syncData);
        }
      } else {
        setLoading(false);
      }
    }
  };

  const beginUpload = (syncData: any[]) => {
    if (syncData && syncData.length > 0 && domain) {
      let tmpState = [...syncData];
      const dataPiece = tmpState.pop();
      console.log(JSON.stringify(dataPiece));

      ApiRequest.UpdateChiso(JSON.stringify(dataPiece), domain).then(res => {
        if (res === true) {
          setNumUpload(numUpload + 1);
          customerSqlite?.updateByFilterAsync(
            dataPiece.Makhachhang,
            'Dongbo = true',
          );
          if (tmpState.length > 0) {
            new Promise(res => setTimeout(res, 1)).then(() =>
              beginUpload(tmpState),
            );
          } else {
            setLoading(false);
            Alert.alert(
              'Cập nhật lại dữ liệu mới từ máy chủ ?',
              'Dữ liệu cũ lưu trong ứng dụng sẽ bị xoá',
              [
                {
                  text: 'Đồng ý',
                  onPress: () => {
                    loadata();
                    navigation.navigate('Loading');
                  },
                },
                {
                  text: 'Không cập nhật',
                  onPress: () => {},
                },
              ],
              {cancelable: false},
            );
          }
        } else if (res == 'khoa' || res == 'huy') {
          setLoading(false);
          Alert.alert(
            'Sổ ghi đã khóa hoặc không tồn tại. Cập nhật lại dữ liệu tháng mới nhất từ máy chủ ?',
            'Dữ liệu cũ lưu trong ứng dụng sẽ bị xoá',
            [
              {
                text: 'Đồng ý',
                onPress: () => {
                  loadata();
                  navigation.replace('Loading');
                },
              },
              {
                text: 'Không cập nhật',
                onPress: () => {},
              },
            ],
            {cancelable: false},
          );
        } else {
          setLoading(false);
          Alert.alert(
            'Có lỗi trong quá trình gửi dữ liệu !',
            'Vui lòng kiểm tra kết nối mạng và thử lại!',
            [
              {
                text: 'Đồng ý',
                onPress: () => {
                  loadata();
                },
              },
            ],
            {cancelable: false},
          );
        }
      });
    } else {
      setLoading(false);
      Alert.alert(
        'Cập nhật lại dữ liệu mới từ máy chủ ?',
        'Dữ liệu cũ lưu trong ứng dụng sẽ bị xoá',
        [
          {
            text: 'Đồng ý',
            onPress: () => {
              navigation.navigate('Loading');
            },
          },
          {
            text: 'Không cập nhật',
            onPress: () => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            },
          },
        ],
        {cancelable: false},
      );
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <Spinner
          visible={loading}
          textStyle={{color: '#FFF'}}
          textContent={`${numUpload}/${totalUpload}`}
        />
      )}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: mainColor,
          paddingTop: Platform.OS === 'ios' ? 40 : 20,
          justifyContent: 'center',
          height: 120,
          padding: 10,
          alignItems: 'center',
        }}>
        <Text
          style={{flex: 1, color: '#fff', fontSize: 24, fontWeight: 'bold'}}>
          {DeviceInfo.getApplicationName()}
        </Text>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity style={{padding: 10}} onPress={openMenu}>
              <Icon name="ellipsis-v" size={28} color={'#fff'} style={{}} />
            </TouchableOpacity>
          }>
          <Menu.Item
            onPress={() => {
              closeMenu();
              askLogout();
            }}
            title="Đăng xuất"
          />
        </Menu>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{flex: 1, padding: 10}}>
          <Searchbar
            placeholder="Tìm kiếm..."
            //@ts-ignore
            onChangeText={updateSearch}
            value={search}
            autoCorrect={false}
          />
        </View>
        <View
          style={{
            justifyContent: 'center',
            paddingRight: 10,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={askSync}
            style={{
              backgroundColor: mainColor,
              flexDirection: 'row',
              padding: 10,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff', paddingRight: 10}}>Đồng bộ</Text>
            <Icon name="eject" color={'#fff'} size={14} />
          </TouchableOpacity>
        </View>
      </View>

      {regionData === undefined ? (
        <></>
      ) : (
        <View style={styles.infoContainer}>
          <View>
            <View
              style={{
                justifyContent: 'center',
                position: 'absolute',
                left: 10,
              }}>
              <View style={{flexDirection: 'row'}}>
                <Icon name="check" size={18} color="green" />
                <Text style={{color: 'green', marginLeft: 5}}>Đã ghi</Text>
              </View>
              <Text style={{color: 'green', fontSize: 30}}>
                {chitso?.daghi}
              </Text>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={{flexDirection: 'row'}}>
                <Icon name="calendar" size={18} color={mainColor} />
                <Text style={{color: mainColor, marginLeft: 5}}>
                  {chitso?.mathoiky}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Icon name="user-circle-o" size={18} color={mainColor} />
                <Text style={{color: mainColor, marginLeft: 5}}>
                  {username}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Icon name="cloud-upload" size={18} color={mainColor} />
                <Text style={{color: mainColor, marginLeft: 5}}>
                  Phiên bản {DeviceInfo.getVersion()}
                </Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: 'center',
                position: 'absolute',
                right: 10,
              }}>
              <View style={{flexDirection: 'row'}}>
                <Icon name="close" size={18} color="red" />
                <Text style={{color: 'red', marginLeft: 5}}>Chưa ghi</Text>
              </View>
              <Text style={{color: 'red', fontSize: 30}}>
                {chitso?.chuaghi}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={{flex: 1}}>
        <FlatList
          keyExtractor={(item, index) => `${item.Makhuvuc}_${index}`}
          data={regionData?.filter(item => searchFilter(search, item))}
          renderItem={({item}) => (
            <RenderRowThree
              item={item}
              onPress={() => {
                navigation.navigate('Customer', {
                  makuvuc: item.Makhuvuc,
                  tenkhuvuc: item.Tenkhuvuc,
                });
              }}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
  },
  itemContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: 'white',
  },
  subContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginRight: 10,
  },
  itemThreeImage: {
    height: 100,
    width: 100,
  },
  content: {
    flex: 1,
    paddingLeft: 15,
    //justifyContent: 'space-between',
    flexDirection: 'row',
  },
  makv: {
    //fontFamily: fonts.primaryRegular,
    fontSize: 14,
    color: mainColor,
    fontWeight: '700',
  },
  tenkv: {
    //fontFamily: fonts.primaryBold,
    flex: 1,
    fontSize: 16,
    color: mainColor,
  },
  infokv: {
    flexDirection: 'row',
    //justifyContent: 'space-between',
    //alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  graph: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,255,0,0.3)',
  },
  infoContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },
});

export default RegionScreen;

const RenderRowThree = ({
  item,
  onPress,
}: {
  item: Region;
  onPress: () => void;
}) => {
  const daghi = item.Daghi ? item.Daghi : 0;

  const soLuong = item.Soluong ? item.Soluong : 1;

  return (
    <TouchableOpacity
      key={item.Makhuvuc}
      style={styles.itemContainer}
      onPress={onPress}>
      <View style={styles.subContainer}>
        {/* <Image source={require('../../../assets/images/default-avatar.png')} style={styles.itemThreeImage} /> */}
        <View style={styles.content}>
          <View
            style={{
              marginRight: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../../assets/img/loading.png')}
              resizeMode="contain"
              style={{width: 64, height: 64}}
            />
            {(daghi * 100) / soLuong < 100 ? (
              <Text
                style={{
                  position: 'absolute',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: 'red',
                }}>
                {((daghi * 100) / soLuong).toFixed(0) + '%'}
              </Text>
            ) : (
              <Text
                style={{
                  position: 'absolute',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: mainColor,
                }}>
                {((daghi * 100) / soLuong).toFixed(0) + '%'}
              </Text>
            )}
          </View>

          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', paddingBottom: 5}}>
              <Icon
                name="vcard-o"
                size={15}
                color={mainColor}
                style={styles.icon}
              />
              <Text style={styles.makv}>{item.Makhuvuc}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Icon
                name="map-o"
                size={15}
                color={mainColor}
                style={styles.icon}
              />
              <Text style={styles.tenkv}>{item.Tenkhuvuc}</Text>
            </View>
            <View style={styles.infokv}>
              <Icon
                name="line-chart"
                size={15}
                color={mainColor}
                style={styles.icon}
              />
              {item.Daghi == item.Soluong ? (
                <Text style={{color: mainColor}}>
                  Tiến độ: {item.Daghi}/{item.Soluong}
                </Text>
              ) : (
                <Text style={{color: 'red'}}>
                  Tiến độ: {item.Daghi}/{item.Soluong}
                </Text>
              )}
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              padding: 5,
              borderRadius: 8,
              backgroundColor: 'rgba(23,78,166 , 0.3)',
              position: 'absolute',
              right: 5,
              top: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              name="map-marker"
              size={15}
              color={mainColor}
              style={styles.icon}
            />
            <Text style={{color: mainColor}}>{item.Soluong} Địa chỉ</Text>
          </View>
        </View>
      </View>
      <View />
    </TouchableOpacity>
  );
};
