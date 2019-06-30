import React, {Component} from 'react';
import {
    Animated,
    Text,
    PanResponder,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Easing,
} from 'react-native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class DraggableItem extends Component {
    _scrollInterval = null;
    _animatedItem = new Animated.Value(0);
    _position = new Animated.ValueXY(0);
    _movedYByScroll = 0;
    PanResponder = PanResponder.create({
        // we allow pan responder to capture the finger movement just if the item
        // is set to isDragging by long press
        onMoveShouldSetPanResponderCapture: () => this.props.isDragging,
        onPanResponderMove: (_, {dx, dy, moveY}) =>{

            console.log('moveY: ', moveY);
            console.log('!this._scrollInterval: ', !this._scrollInterval);

            if(moveY>HEIGHT-100 && !this._scrollInterval){
                this._scrollSmoothly(dx, dy, 10)
            }else if(moveY<100 && !this._scrollInterval){
                this._scrollSmoothly(dx, dy, -10);
            }else{
                this._clearScrollInterval();
                this._position.setValue({ x: dx, y: dy+this._movedYByScroll });
                this.props.onMove(dx, dy+this._movedYByScroll, 0);
            }
        },
        onPanResponderRelease: () => {
            // then reset to the initial _position
            this._position.setValue({ x: 0, y: 0 });
            this._clearScrollInterval();
            this.props.onRelease(this._movedYByScroll);
            this._movedYByScroll = 0;
        },
    });

    _scrollSmoothly = (dx, dy, direction) =>{
        this._movedYByScroll = direction;
        this._scrollInterval = setInterval(()=>{
            this._movedYByScroll += direction;
            if(this.props.cantScroll || (direction<0 && (this.props.scrollViewYPosition+this._movedYByScroll)===0)){
                this._clearScrollInterval();
                return;
            }
            this._position.setValue({x: dx, y: dy+this._movedYByScroll});
            this.props.onMove(dx,dy+this._movedYByScroll, this._movedYByScroll)
        }, 100)
    };

    _clearScrollInterval = ()=>{
        clearInterval(this._scrollInterval);
        this._scrollInterval= null;
    };

    _onMoveTo = y=>{
        // if dragging item has changed its column we don't animate(performance)!
        // it would be hard for react native to animate numerous items at the same time
        // since all items should move down at the same time as you change the column
        if(this.props.dontAnimate) this._position.setValue({ x: 0, y });
        else Animated.timing(this._position, {
            toValue: { y, x: 0},
            easing: Easing.in,
            duration: 200,
        }).start()
    };

    componentDidUpdate(prevProps){
        // if the item is newly long pressed, we start an animation to
        // give it some rotation
        if(!prevProps.isDragging && this.props.isDragging){
            Animated.spring(this._animatedItem,{toValue: 1}).start()
        }

        // if the item should update its y coordinates we trigger _onMoveTo method
        if(prevProps.moveYTo !== this.props.moveYTo){
            this._onMoveTo(this.props.moveYTo ? this.props.moveYTo : 0);
        }
    }

    render() {
        const { item, onLongPress, isDragging, onItemLayout } = this.props;
        return (
            <Animated.View
                {...this.PanResponder.panHandlers}
                style={[
                    ...this._position.getTranslateTransform(),
                    styles.itemContainer,
                    isDragging && {
                        zIndex: 1000,
                        transform:[
                            {
                                rotate: this._animatedItem.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '6deg']
                                })
                            }
                        ]
                    },
                ]}
                onLayout={onItemLayout}
            >
                <TouchableOpacity
                    activeOpacity={.9}
                    onLongPress={onLongPress}
                    style={styles.item}
                    delayLongPress={50}
                    onPress={()=>alert(item.id)}
                >
                    <Text style={styles.itemTitle}>{item.id}</Text>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    itemContainer:{
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
        borderRadius: 4,
    },
    itemTitle:{
        fontSize: 20,
        fontWeight: '600',
        color: '#eee',
        width: '100%',
        textAlign: 'center',
    },
    itemDescription:{
        fontSize: 15,
        color: 'yellow',
        width: '100%',
        textAlign: 'center',
    },
});
