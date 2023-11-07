import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const InformationInput = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [exerciseLevel, setExerciseLevel] = useState('beginner'); // 운동 수준 상태 추가
  const [goal, setGoal] = useState('weight_loss'); // 운동 목표 상태 추가
  const [comment, setComment] = useState('');

  const handlePress = () => {
    alert('정보가 제출되었습니다.');
  };

  return (
    <View style={styles.container}>
        <Text style={styles.header}>초기 설정</Text>
        <View style={styles.inputGroup}>
            <Text style={styles.label}>키</Text>
            <TextInput
            style={styles.input}
            placeholder="키 입력"
            keyboardType="numeric"
            onChangeText={setHeight}
            value={height}
            />
            <Text style={styles.unit}>cm</Text>
        </View>
      
        <View style={styles.inputGroup}>
            <Text style={styles.label}>몸무게</Text>
            <TextInput
            style={styles.input}
            placeholder="몸무게 입력"
            keyboardType="numeric"
            onChangeText={setWeight}
            value={weight}
            />
            <Text style={styles.unit}>kg</Text>
        </View>
      
        <View style={{flexDirection:'row', alignItems:'center', justifyContent: 'space-between'}}>
            <Text style={styles.label}>운동 수준</Text>
            <Picker
                selectedValue={exerciseLevel}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => setExerciseLevel(itemValue)}>
                <Picker.Item label="초보" value="beginner" />
                <Picker.Item label="중급" value="intermediate" />
                <Picker.Item label="상급" value="advanced" />
            </Picker>
        </View>

        <View style={{flexDirection:'row', alignItems:'center', justifyContent: 'space-between'}}>
            <Text style={styles.label}>운동 목표</Text>
            <Picker
                selectedValue={goal}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => setGoal(itemValue)}>
                <Picker.Item label="체중 감량" value="weight_loss" />
                <Picker.Item label="근육 증가" value="muscle_gain" />
                <Picker.Item label="체력 증진" value="stamina_improvement" />
            </Picker>
        </View>

      
        <View style={styles.inputGroup}>
            <Text style={styles.label}>제약 사항</Text>
            <TextInput
                style={styles.input}
                placeholder="제약사항 입력(부상 등)"
                onChangeText={setComment}
                value={comment}
            />
        </View>
      
      <Button title="완료" onPress={handlePress} />
    </View>
  );
};

export default InformationInput

const styles = StyleSheet.create({
    container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    },
    header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    },
    inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    },
    label: {
    width: 70, // 라벨 너비 고정
    },
    input: {
    flex: 1,
    },
    picker: {
        height: 50,
        marginBottom: 20,
      },
})