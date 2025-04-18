import { Text, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { useContext } from "react";
import { MyDispatchContext, MyUserContext } from "../../configs/MyContexts";
import { Button } from "react-native-paper";

const Profile = () => {
    const user = useContext(MyUserContext); 
    const dispatch = useContext(MyDispatchContext);

    console.info(user);

    const logout = () => {
        dispatch({
            "type": "logout"
        })
    }

    if (user?._j !== null)
        return (
            <View style={[MyStyles.container, MyStyles.center]}>
                <Text style={MyStyles.subject}>{user._j.first_name} {user._j.last_name}</Text>
                <Button mode="contained-tonal" onPress={logout}>Đăng xuất</Button>
            </View>
        );
    
    return <Text style={MyStyles.subject}>ĐÃ ĐĂNG XUẤT</Text>
}

export default Profile;