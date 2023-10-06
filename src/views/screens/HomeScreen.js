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
  StatusBar
} from "react-native";
import Constants from "expo-constants";
import { Camera } from "expo-camera";
import COLORS from "../../const/colors";
import React, { useEffect, useState, useContext, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/Octicons";
import * as ImagePicker from "expo-image-picker";
import CameraPreview from "../components/CameraPreview";
import ImgContext from "../../hooks/ImgContext";
import HomeCarousel from "../components/HomeCarousel";
import Empty from "../../../assets/images/empty";
import Settings from "../../../assets/images/shapes/Settings";
import RBSheet from 'react-native-raw-bottom-sheet';
import Input from "../components/Input";

import CameraIcon from "../../../assets/images/shapes/Camera";
import GalerieIcon from "../../../assets/images/shapes/Galerie";
import Toast from "react-native-toast-message";
import Profil from "../../../assets/images/shapes/Profil";
import Logout from "../../../assets/images/shapes/Logout";
import Password from "../../../assets/images/shapes/Password";
import Email from "../../../assets/images/shapes/Email";





let camera;
export default function HomeScreen({ navigation }) {

  StatusBar.setBarStyle('dark-content');
  StatusBar.setBackgroundColor('#fff');

  const [inputs, setInputs] = useState({
    sample_name: "",
    depth: "",
    source: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const newAnalysis = useRef(null);
  const importModal = useRef(null);
  const settingsModal = useRef(null);
  const profileEditModal = useRef(null);

  const openBottomSheet = (ref) => {
    if (ref == newAnalysis) {
      
      newAnalysis.current.open();
      
    }else if(ref == importModal){

      newAnalysis.current.close();
      importModal.current.open();

    }else if(ref == settingsModal){

      settingsModal.current.open();

    }else if(ref == profileEditModal){

      settingsModal.current.close();
      profileEditModal.current.open();

    }
  };


  const closeBottomSheet = (ref) => {
    if (ref == newAnalysis) {
      
      newAnalysis.current.close();
      
    }else if(ref == importModal){
      
      importModal.current.close();

    }else if(ref == settingsModal){

      settingsModal.current.close();

    }else if(ref == profileEditModal){

      profileEditModal.current.close();

    }
  };



  const handleLogout = () =>{
    if (userData) {
      user = { ...userData, loggedIn: false };
      AsyncStorage.setItem("userData", JSON.stringify(user));
      navigation.navigate("LoginScreen");
    }
  }



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

const __DateFormatter = (dateString) =>{
  const [month, day, year] = dateString.split('/');
  const date = new Date(year, month - 1, day);
  const options = { year: 'numeric', month: 'long' };
  const formattedDate = `Depuis ${date.toLocaleDateString('fr-FR', options)}`;
  
  return formattedDate
}

const handleOnChange = (text, input) => {
  setInputs((prevState) => ({
    ...prevState,
    [input]: text,
  }));
};

const handleError = (error, input) => {
  setErrors((prevState) => ({
    ...prevState,
    [input]: error,
  }));
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
      closeBottomSheet(importModal)
      Toast.show({
        type: "error",
        text1: "Alerte",
        text2: "vous devez autoriser l'accès à l'appareil photo",
        position:"top"
      });
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
      }else{
        closeBottomSheet(importModal)
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


  <View style={styles.topContainer}>
           
            {/* <HomeCarousel/> */}

            <View style={{alignItems:"center",justifyContent:"center", flexDirection: "column", gap: 10}}>
              <TouchableOpacity style={styles.profilePic} onPress={pickImageProfile}>
                {
                  !imgProfile?
                
                
                <Text style={{fontSize: 28, color: "#fff", fontFamily: 'PTSans-regular',}}>
                  {userData && userData?.name?.charAt(0)}
                </Text>
                
                :
                  <Image
                    source={ {uri:imgProfile}}
                    style={styles.imageProfileSize}
                  />
                }
              </TouchableOpacity>

              <View style={{alignItems:"center",justifyContent:"center"}}>

                <Text style={{fontFamily: 'PTSans-regular', fontSize: 16 }}>
                  {userData?.name}
                </Text>

                <Text style={{fontSize: 12, color: "#A7A7A7", fontFamily: 'PTSans-regular', fontSize: 12 }}>
                  {userData?.date && __DateFormatter(userData?.date)}
                  </Text>
              </View>

            </View>

          </View>
          <View style={styles.middleContainer}> 
            <Empty/>

            <Text style={{fontSize: 14, lineHeight: 16,fontFamily: 'PTSans-regular', }}>
              Aucune analyse pour l’instant
            </Text>
          </View>

          <View style={styles.bottomContainer}> 

            <View style={{flex: 1,justifyContent: "space-between", alignItems: "center", flexDirection:"row", gap: 15}}>
                <TouchableOpacity onPress={() =>openBottomSheet(settingsModal)} style={{justifyContent: "center", alignItems: "center",  height:55, width: 54 ,backgroundColor: "#E6E6E6", borderRadius: 8}}>
                  <Settings/>
                </TouchableOpacity>

                <View style={{width: 266 }}>
                  <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.purple}]} onPress={() => openBottomSheet(newAnalysis)} activeOpacity={0.7}>
                    <Text style={styles.text}>Nouvelle analyse</Text>
                  </TouchableOpacity>
                
                </View>

              
              </View>
          </View>

          <RBSheet
            ref={newAnalysis}
            height={421}
            openDuration={250}
            closeOnDragDown={true}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20
              }
            }}
          >
            <Text style={{fontSize: 22, alignSelf: "center", fontFamily: 'PTSans-regular', fontWeight: 700}} 
            > Nouvelle Analyse
           </Text>

           <Text style={{fontSize: 14, textAlign: "center", fontFamily: 'PTSans-regular', marginHorizontal: 50, marginTop: 10}} 
            > Veuillez renseigner les informations ci - dessous
           </Text>


           <View style={{marginHorizontal: 30, marginTop: 20  }}>
            <Input
              label="Nom de l’echantillon"
              iconName="finger-print-outline"
              error={errors.sample_name}
              onFocus={() => {
                handleError(null,"sample_name");
              }}
              placeholder="Ecrivez ici..."
              onChangeText={(text)=>handleOnChange(text,"sample_name")}
            />

            <Input
              label="Profondeur"
              iconName="resize-outline"
              error={errors.depth}
              onFocus={() => {
                handleError(null,"depth");
              }}
              placeholder="Ecrivez ici..."
              onChangeText={(text)=>handleOnChange(text,"depth")}
            />

            <Input
              label="Provenance"
              iconName="location-outline"
              error={errors.source}
              onFocus={() => {
                handleError(null,"source");
              }}
              placeholder="Ecrivez ici..."
              onChangeText={(text)=>handleOnChange(text,"source")}
            />
            </View>

            <View style={{marginHorizontal: 30, marginTop: 10, justifyContent: "space-between", alignItems: "center", flexDirection:"row"}}>
              <TouchableOpacity onPress={() =>closeBottomSheet(newAnalysis)} style={{justifyContent: "center", alignItems: "center",  height:55, width: 54 ,backgroundColor: COLORS.black, borderRadius: 8}}>
                <Icon
                  name="chevron-back-outline"
                  style={{ fontSize: 36, color: "#fff"}}
                />
              </TouchableOpacity>

              <View style={{width: 266 }}>
                <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.purple}]} onPress={() => openBottomSheet(importModal)} activeOpacity={0.7}>
                  <Text style={styles.text}>Importer les images</Text>
                </TouchableOpacity>
              
              </View>

            
            </View>

          </RBSheet>


          <RBSheet
            ref={importModal}
            height={203}
            openDuration={250}
            closeOnDragDown={true}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20
              }
            }}
          >
            <Text style={{fontSize: 22, alignSelf: "center", fontFamily: 'PTSans-regular', fontWeight: 700}} 
            > Importer les images
           </Text>

           <Text style={{fontSize: 14, textAlign: "center", fontFamily: 'PTSans-regular', marginHorizontal: 50, marginTop: 10}} 
            > Par quel moyen souhaitez vous importer vos 2 images
           </Text>

           <View style={{marginHorizontal: 30, marginTop: 10, justifyContent: "space-between", alignItems: "center", flexDirection:"row", gap: 15}}>
              <TouchableOpacity onPress={() =>[closeBottomSheet(importModal), openBottomSheet(newAnalysis)]} style={{justifyContent: "center", alignItems: "center",  height:55, width: 54 ,backgroundColor: COLORS.black, borderRadius: 8}}>
                <Icon
                  name="chevron-back-outline"
                  style={{ fontSize: 36, color: "#fff"}}
                />
              </TouchableOpacity>

              <View style={{flex: 1,justifyContent: "space-around", alignItems: "center", flexDirection:"row", gap: 15 }}>
                <TouchableOpacity style={styles.import_button} onPress={__startCamera}>
                  <CameraIcon />
                  <Text style={{}}>Camera</Text>
                </TouchableOpacity>
              
                <TouchableOpacity style={styles.import_button} onPress={pickImage}>
                  <GalerieIcon />
                  <Text style={{}}>Galerie</Text>
                </TouchableOpacity>
              </View>

            
            </View>
    

          </RBSheet>


          <RBSheet
            ref={settingsModal}
            height={305}
            openDuration={250}
            closeOnDragDown={true}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20
              }
            }}
          >
            <Text style={{marginTop: 15,fontSize: 18, alignSelf: "center", fontFamily: 'PTSans-regular', fontWeight: 700}} 
            > Options
           </Text>

     
              <View style={{marginHorizontal: 30,flex: 1,justifyContent: "center", alignItems: "center", gap: 10 }}>
                <TouchableOpacity style={styles.option_button} onPress={()=>openBottomSheet(profileEditModal)}>
                  <Profil />
                  <Text style={{}}>Editer votre profil</Text>
                </TouchableOpacity>
              
                <TouchableOpacity style={styles.option_button} onPress={()=>handleLogout()}>
                  <Logout />
                  <Text style={{}}>Vous deconnecter</Text>
                </TouchableOpacity>
              

                <TouchableOpacity onPress={() => closeBottomSheet(settingsModal)} style={{marginTop: 10,width:"100%", justifyContent: "center", alignItems: "center",  height:54,backgroundColor: COLORS.black, borderRadius: 8}}>
                  <Text style={{color: "#fff"}}>Retour</Text>
                </TouchableOpacity>
             
              </View>

          </RBSheet>

          <RBSheet
            ref={profileEditModal}
            height={373}
            openDuration={250}
            closeOnDragDown={true}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20
              }
            }}
          >
            <Text style={{marginTop: 15,fontSize: 18, alignSelf: "center", fontFamily: 'PTSans-regular', fontWeight: 700}} 
            > Edition du profil
           </Text>

     
              <View style={{marginHorizontal: 30,flex: 1,justifyContent: "center", alignItems: "center", gap: 10 }}>
                <TouchableOpacity style={styles.option_button} onPress={()=>{}}>
                  <Profil />
                  <Text style={{}}>Editer le nom d’utilisateur</Text>
                </TouchableOpacity>
              
                <TouchableOpacity style={styles.option_button} onPress={()=>{}}>
                  <Password />
                  <Text style={{}}>Editer le mot de passe</Text>
                </TouchableOpacity>
              
                <TouchableOpacity style={styles.option_button} onPress={()=>{}}>
                  <Email />
                  <Text style={{}}>Editer l’addresse email</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => [closeBottomSheet(profileEditModal), openBottomSheet(settingsModal)]} style={{marginTop: 10,width:"100%", justifyContent: "center", alignItems: "center",  height:54,backgroundColor: COLORS.black, borderRadius: 8}}>
                  <Text style={{color: "#fff"}}>Retour</Text>
                </TouchableOpacity>
             
              </View>

          </RBSheet>
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
  import_button:{
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 53,
    backgroundColor: "#F2F2F2",
    flex: 0.5,
    flexDirection: "row",
    borderRadius: 8,
    
  },

  option_button:{
    height: 59,
    width:"100%",
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    gap: 15,
    paddingLeft: 20
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
  middleContainer: {
    flex: 0.75,
    backgroundColor: "#D9D9D95E",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    gap: 20,
  },
  bottomContainer: {
    /* flex: 0.2, */
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  imageProfileSize: {
    height: 80,
    width: 80,
    borderRadius: 80,
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
