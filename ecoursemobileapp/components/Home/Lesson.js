import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { useEffect, useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import { List } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const Lesson = ({route}) => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(false);
    const courseId = route.params?.courseId;
    const nav = useNavigation();

    const loadLessons = async () => {
        try {
            setLoading(true);
            console.info(endpoints['lessons'](courseId))
            let res = await Apis.get(endpoints['lessons'](courseId));

            setLessons(res.data);
        } catch {

        } finally {
            setLoading(false);
        }
        
    }

    useEffect(() => {
        loadLessons();
    }, [courseId]);


    return (
        <View style={MyStyles.container}>
            <FlatList ListFooterComponent={loading && <ActivityIndicator />} data={lessons} 
                            renderItem={({item}) => <List.Item key={item.id} title={item.subject} description={item.created_date} 
                                                               left={() => <TouchableOpacity onPress={() => nav.navigate('lesson-details', {'lessonId': item.id})}>
                                                                <Image style={MyStyles.avatar} source={{uri: item.image}} />
                                                                </TouchableOpacity>} />} />
        </View>
    );
}

export default Lesson;