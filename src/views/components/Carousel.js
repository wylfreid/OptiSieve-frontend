import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import Slick from 'react-native-slick';
import COLORS from '../../const/colors';
 

 
 const Carousel = ({imageTop,imageBottom})=>{

    return (
      <Slick style={styles.wrapper} dotColor={"#E5E5E5"} removeClippedSubviews={false}  activeDotColor={COLORS.purple} >
        <View style={styles.slide1}>
        <Image
        source={{ uri: imageTop.uri }} style={styles.image}/>
        </View>
        <View style={styles.slide2}>
        <Image
        source={{ uri: imageBottom.uri }} style={styles.image}/>
        </View>
      </Slick>
    )
  
};
var styles = StyleSheet.create({
    wrapper: {
    },
    slide1: {
      flex: 1,
    },
    slide2: {
      flex: 1,
    },
    image: {
      flex: 1,
      resizeMode: 'cover',
      width: "100%"
    },
    buttonText:{
    color:COLORS.purple,
    fontSize:45,
    }
  })
export default Carousel;