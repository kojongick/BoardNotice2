import React, { Component } from 'react';
import Button from '../components/Button'
import Modal from 'react-native-modal'
import API from '../services/API'
import * as firebase from 'firebase';

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
    FlatList,
    TouchableOpacity,
    Animated,
    TouchableHighlight
} from 'react-native';
const {width,height} = Dimensions.get('window');

class Board extends Component{
    constructor(props){
        super(props);
        this.state = {
            inputModalVisible:false,
            deleteModalVisible:false,
            addressData : [],
            sortData : [],
            check : 1,
            select:"",
        }
    }
    componentWillMount(){
        this.getData();
    }
//!FIXME :: once -> on ?
    async getData(){
        let ref = `users`
        await API.getDataOnce(ref)
            .then( (data) => {
                const items = []
                const obj = data.val()
                const keys = Object.keys(obj).sort().reverse()
                for(let i = 0, item; item = obj[keys[i]]; i++){
                    let temp = keys[i]
                    item.time = temp;
                    items.push(item)
                }
                this.setState({sortData:items})
            });
    }

    overlap(BoardName){
        for(var a = 0; a<this.state.sortData.length; a++) {
                if(this.state.sortData[a].BoardName === BoardName){
                    alert("중복된 이름을 가진 게시판이 있습니다.")
                return false;
                }
            }
            return true;
    }

    send_Data(BoardName, BoardUri) {
        var tmp = BoardUri.split("")
        var i = parseInt(tmp[0]);

        //uri 검사
        if (!isNaN(i) && this.overlap(BoardName)) {
            var headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
            var params = {
                id: "jje9302",
                name: BoardName,
                uri: BoardUri,
            };

            var url = "http://49.161.111.188:8080/boards"
            var formData = new FormData();

            for (var k in params) {
                formData.append(k, params[k]);
            }

            var request = {
                method: 'POST',
                headers: headers,
                body: formData
            };

            //데이터 전송 and 반환값 검사
            fetch(url, request).then(function (res) {
                return res.json();
            }).then(function (json) {
                return (this.setState({check: json.response_message}))
            })

            if (this.state.check == 1) {
                this.InsertData(BoardName, BoardUri)
            }
            else
                alert("URI를 확인하세요")
        }

        if(isNaN(i)){
            alert("URI 값을 입력하세요")
        }
    }

        InsertData(Name,Uri){
            let inputData ={
                BoardName : Name,
                BoardUri : Uri
            }
            let road = `users/${Date.now()}`;
            this.setState({BoardUri:"",BoardName:""})
            return firebase.database().ref(road).set(inputData).then(this.getData()).then(this.input_close_modal())
        }

        toast(){
            ()=>{ // record scenes state reset
                ToastAndroid.show('기록되었습니다.',ToastAndroid.SHORT);
            }
        }

        render(){
            return(
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <FlatList
                        data = {this.state.sortData}

                        renderItem={({item}) => {
                            {
                                return(
                                    <TouchableOpacity
                                        onLongPress={()=> this.delete_show_modal(item.time)}
                                    >
                                        <Animated.View style={{flex:1,borderBottomWidth:1,borderBottomColor:'#efefef',
                                            height:this.state.animation}}>
                                            <View style={{marginLeft:10,flex: 1, width: width, marginBottom: 5,height:55, justifyContent:"center"}}>
                                                <Text style={{fontSize : 17, color:"#000"}}>게시판 이름 : {item.BoardName} </Text>
                                                <Text style={{fontSize : 13,color : "#000",marginTop:10}}>게시판 주소 : {item.BoardUri} </Text>
                                            </View>
                                        </Animated.View>
                                    </TouchableOpacity>
                                )
                            }
                        }
                        }
                    />

                    <InsertModal
                        InputModalVisible={this.state.inputModalVisible}
                        onClose={()=>this.input_close_modal()}
                        onClick={(name, uri) => this.send_Data(name, uri)}
                    />

                    <DeleteModal
                        DeleteModalVisible={this.state.deleteModalVisible}
                        onClose = {()=>this.delete_close_modal()}
                        onClick = {()=>this.onRemove(this.state.select)}
                        label = "삭제하기"
                    />

                    <Button
                        title="게시판 추가"
                        onClick={() => this.input_show_modal()}
                        buttonStyle ={{marginBottom : 5}}/>
                </View>
            )
        }

        input_show_modal(){
            this.setState({inputModalVisible:true})
        }

        input_close_modal(){
            this.setState({inputModalVisible:false})
        }

        delete_show_modal(key){
            this.setState({select :key, deleteModalVisible:true})
        }
        delete_close_modal(){
            this.setState({deleteModalVisible:false})
        }
        async onRemove(select){
            let ref = `users`
            API.removeData(ref,select);
            await this.getData().then(this.setState({deleteModalVisible:false}))
            ToastAndroid.show('삭제되었습니다',ToastAndroid.SHORT)

        }

    }
    export default Board;



    class InsertModal extends Component{
    constructor(props){
        super(props)
        this.state={
            BoardName :"",
            BoardUri:"",
        }
    }

    render(){
        return(
            <Modal
                isVisible={this.props.InputModalVisible}
                onBackButtonPress={()=>this.props.onClose()}
                hideOnBack={true}>

                <View style ={{alignItems:'center',backgroundColor:'#fff'}}>

                    <View style={{width:width,backgroundColor:'#bfbfbf',height:50,alignItems:"center", justifyContent:"center"}}>
                        <Text style={{fontSize:20}}>게시판 추가</Text>
                    </View>

                    <View style ={{flexDirection: "row",marginLeft:20}}>
                        <Text style={{marginTop:30}}>게시판 이름 : </Text>
                        <TextInput
                            style ={{width:220,height:40,margin:20,marginLeft: 5, borderWidth:1}}
                            multiline = {true}
                            value={this.state.BoardName}
                            onChangeText={(name)=>{this.setState({BoardName:name})}}
                            underlineColorAndroid='#fff'
                            textAlignVertical='top'/>
                    </View>

                    <View style ={{flexDirection: "row",marginLeft:20, marginTop:-25}}>
                        <Text style={{marginTop:30}}>게시판 주소 : </Text>
                        <TextInput
                            style ={{width:220,height:40,margin:20,marginLeft:5,borderWidth:1}}
                            multiline = {true}
                            value={this.state.BoardUri}
                            onChangeText={(url)=>{this.setState({BoardUri:url})}}
                            underlineColorAndroid='#fff'
                            textAlignVertical='top' />
                    </View>

                    <View style={{height:50,width:300,justifyContent:'center', flexDirection: 'row' }}>
                        <Button
                            onClick={()=>{this.setState({BoardName:"", BoardUri:""}),this.props.onClick(this.state.BoardName,this.state.BoardUri)}}
                            buttonStyle={{width:100,fontSize:16,color:'#000',alignItems:"center",marginRight:20}}
                            title ="추가하기"/>
                        <Button
                            onClick={()=>this.props.onClose()}
                            buttonStyle={{width:100,fontSize:16,color:'#000'}}
                            title="취소" />
                    </View>
                </View>
            </Modal>
        )
    }
}

class DeleteModal extends Component{
    constructor(props){
        super(props)
        this.state={
            comment:'',
            BoardName : "",
            BoardUri : "",
            check : false,
        }
    }

    render(){
        return(
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.props.DeleteModalVisible}
                onRequestClose={()=>this.props.onClose()}>

                <View style={styles.container}>
                    <View style={styles.buttonContainer}>
                        <TouchableHighlight
                            underlayColor={'#efefef'}
                            activeOpacity={0.2}
                            style={styles.button}
                            onPress={()=> this.props.onClick()}>
                            <Text style={styles.buttonText}>{this.props.label}</Text>
                        </TouchableHighlight>

                        <TouchableHighlight
                            underlayColor={'#efefef'}
                            activeOpacity={0.2}
                            style={styles.button}
                            onPress={()=> this.props.onClose()}>
                            <Text style={styles.buttonText}>취소</Text>
                        </TouchableHighlight>
                    </View>
                </View>

            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    button:{
        alignItems:'center',justifyContent:'center',height:50,borderRadius:10
    },

    buttonContainer: {
        position:'absolute',bottom:0,
        width: width,
        backgroundColor:'white',
        borderTopLeftRadius:10,borderTopRightRadius:10,
    },
    buttonText:{
        fontSize:17,
        color:'#555'
    },
    container: {
        height:100,
        marginTop:150,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor:'#000000aa'
    },

    dateText:{
        fontSize:14,
        color:'#666666',
    },
    timeText:{
        fontSize:13,
        color:'#8f8f8f'
    },
})