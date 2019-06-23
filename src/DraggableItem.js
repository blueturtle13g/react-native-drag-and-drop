import React, {Component} from 'react';
import {
    Animated,
    Text,
    PanResponder,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class DraggableItem extends Component {
    position = new Animated.ValueXY();
    PanResponder = PanResponder.create({
        onMoveShouldSetPanResponderCapture: () => this.props.isDragging,
        onPanResponderMove: (_, {dx,dy}) =>{
            this.props.onMove(dx,dy);
            this.position.setValue({ x: dx, y: dy })
        },
        onPanResponderRelease: (_, {dx,dy}) => {
            this.props.onRelease();
            this.position.setValue({ x: 0, y: 0 });
        },
    });

    render() {
        const { item, onLongPress, isDragging, onLayout, moveTo } = this.props;
        return (
            <Animated.View
                {...this.PanResponder.panHandlers}
                style={[
                    ...this.position.getTranslateTransform(),
                    styles.itemContainer,
                    isDragging && styles.draggingItem,
                    moveTo==='top' &&{bottom: 84},
                    moveTo==='bottom' &&{top: 84},
                ]}
                onLayout={onLayout}
            >
                <TouchableOpacity
                    activeOpacity={.8}
                    key={item.id}
                    onLongPress={onLongPress}
                    style={styles.item}
                    delayLongPress={100}
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
        zIndex: -1000,
        borderRadius: 5,
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
    draggingItem:{
        zIndex: 1000,
        // height: 84,
        // width: (WIDTH/2)-2,
        // transform: [{ rotate: '2deg' }],
        backgroundColor: '#161616',
    },
});
