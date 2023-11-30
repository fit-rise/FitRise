import React,{ useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView,Dimensions,TouchableOpacity,ImageBackground } from 'react-native';
import Checkbox from 'expo-checkbox';
import {Stack, useRouter} from "expo-router";

import { Ionicons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import { images,icons } from '../constants';
import TabBar from '../components/TabBar'

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');


const MainScreen = () => {
  // 예시 데이터
  const exercises = [
    { id: 1, name: 'Push Ups', sets: 3, reps: 10 },
    { id: 2, name: 'Pull Ups', sets: 2, reps: 8 },
  ];

  const [isChecked, setChecked] = useState(false);
  const router = useRouter()

  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <View style={styles.experienceBar}>
        <View style={styles.experienceFill} /* 현재 경험치에 따라 너비 조정 */ />
        <Text style={styles.experienceText}>경험치: 200 / 500</Text>
      </View>
        <TouchableOpacity onPress={() => router.push('/ExerciseDictionary')}>
          <Image source={icons.exerciseDict} style={styles.tabBarIcon} />
        </TouchableOpacity>
    </View>

      <View style={styles.characterContainer}>
        <Image source={images.char_background} resizeMode="stretch" style={styles.imageStyle} />
        <Image source={images.level_1} resizeMode="cover" style={styles.characterImage} />
      </View>
    <ImageBackground source={images.card_background} style={styles.scrollViewBackground}>
      <ScrollView style={styles.exerciseList}>
          {exercises.map((exercise) => (
            <Card key={exercise.id} style={styles.card}>
              <Card.Title title={exercise.name} />
              <Card.Content>
                <View style={styles.cardContent}>
                  <Text>{exercise.sets} Set, {exercise.reps}회</Text>
                  <Checkbox
                    value={isChecked}
                    onValueChange={setChecked}
                    color={isChecked ? '#186A3B' : undefined}/>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
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
    width: screenWidth * 0.5,
    height: screenHeight * 0.2,
    resizeMode:"center",
    zIndex: 1,
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
    backgroundColor:"#D4EFDF"
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
    tabBarIcon: {
    width: 35, // 아이콘의 너비 설정
    height: 35, // 아이콘의 높이 설정
    resizeMode: 'contain', // 이미지의 비율을 유지
    borderRadius: 18,
  },
});

export default MainScreen;
