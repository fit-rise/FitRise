import React, { useEffect, useState, useRef } from 'react';
import { View, Modal, Text, StyleSheet, Image, ScrollView, Button, Animated, PanResponder, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Stack, useRouter } from "expo-router";
import { IP_URL } from "@env"
import { ActivityIndicator, Card } from 'react-native-paper';
import { setNickname,getItem } from './storage/setNickname';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../constants';
import TabBar from '../components/TabBar'
import * as Progress from 'react-native-progress';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

//env 체크
const MainScreen = () => {
  const [stoageValue, setStoageValue] = useState('');//스토리지 관련 스테이터스
  const [exercise, setExercise] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [checkedStates, setCheckedStates] = useState({});
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter()
 
  //운동완료 확인누를시
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
        resetCheckboxes();
        setisLoading(false);
      })
  };
  //체크박스
  const handleCheckboxChange = (exerciseId, value) => {
    setCheckedStates({
      ...checkedStates,
      [exerciseId]: value
    });
    // 모달을 보여주기
    setIsModalVisible(true);
  };

  //체크박스 토글 초기화
  const resetCheckboxes = () => {
    const newCheckedStates = { ...checkedStates };
    Object.keys(newCheckedStates).forEach(key => {
      newCheckedStates[key] = false;
    });
    setCheckedStates(newCheckedStates);
  };

  
  //plans,exp 정보 요청
  useEffect(() => {
    confirmAsyncValue()
    console.log(stoageValue)
    setisLoading(true);
    fetch(`${IP_URL}/checklist`, { // 또는 로컬 IP 사용
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: stoageValue,
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

  const confirmAsyncValue = async () => { //닉네임이 스토리지에 잘 저장 되있나 호출하는 함수 
    const result = await setNickname('key');
    console.log(result)
    setStoageValue(result);
  };
  
  useEffect(() => {
    confirmAsyncValue()
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
  // 현재 경험치에 따라 현재 스테이지와 그 스테이지에서의 경험치 비율을 반환하는 함수
  const calculateStageProgress = (currentExp) => {
    let MaxExp;
    let MinExp;
    let stage;
    if (currentExp < 100) {
      stage = 1;
      MaxExp = 100;
      MinExp = 0;
    } else if (currentExp < 200) {
      stage = 2;
      MaxExp = 200;
      MinExp = 100;
    } else if (currentExp < 300) {
      stage = 3;
      MaxExp = 300;
      MinExp = 200;
    } else {
      stage = 4;
      MaxExp = 500; // 여기서 최대 경험치를 정의할 수 있습니다.
      MinExp = 300;
    }
    // 현재 스테이지에서의 경험치 비율 계산
    const stageProgress = (currentExp - MinExp) / (MaxExp - MinExp);
    //스테이지별 exp
    const stageExp = currentExp - MinExp;
    //스테이지별 채워야하는 EXP
    const stageMaxExp = MaxExp - MinExp;
    if (typeof currentExp === "number") {
      //stage:현재단계  stageprogress:현재 단계 진행률 stagemaxexp:현재단계 최대xp
      return { stage, stageProgress, stageMaxExp, stageExp };
    } else {
      return null
    }
  };

  const expData = calculateStageProgress(exercise[0]?.exp);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <View style={styles.characterContainer}>
            <ImageBackground source={images.background_sky} resizeMode="cover" style={styles.imageStyle}>
              {expData && (
                <View style={styles.experienceBar}>
                  <Progress.Bar progress={expData.stageProgress} width={250} style={styles.progressBar} color='#000' animated={true} />
                  <Text style={styles.experienceText}>경험치: {expData.stageExp} / {expData.stageMaxExp}</Text>
                </View>
              )}
              <Ionicons name="book" size={24} color="black" onPress={() => router.push('/ExerciseDictionary')} />
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
        </>
      )}
      <TabBar router={router} />
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>운동을 완료하셨나요?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonStyle} onPress={() => {
                resetCheckboxes()
                setIsModalVisible(false)
              }}>
                <Text style={styles.buttonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonStyle} onPress={() => {
                handlePress()
                setIsModalVisible(false)
              }}>
                <Text style={styles.buttonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  progressBar: {
    height: 10, // 프로그레스바의 높이
    borderRadius: 10, // 프로그레스바의 모서리를 둥글게
    borderWidth: 2, // 프로그레스바의 테두리 두께
    borderColor: "#000", // 프로그레스바의 테두리 색상
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // 반투명 배경
  },
  modalView: {
    width: '80%', // 모달의 너비 조정
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20, // 패딩을 줄임
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16, // 글꼴 크기 증가
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // 버튼 간격 조정
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: '#841584', // 버튼 배경색
    padding: 10,
    borderRadius: 10, // 둥근 모서리
  },
  buttonText: {
    color: 'white', // 텍스트 색상
  },
});

export default MainScreen;