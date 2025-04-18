import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { Button, HelperText, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { useContext, useState } from "react";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyDispatchContext } from "../../configs/MyContexts";

const Login = () => {
    const info = [{
        label: 'Tên đăng nhập',
        icon: "text",
        secureTextEntry: false,
        field: "username"
    }, {
        label: 'Mật khẩu',
        icon: "eye",
        secureTextEntry: true,
        field: "password"
    }];
    const [user, setUser] = useState({});
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();
    const dispatch = useContext(MyDispatchContext);

   
    const setState = (value, field) => {
        setUser({...user, [field]: value});
    }

    const validate = () => {
        if (!user?.username || !user?.password) {
            setMsg("Vui lòng nhập tên đăng nhập và mật khẩu!");
            return false;
        } 

        setMsg(null);
        
        return true;
    }

    const login = async () => {
        if (validate() === true) {
           try {
                setLoading(true);
                let res = await Apis.post(endpoints['login'], {
                    ...user,
                    "client_id": "Vbe8euZZQJoWJ2UzW9wDThg4hJEZHHbhFmnfj7UR",
                    "client_secret": "cVm4w4hSdy4MtwbP4KuNgXkGPeQJ9yrQdBvXHGR6b3e97F2bYqQ81XJ49FEufzjcw4SKwpuOZQiCLsNelHY1MkuYTGBRcSqtWmSlebSUk27WfyDskCB2VeCQihnEKdZ2",
                    'grant_type': 'password'
                });
                
                console.info(res.data.access_token)
                await AsyncStorage.setItem("token", res.data.access_token);

                let u = await authApis(res.data.access_token).get(endpoints['current-user']);
                console.info(u.data);

                // dispatch({
                //     "type": "login",
                //     "payload": u.data
                // })
           } catch (ex) {
                console.error(ex);
           } finally {
                setLoading(false);
           }
        }
    }

    return (
        <View>
            <ScrollView>
                <HelperText type="error" visible={msg}>
                    {msg}
                </HelperText>

                {info.map(i => <TextInput value={user[i.field]} 
                    onChangeText={t => setState(t, i.field)} style={MyStyles.m} key={i.field} label={i.label} 
                                        secureTextEntry={i.secureTextEntry} right={<TextInput.Icon icon={i.icon} />} />)}

                <Button disabled={loading} loading={loading} onPress={login} mode="contained">Đăng nhập</Button>
            </ScrollView>
        </View>
    );
}

export default Login;