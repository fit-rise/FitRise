import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categories = ['모든 운동', '상체', '하체', '코어', '유산소', '스트레칭'];

// 가상의 운동 데이터입니다. 실제 앱에서는 API를 통해 받아올 데이터입니다.
const exercises = [
  { id: '1', name: '푸시업', category: '상체' },
  { id: '2', name: '스쿼트', category: '하체' },
  // ...더 많은 운동 데이터
];

const ExerciseDictionary = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const renderExerciseItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
        <Text style={styles.headerText}>운동사전</Text>
        <View style={styles.searchContainer}>
            <TextInput
                placeholder="운동 검색"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <Ionicons name="search" size={20} style={styles.searchIcon} />
        </View>
        <View style={styles.categoryContainerWrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryContainer}
            >
                {categories.map((category, index) => (
                <TouchableOpacity key={index} style={styles.categoryButton}>
                    <Text style={styles.categoryButtonText}>{category}</Text>
                </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

      <FlatList
        data={exercises}
        renderItem={renderExerciseItem}
        keyExtractor={(item) => item.id}
        style={styles.exerciseList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 5,
    alignItems: 'center',
  },
  searchIcon: {
    marginHorizontal: 5,
  },
  searchInput: {
    flex: 1,
    padding: 10,
  },
  categoryContainerWrapper: {
    height: 80, // 원하는 높이로 설정
    marginVertical: 10,
    justifyContent: 'center',
  },
  categoryContainer: {
    paddingTop:10,
    marginVertical: 10,
  },
  categoryButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#81fcf0',
    borderRadius: 20,
    height: 40,
  },
  categoryButtonText: {
    fontWeight: 'bold',
  },
  exerciseList: {
    flex: 1,
  },
  listItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemText: {
    fontSize: 18,
  },
});

export default ExerciseDictionary;
