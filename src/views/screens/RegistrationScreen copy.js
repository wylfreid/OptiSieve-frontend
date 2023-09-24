import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Keyboard,
  Image,
  StatusBar,
  useWindowDimensions
} from "react-native";
import Input from "../components/Input";
import COLORS from "./../../const/colors";
import Button from "../components/Button";
import Toast from "react-native-toast-message";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../components/Loader";

export default function RegistrationScreen({ navigation }) {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const {width, height} = useWindowDimensions();

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.name) {
      handleError("Please enter your full name", "name");
      isValid = false;
    }
    if (!inputs.email) {
      handleError("Please enter your email", "email");
      isValid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError("Please enter a valid email", "email");
      isValid = false;
    }
    if (!inputs.password) {
      handleError("please enter password", "password");
      isValid = false;
    }

    if (!inputs.phone) {
      handleError("Please enter phone number", "phone");
      isValid = false;
    }

    if (isValid) {
      register();
    }
  };
  const register = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        AsyncStorage.setItem("userData", JSON.stringify(inputs));
        navigation.navigate("LoginScreen");
        setLoading(false);
        Toast.show({
          type: "success",
          text1: "Confirmation",
          text2: "your account has been successfully created ",
          position:"bottom"
        });
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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, marginTop: StatusBar.currentHeight }}>
      <Loader visible={loading} />

      <Image
        source={require("../../../assets/images/shapes/Ellipse1.png")}
        style={styles.elipse}
      />
      <Image
        source={require("../../../assets/images/shapes/Ellipse2.png")}
        style={styles.elipse}
      />
      <ScrollView
        contentContainerStyle={{ paddingTop: 50, paddingHorizontal: 25, marginTop: 100, height: height }}
      >
        <Text style={{ color: COLORS.black, fontSize: 20, textAlign: "center", fontFamily: 'poppins-semiBold' }}>
          Welcome Onboard!
        </Text>

        <Text style={{ color: COLORS.black, fontSize: 13, fontWeight: 500, textAlign: "center", marginTop: 15, fontFamily: 'poppins-regular' }}>
          Let’s help you meet up your tasks
        </Text>
        <View style={{ marginVertical: 20 }}>
          <Input
            label="Name"
            iconName="person-outline"
            error={errors.name}
            onFocus={() => {
              handleError(null,"name");
            }}
            placeholder="Enter your name"
            onChangeText={(text)=>handleOnChange(text,"name")}
          />
          <Input
            label="Email"
            iconName="mail-outline"
            error={errors.email}
            onFocus={() => {
              handleError(null,"email");
            }}
            placeholder="Enter your email"
            onChangeText={(text)=>handleOnChange(text,"email")}
          />
          <Input
            label="Phone Number"
            iconName="call-outline"
            error={errors.phone}
            onFocus={() => {
              handleError(null,"phone");
            }}
            placeholder="Enter your phone number"
            onChangeText={(text)=>handleOnChange(text,"phone")}
            KeyboardType="numeric"
          />
          <Input
            label="Password"
            error={errors.password}
            onFocus={() => {
              handleError(null,"password");
            }}
            placeholder="Enter your password"
            onChangeText={(text)=>handleOnChange(text,"password")}
            password = {true}
          />
          <Button style={{ fontFamily: 'poppins-semiBold'}} title="Register" onPress={()=>validate}/>
          <Text style={{fontSize:16, textAlign:"center", color:COLORS.black, fontFamily: 'poppins-semiBold'}} onPress={()=> navigation.navigate("LoginScreen")}> Already have account ? Login</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  elipse:{
      resizeMode: "contain",
      position: "absolute",
  },
 
});
