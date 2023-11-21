// Info_TextInput.js
import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import info_styles from "./info.style";

const Info_TextInput = ({ placeholder, keyboardType }) => {
    const [text, setText] = useState('');

    const onChangeText = (inputText) => {
        setText(inputText);
    }

    return (
        <View style={info_styles.input}>
            <TextInput
                placeholder={placeholder}
                onChangeText={onChangeText}
                value={text}
                keyboardType={keyboardType}
            />
        </View>
    );
}

export default Info_TextInput;
