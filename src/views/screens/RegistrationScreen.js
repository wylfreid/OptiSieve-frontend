import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Keyboard,
  Image,
  StatusBar,
  useWindowDimensions,
  TouchableOpacity
} from "react-native";
import Input from "../components/Input";
import COLORS from "./../../const/colors";
import Button from "../components/Button";
import Toast from "react-native-toast-message";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../components/Loader";
import Logo from "../../../assets/images/Logo";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


import { auth, db } from "./../../firebase.config";

import { setDoc, doc } from "firebase/firestore";

import { storage } from "./../../firebase.config";

export default function RegistrationScreen({ navigation }) {

  StatusBar.setBarStyle('dark-content');
  StatusBar.setBackgroundColor('#fff');

  const [inputs, setInputs] = useState({
    displayName: "",
    email: "",
    password: "",
    password_confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const {width, height} = useWindowDimensions();

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.displayName) {
      handleError("Veuillez saisir votre nom", "displayName");
      isValid = false;
    }
    if (!inputs.email) {
      handleError("Veuillez saisir votre email", "email");
      isValid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError("Veuillez saisir un email valide", "email");
      isValid = false;
    }
    if (!inputs.password) {
      handleError("Veuillez saisir votre mot de passe", "password");
      isValid = false;
    }else if(inputs.password && inputs.password.length < 6){
      handleError("le mot de passe doit comporter au moins 6 caractères", "password");
      isValid = false;
    }

    if (!inputs.password_confirm) {
      handleError("Veuillez confirmer votre mot de passe", "password_confirm");
      isValid = false;
    }else if(inputs.password_confirm != inputs.password) {
      handleError("Le mot de passe est différent", "password_confirm");
      isValid = false;
    }

    if (isValid) {
      register();
    }
  };
  const register = async () => {
    setLoading(true);
      try {

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          inputs.email,
          inputs.password
        );
  
        const user = await userCredential.user;

        await updateProfile(user, {
          displayName: inputs.displayName,
        });
  
        //store user data in firestore database
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: inputs.displayName,
          email: inputs.email,
          date: new Date().toLocaleDateString()
        });


        navigation.navigate("LoginScreen");

        setLoading(false);

        Toast.show({
          type: "success",
          text1: "Confirmation",
          text2: "Votre compte a été créée avec succès",
          position:"top"
        });
      } catch (error) {
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2: error,
          position:"top"
        });
      }
  };



  const handleError = (error, input) => {
    setErrors((prevState) => ({
      ...prevState,
      [input]: error,
    }));
  };

  const handleOnChange = (text, input) => {
    setInputs((prevState) => ({
      ...prevState,
      [input]: text,
    }));
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white}}>
      <Loader visible={loading} />

      <View style={[styles.topContainer, {height: height/5.2}]}>
        <Logo/>
      </View>

      <View style={[styles.midlleContainer, {height: height/8.8}]}>
        <Text style={{ color: COLORS.black, fontSize: 24, textAlign: "center", fontFamily: 'PTSans-bold' }}>
          Créer votre compte
        </Text>

        <Text style={{ color: COLORS.black, fontSize: 13, fontWeight: 500, textAlign: "center", marginTop: 0, fontFamily: 'PTSans-regular' }}>
          Veuillez renseigner les informations ci-dessous
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.bottomContainer,{ paddingTop: 30, paddingHorizontal: 25}]}
      >
        
        <View style={{  }}>
          <Input
            label="Nom d’utilisateur"
            iconName="person-outline"
            error={errors.displayName}
            onFocus={() => {
              handleError(null,"displayName");
            }}
            placeholder="Ecrivez ici..."
            onChangeText={(text)=>handleOnChange(text,"displayName")}
          />
          <Input
            label="Email"
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

          <Input
            label="Confirmer le mot de passe"
            error={errors.password_confirm}
            onFocus={() => {
              handleError(null,"password_confirm");
            }}
            placeholder="Ecrivez ici..."
            onChangeText={(text)=>handleOnChange(text,"password_confirm")}
            password = {true}
          />
          
          <Button style={{}} title="Creer mon compte" onPress={()=>validate}/>

          <TouchableOpacity onPress={()=> navigation.navigate("LoginScreen")} style={{ justifyContent: "space-between", flexDirection: "row", marginTop: 10}}>

            <Text style={{fontSize:13, textAlign:"center", color: "grey", fontFamily: 'PTSans-regular'}} 
            > Si vous avez deja un compte</Text>

            <Text style={{fontSize:13, textAlign:"center", color:COLORS.blue, fontWeight: 600, fontFamily: 'PTSans-regular'}} 
            > Connectez vous</Text>
          </TouchableOpacity>

          
        </View>
      </ScrollView>

          <View style={{ zIndex: -1,justifyContent: "center",alignSelf: "center", position: "absolute",flexDirection: 'row',
          flexWrap: 'wrap', bottom: 25, left: 10, right: 10}}>

            <Text style={{lineHeight: 14.46, fontSize:12, textAlign:"center", color: "grey", fontFamily: 'PTSans-regular'}} 
            > En vous inscrivant, vous acceptez nos 
           </Text>

           <Text style={{lineHeight: 14.46,fontSize:12, textAlign:"center", color:COLORS.blue, fontFamily: 'PTSans-regular'}} 
            > termes et conditions
           </Text>

           <Text style={{lineHeight: 14.46, fontSize:12, textAlign:"center", color: "grey", fontFamily: 'PTSans-regular'}} 
            > et notre 
           </Text>

           <Text style={{lineHeight: 18,fontSize:12, textAlign:"center", color:COLORS.blue, fontFamily: 'PTSans-regular'}} 
            > politique de confidentialité
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
 
});
