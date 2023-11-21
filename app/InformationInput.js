import React, { useState } from 'react';
//alert 창 누른 없앤 후에 넘어갈 수 있도록 Alert 컴포넌트 사용
import { View, Button, Text, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {Stack, useRouter} from "expo-router";

import info_styles from "../components/info.style"
import Info_TextInput from '../components/Info_TextInput'

const InformationInput = () => {
  const [exerciseLevel, setExerciseLevel] = useState('beginner'); // 운동 수준 상태 추가
  const [goal, setGoal] = useState('weight_loss'); // 운동 목표 상태 추가
  const router = useRouter()

  const handlePress = () => {

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

    <View style={info_styles.container}>
        <Text style={info_styles.header}>초기 설정</Text>
        <View style={info_styles.inputGroup}>
            <Text style={info_styles.label}>키</Text>
            <Info_TextInput
                    placeholder="키 입력"
                    keyboardType="numeric"
                />
            <Text style={info_styles.unit}>cm</Text>
        </View>
      
        <View style={info_styles.inputGroup}>
            <Text style={info_styles.label}>몸무게</Text>
            <Info_TextInput
            placeholder="몸무게 입력"
            keyboardType="numeric"
            />
            <Text style={info_styles.unit}>kg</Text>
        </View>
      
        <View style={info_styles.picker_container}>
            <Text style={info_styles.label}>운동 수준</Text>
            <Picker
                selectedValue={exerciseLevel}
                style={info_styles.picker}
                itemStyle={{fontSize:14}}
                onValueChange={(itemValue, itemIndex) => setExerciseLevel(itemValue)}>
                <Picker.Item label="초보" value="beginner" />
                <Picker.Item label="중급" value="intermediate" />
                <Picker.Item label="상급" value="advanced" />
            </Picker>
        </View>

        <View style={info_styles.picker_container}>
            <Text style={info_styles.label}>운동 목표</Text>
            <Picker
                selectedValue={goal}
                style={info_styles.picker}
                itemStyle={{fontSize:14}}
                onValueChange={(itemValue, itemIndex) => setGoal(itemValue)}>
                <Picker.Item label="체중 감량" value="weight_loss" />
                <Picker.Item label="근육 증가" value="muscle_gain" />
                <Picker.Item label="체력 증진" value="stamina_improvement" />
            </Picker>
        </View>

        <View style={info_styles.inputGroup}>
            <Text style={info_styles.label}>운동 횟수</Text>
            <Info_TextInput
              placeholder="주당 운동 횟수(ex)주 3회)"
              keyboardType="numeric"
            />
            <Text style={info_styles.unit}>회</Text>
        </View>
        <View style={info_styles.inputGroup}>
            <Text style={info_styles.label}>제약 사항</Text>
            <Info_TextInput
              placeholder="제약사항 입력(부상 등)"
              keyboardType="default"
            />
        </View>
      
      <Button title="완료" onPress={handlePress} />
    </View>
  );
};

export default InformationInput