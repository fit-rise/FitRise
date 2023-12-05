import {Image, TouchableOpacity} from "react-native";
import icon_styles from "./icon.style"


const CircleBtn = ({iconUrl, dimension, handlePress}) => {
    return(
        <TouchableOpacity style = {icon_styles.circleBtn}
        onPress={handlePress}>
        <Image
            source={iconUrl}
            resizeMode='contain'
            style = {icon_styles.btnImg(dimension)}
        />
    </TouchableOpacity>

    )
    
}

export default CircleBtn