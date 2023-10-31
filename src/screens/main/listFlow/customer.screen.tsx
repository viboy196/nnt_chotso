import React, {useState, useEffect} from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Text,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import {ListFlowScreenProps} from '../../../navigation/types';
import {Menu, Searchbar} from 'react-native-paper';
import {mainColor} from '../../../constants/Colors';
import {Customer} from '../../../utils/model';
import {useSqliteContext} from '../../../context/SqliteContext';
import {hexToRgba} from '../../../utils/helper';

const CustomerScreen = ({
  navigation,
  route,
}: ListFlowScreenProps<'Customer'>) => {
  const {customerSqlite} = useSqliteContext();
  const [search, updateSearch] = useState<string>('');
  const [listData, setListData] = useState<Customer[]>();
  // const [targetCustomer, setTargetCustomer] = useState<Customer>();
  const [loading, setLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState<'Tất cả' | 'Đã ghi' | 'Chưa ghi'>(
    'Tất cả',
  );
  const [visibleSelect, setVisibleSelect] = useState<boolean>(false);

  const filter = (item: Customer): boolean => {
    let locType = true;
    switch (checked) {
      case 'Chưa ghi':
        locType = item.Chisomoi == -1;
        break;
      case 'Đã ghi':
        locType = item.Chisomoi != -1;
        break;
      default:
        locType = true;
        break;
    }

    let searchBool = true;
    if (
      item.Makhachhang &&
      item.Makhachhang.toLowerCase().indexOf(search.toLowerCase()) > -1
    ) {
      searchBool = true;
    } else if (
      item.Madongho &&
      item.Madongho.toLowerCase().indexOf(search.toLowerCase()) > -1
    ) {
      searchBool = true;
    } else if (
      item.Tenkhachhang &&
      item.Tenkhachhang.toLowerCase().indexOf(search.toLowerCase()) > -1
    ) {
      searchBool = true;
    } else if (
      item.Diachi &&
      item.Diachi.toLowerCase().indexOf(search.toLowerCase()) > -1
    ) {
      searchBool = true;
    } else {
      searchBool = false;
    }

    return locType && searchBool;
  };

  useEffect(() => {
    const anhdan1 = navigation.addListener('focus', () => {
      setLoading(true);
      customerSqlite?.getBy('Makhuvuc', route.params.makuvuc).then(res => {
        setLoading(false);
        if (res.code === '00') {
          setListData(res.result);
        }
      });
    });
    return anhdan1;
  }, [customerSqlite, navigation, route.params.makuvuc]);
  //if (state.customers == null) loadCustomerData(navigation.getParam('makhuvuc'));

  const RenderRowThree = ({item}: {item: Customer}) => (
    <TouchableOpacity
      key={item.Makhachhang}
      style={styles.itemContainer}
      onPress={() => {
        navigation.navigate('CustomerDetail', {
          data: item,
          goCamera: item.Chisomoi == -1 ? true : false,
        });
      }}>
      <View style={styles.subContainer}>
        <View
          style={{padding: 10, justifyContent: 'center', alignItems: 'center'}}>
          {item.Chisomoi != -1 && item.Chisomoi != null ? (
            <Icon name="check-circle" color={'#0A95FF'} size={20} />
          ) : (
            <Icon name="minus-circle" color={'#FF6666'} size={20} />
          )}
        </View>
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.tenkh}>{item.Tenkhachhang}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{...styles.tenkh, fontWeight: '500'}}>
              {'Mã đồng hồ : '}
            </Text>
            <Text style={{...styles.tenkh, fontWeight: '500'}}>
              {item.Madongho}
            </Text>
          </View>

          <View style={styles.infokh}>
            <Text style={{color: hexToRgba(mainColor, 0.4)}}>
              {item.Diachi}
            </Text>
          </View>
        </View>
        <View
          style={{
            padding: 10,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Icon
              name="vcard-o"
              size={15}
              color={mainColor}
              style={styles.icon}
            />
            <Text style={styles.makh}>{item.Makhachhang}</Text>
          </View>
          {item.Chisomoi != -1 && item.Chisomoi != null && (
            <View>
              <Text style={{color: mainColor, fontWeight: '800'}}>
                {item.Chisomoi}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: mainColor,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: Platform.OS === 'ios' ? 30 : 10,
        }}>
        <TouchableOpacity
          style={{padding: 10, marginLeft: 10}}
          onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={35} color={'#fff'} />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            fontSize: 18,
            textAlign: 'center',
            color: '#fff',
            fontWeight: '700',
          }}>
          {route.params.tenkhuvuc}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Searchbar
          style={{flex: 1}}
          placeholder="Tìm kiếm theo mã đồng hồ , tên , mã HĐ , ...."
          placeholderTextColor={hexToRgba(mainColor, 0.3)}
          //@ts-ignore
          onChangeText={updateSearch}
          value={search}
          autoCorrect={false}
        />
        <View
          style={{
            paddingHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: mainColor}}>Chọn Loại</Text>

          <Menu
            visible={visibleSelect}
            onDismiss={() => setVisibleSelect(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setVisibleSelect(true)}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  backgroundColor: mainColor,
                }}>
                <Text style={{color: '#fff', fontWeight: '700'}}>
                  {checked}
                </Text>
              </TouchableOpacity>
            }>
            <Menu.Item
              onPress={() => {
                setChecked('Tất cả');
                setVisibleSelect(false);
              }}
              title="Tất cả"
            />
            <Menu.Item
              onPress={() => {
                setChecked('Đã ghi');
                setVisibleSelect(false);
              }}
              title="Đã ghi"
            />

            <Menu.Item
              onPress={() => {
                setChecked('Chưa ghi');
                setVisibleSelect(false);
              }}
              title="Chưa ghi"
            />
          </Menu>
        </View>
      </View>

      {listData && listData.length > 0 ? (
        //<RecyclerListView rowRenderer={renderRowThree} dataProvider={listData} layoutProvider={layoutProvider}/>
        <FlatList
          keyExtractor={(item, index) => `${item.Makhachhang}${index}`}
          data={listData.filter(item => filter(item))}
          updateCellsBatchingPeriod={1}
          legacyImplementation={true}
          renderItem={({item}) => <RenderRowThree item={item} />}
          removeClippedSubviews={true}
        />
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
      {loading && (
        <View style={{position: 'absolute', bottom: 20, right: 20}}>
          <ActivityIndicator size="large" color={hexToRgba(mainColor, 0.6)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingLeft: 15,
  },
  makh: {
    fontSize: 14,
    color: mainColor,
  },
  tenkh: {
    //fontFamily: fonts.primaryBold,
    fontSize: 16,
    color: mainColor,
    fontWeight: '800',
  },
  infokh: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginTop: 3,
    marginRight: 5,
  },
  input: {
    height: 40,
    marginBottom: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'grey',
    color: 'black',
    paddingHorizontal: 20,
    fontWeight: 'bold',
  },
});

export default CustomerScreen;
