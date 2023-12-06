import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomBtn = ({ onPress, title }) => (
  <TouchableOpacity style={btn_styles.button} onPress={onPress}>
    <Text style={btn_styles.text}>{title}</Text>
  </TouchableOpacity>
);

const btn_styles = StyleSheet.create({
  button: {
    flex:0.3,
    backgroundColor: '#a2e78d', // react-native-paper 기본 색상
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    margin:10
  },
  text: {
    fontFamily:"jua",
    color: '#555',
    fontSize: 18,
  },
});

export default CustomBtn;
