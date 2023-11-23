import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Stack, useRouter } from "expo-router";
import {IP_URL}from "@env"
import { ActivityIndicator, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../constants';

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
    fetch(`${IP_URL}/MainScreen/food`, {
      method: "POST",
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
      <View style={styles.header}>
        <Ionicons name="book" size={24} color="black" onPress={() => router.push('/ExerciseDictionary')} />
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <><><View style={styles.characterContainer}>
          <Image source={images.level_1} resizeMode="cover" style={styles.characterImage} />
          <View style={styles.experienceBar}>
            <View style={styles.experienceFill} /* 현재 경험치에 따라 너비 조정 */ />
            <Text style={styles.experienceText}>XP: {exercise[0]?.exp} / 500</Text>
          </View>
        </View><ScrollView style={styles.exerciseList}>
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
          </ScrollView></><View style={styles.btnContainer}>
            <Button
              title="완료"
              onPress={handlePress}
              color="#841584" />
          </View></>

      )}
      <View style={styles.tabBar}>
        <View style={styles.tabBarIcon}>
          <Ionicons name="home-outline" size={24} color="black" onPress={() => router.push('/MainScreen')} />
          <Text>홈</Text>
        </View>
        <View style={styles.tabBarIcon}>
          <Ionicons name="trophy-outline" size={24} color="black" onPress={() => router.push('/RankingScreen')} />
          <Text>랭킹</Text>
        </View>
        <View style={styles.tabBarIcon}>
          <Ionicons name="calendar-outline" size={24} color="black" onPress={() => router.push('/CalendarScreen')} />
          <Text>달력</Text>
        </View>
        <View style={styles.tabBarIcon}>
          <Ionicons name="person-outline" size={24} color="black" onPress={() => router.push('/AnalysisScreen')} />
          <Text>프로필</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingRight: 20,
    alignItems: 'flex-end',
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
  },
  characterImage: {
    width: 200,
    height: 200,
    // 캐릭터 이미지에 맞는 크기 조정
  },
  experienceBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  experienceFill: {
    backgroundColor: 'blue',
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
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#e1e1e1',
  },
});

export default MainScreen;