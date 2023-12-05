import React,{ useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView,
        Dimensions,TouchableOpacity,ImageBackground } from 'react-native';
import Checkbox from 'expo-checkbox';
import { useRouter } from "expo-router";

import { Card } from 'react-native-paper';
import { images,icons } from '../constants';
import {TabBar,Character,CircleBtn} from '../components'

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');


const MainScreen = () => {
  const router = useRouter()

  //체크 상태관리
  const [isChecked, setChecked] = useState(false);

  // 예시 데이터
  const exercises = [
    { id: 1, name: 'Push Ups', sets: 3, reps: 10 },
    { id: 2, name: 'Pull Ups', sets: 2, reps: 8 },
  ];

  return (
    <View style={styles.container}>
      { /* 경험치 바 영역 */ }
      <View style={styles.header}>
        <View style={styles.experienceBar}>
          <View style={styles.experienceFill} /* 현재 경험치에 따라 너비 조정 */ />
          <Text style={styles.experienceText}>경험치: 200 / 500</Text>
        </View>
          <TouchableOpacity onPress={() => router.push('/ExerciseDictionary')}>
            <Image source={icons.exerciseDict} style={styles.Icon} />
          </TouchableOpacity>
      </View>
      
      {/* 캐릭터 영역 */}
      <View style={styles.characterContainer}>
        <Image source={images.char_background} resizeMode="stretch" style={styles.imageStyle} />
        <Character characterImage={images.level_1} />
      </View>

      {/* Card 영역 */}
      <ImageBackground source={images.card_background} style={styles.scrollViewBackground}>
        <ScrollView style={styles.exerciseList}>
            {exercises.map((exercise) => (
              <Card key={exercise.id} style={styles.card}>
                <Card.Title title={exercise.name} />
                <Card.Content>
                  <View style={styles.cardContent}>
                    <Text style={styles.experienceText}>{exercise.sets} Set, {exercise.reps}회</Text>
                    <Checkbox
                      value={isChecked}
                      onValueChange={setChecked}
                      color={isChecked ? '#186A3B' : undefined}/>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
          <CircleBtn
              iconUrl={icons.gpt_chat} 
              dimension='70%'
              handlePress={() => router.push('/ChatScreen')}
              />
      </ImageBackground>
      
      <TabBar router = {router}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#DFEFDF"
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  characterContainer: {
    height: '35%', // 높이를 조정해 캐릭터 이미지에 맞게 설정
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterImage: {
    width: '100%',
    height: 150,
  },
  characterTouchable: {
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth * 0.4, // 캐릭터 이미지의 너비
    height: screenHeight * 0.15, // 캐릭터 이미지의 높이
  },
  reactionGifSmall: {
    position: 'absolute',
    top: '1%',
    left: '50%',
    width: 70,
    height: 70,
    transform: [{ translateX: -40 }, { translateY: -40 }], // 이미지 크기의 절반으로 조정
  },
  reactionGifLarge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 100,
    height: 60,
    transform: [{ translateX: -50 }, { translateY: -30 }], // 이미지 크기의 절반으로 조정
  },
  experienceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  experienceFill: {
    backgroundColor: '#27AE60',
    width: '50%', // 현재 경험치에 따라 너비를 조정해야 함
    height: 10,
  },
  experienceText: {
    paddingLeft: 10,
    fontFamily:"jua"
  },
  scrollViewBackground: {
    flex: 1,
    width: '100%', // 부모 컨테이너의 전체 너비를 사용
  },
  exerciseList: {
    flex: 1,
  },
  card: {
    margin: 10,
    backgroundColor:"#D4EFDF",
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
  Icon: {
    width: 35, // 아이콘의 너비 설정
    height: 35, // 아이콘의 높이 설정
    resizeMode: 'contain', // 이미지의 비율을 유지
    borderRadius: 10,
  },
});

export default MainScreen;
