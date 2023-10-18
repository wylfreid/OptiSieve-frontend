import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import Constants from 'expo-constants';
import * as tf from "@tensorflow/tfjs";
import {bundleResourceIO } from "@tensorflow/tfjs-react-native";
import * as jpeg from "jpeg-js";
import * as FileSystem from "expo-file-system";
import ImgContext from "../../hooks/ImgContext";
import Loader from "../components/Loader2";
import Icon from "react-native-vector-icons/Ionicons";
import COLORS from "../../const/colors";
import ResultContext from "../../hooks/ResultContext";
import Carousel from "../components/Carousel";
import { useSelector } from "react-redux";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../../firebase.config";
import { ref, uploadBytesResumable } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";




const options = { encoding: FileSystem.EncodingType.Base64 };

export default function TensorScreen({ navigation }) {

  const images = useSelector((state) => state.images);

  const { setResult } = useContext(ResultContext);

  const [isLoaded, setIsLoaded] = useState(false);
  const [GradingNetwork, setGradingNetwork] = useState("");
  useEffect(() => {
    async function loadModel() {
      console.log("[+] Application started");
      //Wait for tensorflow module to be ready
      const tfReady = await tf.ready();
      console.log("[+] Loading pre-trained images detection model");
      //Replce model.json and group1-shard.bin with your own custom model
      const modelJson = await require("../../../assets/model/model.json");
      const modelWeights1 = await require("../../../assets/model/group1-shard1of1.bin");

      const ioHandler = bundleResourceIO(modelJson, [modelWeights1]);
      const GradingNetwork1 = await tf.loadGraphModel(
        ioHandler
      );


      setGradingNetwork(GradingNetwork1);

      console.log("[+] Model Loaded");

      setIsLoaded(true);
    }
    loadModel();
  }, []);
  function imageToTensor(rawImageData) {
    //Function to convert jpeg image to tensors
    const TO_UINT8ARRAY = true;
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3);
    let offset = 0; // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset];
      buffer[i + 1] = data[offset + 1];
      buffer[i + 2] = data[offset + 2];
      offset += 4;
    }
    return tf.tensor3d(buffer, [height, width, 3]);
  }


  const appliedNetwork = async () => {
    try {
      setIsLoaded(false);
      console.log("[+] Retrieving image 1 from link :" + images[0]?.uri);

      // read the image as base64 and create buffer
      const img64Top = await FileSystem.readAsStringAsync(images[0]?.uri, options);
      const imgBufferTop = tf.util.encodeString(img64Top, "base64").buffer;
      const rawImageDataTop = new Uint8Array(imgBufferTop);

      let imageTensorTop = imageToTensor(rawImageDataTop).resizeBilinear([224,224]);


      console.log("[+] Retrieving image 2 from link :" + images[1]?.uri);
      
      // read the image as base64 and create buffer
      const img64Down = await FileSystem.readAsStringAsync(images[1]?.uri, options);
      const imgBufferDown = tf.util.encodeString(img64Down, "base64").buffer;
      const rawImageDataDown = new Uint8Array(imgBufferDown);

      let imageTensorDown = imageToTensor(rawImageDataDown).resizeBilinear([224,224]);
      

      imageTensorTop = imageTensorTop.resizeBilinear([224,224]).reshape([1,224,224,3])
      imageTensorDown = imageTensorDown.resizeBilinear([224,224]).reshape([1,224,224,3])
 

      let testPictures = [imageTensorTop,imageTensorDown]

      let granularPictures = true;
      for(i=0;i<=1;i++){
        let granularMaterialPredict = await GradingNetwork.predict(testPictures[i]).dataSync();
        console.log(granularMaterialPredict);
        if(granularMaterialPredict >= 0.5 ){
         granularPictures = false;
      }}
      
      if(granularPictures == true){
        //let result = await GradingNetwork.predict([imageTensorTop,imageTensorDown]).dataSync()
        console.log('materiau granulaire')
       // let granulometrie = [0,0,...result];
      //  let accumuledResult = [0,0,0,0,0,0,0,0]
      //  for(i=0;i<7;i++){
       //   if(i==0){
       //     accumuledResult[6-i] = 1-granulometrie[6-i];
       //   }else{
       //     accumuledResult[6-i] = Math.max(accumuledResult[7-i]-granulometrie[6-i],0)
        //  }
        //    }
        //    accumuledResult[7] = granulometrie[7]
        //    console.log(accumuledResult);
       // setResult(accumuledResult);
        console.log("_______Successfully predicted particle size curve");
      }else{
        console.log("insérer des images valides");
      }


      let newAnalysis_infos = await AsyncStorage.getItem("newAnalysis_infos")

      newAnalysis_infos = JSON.parse(newAnalysis_infos)

      try {

        const docRef = await collection(db, "analysis");

        const response1 = await fetch(images[0]?.uri);
        const response2 = await fetch(images[1]?.uri);
        const blob1 = await response1.blob();
        const blob2 = await response2.blob();

        const storageRef1 = ref(storage, `Analysis_images/${Date.now() + "top-" + newAnalysis_infos?.sample_name}`);
        const storageRef2 = ref(storage, `Analysis_images/${Date.now() + "bottom-" + newAnalysis_infos?.sample_name}`);
    
        let url1 = ""

        const uploadTask1 = uploadBytesResumable(storageRef1, blob1).then(
          
          () => {
            getDownloadURL(storageRef1).then(async (downloadURL1) => {
              url1 = downloadURL1

          });
  
          }
        );

        const uploadTask2 = uploadBytesResumable(storageRef2, blob2).then(
          
          () => {
            getDownloadURL(storageRef2).then(async (downloadURL2) => {
              await addDoc(docRef, {
                ...newAnalysis_infos,
                images: [url1, downloadURL2]
              });

          });
  
          }
        );
      } catch (err) {
      }

      setIsLoaded(true);
      navigation.navigate('ResultScreen');
    } catch (error) {
      console.log("[-] Unable to load image " + error);
      setIsLoaded(true);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      {isLoaded ? (
        <View
          style={{
            flex: 1,
            marginTop: Constants.statusBarHeight,
            backgroundColor: "#fff",
          }}
        >
        <View style={{width: '100%', height: 60, alignItems:"center",justifyContent:"center",  backgroundColor: COLORS.white, justifyContent: "center", zIndex: 10, borderBottomWidth: 1, borderColor: COLORS.light}}>
                  <TouchableOpacity style={{position: "absolute",left:0}} onPress={() => navigation.navigate("HomeScreen")} >
                  <Icon
                  name="arrow-back-outline"
                  style={{ fontSize: 35, color: COLORS.purple, left: 10}}
                  />
                  </TouchableOpacity>
                  <Text style={{fontWeight:"600", fontSize:20}}> Prediction </Text>
                </View>
      
          <View style={styles.container}>

          <Carousel imageTop={images[0]} imageBottom={images[1]}/>
            
          </View>

            <TouchableOpacity 
              onPress={() => {
                appliedNetwork();
              }}
              style={{backgroundColor: COLORS.purple,width: '100%', height: 50, alignItems: "center", justifyContent: "center",}}
            >
              <Text style={{color: COLORS.white, fontSize: 16, fontWeight: 'bold'}}>Predict</Text>
            </TouchableOpacity>
        </View>
      ) : (
        <Loader visible={true} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
