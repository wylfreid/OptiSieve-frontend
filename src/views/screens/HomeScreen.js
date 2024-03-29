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
  StatusBar,
  Keyboard,
  ScrollView,
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
import Loader from "../components/Loader";

import CameraIcon from "../../../assets/images/shapes/Camera";
import GalerieIcon from "../../../assets/images/shapes/Galerie";
import Toast from "react-native-toast-message";
import Profil from "../../../assets/images/shapes/Profil";
import Logout from "../../../assets/images/shapes/Logout";
import Password from "../../../assets/images/shapes/Password";
import Email from "../../../assets/images/shapes/Email";
import UseAuth from "../../custom-hooks/useAuth";



import {EmailAuthProvider, reauthenticateWithCredential, signOut, updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../firebase.config";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { CommonActions } from "@react-navigation/native";
import { doc, updateDoc } from "firebase/firestore";



import { useDispatch, useSelector } from 'react-redux';
import { userActions } from "../../redux/slices/userSlice";
import useGetData from "../../custom-hooks/useGetData";
import { imgActions } from "../../redux/slices/imgSlice";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import CardAnalysis from "../components/CardAnalysis";
import TextArea from "../components/TextArea";
import { Entypo  } from '@expo/vector-icons';

import { ExpoImageManipulator } from 'react-native-expo-image-cropper'


let camera;
export default function HomeScreen({ navigation }) {

  const { currentUser} = UseAuth();

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  

  const {data: users} = useGetData("users")

  const {data: analysisData, load} = useGetData("analysis")

  const [analysis, setAnalysis] = useState([]);

  const [analysisToRate, setAnalysisToRate] = useState(null);

  const handleOpenRate = (item) => {
    setAnalysisToRate(item)
    setRating(item?.rating || 0)
    handleOnChange(item?.comment || "","comment")
    openBottomSheet(rateModal)
  };



  const handleRate = async () => {

    if (rating > 0) {
      
      try {
        await updateDoc(doc(db, "analysis", analysisToRate?.id), {
          rating: rating,
          comment: inputs?.comment
        });
  
        closeBottomSheet(rateModal)
        
      } catch (error) {
        console.log(error);
      }
    }
    
    
  };

  useEffect(()=>{

    if(analysisData?.length > 0 && user?.uid){
      let result = analysisData.filter(
      (item) => item.user_id === user.uid
    );

    result.sort((a, b) => {
      if (!a.createdAt === 0 && !b.createdAt) {
        return 0;
      } else if (!a.createdAt) {
        return 1;
      } else if (!b.createdAt) {
        return -1;
      } else {
        const aDate = new Date(a.createdAt.toDate())
        const bDate = new Date(b.createdAt.toDate())
        
        return  bDate - aDate;
      }
    });

    setAnalysis(result)}

  },[analysisData, user])

  useEffect(()=>{

    const getUserData = () =>{

      if (users?.length > 0){
        let result = []
        result = users?.filter(
          (item) => item?.uid === currentUser?.uid
        );

        dispatch(userActions.addUser(result[0]))
      }
    }

    getUserData()
    
  },[users, currentUser])
  
  //console.log(users?.length);

  StatusBar.setBarStyle('dark-content');
  StatusBar.setBackgroundColor('#fff');

  const [inputs, setInputs] = useState({
    sample_name: "",
    depth: "",
    source: "",

    displayName: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    newPasswordConfirm: "",

    comment: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const newAnalysis = useRef(null);
  const importModal = useRef(null);
  const settingsModal = useRef(null);
  const profileEditModal = useRef(null);
  const nameEditModal = useRef(null);
  const passwordEditModal = useRef(null);
  const emailEditModal = useRef(null);

  const rateModal = useRef(null);

  const openBottomSheet = (ref) => {
    if (ref == newAnalysis) {
      
      newAnalysis.current?.open();
      
    }else if(ref == importModal){

      importModal.current?.open();
      newAnalysis.current?.close();

    }else if(ref == settingsModal){

      settingsModal.current?.open();

    }else if(ref == profileEditModal){

      settingsModal.current?.close();
      profileEditModal.current?.open();

    }else if(ref == nameEditModal){

      profileEditModal.current?.close();
      nameEditModal.current?.open();

    }else if(ref == passwordEditModal){

      profileEditModal.current?.close();
      passwordEditModal.current?.open();

    }else if(ref == emailEditModal){

      profileEditModal.current?.close();
      emailEditModal.current?.open();

    }else if(ref == rateModal){

      rateModal.current?.open();

    }
  };

 

  const closeBottomSheet = (ref) => {
    if (ref == newAnalysis) {
      
      newAnalysis.current?.close();
      
    }else if(ref == importModal){
      
      importModal.current?.close();

    }else if(ref == settingsModal){

      settingsModal.current?.close();

    }else if(ref == profileEditModal){

      profileEditModal.current?.close();

    }else if(ref == nameEditModal){

      nameEditModal.current?.close();

    }else if(ref == passwordEditModal){

      passwordEditModal.current?.close();

    }else if(ref == emailEditModal){

      emailEditModal.current?.close();

    }else if(ref == rateModal){

      rateModal.current?.close();

    }
  };

  const closeAllBottomSheet = (ref) =>{
    newAnalysis.current?.close();
    importModal.current?.close();
    settingsModal.current?.close();
    profileEditModal.current?.close();
    nameEditModal.current?.close();
    passwordEditModal.current?.close();
    emailEditModal.current?.close();
  }

  const validate = (field, value) => {

    Keyboard.dismiss();

    if (user) {
    
      let isValid = true;

      

      if (Array.isArray(field) && Array.isArray(value)) {
       
        for (let index = 0; index < field.length; index++) {


          if (field[index] == "newPasswordConfirm"  && inputs[field[index]] != inputs.newPassword) {
            handleError("Le mot de passe est différent", "newPasswordConfirm");
            isValid = false;
          }

          if (!inputs[field[index]]) {
            handleError(`Veuillez remplir ce champ`, field[index]);
            isValid = false;
          }
          
        }

        field = "password"
        value = value[value.length - 1]
        
      }else{

        
        
        if (field == "email" && !inputs.email.match(/\S+@\S+\.\S+/)) {
          handleError("Veuillez saisir un email valide", "email");
          isValid = false;
        }

        if (inputs[field]?.length == 0) {
          handleError(`Veuillez remplir ce champ`, field);
          isValid = false;
        }
      }

      if (isValid) {
        update(field,value);
      }
    }
  };

  const update = async (field,value) =>{
    setLoading(true);
    closeAllBottomSheet()

      try {


      if (field == "password") {
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          inputs?.oldPassword
        );

    
        reauthenticateWithCredential(currentUser,credential)
          .then(() => {
            return updatePassword(currentUser,inputs?.newPassword);
          })
          .then(() => {
            console.log('Mot de passe mis à jour avec succès.');
            
            Toast.show({
              type: "success",
              text1: "Succès",
              text2: "Les modifications on été enregistrées",
              position:"top"
            });
          })
          .catch((error) => {
            console.error('Erreur lors de la mise à jour du mot de passe :', error);
            Toast.show({
              type: "error",
              text1: "Erreur de connection",
              text2: "le mot de passe actuel ne correspond pas, veuillez réessayer.",
              position:"top"
            });
          });
      }else if(field == "displayName"){
        await updateDoc(doc(db, "users", user?.uid), {
          displayName: inputs.displayName,
        });
        Toast.show({
          type: "success",
          text1: "Succès",
          text2: "Les modifications on été enregistrées",
          position:"top"
        });
      }else if(field == "email"){
        updateEmail(currentUser,inputs?.email);
        await updateDoc(doc(db, "users", currentUser?.uid), {
          email: inputs.email,
        }); 

        Toast.show({
          type: "success",
          text1: "Succès",
          text2: "Les modifications on été enregistrées",
          position:"top"
        });
      }

      setLoading(false);
      

      }catch (error) {
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "Erreur de connection",
          text2: "une erreur inattendue s'est produite, veuillez réessayer.",
          position:"top"
        });
      }
  }


  const handleLogout = () =>{
    signOut(auth).then( async () => {
      // Sign-out successful.

      await AsyncStorage.setItem("loggedIn", "false");

      navigation.dispatch(
        CommonActions.reset({
          index: 0, // Indiquez l'index de l'écran que vous souhaitez garder (0 pour conserver le premier écran).
          routes: [
            // Liste des écrans que vous souhaitez conserver après la réinitialisation.
            { name: 'LoginScreen' },
          ],
        })
      );
      Toast.show({
        type: "success",
        text1: "Succès",
        text2: "Vous avez été déconnecté avec succès",
        position:"top"
      });
      navigation.navigate("LoginScreen");
    }).catch((error) => {
      // An error happened.
      Toast.show({
        type: "error",
        text1: "Erreur de connection",
        text2: "une erreur inattendue s'est produite, veuillez réessayer.",
        position:"top"
      });
    });
      
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


  
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("camera");
  const [uri, setUri] = useState("");

  const onToggleModal = () => {
    setShowModal(!showModal)
  }

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
    const options = { quality: 1, width: 4016, height: 4016 };

    const photo = await camera.takePictureAsync(options);

    setUri(photo.uri)
    setStartCamera(false)
    onToggleModal()
  };

  const pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.photo,
      quality: 1,
    });

    if (!result.canceled) {

      setUri(result.assets[0]?.uri)
      onToggleModal()

    }
  };

  const __editPic = (photo) => {

    let temponPicture = capturedImage;

    temponPicture.push(photo);

    setCapturedImage(temponPicture);

    if (temponPicture.length >= 2) {
      closeBottomSheet(importModal)
      setPreviewVisible(true);
    }else{
      openBottomSheet(importModal)
    }

    if (temponPicture.length >= 1) {
      setImageNumber("Bottom image");
    }
  };

  async function __savePhoto(picture) {
    
    dispatch(imgActions.addImages(picture))
    
    await AsyncStorage.setItem("newAnalysis_infos", JSON.stringify({sample_name : inputs.sample_name, depth: inputs.depth, source: inputs.source}));
    navigation.navigate("TensorScreen");
  }

  
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

  const [imgProfile, setImgProfile] = useState(null);

  useEffect(()=>{
    if (currentUser) {
      setImgProfile(currentUser?.photoURL)
    }
  }, [currentUser])

  const pickImageProfile = async () => {
    let profileImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    }); 
    if (!profileImage.canceled) {
      try {

        const response = await fetch(profileImage.assets[0]?.uri);
        const blob = await response.blob();

        const storageRef = ref(storage, `images/${Date.now() + currentUser?.displayName}`);
    
        const uploadTask = uploadBytesResumable(storageRef, blob).then(
          
          () => {
            getDownloadURL(storageRef).then(async (downloadURL) => {
              //update user profile
              await updateProfile(currentUser, {
                photoURL: downloadURL,
              });

            });
          }
          
        );

        setImgProfile(profileImage.assets[0]?.uri)
      } catch (error) {
        console.log(error);
      }
     
    }
   
  }


  const handleInitAnalyse = () => {
    let isValid = true;

    if (inputs.sample_name?.length == 0) {
      handleError(`Veuillez remplir ce champ`, "sample_name");
      isValid = false;
    }

    if (inputs.depth?.length == 0) {
      handleError(`Veuillez remplir ce champ`, "depth");
      isValid = false;
    }

    if (inputs.source?.length == 0) {
      handleError(`Veuillez remplir ce champ`, "source");
      isValid = false;
    }

    if (isValid) {
      openBottomSheet(importModal)
    }

  };

  
  const [rating, setRating] = useState(0); 

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={styles.starContainer}
        >
          <Entypo 
            name={'star'}
            size={46}
            color={i <= rating ? 'gold' : '#C5C5C5'}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  function __retakePicture() {
    setStartCamera(false)
    setCapturedImage([]);
    setPreviewVisible(false);
    setImageNumber("Top image")
    openBottomSheet(importModal)
    console.log("test");
  };


  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      {startCamera ? (
        <View
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: "#000",
          }}
        >
          {!showModal &&<View
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
                      marginBottom: 50
                    }}
                  >
                    <TouchableOpacity style={{ position: "absolute", left: 0 }} onPress={() => __retakePicture()}>
                      <Icon
                        name="arrow-back-outline"
                        style={{ fontSize: 35, color: COLORS.white, left: 10 }} />
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
                      ratio="1:1"
                      type={cameraType}
                      flashMode={flashMode}
                      style={{ width: width, height: width }}
                      ref={(r) => {
                        camera = r;
                      } }
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
                      width: width,
                      flex: 1,
                      
                      backgroundColor: "black",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "black",
                        flexDirection: "row",
                        gap: 70,
                        justifyContent: "center",
                        paddingTop: 20,
                        flex: 1,
                        alignItems: "flex-end",
                        marginBottom: 20,
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
                            style={{ fontSize: 50, color: "#fff", flex: 1 }} />
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
                          }} />
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
                            style={{ fontSize: 50, color: "#fff" }} />
                        ) : (
                          <Icon
                            name="flash-outline"
                            style={{ fontSize: 50, color: "#fff" }} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>}
        </View>
      ) : (
        <>

          {showModal && capturedImage.length < 2 && <View
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ExpoImageManipulator
                  photo={{uri}}
                  isVisible={showModal}
                  onPictureChoosed={(data) => {
                    __editPic(data);
                  } }
                  onToggleModal={() => onToggleModal()}
                  saveOptions={{
                    compress: 1,
                    format: 'png',
                    base64: true,
                  }} />

              </View>}

                  

          {capturedImage.length >= 2 && (

            <CameraPreview
              photo={capturedImage}
              savePhoto={() => __savePhoto(capturedImage)}
              retakePicture={__retakePicture}
            />
          )}

                


  <View style={styles.topContainer}>
           
            {/* <HomeCarousel/> */}

            <View style={{alignItems:"center",justifyContent:"center", flexDirection: "column", gap: 10}}>
              <TouchableOpacity style={styles.profilePic} onPress={pickImageProfile}>
                {
                  !imgProfile ?
                
                
                <Text style={{fontSize: 28, color: "#fff", fontFamily: 'PTSans-regular',}}>
                  {user && user?.displayName?.charAt(0)}
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
                  {user?.displayName}
                </Text>

                <Text style={{fontSize: 12, color: "#A7A7A7", fontFamily: 'PTSans-regular', fontSize: 12 }}>
                  {user?.date && "Depuis " + format(user?.date?.toDate(), "MMMM yyyy", { locale: fr })}
                  </Text>
              </View>

            </View>

    </View>

          { analysis?.length > 0 &&
              <View style={{ width: "100%", backgroundColor: "#fff", paddingBottom: 13 }}>
                <Text style={{ fontSize: 16, fontFamily: 'PTSans-bold', textAlign: "center" }}>
                  {analysis?.length} Analyse{analysis?.length > 1 && "s"}
                </Text>
              </View>
          }

          <View style={{ elevation: 2,height: 0.3,width: "100%", backgroundColor: "#fff"}}></View>
          

          <View style={styles.middleContainer}> 
            { analysis?.length == 0 ?
              <><Empty /><Text onPress={()=>{navigation.navigate("TestScreen")}} style={{ fontSize: 14, lineHeight: 16, fontFamily: 'PTSans-regular', }}>
                Aucune analyse pour l’instant
              </Text></>
              
              : 
                <ScrollView>
                  {analysis?.map((item, index)=>(
                    <CardAnalysis key={index} item ={{...item}} handleOpenRate={()=> handleOpenRate(item)} navigation={navigation} />
                  ))}
                </ScrollView>
              }
          </View>

          <View style={styles.bottomContainer}> 

            <View style={{marginHorizontal: 30,flex: 1,justifyContent: "space-between", alignItems: "center", flexDirection:"row", gap: 15}}>
                <TouchableOpacity onPress={() =>openBottomSheet(settingsModal)} style={{justifyContent: "center", alignItems: "center",  height:55, width: 54 ,backgroundColor: "#E6E6E6", borderRadius: 8}}>
                  <Settings/>
                </TouchableOpacity>

                <View style={{flex: 1}}>
                  <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.purple}]} onPress={() => openBottomSheet(newAnalysis)} activeOpacity={0.7}>
                    <Text style={styles.text}>Nouvelle analyse</Text>
                  </TouchableOpacity>
                
                </View>

              
              </View>
          </View>

          <RBSheet
            ref={newAnalysis}
            height={441}
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


           <ScrollView contentContainerStyle={{paddingTop: 35,paddingBottomBottom: 35, marginHorizontal: 30}}>
            <Input
              label="Nom de l’echantillon"
              iconName="finger-print-outline"
              error={errors.sample_name}
              onFocus={() => {
                handleError(null,"sample_name");
              }}
              placeholder="Ecrivez ici..."
              onChangeText={(text)=>handleOnChange(text,"sample_name")}
              value={inputs.sample_name}
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
              value={inputs.depth}
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
              value={inputs.source}
            />
            <View style={{gap: 15,marginTop: 20, justifyContent: "space-between", alignItems: "center", flexDirection:"row"}}>
              <TouchableOpacity onPress={() =>closeBottomSheet(newAnalysis)} style={{justifyContent: "center", alignItems: "center",  height:55, width: 54 ,backgroundColor: COLORS.black, borderRadius: 8}}>
                <Icon
                  name="chevron-back-outline"
                  style={{ fontSize: 36, color: "#fff"}}
                />
              </TouchableOpacity>

              <View style={{flex: 1 }}>
                <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.purple}]} onPress={() => handleInitAnalyse()} activeOpacity={0.7}>
                  <Text style={styles.text}>Importer les images</Text>
                </TouchableOpacity>
              
              </View>

            
            </View>
            </ScrollView>


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
            > Par quel moyen souhaitez vous importer l'image du {imageNumber == "Top image" ? "dessus" : "dessous"}
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
                <TouchableOpacity style={styles.option_button} onPress={()=>openBottomSheet(nameEditModal)}>
                  <Profil />
                  <Text style={{}}>Editer le nom d’utilisateur</Text>
                </TouchableOpacity>
              
                <TouchableOpacity style={styles.option_button} onPress={()=>openBottomSheet(passwordEditModal)}>
                  <Password />
                  <Text style={{}}>Editer le mot de passe</Text>
                </TouchableOpacity>
              
                <TouchableOpacity style={styles.option_button} onPress={()=>openBottomSheet(emailEditModal)}>
                  <Email />
                  <Text style={{}}>Editer l’adresse email</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => [closeBottomSheet(profileEditModal), openBottomSheet(settingsModal)]} style={{marginTop: 10,width:"100%", justifyContent: "center", alignItems: "center",  height:54,backgroundColor: COLORS.black, borderRadius: 8}}>
                  <Text style={{color: "#fff"}}>Retour</Text>
                </TouchableOpacity>
             
              </View>

          </RBSheet>

          <RBSheet
            ref={nameEditModal}
            height={290}
            openDuration={250}
            closeOnDragDown={true}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20
              }
            }}
          >
            <Text style={{marginTop: 10,fontSize: 16, alignSelf: "center", fontFamily: 'PTSans-regular', fontWeight: 700}} 
            > Edition du nom d’utilisateur
           </Text>

           <Text style={{fontSize: 14, textAlign: "center", fontFamily: 'PTSans-regular', marginHorizontal: 50, marginTop: 10}} 
            > Veuillez renseigner votre nouveau nom
           </Text>


           <View style={{marginHorizontal: 30, marginTop: 20  }}>
            <Input
              label="Nom d’utilisateur"
              iconName="person-outline"
              error={errors.displayName}
              onFocus={() => {
                handleError(null,"displayName");
              }}
              placeholder="Ecrivez ici..."
              onChangeText={(text)=>handleOnChange(text,"displayName")}
              value={inputs?.displayName}
            />
            </View>

            <View style={{gap: 15,marginHorizontal: 30, marginTop: 20, justifyContent: "space-between", alignItems: "center", flexDirection:"row"}}>
              <TouchableOpacity onPress={() =>[closeBottomSheet(nameEditModal), openBottomSheet(profileEditModal)]} style={{justifyContent: "center", alignItems: "center",  height:55, width: 54 ,backgroundColor: COLORS.black, borderRadius: 8}}>
                <Icon
                  name="chevron-back-outline"
                  style={{ fontSize: 36, color: "#fff"}}
                />
              </TouchableOpacity>

              <View style={{flex: 1}}>
                <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.purple}]} onPress={() =>validate("displayName", inputs?.displayName)} activeOpacity={0.7}>
                  <Text style={styles.text}>Enregistrer</Text>
                </TouchableOpacity>
              
              </View>

            
            </View>

          </RBSheet>


          <RBSheet
            ref={passwordEditModal}
            height={455}
            openDuration={250}
            closeOnDragDown={true}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20
              }
            }}
          >
            <Text style={{marginTop: 10,fontSize: 16, alignSelf: "center", fontFamily: 'PTSans-regular', fontWeight: 700}} 
            > Edition du mot de passe
           </Text>

           <Text style={{fontSize: 14, textAlign: "center", fontFamily: 'PTSans-regular', marginHorizontal: 50, marginTop: 10}} 
            > Veuillez renseigner les champs ci-dessous
           </Text>


           <ScrollView contentContainerStyle={{paddingTop: 35,paddingBottomBottom: 35, marginHorizontal: 30}}>
            <Input
              label="Mot de passe actuel"
              error={errors.oldPassword}
              password = {true}
              onFocus={() => {
                handleError(null,"oldPassword");
              }}
              placeholder="Ecrivez ici..."
              onChangeText={(text)=>handleOnChange(text,"oldPassword")}
              value={inputs.oldPassword}
            />

            <Input
              label="Nouveau mot de passe"
              error={errors.newPassword}
              password = {true}
              onFocus={() => {
                handleError(null,"newPassword");
              }}
              placeholder="Ecrivez ici..."
              onChangeText={(text)=>handleOnChange(text,"newPassword")}
              value={inputs.newPassword}
            />

            <Input
              label="Confirmer le nouveau mot de passe"
              error={errors.newPasswordConfirm}
              password = {true}
              onFocus={() => {
                handleError(null,"newPasswordConfirm");
              }}
              placeholder="Ecrivez ici..."
              onChangeText={(text)=>handleOnChange(text,"newPasswordConfirm")}
              value={inputs.newPasswordConfirm}
            />
            <View style={{ gap: 15,marginTop: 20, justifyContent: "space-between", alignItems: "center", flexDirection:"row"}}>
              <TouchableOpacity onPress={() =>[closeBottomSheet(passwordEditModal), openBottomSheet(profileEditModal)]} style={{justifyContent: "center", alignItems: "center",  height:55, width: 54 ,backgroundColor: COLORS.black, borderRadius: 8}}>
                <Icon
                  name="chevron-back-outline"
                  style={{ fontSize: 36, color: "#fff"}}
                />
              </TouchableOpacity>

              <View style={{flex: 1}}>
                <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.purple}]} onPress={() =>validate(["oldPassword","newPassword","newPasswordConfirm"], [inputs?.oldPassword,inputs?.newPassword,inputs?.newPasswordConfirm])} activeOpacity={0.7}>
                  <Text style={styles.text}>Enregistrer</Text>
                </TouchableOpacity>
              
              </View>

            
            </View>
            </ScrollView>


          </RBSheet>

          <RBSheet
            ref={emailEditModal}
            height={290}
            openDuration={250}
            closeOnDragDown={true}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20
              }
            }}
          >
            <Text style={{marginTop: 10,fontSize: 16, alignSelf: "center", fontFamily: 'PTSans-regular', fontWeight: 700}} 
            > Edition de l’adresse mail
           </Text>

           <Text style={{fontSize: 14, textAlign: "center", fontFamily: 'PTSans-regular', marginHorizontal: 50, marginTop: 10}} 
            > Veuillez renseigner votre nouvel email
           </Text>


           <View style={{marginHorizontal: 30, marginTop: 20  }}>
            <Input
              label="Email"
              iconName="mail-outline"
              error={errors.email}
              onFocus={() => {
                handleError(null,"email");
              }}
              placeholder="Ecrivez ici..."
              onChangeText={(text)=>handleOnChange(text,"email")}
              value={inputs.email}
            />
            </View>

            <View style={{ gap: 15 ,marginHorizontal: 30, marginTop: 20, justifyContent: "space-between", alignItems: "center", flexDirection:"row"}}>
              <TouchableOpacity onPress={() =>[closeBottomSheet(emailEditModal), openBottomSheet(profileEditModal)]} style={{justifyContent: "center", alignItems: "center",  height:55, width: 54 ,backgroundColor: COLORS.black, borderRadius: 8}}>
                <Icon
                  name="chevron-back-outline"
                  style={{ fontSize: 36, color: "#fff"}}
                />
              </TouchableOpacity>

              <View style={{flex: 1}}>
                <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.purple}]} onPress={() =>validate("email", inputs?.email)} activeOpacity={0.7}>
                  <Text style={styles.text}>Enregistrer</Text>
                </TouchableOpacity>
              
              </View>

            
            </View>

          </RBSheet>


          <RBSheet
            ref={rateModal}
            height={351}
            openDuration={250}
            closeOnDragDown={true}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20
              }
            }}
          >
            <Text style={{marginTop: 5,fontSize: 16, alignSelf: "center", fontFamily: 'PTSans-regular', fontWeight: 700}} 
            > Ajouter une notation
           </Text>

           <Text style={{fontSize: 14, textAlign: "center", fontFamily: 'PTSans-regular', marginHorizontal: 50, marginTop: 10}} 
            > lorem ipsum lorem ipsum lorem ispum
           </Text>

           <View style={styles.starRow}>{renderStars()}</View>


           <View style={{marginHorizontal: 30,marginTop: 5,  }}>
            <TextArea
              label="Commentaire"
              error={errors.comment}
              onFocus={() => {
                handleError(null,"comment");
              }}
              placeholder="Ecrivez ici..."
              onChangeText={(text)=>handleOnChange(text,"comment")}
              value={inputs?.comment}
              rlabel = {"facultatif"}
              multiline={true}
              numberOfLines={3} 
            />
            </View>

            <View style={{gap: 15,marginHorizontal: 30, marginTop: 20, justifyContent: "space-between", alignItems: "center", flexDirection:"row"}}>
              <TouchableOpacity onPress={() => closeBottomSheet(rateModal)} style={{justifyContent: "center", alignItems: "center",  height:55, width: 54 ,backgroundColor: COLORS.black, borderRadius: 8}}>
                <Icon
                  name="chevron-back-outline"
                  style={{ fontSize: 36, color: "#fff"}}
                />
              </TouchableOpacity>

              <View style={{flex: 1}}>
                <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.purple}]} onPress={() =>handleRate()} activeOpacity={0.7}>
                  <Text style={styles.text}>Enregistrer</Text>
                </TouchableOpacity>
              
              </View>

            
            </View>

          </RBSheet>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  starRow: {
    flexDirection: 'row',
    justifyContent: "center"
  },
  starContainer: {
    padding: 5,
  },

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
    flex: 0.22,
    alignItems: "center",
    justifyContent: "center",
    /* backgroundColor: COLORS.purple, */
  },
  middleContainer: {
    flex: 0.78,
    backgroundColor: "#D9D9D95E",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 0,
    gap: 20,
  },
  bottomContainer: {
    elevation: 5,
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
