import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  StatusBar
} from "react-native";
import COLORS from "../../const/colors";

export default function Loader({ visible = false, title = "Loading..." }) {
  const { width, height } = useWindowDimensions();
  return (
    visible && (
      <View style={[styles.container, { width, height: height + StatusBar.currentHeight }]}>
        <View style={styles.loader}>
          <ActivityIndicator size={"large"} color={COLORS.purple} />
          <Text style={styles.textLoader}>{title}</Text>
        </View>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    //marginTop: StatusBar.currentHeight
  },
  loader: {
    height: 70,
    backgroundColor: COLORS.white,
    marginHorizontal: 50,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  textLoader: {
    marginLeft: 10,
    fontSize: 16,
  },
});
