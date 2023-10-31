import React, { useState, useEffect, useContext } from 'react';
import { Text, Button, SearchBar, CheckBox } from 'react-native-elements';
import { Alert, FlatList, View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { ListFlowScreenProps } from '../../../navigation/types';
import { Customer } from '../../../utils/model';
import { SqliteContext, useSqliteContext } from '../../../context/SqliteContext';

const QRAssignScreen = ({ navigation , route }:ListFlowScreenProps<'QRAssign'>) => {
  const {customerSqlite} = useSqliteContext()
    
  const [search, updateSearch] = useState('');
  const [listData, setListData] = useState<Customer[]>();
  const [customerData, setCustomerData] = useState<Customer[]>();

  const runSearch = (search :string) => {
    //if (customerData.length == 0 || state.isLoading) return;
    if (search.length === 0) setListData(customerData);
    else {
      let filteredData = customerData?.filter((item) => {
        //@ts-ignore
        if (item.Makhachhang.toLowerCase().indexOf(search) > -1) return true;
         //@ts-ignore
        if (item.Madongho.toLowerCase().indexOf(search) > -1) return true;
         //@ts-ignore
        if (item.Tenkhachhang.toLowerCase().indexOf(search) > -1) return true;
         //@ts-ignore
        if (item.Diachi.toLowerCase().indexOf(search) > -1) return true;
        return false;
      })
      setListData(filteredData);
    }
  }

  const assignQR = async (item : Customer) => {
    Alert.alert(
      'Xác nhận gán QR cho khách hàng ' + item.Tenkhachhang,
      'Với mã đồng hồ ' + item.Madongho,
      [
        {
          text: 'Xác nhận', onPress: async () => {
           
            await customerSqlite?.updateAsync({...item , Qrcode : route.params.qrcode})
            navigation.navigate('Region');
          }
        },
        { text: 'Hủy', onPress: () => {
          //navigation.navigate('Region');
        }}
      ],
      {cancelable: false},
    );
          
  }


  useEffect( () => {
      customerSqlite?.getAll().then(res => {
        if(res.code === '00'){
          const data = res.result as Customer[]
          
          setCustomerData(data)
          setListData(data);
        }
      })
  
  }, []);

  useEffect(() => { runSearch(search.toLowerCase()) }, [search]);
  //if (state.customers == null) loadCustomerData(navigation.getParam('makhuvuc'));
 
  const renderRowThree = ({ item }:{item :Customer}) => (
    <TouchableOpacity
      key={item.Makhachhang}
      style={styles.itemContainer}
      onPress={() => { assignQR(item) }}
    >
      <View style={styles.subContainer}>
        {/* <Image source={require('../../../assets/images/default-avatar.png')} style={styles.itemThreeImage} /> */}
        <View style={styles.content}>
          <View style={{ flexDirection: 'row' }}>
            <Icon name='vcard-o' size={15} color='rgb(23,78,166)' style={styles.icon}/>
            <Text style={styles.makh}>{item.Makhachhang}</Text>
            {item.Chisomoi === -1 ? <Text style={{ flex: 1, color: 'red', textAlign: 'right' }}> Chưa ghi </Text> : <Text style={{flex: 1, color: 'green', textAlign: 'right' }}> Đã ghi </Text>}
            
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Icon name='user-o' size={15} color='rgb(23,78,166)' style={styles.icon}/>
            <Text style={styles.tenkh}>{(item.Ghichuoffline == ""? "" : (item.Ghichuoffline  + ". "))  + item.Tenkhachhang }</Text>
            
          </View>
          <View style={styles.infokh}>
            <Icon name='clock-o' size={15} color='rgb(23,78,166)' style={styles.icon}/>
            <Text style={{ flex: 1, textAlign: 'left' }}>{item.Madongho}</Text>
            <Icon name='phone' size={15} color='rgb(23,78,166)' style={{ flex: 1, textAlign: 'right', marginTop: 3 }}/>
            <Text style={{ flex: 1, textAlign: 'right' }}>{item.Sodienthoai == -1 ? 'Không có' : '0' + item.Sodienthoai }</Text>
          </View>
        </View>
      </View>
      
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <SearchBar
          containerStyle={{ flex: 4 }}
          placeholder="Tìm kiếm..."
          lightTheme
          round
          //@ts-ignore
          onChangeText={updateSearch}
          value={search}
          autoCorrect={false}
        />
      </View>
     
        <FlatList
          keyExtractor={(item , index) =>
            `${item.Makhachhang}${index}`
          }
          data={listData}
          updateCellsBatchingPeriod={1}
          legacyImplementation= {true}
          renderItem={renderRowThree}
          removeClippedSubviews= {true}
        />
      
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
      },
    itemContainer: {
        shadowColor: "#000",
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
        marginRight: 10
      },
      content: {
        flex: 1,
        paddingLeft: 15,
        justifyContent: 'space-between',
      },
      makh: {
        //fontFamily: fonts.primaryRegular,
        flex:1,
        fontSize: 14,
        color: '#617ae1',
      },
      tenkh: {
        //fontFamily: fonts.primaryBold,
        fontSize: 16,
        color: '#5F5F5F',
      },
      infokh: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        fontWeight: 'bold'
      },
})

export default QRAssignScreen;



