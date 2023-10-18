import { StyleSheet, Text, View } from "react-native";
import "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/views/screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import RegistrationScreen from "./src/views/screens/RegistrationScreen";
import LoginScreen from "./src/views/screens/LoginScreen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "./src/views/components/Loader";
import Toast from "react-native-toast-message";
import TensorScreen from "./src/views/screens/TensorScreen";

import ResultScreen from "./src/views/screens/ResultScreen";
import WelcomeScreen from "./src/views/screens/WelcomeScreen";

import { Animated } from 'react-native';

import * as Font from 'expo-font';
import { AppLoading } from 'expo';

import { Provider} from 'react-redux';
import store from "./src/redux/store";
import { TransitionPresets } from "@react-navigation/stack";
import UseAuth from "./src/custom-hooks/useAuth";



const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRouteName, setInitialRouteName] = useState(null);

  const [isReady, setIsReady] = useState(false);
  

  const loadFonts = async () => {
    await Font.loadAsync({
      'PTSans-regular': require('./assets/fonts/PT_Sans/PTSans-Regular.ttf'),
      'PTSans-bold': require('./assets/fonts/PT_Sans/PTSans-Bold.ttf'),
      'poppins-regular': require('./assets/fonts/Poppins/Poppins-Regular.ttf'),
    });
    setIsReady(true)
  }

  useEffect(()=>{
    loadFonts()
  })

  setTimeout(() => {
    authUser();
  }, 1500)
  
  //AsyncStorage.clear()

  const authUser = async () => {
    try {
      
    
      let test = await AsyncStorage.getItem("test");

      let loggedIn = await AsyncStorage.getItem("loggedIn");

      if (test == "true") {
        if (loggedIn == "true") {
          setInitialRouteName("HomeScreen");
        } else {
          setInitialRouteName("LoginScreen");
        }
      } else {
        setInitialRouteName("WelcomeScreen");
      } 
    } catch (error) {
      setInitialRouteName("WelcomeScreen");
    }
  };

  function slideFromRightIOS(transitionProps, prevTransitionProps) {
    const { layout, position, scene } = transitionProps;
  
    const thisSceneIndex = scene.index;
    const width = layout.initWidth;
  
    const translateX = Animated.subtract(
      0,
      Animated.multiply(position, new Animated.Value(width))
    );
  
    return { transform: [{ translateX }] };
  }

  if (!isReady) {
    return (
      null
    );
  }


  return (
    <NavigationContainer>
      {!initialRouteName ? (
        <Loader visible={true} />
      ) : (
        <Provider store={store}>
          <Stack.Navigator
            initialRouteName={initialRouteName}
            screenOptions={{
              headerShown: false,
              cardStyleInterpolator: slideFromRightIOS,
            }}
    
          >
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="TensorScreen" component={TensorScreen} />
            <Stack.Screen name="ResultScreen" component={ResultScreen} />
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} 
            options={{
              ...TransitionPresets.SlideFromRightIOS,
              gesteEnabled : true,
              headerShown : false,
              gesteResponseDistance : 100,
              gesteDirection : "horizontal",
              detachPreviousScreen : false,
              }}/>
            <Stack.Screen name="LoginScreen" component={LoginScreen} 
            options={{
              ...TransitionPresets.SlideFromRightIOS,
              gesteEnabled : true,
              headerShown : false,
              gesteResponseDistance : 100,
              gesteDirection : "horizontal",
              detachPreviousScreen : false,
              }}/>
            <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} 
            options={{
              ...TransitionPresets.SlideFromRightIOS,
              gesteEnabled : true,
              headerShown : false,
              gesteResponseDistance : 100,
              gesteDirection : "horizontal",
              detachPreviousScreen : false,
              }}/>
          </Stack.Navigator>
        </Provider>
      )}
      <Toast />
    </NavigationContainer>
  );
}
