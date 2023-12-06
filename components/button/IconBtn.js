import {Image, TouchableOpacity} from "react-native";
import icon_styles from "./icon.style"


const IconBtn = ({iconUrl, dimension, handlePress}) => {
    return(
        <TouchableOpacity style = {icon_styles.btnContainer}
            onPress={handlePress}>
            <Image
                source={iconUrl}
                resizeMode='contain'
                style = {icon_styles.btnImg(dimension)}
            />
        </TouchableOpacity>

    )
    
}

export default IconBtn