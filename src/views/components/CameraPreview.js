import {
    Text,
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
  } from "react-native";
  import Icon from "react-native-vector-icons/Ionicons";
import COLORS from "../../const/colors";
import Carousel from "./Carousel";
import Check from "../../../assets/images/shapes/Check";


const CameraPreview = ({ photo, retakePicture, savePhoto, setCapturedImage= ()=>{}, setImage = ()=>{}, setStartCamera = ()=>{}, setImageNumber=()=>{},setPreviewVisible = ()=>{} }) => {



    return (
            <View
                style={{
                  backgroundColor: "#D9D9D9",
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  zIndex: 10,
                }}
              >
                <View style={{backgroundColor: "#fff", width: '100%', height: 60, alignItems:"center",justifyContent:"center", justifyContent: "center", zIndex: 10,}}>
             
                  <Text style={{fontFamily: "PTSans-bold", fontSize:16}}> Presentation des images </Text>

                </View>
  
            <View style={{marginHorizontal: 30,  flex: 0.5, marginBottom: 20, marginTop: 8, position: "relative", zIndex: 10,}}>
              <View style={styles.textInfo}>
                <Check />
                <Text style={{fontSize: 12}}>image de dessus</Text>
              </View>

              <Image source={{ uri: photo[1]?.uri }} style={styles.image}/>

           </View>


           <View style={{marginHorizontal: 30,  flex: 0.5, marginBottom: 10, position: "relative", zIndex: 10,}}>
              <View style={styles.textInfo}>
                <Check />
                <Text style={{fontSize: 12}}>image de dessous</Text>
              </View>

              <Image source={{ uri: photo[1]?.uri }} style={styles.image}/>

           </View>
                
           <View style={{height: 89,backgroundColor: "#fff"}}>
            
              <View style={{backgroundColor: "#fff",marginHorizontal: 30, height: 89, marginBottom: -5, justifyContent: "space-between", alignItems: "center", flexDirection:"row"}}>
                  <TouchableOpacity onPress={()=>[setCapturedImage([]), setImage([]), setStartCamera(false), setImageNumber("Top image"),setPreviewVisible(false)]} style={{justifyContent: "center", alignItems: "center",  height:55, width: 54 ,backgroundColor: COLORS.black, borderRadius: 8}}>
                    <Icon
                      name="chevron-back-outline"
                      style={{ fontSize: 36, color: "#fff"}}
                    />
                  </TouchableOpacity>

                  <View style={{width: 266 }}>
                    <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.purple}]} onPress={savePhoto} activeOpacity={0.7}>
                      <Text style={styles.text}>Lancer l’analyse</Text>
                    </TouchableOpacity>
                  
                  </View>

              
              </View>
            </View>
              </View>
    );
  };

  export default CameraPreview;

  const styles = StyleSheet.create({
  
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

    textInfo:{
      backgroundColor: "#fff",
      borderRadius: 8,
      top: 20,
      width: 155, 
      height: 34,
      alignSelf: "center",
      marginBottom: 10, position: "absolute",
      zIndex: 10, 
      flexDirection: "row", 
      alignItems: "center", 
      justifyContent: "center", 
      gap: 10
    },

    image:{
      flex: 1,
      borderRadius: 8,
      objectFit: "contain"
    }

 
  });