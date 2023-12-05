import React, { useState,useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useRouter} from "expo-router";
import TabBar from '../components/TabBar'
import * as Font from "expo-font";

const mockExerciseData = {
  '2023-11-07': [{ name: '푸시업', duration: '30분' }, { name: '스쿼트', duration: '20분' }],
  '2023-11-08': [{ name: '런지', duration: '20분' }],
};

const CalendarScreen = () => {
  const [selectedDay, setSelectedDay] = useState('');
  const router = useRouter()

  // 선택된 날짜에 운동이 있었는지 확인하고, 있으면 마킹합니다.
  const markedDates = Object.keys(mockExerciseData).reduce((acc, curr) => {
    acc[curr] = { marked: true };
    return acc;
  }, {});

  const renderExerciseItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{item.name}</Text>
      <Text>{item.duration}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => {
          setSelectedDay(day.dateString);
        }}
        markedDates={markedDates}
        style={{borderRadius:10,margin:10}}
      />
      <View style={styles.listContainer}>
        <Text style={styles.headerText}>오늘의 성과</Text>
        <FlatList
        data={mockExerciseData[selectedDay]}
        renderItem={renderExerciseItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.exerciseList}
        />
      </View>
      <TabBar router = {router}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor:'#DFEFDF',
  },
  listItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listItemText: {
    fontFamily:"jua",
    fontWeight: 'bold',
    marginRight: 10,
    color:"#555"
  },
  headerText: {
    fontFamily:"jua",
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4a90e2', // 헤더의 파란색 계열
    padding: 10,
    textAlign: 'center',
  },
  listContainer:{
    flex:1,
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    margin:10,
    borderRadius:10
  },
  exerciseList: {
    flex:1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    margin:10,
    borderRadius:10
  },
});

export default CalendarScreen;
