import { View, Text, Alert, StyleSheet } from 'react-native'
import React, { useEffect, useState, } from 'react'
import { ListFlowScreenProps } from '../../../navigation/types';
import ApiRequest from '../../../utils/api/base/ApiRequest';
import { useAppSelector } from '../../../redux/store/hooks';
import Layout from '../../../constants/Layout';

export default function BillPrintScreen({ route, navigation }: ListFlowScreenProps<'BillPrint'>) {
    const [state, setState] = useState<any>({
        devices: null,
        pairedDs: [],
        foundDs: [],
        bleOpend: false,
        loading: true,
        loading2: false,
        boundAddress: '',
        debugMsg: '',
        billInfo: {},
        loading3: false,
        name: 'Không có',
        showPayment: false,
        loading4: false,
    });
    const { username, domain } = useAppSelector(s => s.user)

    const _loadInfoBill = () => {
        try {
            setState((old: any) => ({
                ...old,
                loading2: true,
            }))
            let customer = route.params.customer
            //console.warn(domain + customer.Makhachhang);
            let objChiso = {
                Makhachhang: customer.Makhachhang,
                Chisocu: customer.Chisocu,
                Chisomoi: customer.Chisomoi,
                Chisodu: customer.Chisodu,
                Madoituonggia: customer.Madoituonggia
            }
            if (domain)
                ApiRequest.GetInfoBill(JSON.stringify(objChiso), domain).then(res => {
                    let data = res.split("%space%");
                    //console.log(response);
                    let obj = {
                        loaikhachhang: data[0],
                        chisocu: objChiso.Chisocu,
                        chisomoi: objChiso.Chisomoi,
                        muctieuthu: (objChiso.Chisomoi - objChiso.Chisocu) + (objChiso.Chisodu != '' ? (' + ' + objChiso.Chisodu) : ''),
                        tongtien: data[data.length - 2]
                    }
                    setState((old: any) => ({
                        ...old,
                        billInfo: obj,
                        loading2: false
                    }))
                })

        }
        catch (err: any) {
            setState((old: any) => ({
                ...old,
                loading2: false,
            }))
            Alert.alert('Lỗi tải thông tin hoá đơn. ' + err.toString());
        }
    }

    const _payInvioce = () => {
        setState({
            loading4: true,
        });
        let customer = route.params.customer
        if (domain)
            ApiRequest.NntPayInvioce(JSON.stringify(customer), domain).then(res => {

                Alert.alert(res)
            })

    }
    useEffect(() => {
        new Promise(res => setTimeout(res, 1000)).then(() => {
            _loadInfoBill()
        })
    }, [])

    const _prepareData = async () => {


        try {
            let customer = route.params.customer
            if (domain) {
                ApiRequest.GetDataSingleBill(JSON.stringify(customer), domain).then(res => {
                    const data = res.split("%space%");
                    return data
                })
            }
        } catch (err) {

            setState((old: any) => ({
                ...old,
                loading3: false,
            }))
            return [];
        }
    }

    return (
        <View>
            <Text>BillPrintScreen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },

    title: {
        width: Layout.window.width,
        backgroundColor: "#eee",
        color: "#232323",
        textAlign: "left"
    },
    wtf: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    name: {
        marginLeft: 25,
        flex: 1,
        textAlign: "left"
    },
    address: {
        flex: 1,
        textAlign: "right"
    },
    billinfo: {
        flex: 1,
        alignItems: "center",
        marginTop: 10,
        marginBottom: 10
    },
    icon: {
        backgroundColor: "#eee",
        paddingLeft: 5,
        paddingTop: 2,
        paddingRight: 5,
    },
    icon2: {
        paddingTop: 2,
        paddingRight: 5,
    },
    txtinfo: {
        fontWeight: "bold"
    }
});
