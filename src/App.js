import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Dimensions,
} from 'react-native';
import DraggableItem from './DraggableItem';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const SWITCH_COLUMN_SPOT = WIDTH/3;

export default class App extends Component {
    state={
        items:[
            {
                id: '0',
                columnNumber: 1,
            },
            {
                id: '1',
                columnNumber: 1,
            },
            {
                id: '2',
                columnNumber: 1,
            },
            {
                id: '3',
                columnNumber: 1,
            },
            {
                id: '4',
                columnNumber: 1,
            },
            {
                id: '5',
                columnNumber: 2,
            },
            {
                id: '6',
                columnNumber: 2,
            },
            {
                id: '7',
                columnNumber: 2,
            },
            {
                id: '8',
                columnNumber: 2,
            },
            {
                id: '9',
                columnNumber: 2,
            },
        ],
        movingFrom: null,
        movingTo: null,
        switchingTo: null,
        scrollEnabled: true,
    };

    yPositions=[];
    c1Length = 5;

    _onLayout = (index, y)=>this.yPositions[index] = y;

    _onItemLongPress = movingFrom=>this.setState({scrollEnabled: false}, ()=> {
        this.setState({movingFrom, movingTo: movingFrom});
    });


    _onDraggableMove = (x, y)=>{
        // console.log('y: ', y);
        // console.log('HEIGHT: ', HEIGHT);
        // this._scrollview.scrollTo({y});

        let { movingFrom, items } = this.state;
        let switchingTo;
        let newMovingTo = Math.round(y / 84)+movingFrom;
        const isColumn1 = items[movingFrom].columnNumber === 1;
        if(isColumn1 && x>SWITCH_COLUMN_SPOT || !isColumn1 && x<-SWITCH_COLUMN_SPOT){
            if(isColumn1){
                switchingTo = 2;
                if(this.c1Length===items.length) newMovingTo = this.c1Length-1;
                else newMovingTo += this.c1Length-1;
            }else{
                switchingTo = 1;
                if(newMovingTo>=this.c1Length) newMovingTo = this.c1Length;
                else newMovingTo += -this.c1Length;

            }
            // console.log('newMovingTo: ', newMovingTo);
            if(newMovingTo>=items.length) newMovingTo = items.length-1;
        }else {
            if (isColumn1) {
                if(newMovingTo >= this.c1Length) newMovingTo = this.c1Length - 1;
            } else if(newMovingTo<this.c1Length){
                newMovingTo = this.c1Length;
            }
        }
        // console.log('MOVING_FROM: ', movingFrom);
        // console.log('NEW_MOVING_TO: ', newMovingTo);
        // console.log('this.c1Length: ', this.c1Length);
        this.setState({
            movingTo: newMovingTo<0 ? 0 : newMovingTo,
            switchingTo,
        });
    };

    _onDraggableRelease = ()=>{
        let { items, movingFrom, movingTo, switchingTo } = this.state;
        items.splice(movingTo, 0, items.splice(movingFrom, 1)[0]);
        if(switchingTo){
            items[movingTo].columnNumber = switchingTo;
            this.c1Length = switchingTo===2 ? this.c1Length-1 : this.c1Length+1;
        }

        this.setState({
            items,
            scrollEnabled: true,
            movingFrom: null,
            movingTo: null,
            switchingTo: false,
        });
    };

    _renderItems = columnNumber=>{
        const { items, movingFrom, movingTo, switchingTo} = this.state;
        return items.map((item, index)=>{
            if(item.columnNumber === columnNumber){
                let moveTo;
                let isDragging = movingFrom===index;

                if(movingTo>-1 && !isDragging){
                    if(movingTo<=index && movingFrom>index) moveTo = 'bottom';
                    else if(movingTo>=index && movingFrom<index) moveTo = 'top';
                }

                if(switchingTo){
                    if(switchingTo===1){
                        if(index>=this.c1Length) moveTo = null;
                        if(index>movingFrom) moveTo = 'top';
                    }else{
                        if(index>=this.c1Length) moveTo = null;
                        if(index>movingTo) moveTo = 'bottom'
                    }
                }

                // console.log('item.id: ', item.id);
                // console.log('movingCard: ', movingCard);
                // console.log('FROM: ', from);
                // console.log('INDEX: ', index);
                return(
                    <DraggableItem
                        key={item.id}
                        item={item}
                        onLongPress={()=>this._onItemLongPress(index)}
                        onLayout={({nativeEvent:{layout}})=>this._onLayout(index, layout.y)}
                        onRelease={this._onDraggableRelease}
                        isDragging={isDragging}
                        moveTo={moveTo}
                        onMove={this._onDraggableMove}
                    />
                )
            }
        })
    };


    render() {
        const {scrollEnabled, items} = this.state;
        // console.log('ITEMS: ', items);
        return (
            <ScrollView
                ref={component=>this._scrollview=component}
                style={styles.container}
                scrollEnabled={scrollEnabled}
            >
                <View style={styles.columns}>
                    <View style={styles.column}>
                        {this._renderItems(1)}
                    </View>
                    <View style={styles.column}>
                        {this._renderItems(2)}
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    columns:{
        flex: 1,
        minHeight: HEIGHT,
        flexDirection: 'row',
    },
    column:{
        width: WIDTH/2,
    },
});
