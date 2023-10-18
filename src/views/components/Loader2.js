import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  StatusBar
} from "react-native";
import COLORS from "../../const/colors";
import Logo from "../../../assets/images/Logo";
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/Ionicons';



export default function Loader({ visible = false, title = "Analyse en cours..." }) {
  const { width, height } = useWindowDimensions();
  return (
    visible && (
      <View style={[styles.container, { width, height: height + StatusBar.currentHeight }]}>

        <View style={styles.topContainer}>
          <Logo/>
          
        </View>

        <View style={styles.middleContainer}>
        <View style={{height: width/1.2, width: width}}>
          <LottieView
            source={require('../../../assets/images/lotties/animation.json')} // Remplacez par le chemin de votre fichier d'animation JSON
            autoPlay
            loop
          />
        </View>

        <Text style={styles.textLoader}>{title}</Text>
        </View>

        <View style={styles.bottomContainer}>
  

                <View style={{marginHorizontal: 40, marginBottom: 50}}>

                  <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.blackc }]} onPress={() => {}} activeOpacity={0.7}>
                  <Icon name={"close-circle-outline"}  style={{color:"#fff",fontSize:30}}/>
                    <Text style={styles.text}>Annuler l’analyse</Text>
                  </TouchableOpacity>
                
                </View>

        </View>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,1)",
    justifyContent: "center",
    flex: 1
    //marginTop: StatusBar.currentHeight
  },

  topContainer: {
    flex: 0.25,
    alignItems: "center",
    justifyContent: "center",
    /* backgroundColor: COLORS.purple, */
  },
  middleContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    gap: 5,
  },
  bottomContainer: {
    /* flex: 0.2, */
    flex: 0.25,
    justifyContent: "flex-end",
  },


  loader: {
    height: 70,
    backgroundColor: COLORS.white,
    marginHorizontal: 50,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  textLoader: {
    fontSize: 19,
    fontFamily: 'PTSans-regular',
    fontWeight: "bold"
  },

  button: {
    height:55,
    width:"100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius:8,
  },

  text:{
    fontSize:16,
    fontFamily: 'PTSans-regular', 
    color:COLORS.white
  },
});
