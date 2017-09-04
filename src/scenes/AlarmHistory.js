import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    Dimensions,
    TextInput,
    TouchableNativeFeedback,
    ToastAndroid,
    FlatList
} from 'react-native';
const {width,height} = Dimensions.get('window');

class AlarmHistory extends Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }


    render(){
        return(
            <View style={{flex:1,justifyContent:'center', alignItems:'center', backgroundColor:global.backgroundColor}}>
                <Text>AlarmHistory 입니다.</Text>
            </View>

        )
    }

}
export default AlarmHistory;

