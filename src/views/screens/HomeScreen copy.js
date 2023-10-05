import {
  useWindowDimensions,
  Animated,
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import Constants from "expo-constants";
import { Camera } from "expo-camera";
import COLORS from "../../const/colors";
import React, { useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/Octicons";
import * as ImagePicker from "expo-image-picker";
import CameraPreview from "../components/CameraPreview";
import ImgContext from "../../hooks/ImgContext";
import HomeCarousel from "../components/HomeCarousel";
import Empty from "../../../assets/images/empty";




let camera;
export default function HomeScreen({ navigation }) {
  const [imgProfile,setImgProfile] = useState(null);

const __loadUserProfile = async ()=>{
  try{
    let profileUri = await AsyncStorage.getItem("profileUri");
    if(profileUri){
      setImgProfile(profileUri);
    }
   
  }catch{
  }
 
};

  useEffect(() => {__loadUserProfile()},[]);

  const { setImg } = useContext(ImgContext);

  const [imageNumber, setImageNumber] = useState("Top image");
  /*********************************************************/
  const [startCamera, setStartCamera] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState([]);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState("off");

  const { width, height } = useWindowDimensions();

  const [rotateAnimation, setRotateAnimation] = useState(new Animated.Value(0));

  const handleAnimation = () => {
    Animated.timing(rotateAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      rotateAnimation.setValue(0);
    });
  };

  const interpolateRotating = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const animatedStyle = {
    textAlign: "center",
    transform: [
      {
        rotate: interpolateRotating,
      },
    ],
  };

  const __startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();

    if (status === "granted") {
      setStartCamera(true);
    } else {
      Alert.alert("Access denied");
    }
  };
  const __takePicture = async () => {
    const options = { quality: 1, width: 6048, height: 4024 };

    const photo = await camera.takePictureAsync(options);

    let temponPicture = capturedImage;

    temponPicture.push(photo);

    setCapturedImage(temponPicture);

    if (temponPicture.length >= 2) {
      setPreviewVisible(true);
    }

    if (temponPicture.length >= 1) {
      setImageNumber("Bottom image");
    }
  };

  function __savePhoto(picture) {
    setImg(picture);
    navigation.navigate("TensorScreen");
  }

  const __retakePicture = () => {
    setCapturedImage([]);
    setPreviewVisible(false);
    __startCamera();
  };
  const __handleFlashMode = () => {
    if (flashMode === "on") {
      setFlashMode("off");
    } else if (flashMode === "off") {
      setFlashMode("on");
    } else {
      setFlashMode("auto");
    }
  };
  const __switchCamera = () => {
    rotate();
    if (cameraType === "back" || cameraType === 0) {
      setCameraType("front");
    } else {
      setCameraType("back");
    }
  };

  const rotate = async () => {
    handleAnimation();
  };

  /********************************************************/
  const [image, setImage] = useState([]);

  const pickImageProfile = async () => {
    let profileImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.photo,
      quality: 1,
    }); 
    if (!profileImage.canceled) {
      setImgProfile(profileImage.assets[0].uri);
      AsyncStorage.setItem("profileUri",profileImage.assets[0].uri);
    }
   
  }

  const pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.photo,
      quality: 1,
    });

    if (!result.canceled) {
      setImage([result.assets[0]]);

      let temponPicture = image;

      temponPicture.push(result.assets[0]);

      setImage(temponPicture);

      if (temponPicture.length < 2) {
        pickImage();
      }
    }
  };

  useEffect(()=>{
    if (image.length == 3) {
      setImage((image)=> ([image[2]]))
      pickImage();
      console.log(image);
    }
  },[image])

  /*******************************************************/
  const [userData, setUserData] = useState({});

  const userInfo = async () => {
    let user = await AsyncStorage.getItem("userData");
    user = JSON.parse(user);
    setUserData(user);
  };
  useEffect(() => {
    userInfo();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {startCamera ? (
        <View
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: "#000",
          }}
        >
          {previewVisible && capturedImage.length == 2 ? (
            <CameraPreview
              photo={capturedImage}
              savePhoto={() => __savePhoto(capturedImage)}
              retakePicture={__retakePicture}
              setCapturedImage={setCapturedImage}
              setStartCamera={setStartCamera}
              setImageNumber={setImageNumber}
              setPreviewVisible={setPreviewVisible}
            />
          ) : (
            <View
              style={{
                flex: 1,
                width: "100%",
              }}
            >
              <View
                style={{
                  height: height / 9,
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <TouchableOpacity style={{position: "absolute",left:0}} onPress={()=>[setStartCamera(false), setImage([]), setStartCamera(false), setImageNumber("Top image"),setPreviewVisible(false)]} >
                  <Icon
                  name="arrow-back-outline"
                  style={{ fontSize: 35, color: COLORS.white, left: 10}}
                  />
                  </TouchableOpacity>
                <View
                  style={{
                    color: COLORS.white,
                    borderWidth: 1,
                    borderColor: COLORS.white,
                    borderRadius: 30,
                    width: 130,
                    height: 35,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                    }}
                  >
                    {imageNumber}
                  </Text>
                </View>
              </View>
              <Camera
                type={cameraType}
                flashMode={flashMode}
                style={{ width: width, height: (2 / 3) * height }}
                ref={(r) => {
                  camera = r;
                }}
              >
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    backgroundColor: "transparent",
                    flexDirection: "row",
                  }}
                ></View>
              </Camera>

              <View
                style={{
                  width:width,
                  height:height-2/3*height-1/9*height,
                  backgroundColor: "black",
                }}
              >
                <View
                  style={{
                    backgroundColor: "black",
                    flexDirection:"row",
                    gap:70,
                    justifyContent:"center",
                  paddingTop:20,
                    flex: 1,
                    width: width,
                  }}
                >
  
                    <TouchableOpacity
                      onPress={__switchCamera}
                      style={{
                        borderRadius: 60,
                        height: 60,
                        width: 60,
                      }}
                    >
                      <Animated.Text style={animatedStyle}>
                        <Icon2
                          name="issue-reopened"
                          style={{ fontSize: 50, color: "#fff", flex: 1 }}
                        />
                      </Animated.Text>
                    </TouchableOpacity>

                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: 80,
                        height: 80,
                        bottom: 0,
                        borderRadius: 50,
                        backgroundColor: "transparent",
                        borderWidth: 3,
                        borderColor: "white",
                      }}
                    >
                      <TouchableOpacity
                        onPress={__takePicture}
                        style={{
                          width: 60,
                          height: 60,
                          bottom: 0,
                          borderRadius: 50,
                          backgroundColor: "#fff",
                        }}
                      />
                    </View>

                    <TouchableOpacity
                      onPress={__handleFlashMode}
                      style={{
                        width: 60,
                        height: 60,
                      }}
                    >
                      {flashMode === "off" ? (
                        <Icon
                          name="flash-off-outline"
                          style={{ fontSize: 50, color: "#fff" }}
                        />
                      ) : (
                        <Icon
                          name="flash-outline"
                          style={{ fontSize: 50, color: "#fff" }}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
              </View>
            </View>
          )}
        </View>
      ) : (
        <>
          {image.length == 2 && (
            <CameraPreview
              photo={image}
              savePhoto={() => __savePhoto(image)}
              retakePicture={()=> setImage([])}
              setImage={setImage}
            />
          )}

{image.length != 2 && <View style={{elevation: 1.5,width: '100%', height: 60, alignItems:"center",justifyContent:"center",  backgroundColor: COLORS.white, justifyContent: "center", zIndex: 10, borderBottomWidth: 1, borderColor: COLORS.light}}>
        
                  <Text style={{fontSize:20, fontFamily: 'poppins-semiBold', paddingTop: 10}}> Grading HST </Text>

                  <TouchableOpacity style={{position: "absolute",right:0}}  >
                  <Icon
                  name="person-circle-outline"
                  style={{ fontSize: 35, color: COLORS.purple, right: 10}}
                  />
                  </TouchableOpacity>
                </View>}

  <View style={styles.topContainer}>
           
            {/* <HomeCarousel/> */}

            <View style={{alignItems:"center",justifyContent:"center", flexDirection: "column", gap: 10}}>
              <TouchableOpacity style={styles.profilePic}>
                <Text style={{fontSize: 26, color: "#fff"}}>
                  AS
                </Text>
              </TouchableOpacity>

              <View style={{alignItems:"center",justifyContent:"center"}}>

                <Text>
                  Afrographix Studio
                </Text>

                <Text style={{fontSize: 12, color: "#A7A7A7"}}>
                  Depuis janvier 2023
                  </Text>
              </View>

            </View>

          </View>
          <View style={styles.bottomContainer}> 
          <Text style={{fontWeight:"600", fontSize:20, fontFamily: 'poppins-regular', marginTop: -20}}> Welcome, {userData?.name} </Text>
            <Text style={{fontFamily: 'poppins-regular',color: COLORS.black, fontSize: 13, fontWeight: 500, textAlign: "center"}}>
              Choose the image import method
            </Text>
            <TouchableOpacity style={styles.camera} onPress={__startCamera}>
              <View style={styles.cameraText}>
                <Text style={styles.textName}>CAMERA</Text>
                <Text
                  style={{
                    color: COLORS.light , fontFamily: "poppins-regular",
                  }}
                >
                  Take pictures
                </Text>
              </View>
              <Image
                source={require("../../../assets/images/camera.png")}
                style={styles.imageCameraSize}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.galerie} onPress={pickImage}>
              <View style={styles.cameraText}>
                <Text style={[styles.textName, { color: COLORS.purple }]}>
                  IMPORT
                </Text>
                <Text
                  style={{
                    color: COLORS.black , fontFamily: "poppins-regular",
                  }}
                >
                  Load pictures
                </Text>
              </View>
              <Image
                source={require("../../../assets/images/Import.png")}
                style={{ height: 80, width: 80 }}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  profilePic:{
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#0072F7",
    borderRadius: 100,
    backgroundColor: "#0072F7"

  },




  elipse:{
    resizeMode: "contain",
    position: "absolute",
    zIndex: 9
  },
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    marginTop: Constants.statusBarHeight,
  },
  topContainer: {
    flex: 0.25,
    alignItems: "center",
    justifyContent: "center",
    /* backgroundColor: COLORS.purple, */
  },
  bottomContainer: {
    flex: 0.65,
    backgroundColor: "#D9D9D95E",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    gap: 40,
  },
  infoProfileTop: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flex: 0.7,
    paddingTop: "40%",
  },
  imageProfileSize: {
    height: 120,
    width: 120,
    borderRadius: 150,
    backgroundColor: COLORS.light,
  },
  textName: {
    fontSize: 26,
    color: COLORS.white,
    fontFamily: "poppins-regular",
  },
  infoProfileBottom: {
    flex: 0.3,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  detailProfile: {
    height: 70,
    flex: 0.4,
    backgroundColor: "rgb(135,125,214)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  textProfile: {
    fontSize: 22,
    color: COLORS.white,
  },
  textProfileUser: {
    fontSize: 10,
    fontFamily: "poppins-regular",
    color: COLORS.white,
  },
  camera: {
    flexDirection: "row",
    /* flex: 0.35, */
    width: "80%",
    borderRadius: 10,
    backgroundColor: COLORS.grey,
    alignItems: "center",
    justifyContent: "space-around",
  },
  galerie: {
    flexDirection: "row",
    /* flex: 0.35, */
    width: "80%",
    borderRadius: 10,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "space-around",
  },
  imageCameraSize: {
    height: 90,
    width: 90,
  },
  cameraText: {
    flex: 0.6,
    height: 100,
    gap: 20,
    paddingVertical: 10,
  },
});
