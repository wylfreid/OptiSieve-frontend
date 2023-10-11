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
import Loader from "../components/Loader";
import Icon from "react-native-vector-icons/Ionicons";
import COLORS from "../../const/colors";
import ResultContext from "../../hooks/ResultContext";
import Carousel from "../components/Carousel";


const options = { encoding: FileSystem.EncodingType.Base64 };

export default function TensorScreen({ navigation }) {

  const { img } = useContext(ImgContext);
  const { setResult } = useContext(ResultContext);

  const [isLoaded, setIsLoaded] = useState(false);
  const [GradingNetwork, setGradingNetwork] = useState("");
  useEffect(() => {
    async function loadModel() {
      console.log("[+] Application started");
      //Wait for tensorflow module to be ready
      const tfReady = await tf.ready();
      console.log("[+] Loading pre-trained face detection model");
      //Replce model.json and group1-shard.bin with your own custom model
      const modelJson = await require("../../../assets/model/model.json");
      const modelWeights1 = await require("../../../assets/model/group1-shard1of41.bin");
      const modelWeights2 = await require("../../../assets/model/group1-shard2of41.bin");
      const modelWeights3 = await require("../../../assets/model/group1-shard3of41.bin");
      const modelWeights4 = await require("../../../assets/model/group1-shard4of41.bin");
      const modelWeights5 = await require("../../../assets/model/group1-shard5of41.bin");
      const modelWeights6 = await require("../../../assets/model/group1-shard6of41.bin");
      const modelWeights7 = await require("../../../assets/model/group1-shard7of41.bin");
      const modelWeights8 = await require("../../../assets/model/group1-shard8of41.bin");
      const modelWeights9 = await require("../../../assets/model/group1-shard9of41.bin");
      const modelWeights10 = await require("../../../assets/model/group1-shard10of41.bin");
      const modelWeights11 = await require("../../../assets/model/group1-shard11of41.bin");
      const modelWeights12 = await require("../../../assets/model/group1-shard12of41.bin");
      const modelWeights13 = await require("../../../assets/model/group1-shard13of41.bin");
      const modelWeights14 = await require("../../../assets/model/group1-shard14of41.bin");
      const modelWeights15 = await require("../../../assets/model/group1-shard15of41.bin");
      const modelWeights16 = await require("../../../assets/model/group1-shard16of41.bin");
      const modelWeights17 = await require("../../../assets/model/group1-shard17of41.bin");
      const modelWeights18 = await require("../../../assets/model/group1-shard18of41.bin");
      const modelWeights19 = await require("../../../assets/model/group1-shard19of41.bin");
      const modelWeights20 = await require("../../../assets/model/group1-shard20of41.bin");
      const modelWeights21 = await require("../../../assets/model/group1-shard21of41.bin");
      const modelWeights22 = await require("../../../assets/model/group1-shard22of41.bin");
      const modelWeights23 = await require("../../../assets/model/group1-shard23of41.bin");
      const modelWeights24 = await require("../../../assets/model/group1-shard24of41.bin");
      const modelWeights25 = await require("../../../assets/model/group1-shard25of41.bin");
      const modelWeights26 = await require("../../../assets/model/group1-shard26of41.bin");
      const modelWeights27 = await require("../../../assets/model/group1-shard27of41.bin");
      const modelWeights28 = await require("../../../assets/model/group1-shard28of41.bin");
      const modelWeights29 = await require("../../../assets/model/group1-shard29of41.bin");
      const modelWeights30 = await require("../../../assets/model/group1-shard30of41.bin");
      const modelWeights31 = await require("../../../assets/model/group1-shard31of41.bin");
      const modelWeights32 = await require("../../../assets/model/group1-shard32of41.bin");
      const modelWeights33 = await require("../../../assets/model/group1-shard33of41.bin");
      const modelWeights34 = await require("../../../assets/model/group1-shard34of41.bin");
      const modelWeights35 = await require("../../../assets/model/group1-shard35of41.bin");
      const modelWeights36 = await require("../../../assets/model/group1-shard36of41.bin");
      const modelWeights37 = await require("../../../assets/model/group1-shard37of41.bin");
      const modelWeights38 = await require("../../../assets/model/group1-shard38of41.bin");
      const modelWeights39 = await require("../../../assets/model/group1-shard39of41.bin");
      const modelWeights40 = await require("../../../assets/model/group1-shard40of41.bin");
      const modelWeights41 = await require("../../../assets/model/group1-shard41of41.bin");

      const ioHandler = bundleResourceIO(modelJson, [modelWeights1, modelWeights2, modelWeights3, modelWeights4, modelWeights5,modelWeights6,modelWeights7,modelWeights8,modelWeights9,modelWeights10,modelWeights11,modelWeights12,modelWeights13,modelWeights14,modelWeights15,modelWeights16,modelWeights17,modelWeights18,modelWeights19,modelWeights20,modelWeights21,modelWeights22,modelWeights23,modelWeights24,modelWeights25,modelWeights26,modelWeights27,modelWeights28,modelWeights29,modelWeights30,modelWeights31,modelWeights32,modelWeights33,modelWeights34,modelWeights35,modelWeights36,modelWeights37,modelWeights38,modelWeights39,modelWeights40,modelWeights41]);
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
      console.log("[+] Retrieving image 1 from link :" + img[0]?.uri);

      // read the image as base64 and create buffer
      const img64Top = await FileSystem.readAsStringAsync(img[0]?.uri, options);
      const imgBufferTop = tf.util.encodeString(img64Top, "base64").buffer;
      const rawImageDataTop = new Uint8Array(imgBufferTop);

      let imageTensorTop = imageToTensor(rawImageDataTop).resizeBilinear([299,299]);


      console.log("[+] Retrieving image 2 from link :" + img[1]?.uri);
      
      // read the image as base64 and create buffer
      const img64Down = await FileSystem.readAsStringAsync(img[1]?.uri, options);
      const imgBufferDown = tf.util.encodeString(img64Down, "base64").buffer;
      const rawImageDataDown = new Uint8Array(imgBufferDown);

      let imageTensorDown = imageToTensor(rawImageDataDown).resizeBilinear([299,299]);
      

      imageTensorTop = imageTensorTop.resizeBilinear([299,299]).reshape([1,299,299,3])
      imageTensorDown = imageTensorDown.resizeBilinear([299,299]).reshape([1,299,299,3])

      let result = await GradingNetwork.predict([imageTensorTop,imageTensorDown]).dataSync()
      console.log(result)
      let granulometrie = [0,0,...result];
      let accumuledResult = [0,0,0,0,0,0,0,0]
      for(i=0;i<7;i++){
        if(i==0){
          accumuledResult[6-i] = 1-granulometrie[6-i];
        }else{
          accumuledResult[6-i] = Math.max(accumuledResult[7-i]-granulometrie[6-i],0)
        }
          }
          accumuledResult[7] = granulometrie[7]
          console.log(accumuledResult);
      setResult(accumuledResult);

      console.log("_______Successfully predicted particle size curve");
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

          <Carousel imageTop={img[0]} imageBottom={img[1]}/>
            
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
