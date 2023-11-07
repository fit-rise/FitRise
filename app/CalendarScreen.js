import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const mockExerciseData = {
  '2023-11-07': [{ name: '푸시업', duration: '30분' }, { name: '스쿼트', duration: '20분' }],
  '2023-11-08': [{ name: '런지', duration: '20분' }],
  // ... 여기에 더 많은 데이터를 추가할 수 있습니다.
};

const CalendarScreen = () => {
  const [selectedDay, setSelectedDay] = useState('');

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
      />
      <FlatList
        data={mockExerciseData[selectedDay]}
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
