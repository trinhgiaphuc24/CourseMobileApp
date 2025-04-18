import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { Button, HelperText, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
    const info = [{
        label: 'Tên',
        icon: "text",
        secureTextEntry: false,
        field: "first_name"
    }, {
        label: 'Họ và tên lót',
        icon: "text",
        secureTextEntry: false,
        field: "last_name"
    }, {
        label: 'Tên đăng nhập',
        icon: "text",
        secureTextEntry: false,
        field: "username"
    }, {
        label: 'Mật khẩu',
        icon: "eye",
        secureTextEntry: true,
        field: "password"
    }, {
        label: 'Xác nhận mật khẩu',
        icon: "eye",
        secureTextEntry: true,
        field: "confirm"
    }];
    const [user, setUser] = useState({});
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();

    const picker = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert("Permissions denied!");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();

            if (!result.canceled)
                setState(result.assets[0], "avatar");
        }
    }

    const setState = (value, field) => {
        setUser({...user, [field]: value});
    }

    const validate = () => {
        for (let i of info) {
            if (!(i.field in user) || user[i.field] === '')
                setMsg(`Vui long nhap ${i.label}!`)
        }
        // if (!user?.username || !user?.password) {
        //     setMsg("Vui lòng nhập tên đăng nhập và mật khẩu!");
        //     return false;
        if (user.password !== user.confirm) {
            setMsg("Mật khẩu KHÔNG khớp!");
            return false;
        }

        setMsg(null);
        
        return true;
    }

    const register = async () => {
        if (validate() === true) {
            try {
                setLoading(true);

                let form = new FormData();
                for (let key in user) {
                    if (key !== 'confirm') {
                        if (key === 'avatar' && user?.avatar !== null) {
                            form.append(key, {
                                uri: user.avatar.uri,
                                name: user.avatar.fileName,
                                type: user.avatar.type
                            });
                        } else {
                            form.append(key, user[key]);
                        }
                    }
                }

                let res = await Apis.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (res.status === 201) {
                    nav.navigate("login");
                }
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

                {info.map(i => <TextInput value={user[i.field]} onChangeText={t => setState(t, i.field)} style={MyStyles.m} key={i.field} label={i.label} secureTextEntry={i.secureTextEntry} right={<TextInput.Icon icon={i.icon} />} />)}
                
                <TouchableOpacity style={MyStyles.m} onPress={picker}>
                    <Text>Chọn ảnh đại diện...</Text>
                </TouchableOpacity>

                {user?.avatar && <Image style={[MyStyles.avatar, MyStyles.m]} source={{uri: user.avatar.uri}} />}

                <Button disabled={loading} loading={loading} onPress={register} mode="contained">Đăng ký</Button>
            </ScrollView>
        </View>
    );
}

export default Register;