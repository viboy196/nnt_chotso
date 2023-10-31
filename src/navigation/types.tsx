/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Customer} from '../utils/model';
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Main: NavigatorScreenParams<RootTabParamList> | undefined;
  Login: undefined;
  Start: undefined;
  Loading: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  listFlow: NavigatorScreenParams<ListFlowParamlist> | undefined;
  QRScanning: undefined;
  CameraScanning: undefined;
};

export type ListFlowParamlist = {
  Region: undefined;
  Customer: {makuvuc?: string; tenkhuvuc?: string; data?: Customer[]};
  CustomerReturn: undefined;
  CustomerDetail: {data: Customer; picture?: string; goCamera?: boolean};
  CustomerHistory: {data: Customer; title?: string; mathoiky?: number};
  BillPrint: {customer: Customer};
  Sync: undefined;
  CameraOnly: {data: Customer};
  QRAssign: {qrcode: string};
};

export type ListFlowScreenProps<Screen extends keyof ListFlowParamlist> =
  CompositeScreenProps<
    NativeStackScreenProps<ListFlowParamlist, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
