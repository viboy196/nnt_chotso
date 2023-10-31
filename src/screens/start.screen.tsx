import React, {useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {RootStackScreenProps} from '../navigation/types';
import {useAppSelector} from '../redux/store/hooks';
const StartScreen = ({navigation}: RootStackScreenProps<'Start'>) => {
  const {username} = useAppSelector(s => s.user);
  useEffect(() => {
    if (username) {
      new Promise(res => setTimeout(res, 1000)).then(() => {
        navigation.replace('Main');
      });
    } else {
      new Promise(res => setTimeout(res, 1000)).then(() => {
        navigation.replace('Login');
      });
    }
  }, [navigation, username]);

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default StartScreen;
