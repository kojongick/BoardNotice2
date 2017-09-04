/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    TouchableOpacity,
    Image
} from 'react-native';
import FBSDK from 'react-native-fbsdk';
const {
    LoginButton,
    AccessToken,
    LoginManager,
    GraphRequest,
    GraphRequestManager,
} = FBSDK;

export default class MainTab extends Component {
    constructor(){
        super()
        this.state={
            token:null,
            user:null,
            loggedIn:false,
        }
        this.userConfig = {
            name : null,
            birthday : null,
            gender : null,
            email : null,
            pic : null,
        }
    }

    componentWillMount(){
        this.checkFbAuth()
    }


    async checkFbAuth(){
        let data = await AccessToken.getCurrentAccessToken()
        console.log("LOGGED STATUS",data)
        if(data!=null){
            let data = await AsyncStorage.getItem('userConfig')
            let userConfig = JSON.parse(data);
            console.log("GET ASYNC USER CONFIG",userConfig)
            this.userConfig = userConfig;
            this.setState({loggedIn: true})
            ;
        }

    }

    fb_login(){
        LoginManager.logInWithReadPermissions(['public_profile'])
            .then( (res) => {
                if(res.isCancelled){
                    console.log("cancelled")
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            let accessToken = data.accessToken
                            const responseInfoCallback = (error, result) => {
                                if (error) {
                                    console.log(error)
                                } else {
                                    console.log(result)
                                    this.userConfig = {
                                        name : result.name,
                                        email : result.email,
                                        birthday : result.birthday,
                                        gender : result.gender,
                                        pic : result.picture_small.data
                                    }
                                    this.setState({loggedIn:true},
                                        ()=>{
                                            AsyncStorage.setItem('userConfig',JSON.stringify(this.userConfig))
                                            console.log("SET USER CONFIG")
                                        })
                                }
                            }
                            const infoRequest = new GraphRequest(
                                '/me',
                                {
                                    accessToken: accessToken,
                                    parameters: {
                                        fields: {
                                            string: 'name,birthday,gender,email,picture.width(100).height(100).as(picture_small),picture.width(720).height(720).as(picture_large)'
                                        }
                                    }
                                },
                                responseInfoCallback
                            );
                            // Start the graph request.
                            new GraphRequestManager()
                                .addRequest(infoRequest)
                                .start()
                        }
                    )
                }}
            )
            .catch( (err) => {
                console.log("error ocurred")
            })
    }

    fb_logout(){
        LoginManager.logOut()
        this.setState({loggedIn:false})
    }

    render() {
        const loggedIn = (
            this.state.loggedIn &&
            <View>
                <Text>{this.userConfig.name}</Text>
                <Text>{this.userConfig.gender}</Text>
                <Text>{this.userConfig.birthday}</Text>
                <Text>{this.userConfig.email}</Text>
                <Image
                    style={{width:this.userConfig.pic.width,height:this.userConfig.pic.height}}
                    source={{uri:this.userConfig.pic.url}}
                />
            </View>
        )
        const view = this.state.loggedIn ? loggedIn : <Text>USER NOT LOGGED IN</Text>

        const logoutButton = (
            <TouchableOpacity onPress={()=>this.fb_logout()}>
                <Text>Logout</Text>
            </TouchableOpacity>
        )
        const loginButton = (
            <TouchableOpacity onPress={()=>this.fb_login()}>
                <Text>Login with facebook</Text>
            </TouchableOpacity>
        )
        const button = this.state.loggedIn ? logoutButton : loginButton
        return (
            <View style={styles.container}>
                <View>
                    { view }
                </View>
                { button }


                {/*<LoginButton
                    readPermissions={["public_profile"]}
                    onLoginFinished={
                        (error, result) => {
                            if (error) {
                                alert("login has error: " + result.error);
                            } else if (result.isCancelled) {
                                alert("login is cancelled.");
                            } else {
                                AccessToken.getCurrentAccessToken().then(
                                    (data) => {
                                        let accessToken = data.accessToken
                                        const responseInfoCallback = (error, result) => {
                                            if (error) {
                                                console.log("ERROR FETCHING:",error.toString());
                                            } else {
                                                console.log("SUCCESS FETCHING:",result)
                                                this.userConfig = {
                                                    name : result.name,
                                                    email : result.email,
                                                    gender : result.gender,
                                                    birthday : result.birthday,
                                                    pic : result.picture_small.data
                                                }
                                                this.setState({loggedIn:true})
                                            }
                                        }
                                        const infoRequest = new GraphRequest(
                                            '/me',
                                            {
                                                accessToken: accessToken,
                                                parameters: {
                                                    fields: {
                                                        string: 'email,name,gender,birthday,picture.width(100).height(100).as(picture_small),picture.width(720).height(720).as(picture_large)'
                                                    }
                                                }
                                            },
                                            responseInfoCallback
                                        );
                                        // Start the graph request.
                                        new GraphRequestManager()
                                            .addRequest(infoRequest)
                                            .start()
                                    }
                                )
                            }
                        }
                    }
                    onLogoutFinished={() => this.setState({loggedIn:false},alert("logout."))}/>*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
