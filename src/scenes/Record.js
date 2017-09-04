import React, {Component} from "react";
import {View,Text,Dimensions} from "react-native";

import {Actions} from "react-native-router-flux";
import ScrollableTabView from "react-native-scrollable-tab-view";
import AlarmHistory from "./AlarmHistory"
import Board from "./Board"
import styles from "../commons/mainStyle";
import ImageTabBar from "../components/ImageTabBar";
const {width,height} = Dimensions.get('window')

class Record extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentWillMount(){
    }

    render(){
        return(
            <View style={{flexDirection: "column", flex:1,}}>
                <ScrollableTabView
                    //style={{flexDirection: "column"}}
                    locked={false}
                    tabBarPosition="top"
                    renderTabBar={() => <ImageTabBar tabStyle={{width:width*.3}} badgeNum={0} textStyle={{fontSize:12}}/>}
                    tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
                    tabBarInactiveTextColor='#bdbdbd'
                    initialPage={0}>

                    <Board tabLabel="게시판추가"/>
                    <AlarmHistory tabLabel="최근알림"/>

                </ScrollableTabView>
            </View>
        )
    }

    componentDidMount(){
        //Actions.refresh({title:this.getCurrentLabel(this.tabView)})
    }

}

export default Record;
