import {
    Text,
    View,
    TouchableOpacity,
    Image,
    StatusBar,
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
                
           
        
      
                      <TouchableOpacity
                        onPress={savePhoto}
                        style={{
                          width: "100%",
                          height: 50,
                          backgroundColor: COLORS.purple,
                          alignItems: "center",
                          justifyContent:"center",
                         
                        }}
                      >
                        <Text
                          style={{
                            color: COLORS.white,
                            fontWeight:"bold",
                            fontSize: 20,
                          }}
                        >
                          Submit
                        </Text>
                      </TouchableOpacity>
              </View>
    );
  };

  export default CameraPreview;