import React,{useState , useEffect } from 'react';
import {useRouter} from "expo-router";
import { View, Text, Dimensions, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import TabBar from '../components/TabBar'
import ScreenHeaderBtn from '../components/ScreenHeaderBtn'
import info_styles from "../components/info.style"
import Info_TextInput from '../components/Info_TextInput'
import { Button } from 'react-native-paper';
import {IP_URL}from "@env"
const AnalysisScreen = () => {

  console.log("AnalysisScreen 렌더링 시작");
 // const [data, setData] = useState(null);
 const [chartData, setChartData] = useState({
  labels: [],
  datasets: [{ data: [] }]
});
const [loading, setLoading] = useState(true);
  const [weight, setWeight] = useState('');
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const [modalVisible, setModalVisible] = useState(false);
  const [exerciseLevel, setExerciseLevel] = useState('beginner');
  const [weightSubmitted, setWeightSubmitted] = useState(false); // 몸무게가 제출되었는지 추적하는 상태
  const [goal, setGoal] = useState('weight_loss');
  const router = useRouter()

  // 차트 데이터 가져오기
  const fetchData = async () => {
    try {
      const response = await fetch(`${IP_URL}/AnalysisScreen/analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: '655de6c451a5a1fdd749aff1' }) // 사용자 ID 설정
      });

      if (!response.ok) {
        throw new Error('analysis : Network response was not ok');
      }

      const analysisData = await response.json();
      console.log('분석 데이터 도착'+analysisData)
      const transformed = transformData(analysisData);
      setChartData(transformed);
      // 차트에 사용할 데이터 형식으로 변환 필요
    } catch (error) {
      console.error('Fetching data failed:', error);
    } finally {
      setLoading(false);
    }
  };

   // 오늘 몸무게 입력했는지 확인하기
  const checkWeightSubmission = async () => {
    try {
      // 오늘 날짜 구하기
      const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식
      const response = await fetch(`${IP_URL}/AnalysisScreen/checkWeight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: '655de6c451a5a1fdd749aff1',
          date: today
        }) // 사용자 ID와 오늘 날짜를 함께 전송
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      // 오늘 날짜에 해당하는 데이터가 있는지 확인
      if (result && result.length > 0) {
        setWeightSubmitted(true); // 이미 데이터가 있으면 '입력 완료' 상태로 설정
      }
    } catch (error) {
      console.error('Error checking weight submission:', error);
    }
  };

  useEffect(() => {
    console.log("useEffect 호출됨"); 
    fetchData();
    checkWeightSubmission();
  }, []);

  // 데이터 변환 로직
const transformData = (analysisData) => {
  const labels = analysisData.map(item => item.date);
  const weightData = analysisData.map(item => item.weight);
  const bmiData = analysisData.map(item => item.bmi);

  return {
    labels: labels,
    datasets: [
      {
        data: weightData,
        color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`, // 파란색 계열
        strokeWidth: 2
      },
      {
        data: bmiData,
        color: (opacity = 1) => `rgba(246, 116, 95, ${opacity})`, // 주황색 계열
        strokeWidth: 2
      }
    ],
    legend: ["체중 변화","BMI 지수 변화"] // 범례
  };
};


  const submitWeight = async () => {
    console.log('몸무게 전송'+weight)
    try {

      const response = await fetch(`${IP_URL}/AnalysisScreen/weight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ weight: weight }) // 입력된 몸무게를 JSON 형식으로 전송
      });
  
      if (!response.ok) {
        throw new Error('weight : Network response was not ok');
      }
  
      // 몸무게 입력 후 그래프 새로고침
      setWeightSubmitted(true);
      fetchData();

    } catch (error) {
      console.error(error);
    }
  };

  
  const chartConfig = {
    backgroundGradientFrom: "#fff", // 밝은 배경
    backgroundGradientTo: "#fff", // 밝은 배경
    decimalPlaces: 2, // 소수점 아래 두 자리
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
        {loading ? (
      <ActivityIndicator size="large" color="#0000ff" />
    ) : (
      chartData && chartData.labels.length > 0 && (
        <LineChart
          data={chartData}
          width={screenWidth}
          height={screenHeight * 0.40}
          chartConfig={chartConfig}
          bezier // 부드러운 곡선 표시
        />
      )
    )}
       
       {weightSubmitted ? (
          <Text style={styles.inputCompleteText}>입력 완료</Text>
        ) : (
          <View style={info_styles.inputGroup}>
            <Text style={info_styles.label}>몸무게</Text>
            <Info_TextInput
              placeholder="몸무게 입력"
              keyboardType="numeric"
              onChangeText={text => setWeight(text)}
            />
            <Text style={info_styles.unit}>Kg</Text>
            <Button 
              style={{backgroundColor: 'skyblue', margin:10}}
              onPress={submitWeight}
            > 입력 </Button>
          </View>
          )}

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
    backgroundColor: '#fff', // 밝은 배경색
  },
  btn_container: {
    flex : 1,
    alignItems:'center',
  },
  headerText: {
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
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18
  },
  modalButton: {
    backgroundColor: "#2196F3",
    elevation: 2
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  inputCompleteText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a90e2', // 적절한 색상 선택
    padding: 16,
    textAlign: 'center',
  },
});

export default AnalysisScreen;
