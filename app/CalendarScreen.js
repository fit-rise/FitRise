import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import {IP_URL}from "@env"
const CalendarScreen = () => {
  const [selectedDay, setSelectedDay] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [Exdata, setExdata] = useState([])
  // const mockExerciseData = {
  //   '2023-11-07': [{ name: '푸시업', duration: '30분' }, { name: '스쿼트', duration: '20분' }],
  //   '2023-11-08': [{ name: '런지', duration: '20분' }],
  //   // ... 여기에 더 많은 데이터를 추가할 수 있습니다.
  // };
  //끝낸운동들 fetch
  useEffect(() => {
    setisLoading(true);
    fetch(`${IP_URL}/CalendarScreen/doexercise`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "엄득용",
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        // 첫 번째 사용자의 calender 데이터만 사용합니다.
        setExdata(result[0]?.calendar || []);
        setisLoading(false);
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
      <Text>{`Sets: ${item.sets}, Reps: ${item.reps}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
      />
      <FlatList
        data={selectedDayExercises}
        renderItem={renderExerciseItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.exerciseList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listItemText: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  exerciseList: {
    marginTop: 20,
  },
});

export default CalendarScreen;