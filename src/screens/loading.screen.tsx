import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {RootStackScreenProps} from '../navigation/types';
import {useAppSelector} from '../redux/store/hooks';
import ApiRequest from '../utils/api/base/ApiRequest';
import {ActivityIndicator} from 'react-native-paper';
import {Text} from '@rneui/themed';
import {Customer, Region} from '../utils/model';
import {useSqliteContext} from '../context/SqliteContext';
import {mainColor} from '../constants/Colors';

export default function LoadingScreen({
  navigation,
}: RootStackScreenProps<'Loading'>) {
  const {customerSqlite, regionSqlite} = useSqliteContext();
  const dataUser = useAppSelector(s => s.user);
  const [message, setMessage] = useState<string>();

  const loadLightData = useCallback(async () => {
    await regionSqlite?.deleteAll();
    if (dataUser.domain && dataUser.username) {
      setMessage('Đang tải dữ liệu Khu vực');
      const res = await ApiRequest.loadAreaList(
        dataUser.username,
        dataUser.domain,
      );
      const listRegion = res as Region[];
      await regionSqlite?.SaveAsync(listRegion);
      setMessage('');
    }
  }, [dataUser.domain, dataUser.username, regionSqlite]);

  const getCustomerList = useCallback(async () => {
    await customerSqlite?.deleteAll();

    if (dataUser.domain && dataUser.username) {
      setMessage('Đang tải dữ liệu khách hàng');
      const res = await ApiRequest.getCustomerList(
        dataUser.username,
        dataUser.domain,
      );

      const listCustomer = res as Customer[];
      await customerSqlite?.SaveAsync(listCustomer);
      setMessage('');
    }
  }, [customerSqlite, dataUser.domain, dataUser.username]);

  const LoadingData = useCallback(async () => {
    try {
      await loadLightData();
      await getCustomerList();
    } catch (error) {}
  }, [getCustomerList, loadLightData]);

  useEffect(() => {
    if (dataUser) {
      LoadingData().then(() => {
        navigation.replace('Main');
      });
    }
  }, [LoadingData, dataUser, navigation]);

  return (
    <View style={styles.container}>
      <Text h4 style={{textAlign: 'center'}}>
        {message}
      </Text>
      <ActivityIndicator size="large" color={mainColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 200,
    justifyContent: 'center',
  },
});
