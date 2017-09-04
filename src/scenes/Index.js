import React, {Component} from "react";
import {View,Text,Dimensions,StyleSheet} from "react-native";
import {Actions, Reducer, Router, Scene} from "react-native-router-flux";
import API from "../services/API"
import Main from "./Main";

const {width,height} = Dimensions.get('window')


class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }



    render(){

        return(
            <Router navigationBarStyle={styles.navBar}
                    sceneStyle = {styles.scene}
                    titleStyle={styles.title}
                    createReducer={(params)=>this.reducerCreate(params)}>

                <Scene key="root">
                    <Scene
                        key="main"
                        component={Main}
                        getTitle={(props)=>props.title}
                        hideNavBar={true}
                        renderBackButton={()=>null}
                        panHandlers={null} // this prop handling gesture
                        initial={true}
                    />
                </Scene>
            </Router>
        )
    }

    reducerCreate(params) {
        const defaultReducer = Reducer(params);
        console.log("PARAM:",params);
        return (state, action) => {
            //console.log("ACTION:", action);
            if (action.scene)
                console.log("ACTION:", [action.scene.sceneKey, action.scene.type]);
            if (action.scene && action.scene.sceneKey === 'main' &&
                (action.scene.type === 'REACT_NATIVE_ROUTER_FLUX_PUSH' || action.scene.type === 'REACT_NATIVE_ROUTER_FLUX_REFRESH')) {
                console.log('catch back to main');
            }
            this.sceneKey = action.scene ? action.scene.sceneKey : '';
            return defaultReducer(state, action);
        }
    }
}

const styles = StyleSheet.create({
    navBar:{
        backgroundColor : global.mainColor,
        borderBottomColor:'#ffffff00'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
    },
    scene: {
        flex :1,
        //marginTop : (Platform.OS === 'ios') ? 64 : 54
    },
    title: {
        fontSize: 17,
        fontWeight: "600",
        color:'white',
    }
});

export default Index;
console.ignoredYellowBox = ['setting-detail a timer'];
