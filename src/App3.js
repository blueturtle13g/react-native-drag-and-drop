import React, {Component} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';

export default class App3 extends Component {

    state={
        data: [...Array(100)].map((_, index)=>index),
    };

    componentDidMount() {
        let y = 0;
        this._scrollInterval = setInterval(()=>{
            y+=3;
            this._scrollViewRef.scrollTo({x: 0, y })
        }, 1)
    }

    render() {
        return (
            <View>
                <ScrollView ref={c=>this._scrollViewRef = c}>
                    {this.state.data.map(id => (
                        <Text
                            style={styles.text}
                            key={id.toString()}
                            onPress={()=>{
                                clearInterval(this._scrollInterval)
                            }}
                        >
                            {id}
                        </Text>
                    ))}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text:{
        height: 100,
        width: '100%',
        marginVertical: 10,
        textAlign: 'center',
        fontSize: 30,
    }
});