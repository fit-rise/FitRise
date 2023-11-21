import React,{ useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView,Dimensions } from 'react-native';
import Checkbox from 'expo-checkbox';
import {Stack, useRouter} from "expo-router";

import { Ionicons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import { images } from '../constants';
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
      <Ionicons name="book" size={24} color="pink" onPress={() => router.push('/ExerciseDictionary')} />
    </View>

      <View style={styles.characterContainer}>
        <Image source={images.background} resizeMode="stretch" style={styles.imageStyle} />
        <Image source={images.level_1} resizeMode="cover" style={styles.characterImage} />
      </View>

      <ScrollView style={styles.exerciseList}>
        {exercises.map((exercise) => (
          <Card key={exercise.id} style={styles.card}>
            <Card.Title title={exercise.name} />
            <Card.Content>
              <View style={styles.cardContent}>
                <Text>{exercise.sets} 세트, {exercise.reps}회</Text>
                <Checkbox
                  value={isChecked}
                  onValueChange={setChecked}
                  color={isChecked ? '#4630EB' : undefined}/>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
      <TabBar router = {router}/>
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
  characterContainer: {
    height: '35%', // 높이를 조정해 캐릭터 이미지에 맞게 설정
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20
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
