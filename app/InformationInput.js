import React, { useEffect, useState } from 'react';
//alert 창 누른 없앤 후에 넘어갈 수 있도록 Alert 컴포넌트 사용
import { View, Text, Alert, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { CustomBtn } from '../components'
import { Picker } from '@react-native-picker/picker';
import { useRouter } from "expo-router";
import info_styles from "../components/info.style"
import { setNickname, getItem } from './storage/setNickname';
import { IP_URL } from "@env"

const InformationInput = () => {
  const [namecheck, setNameCheck] = useState(false)
  const [exerciseLevel, setExerciseLevel] = useState('beginner'); // 운동 수준 상태 추가
  const [goal, setGoal] = useState('weight_loss'); // 운동 목표 상태 추가
  const [inputHeight, setHeight] = useState(''); // 키 입력값
  const [inputWeight, setWeight] = useState(''); //몸무게 입력값
  const [inputExercise, setExercise] = useState(''); // 운동 회수
  const [inputNotice, setNotice] = useState(''); // 운동 제약사항
  const [stoageValue, setStoageValue] = useState('');//스토리지 관련 스테이터스
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()



  useEffect(() => {
    const checkStorageAndNavigate = async() => {
      const userNickName = await getItem('key');
      console.log(userNickName)
      if (userNickName) { // 닉네임이 존재하면 메인 스크린으로 이동
        router.push('/MainScreen');
      }
    };

    checkStorageAndNavigate();
  }, []);


  const handlePress = async () => {
    if (!namecheck) {
      Alert.alert('닉네임 중복을 확인해주세요');
      return;
    }
    if (inputHeight === '' || inputWeight === '' || inputExercise === '') {
      Alert.alert('정보를 모두 입력해주세요');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${IP_URL}/UserInfoData`, {
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
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // 성공적으로 데이터가 제출되었음을 알림
      Alert.alert(
        '제출 확인',
        '정보가 제출되었습니다.',
        [{ text: 'OK', onPress: () => router.push('/MainScreen') }],
        { cancelable: false }
      );
    } catch (e) {
      console.error(e);
      Alert.alert('오류', '정보 제출 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };




  const NickcopyCheck = async () => {
    fetch(`${IP_URL}/name`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
      }
      )
    }).then((res) => (res.json())).then((json) => {
      console.log(json)
      if (json == "user not found") {
        setNameCheck(true)
        console.log("중복확인")
        Alert.alert(
          '사용이 가능한 닉네임입니다',
        );
        setNickname('key', name);//닉네임을 스토리지에 저장하기위한 함수호출
        confirmAsyncValue();//저장 확인
      } else {
        setNickname('key', name);
        setNameCheck(false)
        Alert.alert(
          '이미 사용중인 닉네임입니다',
        );
      }
    })
  }
  if (isLoading) {
    return (
      <View style={info_styles.centeredView}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  } else {
    return (
      <SafeAreaView style={info_styles.container}>
        <View style={info_styles.content_container}>
          <Text style={info_styles.header}>초기 설정</Text>

          <View style={info_styles.inputGroup}>
            <Text style={info_styles.label}>닉네임</Text>
            <TextInput
              placeholder="닉네임 입력"
              onChangeText={setName}
              value={name}
            />
            <CustomBtn
              title="중복확인"
              onPress={NickcopyCheck}>
            </CustomBtn>
          </View>


          <View style={info_styles.inputGroup}>
            <Text style={info_styles.label}>키</Text>
            <TextInput
              placeholder="키 입력"
              keyboardType="numeric"
              onChangeText={setHeight}
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
            <View style={{ flex: 1, marginBottom: 115 }}>
              <Picker
                selectedValue={exerciseLevel}
                style={info_styles.picker}
                itemStyle={{ fontSize: 14 }}
                onValueChange={(itemValue, itemIndex) => setExerciseLevel(itemValue)}>
                <Picker.Item label="초보" value="beginner" />
                <Picker.Item label="중급" value="intermediate" />
                <Picker.Item label="상급" value="advanced" />
              </Picker>
            </View>
          </View>

          <View style={info_styles.picker_container}>
            <Text style={info_styles.label}>운동 목표</Text>
            <View style={{ flex: 1, marginBottom: 120 }}>
              <Picker
                selectedValue={goal}
                style={info_styles.picker}
                itemStyle={{ fontSize: 14 }}
                onValueChange={(itemValue, itemIndex) => setGoal(itemValue)}>
                <Picker.Item label="체중 감량" value="weight_loss" />
                <Picker.Item label="근육 증가" value="muscle_gain" />
                <Picker.Item label="체력 증진" value="stamina_improvement" />
              </Picker>
            </View>
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
          <CustomBtn
            title="완료"
            onPress={handlePress}>
          </CustomBtn>
        </View>
      </SafeAreaView>
    );
  }
};

export default InformationInput