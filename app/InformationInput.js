import React, { useState } from 'react';
//alert 창 누른 없앤 후에 넘어갈 수 있도록 Alert 컴포넌트 사용
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {Stack, useRouter} from "expo-router";
import { useEffect } from 'react';
 import {setNickname} from './setNickname'



const InformationInput = () => {
  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [exerciseLevel, setExerciseLevel] = useState('beginner'); // 운동 수준 상태 추가
  const [goal, setGoal] = useState('weight_loss'); // 운동 목표 상태 추가
  const [comment, setComment] = useState('');
   const [stoageValue, setStoageValue] = useState('');

  
  const router = useRouter()

  const handlePress = async() => {
    
    try{
    // Alert.alert를 사용하여 확인 버튼이 눌렸을 때의 행동을 정의
    Alert.alert(
      '제출 확인', // Alert의 제목
      '정보가 제출되었습니다.', // Alert의 내용
      [
        {text: 'OK', onPress: () => router.push('/MainScreen')}, // OK 버튼을 눌렀을 때 router.push를 호출
      ],
      {cancelable: false},
    );
     await setNickname('key',name);//닉네임을 스토리지에 저장하기위한 함수호출
     confirmAsyncValue();
  }catch(e){
    console.log(e)
  }
  
};

const confirmAsyncValue = async () => { //닉네임이 스토리지에 잘 저장 되있나 호출하는 함수 
  const result = await setNickname('key');
  setStoageValue(result);
  
  
};
useEffect(() => {//스토리지 확인용 *추후 삭제
   confirmAsyncValue();
});


  return (
    <View style={styles.container}>
        <Text style={styles.header}>초기 설정</Text>
        <View style={styles.inputGroup}>
            <Text style={styles.label}>이름</Text>
            <TextInput
            style={styles.input}
            placeholder="이름 입력"
            onChangeText={setName}
            value={name}
            />
            
        </View>
        <View style={styles.inputGroup}>
            <Text style={styles.label}>키</Text>
            <TextInput
            style={styles.input}
            placeholder="키 입력"
            keyboardType="numeric"
            onChangeText={setHeight}
            value={height}
            />
            <Text style={styles.unit}>cm</Text>
        </View>
      
        <View style={styles.inputGroup}>
            <Text style={styles.label}>몸무게</Text>
            <TextInput
            style={styles.input}
            placeholder="몸무게 입력"
            keyboardType="numeric"
            onChangeText={setWeight}
            value={weight}
            />
            <Text style={styles.unit}>kg</Text>
        </View>
      
        <View style={{flexDirection:'row', alignItems:'center', justifyContent: 'space-between'}}>
            <Text style={styles.label}>운동 수준</Text>
            <Picker
                selectedValue={exerciseLevel}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => setExerciseLevel(itemValue)}>
                <Picker.Item label="초보" value="beginner" />
                <Picker.Item label="중급" value="intermediate" />
                <Picker.Item label="상급" value="advanced" />
            </Picker>
        </View>

        <View style={{flexDirection:'row', alignItems:'center', justifyContent: 'space-between'}}>
            <Text style={styles.label}>운동 목표</Text>
            <Picker
                selectedValue={goal}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => setGoal(itemValue)}>
                <Picker.Item label="체중 감량" value="weight_loss" />
                <Picker.Item label="근육 증가" value="muscle_gain" />
                <Picker.Item label="체력 증진" value="stamina_improvement" />
            </Picker>
        </View>

      
        <View style={styles.inputGroup}>
            <Text style={styles.label}>제약 사항</Text>
            <TextInput
                style={styles.input}
                placeholder="제약사항 입력(부상 등)"
                onChangeText={setComment}
                value={comment}
            />
        </View>
      
      <Button title="완료" onPress={handlePress} />
    </View>
  );
};

export default InformationInput

const styles = StyleSheet.create({
    container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    },
    header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    },
    inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    },
    label: {
    width: 70, // 라벨 너비 고정
    },
    input: {
    flex: 1,
    },
    picker: {
        height: 50,
        marginBottom: 20,
      },
})