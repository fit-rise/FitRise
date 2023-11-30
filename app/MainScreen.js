import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button, Animated, PanResponder, TouchableOpacity, Dimensions,ImageBackground } from 'react-native';
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
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [containerLayout, setContainerLayout] = useState({ width: 0, height: 0 });

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
    fetch('http://10.0.2.2:3000/MainScreen/food', {
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
    fetch('http://10.0.2.2:3000/checklist', { // 또는 로컬 IP 사용
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
      })
      .catch((error) => {
        console.error('Error:', error);
        setisLoading(false);
      });
  }, []);
  useEffect(() => {
    // 원하는 x, y 좌표로 초기 위치 설정
    hero.setValue({ x: 150, y: 100 });
  }, []);
  // 캐릭터 초기 좌표설정
  const hero = useRef(new Animated.ValueXY()).current;
  //사용자의 터치 드래그 설정

  const panResponder = PanResponder.create({
    //터치시작
    onStartShouldSetPanResponder: () => true,
    //터치하고있을떄
    onPanResponderGrant: () => {
      setStartPos({ x: hero.x._value, y: hero.y._value });
    },
    //드래그중
    onPanResponderMove: (e, gestureState) => {
      const newX = startPos.x + gestureState.dx;
      const newY = startPos.y + gestureState.dy;
      hero.setValue({ x: newX, y: newY });
    },
    //드래그종료
    onPanResponderRelease: (e, gestureState) => {
      Animated.spring(hero.y, {
        toValue: 100,
        tension: 0,
        useNativeDriver: false
      }).start();
      if (hero.x._value > screenWidth / 1.1) {
        // 조건을 만족하면 원래 위치로 이동
        Animated.spring(hero, {
          toValue: { x: 300, y: startPos.y },
          useNativeDriver: false
        }).start();
      } else if (hero.x._value < -50) { // 또는 원하는 최소 x값으로 설정
        Animated.spring(hero, {
          toValue: { x: 0, y: startPos.y },
          useNativeDriver: false
        }).start();
      }
    }
  });
  // 현재 경험치에 따라 적절한 캐릭터 이미지를 선택하는 함수
  const getCurrentCharacterImage = (exp) => {
    if (exp < 100) {
      return images.stage1;
    } else if (exp < 200) {
      return images.stage2;
    } else if (exp < 300) {
      return images.stage3;
    } else {
      return images.stage4;
    }
    // 추가적인 레벨을 여기에 정의할 수 있습니다.
  };
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <View style={styles.characterContainer}>
          <ImageBackground source={images.background_sky} resizeMode="cover" style={styles.imageStyle}>
          <View style={styles.experienceBar}>
            <View style={[styles.experienceFill, { width: `${(exercise[0]?.exp / 500) * 100}%`/* 여기에 경험치에 따른 너비 계산 로직 */ }]} />
            <Text style={styles.experienceText}>경험치: {exercise[0]?.exp} / 500</Text>
          </View>
          <Ionicons name="book" size={24} color="pink" onPress={() => router.push('/ExerciseDictionary')} />
            <Image source={images.background} resizeMode="stretch" style={styles.imageStyle} />
            <Animated.View
              {...panResponder.panHandlers}
              style={[hero.getLayout(), { position: 'absolute' }]}>
              <Image
                source={getCurrentCharacterImage(exercise[0]?.exp)}
                resizeMode="contain"
                style={styles.characterImage}
              />
            </Animated.View>
            </ImageBackground>
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
    width: screenWidth * 0.2,
    height: screenHeight * 0.15,
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
