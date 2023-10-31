// import { Text } from '@rneui/themed';
// import React, { useState, useEffect} from 'react';
// import { Alert, StyleSheet, View, ActivityIndicator } from 'react-native';
// import { ListFlowScreenProps } from '../../../navigation/types';
// import {  useAppSelector } from '../../../redux/store/hooks';
// import ApiRequest from '../../../utils/api/base/ApiRequest';
// import { useSqliteContext } from '../../../context/SqliteContext';
// import { Customer } from '../../../utils/model';

// import * as ImageManipulator from "expo-image-manipulator";
// const SyncScreen = ({ navigation }:ListFlowScreenProps<'Sync'>) => {
//     const {customerSqlite , regionSqlite} = useSqliteContext()

//     const [totalUpload, setTotalUpload] = useState<number>(0);
//     const [numUpload, setNumUpload] = useState<number>(0);

//     const {domain} = useAppSelector(s => s.user)

//     const getSyncData = async () => {

//         const res = await customerSqlite?.getFiltered(`Dongbo = 'false'`)
//         if(res !== undefined)
//         if(res.code === '00'){
//           let syncData:any[] = [];
//           const syncResult = res.result as Customer[]
//           console.log('syncResult' , syncResult);

//           for(let i = 0 ; i < syncResult.length ; i ++){
//             const element = syncResult[i];
//             if(element.Picture === ''){
//               return
//             }
//             const manipResult = await ImageManipulator.manipulateAsync(
//               element.Picture,
//               [{ resize: { width: 500, height: 666 } }],
//               { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true }
//             );

//             syncData.push({
//               Makhachhang:element.Makhachhang,
//               Chisomoi: element.Chisomoi,
//               Ghichu: element.Ghichu,
//               Lydodutchi: element.Lydodutchi,
//               Ngaydocmoi: element.Ngaydocmoi,
//               Picture:manipResult.base64,
//               Madongho: element.Madongho,
//               Qrcode: element.Qrcode,
//               Longitude:element.Longitude,
//               Latitude: element.Latitude,
//               Maso: element.Maso,
//               Manvghiso: element.Manvghiso,
//               Tennvghiso: element.Tennvghiso,
//               Ghichuoffline: element.Ghichuoffline
//           })
//           setTotalUpload(syncData.length);
//           beginUpload(syncData);
//           }
//         }

//     }

//     const beginUpload = (syncData:any[]) => {
//       console.log('vap day');
//       console.log(syncData);

//         if (syncData && syncData.length > 0 && domain) {
//             let tmpState = [...syncData];
//             const dataPiece = tmpState.pop();
//             console.log(JSON.stringify(dataPiece));

//             ApiRequest.UpdateChiso(JSON.stringify(dataPiece) , domain)
//             .then(res => {
//                 if (res === true)
//                 {

//                     setNumUpload(numUpload + 1)
//                     customerSqlite?.updateByFilterAsync(dataPiece.Makhachhang , 'Dongbo = true')
//                     if(tmpState.length > 0)
//                     {
//                       new Promise(res => setTimeout(res, 1)).then(() => beginUpload(tmpState));
//                     }else{
//                       Alert.alert(
//                         'Cập nhật lại dữ liệu mới từ máy chủ ?',
//                         'Dữ liệu cũ lưu trong ứng dụng sẽ bị xoá',
//                         [
//                           {
//                             text: 'Đồng ý', onPress: () => {
//                               navigation.navigate('Loading');
//                             }
//                             },
//                           { text: 'Không cập nhật', onPress: () => {
//                             if(navigation.canGoBack())
//                                     navigation.goBack()
//                           }}
//                         ],
//                         {cancelable: false},
//                       );
//                     }
//                 } else if (res == "khoa" || res == "huy"){
//                     Alert.alert(
//                         'Sổ ghi đã khóa hoặc không tồn tại. Cập nhật lại dữ liệu tháng mới nhất từ máy chủ ?',
//                         'Dữ liệu cũ lưu trong ứng dụng sẽ bị xoá',
//                         [
//                           {
//                             text: 'Đồng ý', onPress: () => {
//                               navigation.replace('Loading');
//                             }
//                             },
//                           { text: 'Không cập nhật', onPress: () => {
//                             if(navigation.canGoBack())
//                             navigation.goBack()
//                           }}
//                         ],
//                         {cancelable: false},
//                       );
//                 } else {
//                     Alert.alert(
//                         'Có lỗi trong quá trình gửi dữ liệu !',
//                         'Vui lòng kiểm tra kết nối mạng và thử lại!',
//                         [
//                           {
//                             text: 'Đồng ý', onPress: () => {
//                               navigation.navigate('Region');
//                             }
//                           }
//                         ],
//                         {cancelable: false},
//                       );
//                 }
//             })

//         }
//         else {
//             Alert.alert(
//                 'Cập nhật lại dữ liệu mới từ máy chủ ?',
//                 'Dữ liệu cũ lưu trong ứng dụng sẽ bị xoá',
//                 [
//                   {
//                     text: 'Đồng ý', onPress: () => {
//                       navigation.navigate('Loading');
//                     }
//                     },
//                   { text: 'Không cập nhật', onPress: () => {
//                     if(navigation.canGoBack())
//                             navigation.goBack()
//                   }}
//                 ],
//                 {cancelable: false},
//               );
//         }
//     }
//     useEffect(() => {
//       getSyncData()
//     }, []);

//     return (
//         <>
//             <View style={styles.container}>
//                 <Text h4 style={{ textAlign: 'center' }}>Đồng bộ dữ liệu ... </Text>
//                 <Text h4 style={{ textAlign: 'center' }}>{numUpload}/{totalUpload}</Text>
//                 <ActivityIndicator size="large" color="#0000ff" />
//             </View>
//         </>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//     },
// })

// export default SyncScreen;
