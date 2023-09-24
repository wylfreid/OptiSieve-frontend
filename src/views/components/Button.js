import { TouchableOpacity, Text,StyleSheet } from "react-native";
import COLORS from "../../const/colors";


const Button = ({title,onPress = ()=>{}, ...props})=>{
return(
    <TouchableOpacity style={[styles.button, {...props}]} onPress={onPress()} activeOpacity={0.7}>
    <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
)
}
const styles = StyleSheet.create({
    button: {
      height:55,
      width:"100%",
      backgroundColor: COLORS.purple,
      marginVertical:10,
      alignItems: "center",
      justifyContent: "center",
      borderRadius:5,
    },
    text:{
        fontSize:18,
        fontFamily: 'PTSans-bold', 
        color:COLORS.white
    }
  });
export default Button;