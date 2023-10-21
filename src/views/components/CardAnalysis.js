import * as React from "react";
import { TouchableOpacity, Text,StyleSheet, View, useWindowDimensions, Image } from "react-native";
import COLORS from "../../const/colors";
import Star from "../../../assets/images/shapes/Star";
import Results from "../../../assets/images/shapes/Results";

import { format } from "date-fns";
import { fr } from "date-fns/locale";

const CardAnalysis = ({item})=>{

    const {width, height} = useWindowDimensions()
return(
    <View style={[styles.card, {width: width - 50}]}>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <Text style={styles.headText}>Analyse du {item?.date && format(item?.date?.toDate(), "dd MMM yyyy", { locale: fr })}</Text>

            <TouchableOpacity style={{flexDirection: "row", gap: 5}}>
                <Star height={19} width={21} />
                <Text style={[styles.headText, {color: COLORS.purple, fontFamily: 'PTSans-bold', fontSize: 15} ]}>Editer la notation</Text>
            </TouchableOpacity>
        </View>

        <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 15}}>
            <Image style={styles.image} source={{uri: item?.images[0]}} />
            <Image style={styles.image} source={{uri: item?.images[1]}} />
        </View>

        <TouchableOpacity style={styles.button}>
           
                <Results />

                <Text style={styles.headText}>Consulter les resultats</Text>
             
        </TouchableOpacity>

        <View style={{flexDirection: "row", marginTop: 15}}>
            {
                new Array(5).fill().map((item, index)=>(
                    <Star height={13} width={14} key={index} />
                ))
            }
        </View>

        <View style={{marginTop: 5}}>
            <Text style={styles.headText}>Lorem lorem lorem lorem lorem lorem lorem ipsum Lorem lorem lorem lorem lorem lorem lorem ipsum ipsum</Text>
        </View>
    </View>
)
}
const styles = StyleSheet.create({
    card: {
      elevation: 2,
      padding: 20,
      flex: 1,
      backgroundColor: COLORS.white,
      marginVertical:10,
      borderRadius:8,
    },
    text:{
        fontSize:18,
        fontFamily: 'PTSans-bold', 
        color:COLORS.white
    },
    button:{
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center", 
        gap: 10, 
        marginTop: 15,
        borderRadius: 8,
        borderWidth: 1,
        paddingVertical: 13
    },
    headText:{
        fontSize:14,
        fontFamily: 'PTSans-regular', 
    },
    image:{
        width: 141,
        height: 141,
        borderRadius: 8
    }
  });
export default CardAnalysis;