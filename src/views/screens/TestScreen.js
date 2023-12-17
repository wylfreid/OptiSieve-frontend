import React, {useState} from 'react'
import { Dimensions, TouchableOpacity, ImageBackground, View } from 'react-native'
import { ExpoImageManipulator } from 'react-native-expo-image-cropper'

export default function App() {
    const [showModal, setShowModal] = useState(false);
    const [uri, setUri] = useState("https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png");
    const { width, height } = Dimensions.get('window')

  const onToggleModal = () => {
    setShowModal(!showModal)
  }


  return(
      
          <View
            style={{flex: 1}}
          >
            <TouchableOpacity style={{flex: 1}} title="Open Image Editor" onPress={() => onToggleModal()}>
                <ImageBackground
                    resizeMode="contain"
                    style={{
                        justifyContent: 'center', padding: 20, alignItems: 'center', height, width, backgroundColor: 'black',
                    }}
                    source={{ uri }}
                >
                    <ExpoImageManipulator
                        currentSize ={{width, height}}
                        photo={{uri}}
                        isVisible={showModal}
                        onPictureChoosed={(data) => {
                            setUri(data.uri)
                        }}
                        onToggleModal={() => onToggleModal()}
                        saveOptions={{
                            compress: 1,
                            format: 'png',
                            base64: true,
                        }}
                    />
                </ImageBackground>
                </TouchableOpacity>
          </View>
      
    );
}