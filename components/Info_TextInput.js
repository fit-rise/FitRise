import React from 'react';
import { TextInput, View } from 'react-native';
import info_styles from "./info.style";

const Info_TextInput = ({ placeholder, keyboardType, onChangeText }) => {
    return (
        <View style={info_styles.input}>
            <TextInput
                placeholder={placeholder}
                onChangeText={onChangeText} // 상위 컴포넌트로부터 받은 onChangeText 사용
                keyboardType={keyboardType}
            />
        </View>
    );
}

export default Info_TextInput;
