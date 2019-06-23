import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    Text,
    View,
    Dimensions,
    Animated,
} from 'react-native';
import DraggableItem from './DraggableItem';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

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
                columnNumber: 1,
            },
            {
                id: '6',
                columnNumber: 1,
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
            {
                id: '10',
                columnNumber: 2,
            },
            {
                id: '11',
                columnNumber: 2,
            },
            {
                id: '12',
                columnNumber: 2,
            },
        ],
        movingCard: {},
    };

    yPositions=[];

    _onLayout = (index, y)=>this.yPositions[index] = y;
    _onItemLongPress = from=>this.setState({movingCard: {from}});
    _onDraggableMove = (x, y)=>{
        if(this.state.movingCard.from+Math.round(y/84)===this.state.movingCard.to) return;
        this.setState({
            movingCard: {
                ...this.state.movingCard,
                to: this.state.movingCard.from+Math.round(y/84)
            }
        });
    };

    _onDraggableRelease = ()=>{
        let { items, movingCard } = this.state;
        const item = items[movingCard.from];
        // const upDownMoves = Math.round(y/84);
        // if(upDownMoves<1) return;
        // let targetIndex = movingCard.from+upDownMoves;
        items = items.filter((_, i)=>i!==movingCard.from);
        items.splice(movingCard.to, 0, item);
        // console.log('movingCard: ', movingCard);
        // console.log('items: ', items);

        this.setState({items, movingCard: {}});
    };

    _renderItems = columnNumber=>{
        const { items, movingCard} = this.state;
        return items.map((item, index)=>{
            if(item.columnNumber === columnNumber){
                let moveTo;
                if(movingCard.to>-1 && movingCard.from!==index){
                    // console.log('MAIN');
                    if(movingCard.to<=index && movingCard.from>index){
                        // console.log('IF');
                        moveTo = 'bottom';
                    }else if(movingCard.to>=index && movingCard.from<index){
                        // console.log('ELSE');
                        moveTo = 'top';
                    }
                }

                // console.log('item.id: ', item.id);
                console.log('movingCard: ', movingCard);
                console.log('moveTo: ', moveTo);
                return(
                    <DraggableItem
                        key={item.id}
                        item={item}
                        onLongPress={()=>this._onItemLongPress(index)}
                        onLayout={({nativeEvent:{layout}})=>this._onLayout(index, layout.y)}
                        onRelease={this._onDraggableRelease}
                        isDragging={movingCard.from===index}
                        moveTo={moveTo}
                        onMove={this._onDraggableMove}
                    />
                )
            }
        })
    };


    render() {
        const { items, movingCard} = this.state;
        // console.log('column1: ', column1);
        // console.log('movingCard: ', movingCard);
        // console.log('this.yPositions: ', this.yPositions);

        return (
            <ScrollView
                style={styles.container}
                scrollEnabled={!movingCard.from}
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
        backgroundColor: '#F5FCFF',
    },
    columns:{
        flex: 1,
        flexDirection: 'row',
    },
    column:{
        width: WIDTH/2,
    },
    itemPlaceholder:{
        backgroundColor: '#eee',
    },
    movingItem:{
        backgroundColor: 'blue',
        position: 'absolute',
    }
});
