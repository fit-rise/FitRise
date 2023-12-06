import React, { useEffect, useState } from 'react';
import { View, Button, Text, Alert,TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter} from "expo-router";
import info_styles from "../components/info.style"
import {setNickname,getItem } from './storage/setNickname';
import {IP_URL}from "@env"

const InformationInput = () => {
  const [namecheck,setNameCheck] = useState(false)
  const [exerciseLevel, setExerciseLevel] = useState('beginner'); // 운동 수준 상태 추가
  const [goal, setGoal] = useState('weight_loss'); // 운동 목표 상태 추가
  const [inputHeight, seHeight] = useState(''); // 키 입력값
  const [inputWeight, setWeight] = useState(''); //몸무게 입력값
  const [inputExercise, setExercise] = useState(''); // 운동 회수
  const [inputNotice, setNotice] = useState(''); // 운동 제약사항
  const [stoageValue, setStoageValue] = useState('');//스토리지 관련 스테이터스
  const [name,setName] = useState('');
  const router = useRouter()
  

  useEffect(() => {
    
    try{
     if(stoageValue != ''){//스토리지에 닉네임이 있으면 
       console.log("useEffect if : "+stoageValue)
       router.push('/MainScreen')
     }else{
       Alert.alert("정보를 입력해주세요")
       }
   }catch(e){
      console.log(e)
   }
 },[]);
 

  const handlePress = async() => {
    
   try{
      if(namecheck == false){
        Alert.alert(
          '닉네임 중복을 확인해주세요',
        );
      }else{
      fetch(`${IP_URL}/UserInfoData`,{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        name: name, 
        height: inputHeight, 
        weight: inputWeight,
        Exercise: inputExercise,
        Notice: inputNotice,
        ex_goal: goal,
        ex_level: exerciseLevel,
        Notice: inputNotice 
        }) 
      }).then((res)=>(res.json())).then((json)=>{
   // Alert.alert를 사용하여 확인 버튼이 눌렸을 때의 행동을 정의
    Alert.alert(
    '제출 확인', // Alert의 제목
    '정보가 제출되었습니다.', // Alert의 내용
    [
      {text: 'OK', onPress: () => router.push('/MainScreen')}, // OK 버튼을 눌렀을 때 router.push를 호출
    ],
    {cancelable: false},
  );
 
 
  router.push('/MainScreen')
  })}
   }catch(e){
    console.log(e)

   }
  };

 


  const NickcopyCheck = async() =>{
    fetch(`${IP_URL}/name`,{
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name, 
      }
      )
    }).then((res)=>(res.json())).then((json)=>{
      console.log(json)
      if(json == "user not found"){
        setNameCheck(true)
        console.log("중복확인")
        Alert.alert(
          '사용이 가능한 닉네임입니다',
        );
        setNickname('key',name);//닉네임을 스토리지에 저장하기위한 함수호출
        confirmAsyncValue();//저장 확인
      }else{
        setNickname('key',name);
        setNameCheck(false)
        Alert.alert(
          '이미 사용중인 닉네임입니다',
        );
        router.push('/MainScreen')
      }
    })
  }
  return (
      <View style={info_styles.container}>
        <Text style={info_styles.header}>초기 설정</Text>
        
        <View style={info_styles.inputGroup}>
            <Text style={info_styles.label}>닉네임</Text>
            <TextInput
                    placeholder="닉네임 입력"
                    onChangeText={setName}
                    value={name}
                />
            <Button title="중복확인" onPress={NickcopyCheck} />
        </View>


        <View style={info_styles.inputGroup}>
            <Text style={info_styles.label}>키</Text>
            <TextInput
                    placeholder="키 입력"
                    keyboardType="numeric"
                    onChangeText={seHeight}
                    value={inputHeight}
                />
            <Text style={info_styles.unit}>cm</Text>
        </View>
      
        <View style={info_styles.inputGroup}>
            <Text style={info_styles.label}>몸무게</Text>
            <TextInput
            placeholder="몸무게 입력"
            keyboardType="numeric"
            onChangeText={setWeight}
            value={inputWeight}
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
            <TextInput
              placeholder="주당 운동 횟수(ex)주 3회)"
              keyboardType="numeric"
              onChangeText={setExercise}
              value={inputExercise}
            />
            <Text style={info_styles.unit}>회</Text>
        </View>
        <View style={info_styles.inputGroup}>
            <Text style={info_styles.label}>제약 사항</Text>
            <TextInput
              placeholder="제약사항 입력(부상 등)"
              keyboardType="default"
              onChangeText={setNotice}
              value={inputNotice}
            />
        </View>
      
      <Button title="완료" onPress={handlePress} />
    </View>
  );
};

export default InformationInput