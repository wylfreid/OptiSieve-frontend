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
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../firebase.config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRef } from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import Close from "../../../assets/images/shapes/Close";



const options = { encoding: FileSystem.EncodingType.Base64 };

export default function TensorScreen({ navigation }) {

  const images = useSelector((state) => state.images);

  const infoModal = useRef(null);

  const openBottomSheet = (ref) => {
    if (ref == infoModal) {
      
      infoModal?.current?.open();
      
    }
  };

 

  const closeBottomSheet = (ref) => {
    if (ref == infoModal) {
      
      infoModal.current.close();
      navigation.navigate('HomeScreen');
      
    }
  };

  const handleCancel = () => {
    navigation.navigate('HomeScreen');
  };



  useEffect(() => {
    async function loadModel() {
      console.log("[+] Application started");
      //Wait for tensorflow module to be ready
      const tfReady = await tf.ready();
      console.log("[+] Loading pre-trained images detection model");
      //Replce model.json and group1-shard.bin with your own custom model
      const modelJson = await require("../../../assets/model/model.json");
      const modelWeights1 =
        await require("../../../assets/model/group1-shard1of21.bin");
      const modelWeights2 =
        await require("../../../assets/model/group1-shard2of21.bin");
      const modelWeights3 =
        await require("../../../assets/model/group1-shard3of21.bin");
      const modelWeights4 =
        await require("../../../assets/model/group1-shard4of21.bin");
      const modelWeights5 =
        await require("../../../assets/model/group1-shard5of21.bin");
      const modelWeights6 =
        await require("../../../assets/model/group1-shard6of21.bin");
      const modelWeights7 =
        await require("../../../assets/model/group1-shard7of21.bin");
      const modelWeights8 =
        await require("../../../assets/model/group1-shard8of21.bin");
      const modelWeights9 =
        await require("../../../assets/model/group1-shard9of21.bin");
      const modelWeights10 =
        await require("../../../assets/model/group1-shard10of21.bin");
      const modelWeights11 =
        await require("../../../assets/model/group1-shard11of21.bin");
      const modelWeights12 =
        await require("../../../assets/model/group1-shard12of21.bin");
      const modelWeights13 =
        await require("../../../assets/model/group1-shard13of21.bin");
      const modelWeights14 =
        await require("../../../assets/model/group1-shard14of21.bin");
      const modelWeights15 =
        await require("../../../assets/model/group1-shard15of21.bin");
      const modelWeights16 =
        await require("../../../assets/model/group1-shard16of21.bin");
      const modelWeights17 =
        await require("../../../assets/model/group1-shard17of21.bin");
      const modelWeights18 =
        await require("../../../assets/model/group1-shard18of21.bin");
      const modelWeights19 =
        await require("../../../assets/model/group1-shard19of21.bin");
      const modelWeights20 =
        await require("../../../assets/model/group1-shard20of21.bin");
      const modelWeights21 =
      await require("../../../assets/model/group1-shard21of21.bin");

      const ioHandler = bundleResourceIO(modelJson, [
        modelWeights1,
        modelWeights2,
        modelWeights3,
        modelWeights4,
        modelWeights5,
        modelWeights6,
        modelWeights7,
        modelWeights8,
        modelWeights9,
        modelWeights10,
        modelWeights11,
        modelWeights12,
        modelWeights13,
        modelWeights14,
        modelWeights15,
        modelWeights16,
        modelWeights17,
        modelWeights18,
        modelWeights19,
        modelWeights20,
        modelWeights21,
      ]);
      const GradingNetwork1 = await tf.loadGraphModel(
        ioHandler
      );

      console.log("[+] Model Loaded");

      appliedNetwork(GradingNetwork1)
    }
    loadModel();
  }, []);

  const appliedNetwork = async (GradingNetwork) => {
    try {
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
        let granularMaterialPredict = await GradingNetwork?.predict(testPictures[i]).dataSync();
        console.log(granularMaterialPredict[0]);
        if(granularMaterialPredict[0] >= 0.5 ){
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
        //console.log("_______Successfully predicted particle size curve");

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

          const uploadTask1 = uploadBytesResumable(storageRef1, blob1).then(
            
            () => {
              getDownloadURL(storageRef1).then(async (downloadURL1) => {

                const uploadTask2 = uploadBytesResumable(storageRef2, blob2).then(
            
                  () => {
                    getDownloadURL(storageRef2).then(async (downloadURL2) => {
                      await addDoc(docRef, {
                        ...newAnalysis_infos,
                        images: [downloadURL1, downloadURL2],
                        date: serverTimestamp(),
                      });
        
                  });
          
                  }
                );

            });
    
            }
          );

          
        } catch (err) {
        }

        navigation.navigate('ResultScreen');

      }else{
        openBottomSheet(infoModal)
        console.log("insérez des images valides");
      }

      
    } catch (error) {
      console.log("[-] Unable to load image " + error);
    }
  };

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
  return (
    <View style={{ flex: 1 }}>

        <Loader visible={true} />
      

        <RBSheet
            ref={infoModal}
            height={293}
            openDuration={250}
            closeOnPressMask={false}
            closeOnDragDown={false}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20
              }
            }}
          >

              <Close style={{alignSelf: "center",marginTop: 10,}} />

            <Text style={{marginTop: 15,fontSize: 28, alignSelf: "center", fontFamily: 'PTSans-regular', fontWeight: 700}} 
            > Images invalides
           </Text>

           <Text style={{marginTop: 10,fontSize: 14, alignSelf: "center", fontFamily: 'PTSans-regular', fontWeight: 700}} 
            > Veuillez importer des images de materiaux granulaires
           </Text>

            <View style={{flex: 1, paddingHorizontal: 30, justifyContent: "flex-end",}}>

                <TouchableOpacity onPress={() => closeBottomSheet(infoModal)} style={{ width: "100%",marginBottom: 10,alignSelf: "center",justifyContent: "center", alignItems: "center",  height:54,backgroundColor: COLORS.black, borderRadius: 8}}>
                  <Text style={{color: "#fff"}}>OK</Text>
                </TouchableOpacity>
            </View>



          </RBSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
