import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity
} from "react-native";
import { useRef, useCallback, useState } from "react";
import COLORS from "./../../const/colors";
import Slick from 'react-native-slick';
import OnboardingScreen_1 from "../components/OnboardingScreen_1";
import OnboardingScreen_2 from "../components/OnboardingScreen_2";
import OnboardingScreen_3 from "../components/OnboardingScreen_3";



export default function WelcomeScreen({ navigation }) {

  

  const slickRef = useRef(null);

  const [index, setIndex] = useState(0);

  const handleAfterChange = useCallback((currentSlide) => {
    setIndex(currentSlide);
  }, []);

  const handleNext = useCallback(() => {
    if (index < 2) {
      slickRef.current?.scrollBy(1);
      setIndex(index + 1);
    }else{
      navigation.navigate('RegistrationScreen');
    }
  }, [slickRef, index]);
  
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
        //marginTop: StatusBar.currentHeight,
      }}
    >

<Slick ref={slickRef} onIndexChanged={handleAfterChange} style={styles.wrapper} loop={false} dotColor={"#D9D9D9"} removeClippedSubviews={false} showsButtons={false} activeDotColor={"#0072F7"}  >
  <OnboardingScreen_1 style={styles.slide1} />
  <OnboardingScreen_2 style={styles.slide2} />
  <OnboardingScreen_3 style={styles.slide3} /> 
</Slick>

<TouchableOpacity style={styles.button1} onPress={()=> navigation.navigate('RegistrationScreen')}>
  <Text style={{fontSize: 18, fontFamily: "PTSans-regular", fontWeight: 700}} >Passer</Text>
</TouchableOpacity>


<TouchableOpacity style={styles.button2} onPress={handleNext}>
  <Text style={{fontSize: 18, fontFamily: "PTSans-regular", fontWeight: 600, color: COLORS.blue}} >Suivant</Text>
</TouchableOpacity>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    elipse1:{
        resizeMode: "contain",
        position: "absolute",
        top: 86,
        zIndex: -10
    },
    elipse2:{
      resizeMode: "contain",
      position: "absolute",
      top: 271,
      right: 0,
      zIndex: -10
  },
    frame:{
      resizeMode: "contain",
      position: "absolute",
      top: 215
    },
    topContainer:{
      flex: 0.4,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 60
    },
    bottomContainer:{
      flex: 0.6,
      justifyContent: "center",
      alignItems: "center",
      
    },
    title: {
      fontSize: 25,
      fontFamily: 'PTSans-bold'
    },
    desc: {
      fontSize: 18,
      fontWeight: 400,
      marginTop: 5,
      textAlign: "center",
      marginHorizontal: 50,
      fontFamily: 'PTSans-regular'
    },

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
    button1:{
      position: 'absolute',
      bottom: 23,
      left: 35,
      
    },
    button2:{
      position: 'absolute',
      bottom: 23,
      right: 35,
    }
});
