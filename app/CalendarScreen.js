import React, { useState,useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import TabBar from '../components/TabBar'
import { useRouter } from "expo-router";

import { getItem } from './storage/setNickname';
import {IP_URL}from "@env"

const CalendarScreen = () => {
  const [selectedDay, setSelectedDay] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [Exdata, setExdata] = useState([])
  const router = useRouter()

  //끝낸운동들 fetch
  useEffect(async () => {
    setisLoading(true);
    const userNickName = await getItem('key');
    fetch(`${IP_URL}/CalendarScreen/doexercise`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: userNickName,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        setExdata(result[0]?.calendar || []);
// 첫 번째 사용자의 calendar 데이터만 사용합니다.
        setExdata(result[0]?.calendar || []);        setisLoading(false);
      });
  }, []);
  let markedDates = {};

 // 캘린더에서 마커 찍을 날짜들을 설정
  if (Exdata.length > 0) {
    markedDates = Exdata.reduce((acc, calendarItem) => {
      if (calendarItem.day) {
        acc[calendarItem.day] = { marked: true };
      }
      return acc;
    }, {});
  }

  
  //사용자가 날짜를 선택했을 때 호출
  const onDayPress = (day) => {
    setSelectedDay(day.dateString);
  };

  // 선택된 날짜에 해당하는 운동 목록을 찾습니다.
  const selectedDayExercises = Exdata.find(item => item.day === selectedDay)?.doexercises || [];
  const renderExerciseItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{item.exercise}</Text>
      <Text style={styles.listItemText}>{`Sets: ${item.sets}, Reps: ${item.reps}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
        style={{borderRadius:10,margin:10}}
      />
      <View style={styles.listContainer}>
        <Text style={styles.headerText}>오늘의 성과</Text>
        <FlatList
          data={selectedDayExercises}
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