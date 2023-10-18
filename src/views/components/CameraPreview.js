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


const CameraPreview = ({ photo, retakePicture, savePhoto, setCapturedImage= ()=>{}, setImage = ()=>{}, setStartCamera = ()=>{}, setImageNumber=()=>{},setPreviewVisible = ()=>{} }) => {



    return (
            <View
                style={{
                  backgroundColor: COLORS.black,
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  zIndex: 10,
                }}
              >
                <View style={{width: '100%', height: 60, alignItems:"center",justifyContent:"center",  backgroundColor: COLORS.black, justifyContent: "center", zIndex: 10,}}>
                  <TouchableOpacity style={{position: "absolute",left:0}} onPress={()=>[setCapturedImage([]), setImage([]), setStartCamera(false), setImageNumber("Top image"),setPreviewVisible(false)]} >
                  <Icon
                  name="close-outline"
                  style={{ fontSize: 35, color: COLORS.purple, left: 10}}
                  />
                  </TouchableOpacity>
                  <Text style={{fontWeight:"600", fontSize:20, color: COLORS.white}}> Images preview </Text>

                  <TouchableOpacity style={{position: "absolute",right:0}} onPress={()=>retakePicture()} >
                  <Icon
                  name="reload-outline"
                  style={{ fontSize: 30, color: COLORS.purple, right:10}}
                  />
                  </TouchableOpacity>
                </View>
  
             <Carousel imageTop={photo[0]} imageBottom={photo[1]}/>
                

             <View style={{backgroundColor,marginHorizontal: 30, marginTop: 20, justifyContent: "space-between", alignItems: "center", flexDirection:"row"}}>
                <TouchableOpacity onPress={() =>[closeBottomSheet(passwordEditModal), openBottomSheet(profileEditModal)]} style={{justifyContent: "center", alignItems: "center",  height:55, width: 54 ,backgroundColor: COLORS.black, borderRadius: 8}}>
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

 
  });