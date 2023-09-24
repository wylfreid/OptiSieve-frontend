import React, { useState, useContext, useEffect } from 'react';
import { View,Text, StyleSheet, TouchableWithoutFeedback, Alert, useWindowDimensions } from 'react-native';
import Svg, { Path, Text as SvgText, Line, Circle } from 'react-native-svg';
import * as d3 from 'd3';
import ResultContext from "../../hooks/ResultContext";

const data = [
   0.08 ,
   0.16,
   0.315 ,
   0.630,
   1.250,
   2.5,
   5,
];

const ResultScreen = () => {

  const { result } = useContext(ResultContext);

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
  
  return (
    <View style={styles.container}>
      <Svg style={styles.svg} width={width + margin.left + margin.right} height={height + margin.top + margin.bottom} transform={"translate(0, 25)"}>
        <Path d={monotoneCurve(dataArray)} fill="none" stroke="#FFA500" strokeWidth="2" />
        <Line x1={margin.left} y1={height} x2={width + margin.left + margin.right} y2={height} stroke="#fff" strokeWidth="1" />
        {axisLabelsX.map((x) => (
          <React.Fragment key={x}>
            <SvgText x={xScale(x)} y={height + margin.bottom - 5} fill="#50C2C9" fontSize="12" textAnchor="middle">
              {x}
            </SvgText>
            <Line x1={xScale(x)} y1={-height} x2={xScale(x)} y2={yScale(0)} stroke="#fff" strokeWidth="1" />
            {yScale(0) !== height && (
              <Line x1={xScale(x)} y1={yScale(0)} x2={xScale(x)} y2={margin.top} stroke="#fff" strokeWidth="1" />
            )}
          </React.Fragment>
        ))}
        
        {axisLabelsY.map((y) => (
          <React.Fragment key={y}>
            <SvgText x="35" y={yScale(y)} fill="#50C2C9" fontSize="12" textAnchor="end">
              {y}
            </SvgText>
            <Line x1={margin.left} y1={yScale(y)} x2={width + margin.left + margin.right} y2={yScale(y)} stroke="#fff" strokeWidth="1" />
            {y === axisLabelsY[axisLabelsY.length - 1] && (
              <Line x1={margin.left} y1={yScale(y)} x2={margin.left} y2={margin.top} stroke="#fff" strokeWidth="1" />
            )}
          </React.Fragment>
        ))}
        <Line x1={margin.left} y1={yScale(0)} x2={margin.left+ width + margin.right} y2={yScale(0)} stroke="#fff" strokeWidth="1" />
        {dataArray.map((d, i) => (
          <TouchableWithoutFeedback key={i} onPress={() => handlePointPress(d)}>
            <Circle cx={xScale(d.x)} cy={yScale(d.y)} r="6" fill="#50C2C9" />
          </TouchableWithoutFeedback>
        ))}
      </Svg>

      <View style={{marginTop:30, alignSelf: "flex-start", justifyContent: 'center', flexDirection: "row"}}>
        <Text style={{ marginLeft:10, fontSize: 13, fontStyle: 'italic'}}> Percentage of bricks in the sample : </Text> 
        <Text style={{color: '#2E7A80', fontWeight: "bold", fontStyle: 'italic'}}>{Math.round(result[7]*100)}%</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FFFFFF',
  },
  svg: {
  backgroundColor: '#021327',
  transform: [{translateY: 25}],
  },
  });
  
  export default ResultScreen;
  
  
