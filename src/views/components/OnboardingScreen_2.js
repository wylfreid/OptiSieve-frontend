import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    StatusBar,
    Image,
    TouchableOpacity
  } from "react-native";
  import COLORS from "../../const/colors";
  import LottieView from 'lottie-react-native';
  import User from "./User";
  import Ellipse1 from "../../../assets/images/shapes/Ellipse1";
  import Ellipse2 from "../../../assets/images/shapes/Ellipse2";
  import Frame2 from "../../../assets/images/shapes/Frame2";
  
  
  
  export default function OnboardingScreen_2(props) {
  
    
    
    return (
      <View
      {...props}
      >
  
          <Ellipse1 style={styles.elipse1} />
          <Ellipse2 style={styles.elipse2} />
        <View style={styles.topContainer}>
          <Frame2 style={styles.frame} />
  
        </View>
  
        <View style={styles.bottomContainer}>
          <Text style={styles.title} >Rapide</Text>
  
          <Text style={styles.desc} > lorem lorem lorem lorem lorem lorem lorem lorem. </Text>
  
        </View>
  
      </View>
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
        top: 260
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
        marginTop: 5,
        textAlign: "center",
        marginHorizontal: 50,
        fontFamily: 'PTSans-regular'
      },
  });
  