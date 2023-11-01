import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {RootStackScreenProps} from '../navigation/types';
import {Input, Text} from '@rneui/themed';
import ApiRequest from '../utils/api/base/ApiRequest';
import {useAppDispatch} from '../redux/store/hooks';
import {setUserState} from '../redux/features/userSlices';
import {mainColor} from '../constants/Colors';
import Spinner from 'react-native-loading-spinner-overlay';
import {hexToRgba} from '../utils/helper';
import {Icon} from '@rneui/themed';

const LoginScreen = ({navigation}: RootStackScreenProps<'Login'>) => {
  const [user, setUser] = useState<string>('');
  const [pass, setPass] = useState<string>('');

  // const [user, setUser] = useState<string>('CTV045@nnt.com');
  // const [pass, setPass] = useState<string>('ctv045');

  const [loading, setLoading] = useState<boolean>(false);

  const [strErr, setStrErr] = useState<string>('');
  const distpatch = useAppDispatch();
  const Login = () => {
    if (user && pass) {
      setLoading(true);
      ApiRequest.Login(user, pass)
        .then(res => {
          setLoading(false);
          if (res) {
            let textArray = user.split('@');
            let username = textArray[0];
            let domain = textArray[1];
            distpatch(
              setUserState({input: {domain: domain, username: username}}),
            );
            navigation.replace('Loading');
          } else {
            setStrErr('Đăng nhập lỗi');
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {loading && <Spinner visible={loading} textStyle={{color: '#FFF'}} />}
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require('../assets/img/logo.png')}
              resizeMode="contain"
            />
          </View>
          <View style={styles.formContainer}>
            <Input
              placeholder="Tên đăng nhập"
              leftIcon={
                <Icon name="person" size={24} color={hexToRgba(mainColor, 1)} />
              }
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              value={user}
              onChangeText={setUser}
            />
            <Input
              placeholder="Mật khẩu"
              leftIcon={
                <Icon name="lock" size={24} color={hexToRgba(mainColor, 1)} />
              }
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              style={styles.input}
              value={pass}
              onChangeText={setPass}
            />
          </View>
          <View style={{alignItems: 'center', marginBottom: 170}}>
            <Text style={styles.error}>{strErr}</Text>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                if (!loading) {
                  Login();
                }
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  padding: 10,
                  color: '#fff',
                  fontSize: 18,
                  fontWeight: '700',
                }}>
                Đăng nhập
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    backgroundColor: '#00324F',
    height: 300,
  },
  logo: {
    width: 200,
    height: 200,
    margin: 50,
  },
  error: {
    color: 'red',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 20,
    color: hexToRgba(mainColor, 0.7),
    paddingHorizontal: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: 150,
    borderRadius: 15,
    marginVertical: 15,
    backgroundColor: mainColor,
    paddingVertical: 15,
  },
  formContainer: {
    backgroundColor: 'white',
    marginTop: -40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    padding: 25,
  },
});

export default LoginScreen;
