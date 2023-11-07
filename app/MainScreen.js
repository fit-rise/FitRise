import React,{ useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import Checkbox from 'expo-checkbox';

import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../constants';

const MainScreen = () => {
  // 예시 데이터
  const exercises = [
    { id: 1, name: 'Push Ups', sets: 3, reps: 10 },
    { id: 2, name: 'Pull Ups', sets: 2, reps: 8 },
  ];

  const [isChecked, setChecked] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="book" size={24} color="black" onPress={() => {/* 운동사전 이동 로직 */}} />
      </View>

      <View style={styles.characterContainer}>
        <Image source={images.level_1} resizeMode="cover" style={styles.characterImage} />
        <View style={styles.experienceBar}>
          <View style={styles.experienceFill} /* 현재 경험치에 따라 너비 조정 */ />
          <Text style={styles.experienceText}>XP: 200 / 500</Text>
        </View>
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

      <View style={styles.tabBar}>
        <View style={styles.tabBarIcon}>
          <Ionicons name="home-outline" size={24} color="black" onPress={() => {/* 홈 탭 로직 */}} />
          <Text>홈</Text>
        </View>
        <View style={styles.tabBarIcon}>
          <Ionicons name="trophy-outline" size={24} color="black" onPress={() => {/* 랭킹 탭 로직 */}} />
          <Text>랭킹</Text>
        </View>
        <View style={styles.tabBarIcon}>
          <Ionicons name="calendar-outline" size={24} color="black" onPress={() => {/* 달력 탭 로직 */}} />
          <Text>달력</Text>
        </View>
        <View style={styles.tabBarIcon}>
          <Ionicons name="person-outline" size={24} color="black" onPress={() => {/* 프로필 탭 로직 */}} />
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
