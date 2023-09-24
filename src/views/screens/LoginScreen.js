import { SafeAreaView, StyleSheet, Image, Text, View, ScrollView, StatusBar, useWindowDimensions, TouchableOpacity } from "react-native";
import Input from "../components/Input";
import COLORS from "./../../const/colors";
import Button from "../components/Button";
import Toast from "react-native-toast-message";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../components/Loader";
import Logo from "../../../assets/images/Logo";

import RBSheet from 'react-native-raw-bottom-sheet';
import  Icon  from "react-native-vector-icons/FontAwesome";



export default function LoginScreen({ navigation }) {

  StatusBar.setBarStyle('dark-content');
  StatusBar.setBackgroundColor('#fff');

  const {width, height} = useWindowDimensions();

  const [timer, setTimer] = useState(60);

  const [allowResend, setAllowResend] = useState(false);

  const bottomSheetRef2 = useRef(null);
  const bottomSheetRef = useRef();

  const openBottomSheet = () => {
    bottomSheetRef.current.open();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current.close();
  };

  const openBottomSheet2 = () => {
    bottomSheetRef2.current.open();
  };

  const closeBottomSheet2 = () => {
    bottomSheetRef2.current.close();
  };

  const Compteur = () => {
    let intervalId = setInterval(() => {
      setTimer((timer)=>{
        if (timer <= 0 ) {
          clearInterval(intervalId);
          setAllowResend(true)

          return timer

        }else{
          return timer - 1
        }
        
      } 
      );

      
    }, 1000);

    
  }
  
  

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    email_reset: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let isValid = true;

    if (!inputs.email) {
      handleError("Veuillez saisir votre email", "email");
      isValid = false;
    } 

    if (!inputs.password) {
      handleError("Veuillez saisir votre mot de passe", "password");
      isValid = false;
    }

    if (isValid) {
      login();
    }
  };

  const handleValidateMail = () => {
    let isValid = true;

    if (!inputs.email_reset) {
      handleError("Veuillez saisir votre email", "email_reset");
      isValid = false;
    } else if (!inputs.email_reset.match(/\S+@\S+\.\S+/)) {
      handleError("Veuillez saisir un email valide", "email_reset");
      isValid = false;
    }

    if (isValid) {
      onPasswordReset();
    }
  };

  const handleResendMail = () => {
    setAllowResend(false)
    setTimer(60)
    Compteur()
  }

  const onPasswordReset = async () => {

    let userData = await AsyncStorage.getItem("userData");

    

    closeBottomSheet()
    setLoading(true);
    setTimeout(() => {
      try {

        if (userData) {

          userData = JSON.parse(userData);

        if (userData.email == inputs.email_reset) {
          setLoading(false);
  
          closeBottomSheet()
          openBottomSheet2()
          Compteur()

        }else{
          openBottomSheet()
          handleError("Ce compte n'existe pas", "email_reset");
        }

      }else{
        openBottomSheet()
        handleError("Ce compte n'existe pas", "email_reset");
      }

        setLoading(false);
        
        /* if (userData) {

          const inputsData = {
            ...userData,
            password: inputs.email
          }
          AsyncStorage.setItem("userData", JSON.stringify(inputsData));

          setLoading(false);

          closeBottomSheet()

          Toast.show({
            type: "success",
            text1: "Confirmation",
            text2: "Votre mot de passe a été réinitialisé avec succès",
            position:"bottom"
          });
        }else{
          setLoading(false);
          Toast.show({
            type: "error",
            text1: "Erreur",
            text2: "ce compte n'existe pas",
            position:"bottom"
          });
        } */
      } catch (error) {
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error,
          position:"bottom"
        });
      }
    }, 3000);
  }

  const login = async () => {
    let userData = await AsyncStorage.getItem("userData");
    
    setLoading(true);
    setTimeout(() => {
      try {
        
        if (userData) {
          
          userData = JSON.parse(userData);
          let userName = userData.name;
          if (
            userData.email == inputs.email && userData.password == inputs.password || 
            userData.name == inputs.email && userData.password == inputs.password
          ) {
            userData = { ...userData, loggedIn: true };
            AsyncStorage.setItem("userData", JSON.stringify(userData));
            navigation.navigate("HomeScreen");
            setLoading(false);
            Toast.show({
              type: "success",
              text1: "Succès",
              text2: "Vous êtes maintenant connecté en tant que "+ userName,
              position:"top"
            });
          } else {
            setLoading(false);
            Toast.show({
              type: "error",
              text1: "Erreur de connection",
              text2: "Veuillez verifier votre email ou mot de passe",
              position:"top"
            });
          }
        }else{
          setLoading(false);
            Toast.show({
              type: "error",
              text1: "Erreur de connection",
              text2: "Veuillez verifier votre email ou mot de passe",
              position:"top"
            });

        }

        
      } catch (error) {
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "Erreur de connection",
          text2: "une erreur inattendue s'est produite, veuillez réessayer.",
          position:"bottom"
        });
      }
    }, 3000);
  };

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, marginTop: StatusBar.currentHeight }}>
      <Loader visible={loading} />

      <View style={[styles.topContainer, {height: height/5.2}]}>
        <Logo/>
      </View>

      <View style={[styles.midlleContainer, {height: height/8.8}]}>
        <Text style={{ color: COLORS.black, fontSize: 24, textAlign: "center", fontFamily: 'PTSans-bold' }}>
          Connexion
        </Text>

        <Text style={{ color: COLORS.black, fontSize: 13, fontWeight: 500, textAlign: "center", marginTop: 0, fontFamily: 'PTSans-regular' }}>
          Veuillez renseigner vos informations
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.bottomContainer,{ paddingTop: 30, paddingHorizontal: 25}]}
      >
        
        <View style={{  }}>
          <Input
            label="Email ou nom d’utilisateur"
            iconName="mail-outline"
            error={errors.email}
            onFocus={() => {
              handleError(null,"email");
            }}
            placeholder="Ecrivez ici..."
            onChangeText={(text)=>handleOnChange(text,"email")}
          />
      
          <Input
            label="Mot de passe"
            error={errors.password}
            onFocus={() => {
              handleError(null,"password");
            }}
            placeholder="Ecrivez ici..."
            onChangeText={(text)=>handleOnChange(text,"password")}
            password = {true}
          />

          <TouchableOpacity onPress={openBottomSheet} style={{ marginBottom: 50 ,justifyContent: "space-between", flexDirection: "row", marginTop: 5}}>

          <Text style={{fontSize:13, textAlign:"center", color: "grey", fontFamily: 'PTSans-regular'}} 
          > Mot de passe oublié?</Text>

          <Text style={{fontSize:13, textAlign:"center", color:COLORS.blue, fontWeight: 600, fontFamily: 'PTSans-regular'}} 
          > Reinitialiser mon mot de passe</Text>
          </TouchableOpacity>
          
          <Button style={{}} title="Me connecter" onPress={()=>validate}/>

          <TouchableOpacity onPress={()=> navigation.navigate("RegistrationScreen")} style={{ justifyContent: "space-between", flexDirection: "row", marginTop: 10}}>

            <Text style={{fontSize:13, textAlign:"center", color: "grey", fontFamily: 'PTSans-regular'}} 
            > Pas encore de compte ?</Text>

            <Text style={{fontSize:13, textAlign:"center", color:COLORS.blue, fontWeight: 600, fontFamily: 'PTSans-regular'}} 
            > Creer un compte</Text>
          </TouchableOpacity>

          <RBSheet
            ref={bottomSheetRef}
            height={310}
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
            > Reinitialisation du mot de passe
           </Text>

           <Text style={{fontSize: 14, textAlign: "center", fontFamily: 'PTSans-regular', marginHorizontal: 50, marginTop: 10}} 
            > Veuillez renseigner votre email pour que nous puissons vous envoyer le lien de reinitialisation
           </Text>


           <View style={{marginHorizontal: 30, marginTop: 20  }}>
            <Input
              label="Email"
              iconName="mail-outline"
              error={errors.email_reset}
              onFocus={() => {
                handleError(null,"email_reset");
              }}
              placeholder="Ecrivez ici..."
              onChangeText={(text)=>handleOnChange(text,"email_reset")}
            />
            </View>

            <View style={{marginHorizontal: 30, marginTop: 20, justifyContent: "space-between", alignItems: "center", flexDirection:"row"}}>
              <TouchableOpacity onPress={() =>closeBottomSheet()} style={{justifyContent: "center", alignItems: "center",  height:55, width: 54 ,backgroundColor: COLORS.black, borderRadius: 8}}>
                <Icon
                  name="angle-left"
                  style={{ fontSize: 36, color: "#fff"}}
                />
              </TouchableOpacity>

              <View style={{width: 266 }}>
                <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.purple}]} onPress={() =>handleValidateMail()} activeOpacity={0.7}>
                  <Text style={styles.text}>Recevoir le lien</Text>
                </TouchableOpacity>
              
              </View>

            
            </View>

          </RBSheet>




          <RBSheet
            ref={bottomSheetRef2}
            height={310}
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
            > Reinitialisation du mot de passe
           </Text>

           <Text style={{fontSize: 14, textAlign: "center", fontFamily: 'PTSans-regular', marginHorizontal: 50, marginTop: 10}} 
            > Veuillez verifier votre boite mail et cliquer sur le lien de réinitialisation
           </Text>


            <View style={styles.InfoContainer}>
            
              <Text style={{fontSize: 18, textAlign: "center", fontFamily: 'PTSans-regular', lineHeight: 19.41}} 
              > Si vous n’avez pas recu le lien vous pouvez demander un nouvel envoie dans 
              </Text>

              <Text style={{color: "#0072F7", lineHeight: 19.41}}>
                {timer} s
              </Text>

            </View>

            <View style={{marginHorizontal: 30, marginTop: 20, justifyContent: "space-between", alignItems: "center", flexDirection:"row"}}>
              <TouchableOpacity onPress={() =>[closeBottomSheet2(), openBottomSheet()]} style={{justifyContent: "center", alignItems: "center",  height:55, width: 54 ,backgroundColor: COLORS.black, borderRadius: 8}}>
                <Icon
                  name="angle-left"
                  style={{ fontSize: 36, color: "#fff"}}
                />
              </TouchableOpacity>

              <View style={{width: 266 }}>
                <TouchableOpacity disabled={!allowResend} style={[styles.button, {backgroundColor: !allowResend ? "#DBDBDB" : COLORS.purple}]} onPress={() =>handleResendMail()} activeOpacity={0.7}>
                  <Text style={styles.text}>Renvoyer le lien</Text>
                </TouchableOpacity>
              
              </View>

            
            </View>

          </RBSheet>
          
        </View>
      </ScrollView>


      <View style={{ zIndex: -1,justifyContent: "center",alignSelf: "center", position: "absolute",flexDirection: 'row',
          flexWrap: 'wrap', bottom: 15}}>

           <Text style={{lineHeight: 14.46, fontSize:12, textAlign:"center", color: "grey", fontFamily: 'PTSans-regular'}} 
            > OptiSieve version 1.1
           </Text>
    

          </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer:{
    backgroundColor: "#fff",
    justifyContent: "flex-end",
    alignItems: "center"
  },

  midlleContainer:{
    backgroundColor: "#fff",
    justifyContent: "flex-end",
    alignItems: "center"
  },

  bottomContainer:{
    backgroundColor: "#fff"
},

button: {
  height:55,
  width:"100%",
  alignItems: "center",
  justifyContent: "center",
  borderRadius:8,
},

text:{
  fontSize:18,
  fontFamily: 'PTSans-regular', 
  color:COLORS.white
},

InfoContainer: {
  marginHorizontal: 30, marginTop: 20,
  height: 75,
  backgroundColor: "#F2F2F2",
  paddingHorizontal: 15,
  paddingVertical: 10,
  marginBottom: 10,
  borderWidth: 0.3,
  borderRadius: 5,
  justifyContent: "center",
  alignItems: "center"
},
 
});

