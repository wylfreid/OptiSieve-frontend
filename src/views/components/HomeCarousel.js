import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions
} from 'react-native';
import Slick from 'react-native-slick';
import COLORS from '../../const/colors';
 

 
 const HomeCarousel = ()=>{
   const {width, height} = useWindowDimensions();


    return (
      <Slick style={styles.wrapper} dotColor={"#E5E5E5"}  removeClippedSubviews={false} autoplay autoplayTimeout={4} showsButtons={false} activeDotColor={COLORS.purple}  >
        <View style={styles.slide1}>
        <Image
        source={require("../../../assets/images/carousel/sol1.jpg")} style={[styles.image,{ width: width}]}/>
        </View>
        <View style={styles.slide2}>
        <Image
        source={require("../../../assets/images/carousel/tamis.jpg")} style={[styles.image,{ width: width}]}/>
        </View>
        <View style={styles.slide3}>
        <Image
        source={require("../../../assets/images/carousel/ai.jpg")} style={[styles.image,{ width: width}]}/>
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
    slide3: {
      flex: 1,
    },
    image: {
      flex: 1,
      resizeMode: "cover",
    },
    buttonText:{
    color:COLORS.purple,
    fontSize:45,
    }
  })
export default HomeCarousel;