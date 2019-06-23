import React, {Component} from 'react';
import {
    Animated,
    Text,
    PanResponder,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions
} from 'react-native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class DraggableItem extends Component {
    position = new Animated.ValueXY();
    PanResponder = PanResponder.create({
        onMoveShouldSetPanResponderCapture: () => this.props.item.isDragging,
        onPanResponderMove: (_, { dx, dy }) => {
            this.position.setValue({ x: dx, y: dy });
            this.props.onMove(dx, dy);
        },
        onPanResponderRelease: (_, { dx, dy }) => {
            console.log('released');

            // this.setState({isDragging: false});
            this.props.onRelease(this.props.item, dx, dy);
            this.position.setValue({ x: 0, y: 0 });

            // Animated.timing(this.position, {
            //     toValue: { x: 0, y: 0 },
            // }).start();
            // if (dx > 50) {
            //     Animated.spring(this.position, {
            //         toValue: { x: WIDTH + 50, y: dy },
            //     }).start(() =>{});
            // } else {
            //     Animated.spring(this.position, {
            //         toValue: { x: 0, y: 0 },
            //         friction: 4,
            //     }).start();
            // }
        },
    });

    render() {
        const { item, onLongPress, customStyle, onLayout } = this.props;
        return (
            <Animated.View
                {...this.PanResponder.panHandlers}
                style={[...this.position.getTranslateTransform(), styles.itemContainer, item.isDragging &&{zIndex: 1000}]}
                onLayout={onLayout}
            >
                <TouchableOpacity
                    activeOpacity={.8}
                    key={item.id}
                    onLongPress={onLongPress}
                    style={styles.item}
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
        backgroundColor: '#2b2b2b',
        marginVertical: 2,
        alignSelf: 'center',
        zIndex: -1000
    },
    item:{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemPlaceholder:{
        backgroundColor: '#eee',
    },
    itemTitle:{
        fontSize: 20,
        fontWeight: '600',
        color: '#fff'
    },
});
