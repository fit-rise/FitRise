import React from 'react';
import { TextInput, View } from 'react-native';
import info_styles from "./info.style";

const Info_TextInput = ({ placeholder, keyboardType,onChangeText, value }) => {
    return (
        <View style={info_styles.input}>
            <TextInput
                placeholder={placeholder}
                onChangeText={onChangeText}
                value={value}
                keyboardType={keyboardType}
            />
        </View>
    );
}

export default Info_TextInput;
