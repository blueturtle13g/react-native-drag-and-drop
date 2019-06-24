import React, {Component} from 'react';
import {
    Animated,
    Text,
    PanResponder,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
    Easing,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class DraggableItem extends Component {
    animatedItem = new Animated.Value(0);
    position = new Animated.ValueXY(0);
    PanResponder = PanResponder.create({
        onMoveShouldSetPanResponderCapture: () => this.props.isDragging,
        onPanResponderMove: (_, {dx,dy}) =>{
            this.props.onMove(dx,dy);
            this.position.setValue({ x: dx, y: dy })
        },
        onPanResponderRelease: () => {
            this.props.onRelease();
            this.position.setValue({ x: 0, y: 0 });
        },
    });


    _onMoveTo = y=>{
        if(this.props.dontAnimate) this.position.setValue({ x: 0, y });
        else Animated.timing(this.position, {
            toValue: { y, x: 0},
            easing: Easing.in,
            duration: 200,
        }).start()
    };

    componentDidUpdate(prevProps){
        if(!prevProps.isDragging && this.props.isDragging){
            Animated.spring(this.animatedItem,{toValue: 1}).start()
        }

        if(prevProps.moveTo !== this.props.moveTo){
            switch (this.props.moveTo){
                case 'top':
                    this._onMoveTo(-84);
                    break;
                case 'bottom':
                    this._onMoveTo(84);
                    break;
                default:
                    this._onMoveTo(0);

            }
        }
    }

    render() {
        const { item, onLongPress, isDragging } = this.props;
        return (
            <Animated.View
                {...this.PanResponder.panHandlers}
                style={[
                    ...this.position.getTranslateTransform(),
                    styles.itemContainer,
                    isDragging && {
                        zIndex: 1000,
                        elevation: 50,
                        transform:[
                            {
                                rotate: this.animatedItem.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '6deg']
                                })
                            }
                        ]
                    },
                ]}
            >
                <TouchableOpacity
                    activeOpacity={.8}
                    onLongPress={onLongPress}
                    style={styles.item}
                    delayLongPress={150}
                    onPress={()=>alert(item.id)}
                >
                    <Text style={styles.itemTitle}>{item.id}</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    itemContainer:{
        height: 80,
        width: (WIDTH/2)-5,
        marginVertical: 2,
        alignSelf: 'center',
        zIndex: -1000,
    },
    item:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#005b96',
    },
    itemTitle:{
        fontSize: 20,
        fontWeight: '600',
        color: '#eee',
        width: '100%',
        textAlign: 'center',
    },
});
