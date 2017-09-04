import React, {Component} from "react";
import {View,Text,Dimensions} from "react-native";

import {Actions} from "react-native-router-flux";
import ScrollableTabView from "react-native-scrollable-tab-view";
import MainTab from "./MainTab"
import styles from "../commons/mainStyle";
import Record from "./Record";
const {width,height} = Dimensions.get('window')

class Main extends Component {
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
                    tabBarPosition="bottom"
                    renderTabBar={() =><View/>}
                    tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
                    tabBarInactiveTextColor='#bdbdbd'
                    initialPage={0}>

                    <MainTab abLabel="메인"/>
                    <Record abLabel="기록"/>
                    

                </ScrollableTabView>
            </View>
        )
    }

    componentDidMount(){
        //Actions.refresh({title:this.getCurrentLabel(this.tabView)})
    }

}

export default Main;
