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
const SWITCH_COLUMN_SPOT = WIDTH/3.5;
// the amount each item occupies plus to its height
const ITEM_MARGIN = 4;

export default class App extends Component {
    // tracks the length of column1
    c1Length = 5;
    // tracks the height of each item
    itemHeights = [];
    state={
        // from beginning until the end it's important to keep the items of
        // column1 at the beginning of the array and not mix up two columns items
        items:[
            {
                id: '0',
                description: 'Lorem ipsum is a pseudo-Latin text used in web design, ',
                columnNumber: 1,
            },
            {
                id: '1',
                description: 'typography, layout, and printing in place of English to emphasise desig' +
                'n elements over content. It\'s also called ',
                columnNumber: 1,
            },
            {
                id: '2',
                description: 'placeholder (or filler) text. It\'s a ' +
                'convenient tool for mock-ups. It helps to outline the visual elements' +
                ' of a document or presentation, eg typography, font, or layout. Lorem ',
                columnNumber: 1,
            },
            {
                id: '3',
                description: 'ipsum is mostly a part of a Latin text by the classical author and' +
                ' philosopher Cicero. Its words and letters have been changed by addition or removal,' +
                ' so to deliberately render its content nonsensical; it\'s not genuine, correct, or' +
                ' comprehensible Latin anymore. While lorem ipsum\'s still resembles ',
                columnNumber: 1,
            },
            {
                id: '4',
                description: 'classical Latin, it actually has no meaning whatsoever. ' +
                'As Cicero\'s text doesn\'t contain the letters K, W, or Z, alien to latin, these,' +
                ' and others are often inserted randomly to mimic the typographic appearence of European' +
                ' languages, as are digraphs not to be found in the original.\n' +
                'In a professional context it often happens that private or corporate clients corder a ',
                columnNumber: 1,
            },
            {
                id: '5',
                description: '2.',
                columnNumber: 2,
            },
            {
                id: '6',
                description: 'the amount or distance by which something is out of line.',
                columnNumber: 2,
            },
            {
                id: '7',
                description: '"these wheels have an offset of four inches"',
                columnNumber: 2,
            },
            {
                id: '8',
                description: 'offset | meaning of offset in Longman Dictionary of Contemporary ...\n' +
                'https://www.ldoceonline.com/dictionary/offset\n' +
                'Define offset. offset synonyms, offset pronunciation, offset translation, English dictionary definition of offset. n. 1. An agent, element, or thing that balances, ...',
                columnNumber: 2,
            },
            {
                id: '9',
                description: 'offset | meaning of offset in Longman Dictionary of Contemporary ...\n' +
                'Define offset. offset synonyms, offset pronunciation, offset translation, English dictionary definition of offset. n. 1. An agent, element, or thing that balances, ...',
                columnNumber: 2,
            },
        ],
        // dragging item is moving from what index
        movingFrom: null,
        // dragging item is moving to what index
        movingTo: null,
        // dragging item is switching to what column
        switchingTo: null,
        // this is added to boost the performance of animations,
        // when user drags an item from one column to another, if we trigger
        // an animation for all the items in new and previous column it would
        // be expensive and causes lags so we set this state to true when user moves
        // an item to another column. with checking this state, we prevent animation
        justSwitched: false,
    };

    _onItemLongPress = movingFrom=>this.setState({movingFrom, movingTo: movingFrom});

    // as item is dragging we get its coordinates
    _onDraggableMove = (x, y)=>{
        let { movingFrom, items } = this.state;
        let switchingTo = null;
        // the column that our dragging item lives
        const initialColumnIs1 = items[movingFrom].columnNumber === 1;
        // determines the next MovingTo
        let nextMovingTo = null;

        // if switched its column
        if(initialColumnIs1 && x>SWITCH_COLUMN_SPOT || !initialColumnIs1 && x<-SWITCH_COLUMN_SPOT){
            // if our dragging item was at column 1 and has gone to column 2
            if(initialColumnIs1){
                switchingTo = 2;
                // if item move to column2 we set the next MovingTo equal to the first item
                // at column2 that equals to the length of column1 -1
                nextMovingTo = this.c1Length-1;
                // if the second column is empty we let nextMovingTo to remain
                // as the first item in column2, otherwise we should continue
                if(this.c1Length!==items.length){
                    // in order to transfer the coordinates of the dragging item
                    // to column2 we need to loop through the previous items
                    // of the dragging item and get their heights and then
                    // add to y
                    for(let i=0; i<movingFrom; i++){
                        y += this.itemHeights[i];
                    }

                    // then we subtract y from the height of items in column2
                    // until our y gets to 0
                    let counter = 0;
                    while(y!==0){
                        // we get the height of item in column2 from 0 and go up
                        const targetItemHeight = this.itemHeights[this.c1Length+counter];
                        // if y exceeds this item's height
                        if(y > targetItemHeight){
                            // we increment the nextMovingTo
                            nextMovingTo++;
                            // and subtract the height of item from y
                            y -= targetItemHeight;

                        // if y is not bigger than the height of the item
                        }else{
                            // but is more than the half of it
                            // we increment the nextMovingTo
                            if(y > targetItemHeight/2) nextMovingTo++;
                            // and set y equal to 0, so we don't loop anymore
                            y = 0;
                        }
                        // increment the counter to go for the next item
                        counter++
                    }
                }
                // if nextMovingTo exceeds the items.length, we set it equal to the last item
                if(nextMovingTo>=items.length) nextMovingTo = items.length-1;

            }else{
                switchingTo = 1;
                nextMovingTo = 0;
                // if the column1 is empty we let nextMovingTo to remain
                // as the first item in column1, otherwise we should continue
                if(this.c1Length !== 0){
                    // in order to transfer the coordinates of the dragging item
                    // to column1 we need to loop through the previous items
                    // of the dragging item in column2 and get their heights and then
                    // add to y
                    for(let i=movingFrom-1; i>=this.c1Length; i--){
                        y += this.itemHeights[i];
                    }

                    let counter = 0;
                    while(y!==0){
                        const targetItemHeight = this.itemHeights[counter];
                        if(y > targetItemHeight){
                            nextMovingTo++;
                            y -= targetItemHeight;
                        }else{
                            if(y > targetItemHeight/2) nextMovingTo++;
                            y = 0;
                        }
                        counter++
                    }
                }
                // if nextMovingTo exceeds column1's height, we set it to the
                // last item in column1
                if(nextMovingTo>=this.c1Length) nextMovingTo = this.c1Length;
            }


        // if no column switching happens we don't need to transform the
        // coordinates of the dragging item anywhere so calculation differs
        }else {
            let counter = 1;
            // initially we set the nextMovingTo where it was previously
            nextMovingTo = movingFrom;
            while(y!==0){
                // if the draggingItem is going down (decrement index)
                if(y>0){
                    const targetItemHeight = this.itemHeights[movingFrom+counter];
                    if(y > targetItemHeight){
                        y -= targetItemHeight;
                        nextMovingTo++;
                    }else{
                        if(y > targetItemHeight/2) nextMovingTo++;
                        y = 0;
                    }

                // if the draggingItem is going up (decrement index)
                }else{
                    const targetItemHeight = this.itemHeights[movingFrom-counter];
                    if(Math.abs(y) > targetItemHeight){
                        y += targetItemHeight;
                        nextMovingTo--;
                    }else{
                        if(Math.abs(y) > targetItemHeight/2) nextMovingTo--;
                        y = 0;
                    }
                }
                counter++
            }


            if (initialColumnIs1) {
                // if dragging item is in column1 and is exceeding the length of
                // its column we set it as the last item
                if(nextMovingTo >= this.c1Length) nextMovingTo = this.c1Length - 1;
            // if dragging item is in column2 and has gone very up that
            // is gonna move to column1, we prevent it by setting as the first item in column2
            } else if(nextMovingTo<this.c1Length){
                nextMovingTo = this.c1Length;
            }
        }

        this.setState({
            movingTo: nextMovingTo<0 ? 0 : nextMovingTo,
            switchingTo,
            // if previous column is not equal to the new one, it mean
            // dragging item has changed its column
            justSwitched: switchingTo!==null && this.state.switchingTo === null,
        });
    };

    _onDraggableRelease = ()=>{
        let { items, movingFrom, movingTo, switchingTo } = this.state;
        // as user releases the dragging item, we move it to its new index(movingTo)
        items.splice(movingTo, 0, items.splice(movingFrom, 1)[0]);
        // accordingly we should move its height to the correct index
        this.itemHeights.splice(movingTo, 0, this.itemHeights.splice(movingFrom, 1)[0]);
        if(switchingTo){
            // column has been switched we should update the columnNumber of that item
            items[movingTo].columnNumber = switchingTo;
            // and c1Length
            this.c1Length = switchingTo===2 ? this.c1Length-1 : this.c1Length+1;
        }

        this.setState({
            items,
            movingFrom: null,
            movingTo: null,
            switchingTo: null,
        });
    };

    // get and set the height of items by their index,
    // they will have the same indexing with state.items
    _onItemLayout = (h, i)=>this.itemHeights[i] = h+ITEM_MARGIN;

    _renderItems = columnNumber=>{
        const { items, movingFrom, movingTo, switchingTo, justSwitched} = this.state;
        return items.map((item, index)=>{
            if(item.columnNumber === columnNumber){
                let moveYTo;
                let isDragging = movingFrom===index;
                let draggingItemHeight = this.itemHeights[movingFrom];

                if(movingTo>-1 && !isDragging){
                    // the items that are between dragging item initial index and its target index
                    // should move down (dragging item is moving up)
                    if(movingTo<=index && movingFrom>index) moveYTo = draggingItemHeight;
                    // the items that are between dragging item initial index and its target index
                    // should move up (dragging item is moving down)
                    else if(movingTo>=index && movingFrom<index) moveYTo = -draggingItemHeight;

                    // if a switch column has happened
                    if(switchingTo){
                        // cancel out those that are in the other column
                        if(index>=this.c1Length) moveYTo = null;
                        // collapse the items that are in column2 and are below the dragged
                        // item to the first column
                        if(switchingTo===1 && index>movingFrom) moveYTo = -draggingItemHeight;
                        // the same for column 1
                        if(switchingTo===2 && index>movingTo) moveYTo = draggingItemHeight
                    }
                }

                return(
                    <DraggableItem
                        key={item.id}
                        item={item}
                        onLongPress={()=>this._onItemLongPress(index)}
                        onRelease={this._onDraggableRelease}
                        isDragging={isDragging}
                        draggingItemHeight={draggingItemHeight}
                        moveYTo={moveYTo}
                        onMove={this._onDraggableMove}
                        dontAnimate={!movingFrom||justSwitched}
                        onItemLayout={({nativeEvent:{layout:{height}}})=>this._onItemLayout(height, index)}

                    />
                )
            }
        })
    };


    render() {
        return (
            <ScrollView
                style={styles.container}
                scrollEnabled={!this.state.movingFrom}
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
