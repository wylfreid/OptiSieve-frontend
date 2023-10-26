import React, { useState, useContext, useEffect, useRef } from 'react';
import { View,Text, StyleSheet, TouchableWithoutFeedback, Alert, useWindowDimensions, TouchableOpacity } from 'react-native';
import Svg, { Path, Text as SvgText, Line, Circle } from 'react-native-svg';
import * as d3 from 'd3';
import { useSelector } from 'react-redux';
import Logo from '../../../assets/images/Logo';
import Pdf from '../../../assets/images/shapes/Pdf';
import COLORS from '../../const/colors';
import Home from '../../../assets/images/shapes/Home';

import ViewShot from "react-native-view-shot";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";


const data = [
   0.08 ,
   0.16,
   0.315 ,
   0.630,
   1.250,
   2.5,
   5,
   10,
   14,
   20,
   31.5
];

const res = [0, 0, 0.009026498533785343, 0.021147500723600388, 0.03020553942769766, 0.04224127437919378, 0.053223625756800175, 0.22656452748924494, 0.42716018948704004, 0.6183350691571832, 0.8064886340871453, 0.9873665729537606, undefined]

const ResultScreen = ({navigation}) => {

  const result = useSelector((state) => state.result.result);

  const sample_name = useSelector((state) => state.result.sample_name);

  const [dataArray, setDataArray] = useState([]);

  const margin = { top: 40, right: 20, bottom: 40, left: 40 };
  const width = useWindowDimensions().width -20 - margin.left - margin.right;
  const height = useWindowDimensions().width -20 - margin.top - margin.bottom;

  const axisLabelsY = [0,10,20,30,40,50,60,70,80,90,100];

  const axisLabelsX = [0.001,0.01,0.1,1,10,100];

  const xScale = d3.scaleLog()
    .domain([0.001, 100])
    .range([margin.left, width]);

    const yScale = (y) => {
      if (y <= 0) {
        return height;
      } else if (y >= 100) {
        return 0;
      } else {
        return height - (y / 100) * height;
      }
    }

  const handlePointPress = (point) => {
    Alert.alert(`Point cliqué : (x: ${point.x}, y: ${point.y})`);
  };

  const monotoneCurve = (data) => {
    const curve = d3.line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(d3.curveMonotoneX)(data);
  
    return curve;
  };

  useEffect(()=>{
    let temp = []
    for (let index = 0; index < result?.length-1; index++) {
      temp.push({x: data[index], y: result[index]*100});
    }
    setDataArray(temp)
  },[result])

  

  const viewRef = useRef();

  // Fonction pour capturer la vue et enregistrer le fichier PDF
const captureViewAsPDF = async () => {
  try {
    // Capture la vue en utilisant react-native-view-shot
    const uri = await ViewShot.captureRef(viewRef, {
      format: "jpg", // Format d'image pour la capture
      quality: 1, // Qualité de l'image (0 à 1)
      result: "tmpfile", // Résultat sous forme de fichier temporaire
    });

    // Vérifie la plateforme pour déterminer le chemin de sauvegarde
    const folderPath =
      Platform.OS === "ios"
        ? FileSystem.documentDirectory
        : FileSystem.cacheDirectory;

    // Génère un nom de fichier unique
    const fileName = `${sample_name}_${Date.now()}.pdf`;

    // Convertit l'image capturée en PDF en utilisant FileSystem
    const pdfUri = `${folderPath}${fileName}`;
    await FileSystem.moveAsync({
      from: uri,
      to: pdfUri,
    });

    // Affiche le chemin du fichier PDF
    console.log("Chemin du fichier PDF :", pdfUri);
  } catch (error) {
    console.log("Erreur lors de la capture et de l'enregistrement du PDF :", error);
  }
};


  
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Logo/>
          
      </View>


      <View ref={viewRef} 
      
      style={{flex: 0.8, backgroundColor: '#F4F4F4',}}>
          <View style={styles.bottomContainer}>
          
          <View style={styles.header}>
            <Text style={{fontSize: 18, fontFamily: "PTSans-bold"}}> Resultat d’analyse </Text> 
          </View>

          <Svg style={styles.svg} width={width + margin.left + margin.right} height={height + margin.top + margin.bottom} transform={"translate(0, 25)"}>
              <Text style={{marginTop: -20,fontSize: 12, fontFamily: "PTSans-regular", alignSelf: "center"}}> {sample_name} </Text> 
            
            <Path d={monotoneCurve(dataArray)} fill="none" stroke="#0072F7" strokeWidth="2" />

            
            <Line x1={margin.left} y1={-24} x2={width + margin.left + margin.right} y2={-24} stroke="#666666" strokeWidth="1" />

            <Line x1={width + 59} y1={-height} x2={width + 59} y2={yScale(0)} stroke="#666666" strokeWidth="1" />


            <Line x1={margin.left} y1={height} x2={width + margin.left + margin.right} y2={height} stroke="#666666" strokeWidth="1" />
            {axisLabelsX.map((x) => (
              <React.Fragment key={x}>
                <SvgText x={xScale(x)} y={height + margin.bottom - 20} fill="#000" fontSize="12" textAnchor="middle">
                  {x}
                </SvgText>
                <Line x1={xScale(x)} y1={-height} x2={xScale(x)} y2={yScale(0)} stroke="#666666" strokeWidth="1" />
                {yScale(0) !== height && (
                  <Line x1={xScale(x)} y1={yScale(0)} x2={xScale(x)} y2={margin.top} stroke="#666666" strokeWidth="1" />
                )}
              </React.Fragment>
            ))}
            
            {axisLabelsY.map((y) => (
              <React.Fragment key={y}>
                <SvgText x="35" y={yScale(y)} fill="#000" fontSize="12" textAnchor="end">
                  {y}
                </SvgText>
                <Line x1={margin.left} y1={yScale(y)} x2={width + margin.left + margin.right} y2={yScale(y)} stroke="#666666" strokeWidth="1" />
                {y === axisLabelsY[axisLabelsY.length - 1] && (
                  <Line x1={margin.left} y1={yScale(y)} x2={margin.left} y2={margin.top} stroke="#666666" strokeWidth="1" />
                )}
              </React.Fragment>
            ))}
            <Line x1={margin.left} y1={yScale(0)} x2={margin.left+ width + margin.right} y2={yScale(0)} stroke="#666666" strokeWidth="1" />
            {dataArray.map((d, i) => (
              <TouchableWithoutFeedback key={i} onPress={() => handlePointPress(d)}>
                <Circle cx={xScale(d.x)} cy={yScale(d.y)} r="6" fill="#0072F7" />
              </TouchableWithoutFeedback>
            ))}
          </Svg>

          <View style={{marginTop:20,backgroundColor: '#F4F4F4', width: "100%", borderRadius: 8,paddingVertical: 20,justifyContent: 'center', flexDirection: "row"}}>
            <View style={{}}>
              <Text style={{fontSize: 18, fontFamily: "PTSans-regular"}}> Constituants de l’échantillon </Text> 
              <View style={{marginTop: 10,justifyContent: 'center', flexDirection: "row", gap: 10}}>
                {["Sable", "Gravier", "Argile"].map((item, index)=>(
                  <View key={index} style={styles.material}>
                    <Text style={{fontSize: 12, fontFamily: "PTSans-regular", color: "#666666"}}> {item} </Text>
                    
                  </View>
                )) 
                }
              </View>
            </View>
          </View>


            <TouchableOpacity onPress={captureViewAsPDF} style={{backgroundColor: '#F4F4F4', width: "100%", borderRadius: 8,paddingVertical: 20,marginTop: 10,justifyContent: 'center',alignItems: "center", flexDirection: "row", gap: 10}}>
                <Pdf />
                <Text style={{fontSize: 14, fontFamily: "PTSans-regular"}}> Telecharger les resultats en PDF </Text>
            </TouchableOpacity>

        </View>
      </View>
      <View style={{backgroundColor: '#fff',height: 80,gap: 15,marginHorizontal: 30, marginTop: 20, justifyContent: "space-between", alignItems: "center", flexDirection:"row"}}>
              <TouchableOpacity onPress={() =>navigation.navigate('HomeScreen')} style={{justifyContent: "center", alignItems: "center",  height:55, width: 54 ,backgroundColor: "#F4F4F4", borderRadius: 8}}>
                <Home />
              </TouchableOpacity>

              <View style={{flex: 1}}>
                <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.purple}]} onPress={() =>{}} activeOpacity={0.7}>
                  <Text style={styles.text}>Nouvelle analyse</Text>
                </TouchableOpacity>
              
              </View>

            
            </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: "#fff",
  },
  svg: {
  backgroundColor: '#fff',
  transform: [{translateX: -10}, {translateY: 30}],
  
  },
  topContainer: {
    backgroundColor: '#F4F4F4',
    flex: 0.20,
    alignItems: "center",
    justifyContent: "center",
    /* backgroundColor: COLORS.purple, */
  },

  bottomContainer: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30

  },
  header:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  material:{
    padding: 10,
    backgroundColor: "rgba(217, 217, 217, 0.32)",
    borderRadius: 4
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
  
  });
  
  
  export default ResultScreen;
  
  
