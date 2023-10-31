import baseApi from './baseApi';

export default class ApiRequest {
  static Login = async (user: string, pass: string) => {
    let textArray = user.split('@');
    let username = textArray[0];
    let domain = textArray[1];
    const response = await baseApi.post(
      domain + '/Login',
      JSON.stringify(username + pass),
    );
    if (response.data === 'access') {
      return true;
    } else {
      return false;
    }
  };

  static UpdateChiso = async (strDataPiece: string, domain: string) => {
    const response = await baseApi.post(domain + '/updateChiso', strDataPiece);

    return response.data;
  };

  static loadAreaList = async (user: string, domain: string) => {
    const response = await baseApi.post(domain + '/loadAreaList', user);
    return response.data;
  };

  static getCustomerList = async (user: string, domain: string) => {
    const response = await baseApi.post(domain + '/getCustomerList', user);
    return response.data;
  };

  static FindHistoryChiso = async (
    input: {makhachhang: string; mathoiky: number},
    domain: string,
  ) => {
    const response = await baseApi.post(domain + '/FindHistoryChiso', input);
    return response.data;
  };

  static GetDataSingleBill = async (
    customerDataStr: string,
    domain: string,
  ) => {
    const response = await baseApi.post(
      domain + domain + '/GetDataSingleBill',
      customerDataStr,
    );
    return response.data;
  };

  static NntPayInvioce = async (customerDataStr: string, domain: string) => {
    const response = await baseApi.post(
      domain + domain + '/NntPayInvioce',
      customerDataStr,
    );
    return response.data;
  };

  static GetInfoBill = async (objChisoDataStr: string, domain: string) => {
    const response = await baseApi.post(
      domain + domain + '/GetInfoBill',
      objChisoDataStr,
    );
    return response.data;
  };
}
