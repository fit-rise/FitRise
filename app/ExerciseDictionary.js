import React, { useState, useMemo } from 'react';
import {Stack, useRouter} from "expo-router";
import { View, Text, TextInput, StyleSheet, FlatList,
        TouchableOpacity, ScrollView, ActivityIndicator,Image } from 'react-native';
import { icons } from '../constants';
import useExercises from '../Hook/useExercises';

const categories = ['Cardio', 'Olympic_weightlifting', 'Plyometrics', 'Powerlifting', 'Stretching', 'Strongman'];

const ExerciseDictionary = () => {
  const router = useRouter()

  //useState & Hook
  const [searchQuery, setSearchQuery] = useState('');
  //검색 결과 담을 useState
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [exerciseType, setExerciseType] = useState('cardio');
  const { exercises, loading, error } = useExercises(exerciseType);

  // 검색 함수
  const handleSearch = () => {
    const filtered = exercises.filter(exercises =>
      exercises.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExercises(filtered);
  };

  useMemo(() => {
    setFilteredExercises(exercises);
  }, [exercises]);

  // 액티비티 인디케이터
  if (loading) return <ActivityIndicator size="large" color='blue' />;
  if (error) return <Text>Error: {error.message}</Text>;

  const renderExerciseItem = ({ item }) => {
  
    return(
    <TouchableOpacity onPress={() => {
      //name, instructions(설명), muscle(쓰는 근육 부위), 
      console.log(item)
      console.log("name:",item.name)
      router.push({pathname:'/ExerciseGuide',
                   params: {name:item.name, instructions:item.instructions, muscle: item.muscle} })
    }

    }>
      <View style={styles.listItem}>
        <Text style={styles.listItemText}>{item.name}</Text>
        <Text style={styles.listItemText}>강도 : {item.difficulty}</Text>
      </View>
    </TouchableOpacity>
  )};

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
        <TouchableOpacity onPress={handleSearch}>
          <Image source={icons.search} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainerWrapper}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryButton}
            onPress={() => setExerciseType(category.toLowerCase())}
          >
            <Text style={styles.categoryButtonText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredExercises}
        keyExtractor={item => item.name.toString()}
        renderItem={renderExerciseItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor:"#F4FFF9"
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
    width: 35, // 아이콘의 너비 설정
    height: 35, // 아이콘의 높이 설정
    resizeMode: 'contain', // 이미지의 비율을 유지
  },
  searchInput: {
    flex: 1,
    padding: 10,
  },
  categoryContainerWrapper: {
    height: 80,
    marginVertical: 10,
  },
  categoryButton: {
    padding: 10,
    backgroundColor: '#7DCEA0',
    borderRadius: 20,
    height: 40,
    marginLeft: 5,
  },
  categoryButtonText: {
    fontWeight: 'bold',
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listItemText: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default ExerciseDictionary;
