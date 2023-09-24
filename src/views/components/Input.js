import { Text, TextInput,StyleSheet, View } from "react-native";
import COLORS from "../../const/colors";
import { useState } from "react";
import Icon from 'react-native-vector-icons/Ionicons';

const Input = ({
  label,
  iconName,
  error,
  password,
  onFocus = () => {},
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePasseword, setHidePasseword] = useState(password);

  return (
    <View style={{ margin: 0, }}>
      
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error
              ? COLORS.red
              : isFocused
              ? COLORS.darkBlue
              : COLORS.grey,
          },
        ]}
      >
        <View style={{  }}>
          <Text style={styles.label}>{label}</Text>
        </View>

        <View style={styles.textContainer}>
          <TextInput
            autoCorrect={false}
            onFocus={() => {
              onFocus();
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
            style={{ color: COLORS.black, flex: 1, fontFamily: 'poppins-regular' }}
            secureTextEntry={hidePasseword ? hidePasseword : false}
            {...props}
          />
          {password ? (
            <Icon
              onPress={() => setHidePasseword(!hidePasseword)}
              name={hidePasseword ? "eye-outline" : "eye-off-outline"}
              style={{color:COLORS.purple,fontSize:22}}
            />
          ) : (
            <Icon name={iconName}  style={{color:COLORS.purple,fontSize:22}}/>
          )}
        </View>
    </View>
        {
          error && (
              <Text style={{marginTop:0, marginBottom: 7, marginRight: 0, color:COLORS.red, fontSize:12}}> {error} </Text>
          )
        }
    </View>
  );
};
const styles = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: COLORS.black,
    fontFamily: 'poppins-regular'
  },
  inputContainer: {
    height: 70,
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 0.3,
    borderRadius: 5,
  },
  textContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingRight: 15,
    
  },
});
export default Input;
