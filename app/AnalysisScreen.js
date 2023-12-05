import React,{useState} from 'react';
import {useRouter} from "expo-router";
import { View, Text, Dimensions, StyleSheet, Modal} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import TabBar from '../components/TabBar'
import info_styles from "../components/info.style"
import Info_TextInput from '../components/Info_TextInput'
import { Button } from 'react-native-paper';

const AnalysisScreen = () => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const [modalVisible, setModalVisible] = useState(false);
  const [exerciseLevel, setExerciseLevel] = useState('beginner');
  const [goal, setGoal] = useState('weight_loss');
  const router = useRouter()

  const weightData = [65, 59, 80, 81, 56, 55];
  const bmiData = [30, 26, 36, 37, 24, 23];

  // 임의의 데이터
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: weightData,
        color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`, // 파란색 계열
        strokeWidth: 2
      },
      {
        data: bmiData, // 추가된 BMI 데이터
        color: (opacity = 1) => `rgba(246, 116, 95, ${opacity})`, // 다른 색상 계열 (예: 주황색)
        strokeWidth: 2
      }
    ],
    legend: ["체중 변화","BMI 지수 변화"]
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff", // 밝은 배경
    backgroundGradientTo: "#fff", // 밝은 배경
    decimalPlaces: 1, // 소수점 아래 두 자리
    color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`, // 파란색 계열
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // 검정색 레이블
    style: {
      borderRadius: 16,
      marginVertical: 8,
      ...styles.chartStyle,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726"
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.headerText}>나의 신체변화</Text>
        <LineChart
          data={data}
          width={screenWidth}
          height={screenHeight * 0.40}
          chartConfig={chartConfig}
          bezier // 부드러운 곡선 표시
          style={{borderRadius:10}}
        />
        <View style={info_styles.inputGroup}>
            <Text style={info_styles.label} style={{margin:10}}>몸무게</Text>
            <Info_TextInput
                    placeholder="몸무게 입력"
                    keyboardType="numeric"
                />
            <Text style={info_styles.unit}>Kg</Text>
            <Button style={{backgroundColor: 'skyblue', margin:10}}> 입력 </Button>
        </View>
        <Button 
          style={{backgroundColor: 'skyblue', margin:10}}
          onPress={() => setModalVisible(true)}> 정보 재설정 
        </Button>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          style={styles.modalView}
      >
            <View style={info_styles.container}>
        <Text style={info_styles.header}>정보 재설정</Text>
        <View style={info_styles.inputGroup}>
            <Text style={info_styles.label}>키</Text>
            <Info_TextInput
                    placeholder="키 입력"
                    keyboardType="numeric"
                />
            <Text style={info_styles.unit}>cm</Text>
        </View>
      
        <View style={info_styles.picker_container}>
            <Text style={info_styles.label}>운동 수준</Text>
            <Picker
                selectedValue={exerciseLevel}
                style={info_styles.picker}
                itemStyle={{fontSize:14}}
                onValueChange={(itemValue, itemIndex) => setExerciseLevel(itemValue)}>
                <Picker.Item label="초보" value="beginner" />
                <Picker.Item label="중급" value="intermediate" />
                <Picker.Item label="상급" value="advanced" />
            </Picker>
        </View>

        <View style={info_styles.picker_container}>
            <Text style={info_styles.label}>운동 목표</Text>
            <Picker
                selectedValue={goal}
                style={info_styles.picker}
                itemStyle={{fontSize:14}}
                onValueChange={(itemValue, itemIndex) => setGoal(itemValue)}>
                <Picker.Item label="체중 감량" value="weight_loss" />
                <Picker.Item label="근육 증가" value="muscle_gain" />
                <Picker.Item label="체력 증진" value="stamina_improvement" />
            </Picker>
        </View>

        <View style={info_styles.inputGroup}>
            <Text style={info_styles.label}>운동 횟수</Text>
            <Info_TextInput
              placeholder="주당 운동 횟수(ex)주 3회)"
              keyboardType="numeric"
            />
            <Text style={info_styles.unit}>회</Text>
        </View>
        <View style={info_styles.inputGroup}>
            <Text style={info_styles.label}>제약 사항</Text>
            <Info_TextInput
              placeholder="제약사항 입력(부상 등)"
              keyboardType="default"
            />
        </View>
        <Button style={styles.modalButton} onPress={() => setModalVisible(false)}> 설정 완료</Button>
    </View>
      </Modal>
      </View>
      <TabBar router = {router}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFEFDF', // 밝은 배경색
  },
  btn_container: {
    flex : 1,
    alignItems:'center',
  },
  headerText: {
    fontFamily:"jua",
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a90e2', // 헤더의 파란색 계열
    padding: 16,
    textAlign: 'center',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  BtnStyle: {
    backgroundColor:'#1187CF'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    fontFamily:"jua",
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18
  },
  modalButton: {
    backgroundColor: "#2196F3",
    elevation: 2
  },
  modalButtonText: {
    fontFamily:"jua",
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});

export default AnalysisScreen;
