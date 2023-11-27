import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button, Alert, Dimensions } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Stack, useRouter } from "expo-router";

import { ActivityIndicator, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../constants';
import TabBar from '../components/TabBar'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');


const MainScreen = () => {

  const [exercise, setExercise] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [checkedStates, setCheckedStates] = useState({});
  const router = useRouter()
  //완료버튼 클릭시
  const handlePress = () => {
    setisLoading(true);
    let exerciseid = [];
    let totalExp = 0;
    // 체크된 운동의 sets와 reps를 곱하여 경험치 계산
    exercise.forEach(data => {
      data.plans.forEach(plan => {
        plan.exercises.forEach(ex => {
          if (checkedStates[ex.id]) {
            totalExp += ex.sets * ex.reps;
            exerciseid.push(ex.id);
          }
        });
      });
    });
    // 현재 경험치에 더하기 
    const newExp = exercise[0].exp + totalExp;

    // 여기서 서버에 업데이트 요청
    fetch('http://localhost:3000/MainScreen/food', {
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: exercise[0].id,
        exid: exerciseid,
        exp: newExp
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        setExercise(result);
        setisLoading(false);
      })
  };
  //체크박스
  const handleCheckboxChange = (exerciseId, value) => {
    setCheckedStates({
      ...checkedStates,
      [exerciseId]: value
    });
  };
  //plans,exp 정보 요청
  useEffect(() => {
    setisLoading(true);
    fetch('http://localhost:3000/checklist', {
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "엄득용",
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        setExercise(result);
        setisLoading(false);
      });
  }, []);
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <View style={styles.experienceBar}>
            <View style={[styles.experienceFill, { width: `${(exercise[0]?.exp / 500) * 100}%`/* 여기에 경험치에 따른 너비 계산 로직 */ }]} />
            <Text style={styles.experienceText}>경험치: {exercise[0]?.exp} / 500</Text>
          </View>
          <Ionicons name="book" size={24} color="pink" onPress={() => router.push('/ExerciseDictionary')} />
          <View style={styles.characterContainer}>
            <Image source={images.background} resizeMode="stretch" style={styles.imageStyle} />
            <Image source={images.jelly} resizeMode="cover" style={styles.characterImage} />
          </View>
          <ScrollView style={styles.exerciseList}>
            {exercise?.map((data) => (
              data.plans.map((plan) => (
                <View key={plan.id}>
                  <Text>{plan.day}</Text>
                  {plan.exercises.map((ex) => (
                    <Card key={ex.id} style={styles.card}>
                      <Card.Title title={ex.exercise} />
                      <Card.Content>
                        <View style={styles.cardContent}>
                          <Text>{ex.sets} 세트, {ex.reps}회</Text>
                          <Checkbox
                            value={checkedStates[ex.id] || false}
                            onValueChange={(newValue) => handleCheckboxChange(ex.id, newValue)}
                            color={checkedStates[ex.id] ? '#4630EB' : undefined} />
                        </View>
                      </Card.Content>
                    </Card>
                  ))}
                </View>
              ))
            ))}
          </ScrollView>
          <View style={styles.btnContainer}>
            <Button
              title="완료"
              onPress={handlePress}
              color="#841584" />
          </View>
          <TabBar router={router} />
        </>
      )}
    </View>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 30,
  },

  characterContainer: {
    height: '35%', // 높이를 조정해 캐릭터 이미지에 맞게 설정
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  characterImage: {
    width: screenWidth * 0.3,
    height: screenHeight * 0.2,
    zIndex: 1,
  },
  experienceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  experienceFill: {
    backgroundColor: 'lime',
    width: '50%', // 현재 경험치에 따라 너비를 조정해야 함
    height: 10,
  },
  experienceText: {
    width: 200,
    paddingLeft: 10,
  },
  exerciseList: {
    flex: 1,
  },
  card: {
    margin: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageStyle: {
    width: screenWidth,
    height: screenHeight * 0.32,
    position: 'absolute',
  },
});

export default MainScreen;
