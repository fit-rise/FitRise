import React, { useState, useEffect } from 'react';
import { useRouter } from "expo-router";
import { SafeAreaView, View, Text, Dimensions, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { TabBar, CustomBtn } from '../components'
import info_styles from "../components/info.style"
import Info_TextInput from '../components/Info_TextInput'
import { IP_URL } from "@env"
import { getItem } from './storage/setNickname';
import { useAppContext } from './AppContext';
const AnalysisScreen = () => {
  const { triggerUpdate } = useAppContext();
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
  const [inputHeight, setHeight] = useState('');//키
  const [inputWeight, setInputWeight] = useState('');//무게
  const [exerciseLevel, setExerciseLevel] = useState('beginner');//운동상태
  const [goal, setGoal] = useState('weight_loss');//목표
  const [inputExercise, setExercise] = useState('');//횟수
  const [inputNotice, setNotice] = useState('');//제약사항
  const router = useRouter()
  const [stoageValue, setStoageValue] = useState('');//스토리지 관련 스테이터스
  const [isSubmitting, setIsSubmitting] = useState(false); //로딩바
  useEffect(async () => {

    const userNickName = await getItem('key');
    setStoageValue(userNickName);

    console.log("useEffect 호출됨");
    const fetchData = async () => {
      try {
        const response = await fetch(`${IP_URL}/AnalysisScreen/analysis`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: userNickName }) // 사용자 ID 설정
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const analysisData = await response.json();
        console.log('분석 데이터 도착' + analysisData)
        const transformed = transformData(analysisData);
        setChartData(transformed);
        // 차트에 사용할 데이터 형식으로 변환 필요
      } catch (error) {
        console.error('Fetching data failed:', error);
      } finally {
        setLoading(false);
      }


    };

    fetchData();
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
      legend: ["체중 변화", "BMI 지수 변화"] // 범례
    };
  };


  const submitWeight = async () => {
    console.log('몸무게 전송' + weight)
    try {

      const response = await fetch('http://localhost:3000/weight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ weight: weight }) // 입력된 몸무게를 JSON 형식으로 전송
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // 성공적인 응답 처리 로직 (예: 알림 띄우기)
    } catch (error) {
      console.error(error);
    }
  };


  /*

  const weightData = [65, 59, 80, 81, 56, 55];
  const bmiData = [30, 26, 36, 37, 24, 23];

  // 임의의 데이터
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: weightData,
        color: (opacity = 1) => `rgba(0, 151, 76, ${opacity})`, // 파란색 계열
        strokeWidth: 2
      },
      {
        data: bmiData, // 추가된 BMI 데이터
        color: (opacity = 1) => `rgba(255, 54, 9, ${opacity})`, 
        strokeWidth: 2
      }
    ],
    legend: ["체중 변화","BMI 지수 변화"]
  };*/
  const reSetUserData = async() => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${IP_URL}/reSetUserData`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: stoageValue,
          height: inputHeight,
          Exercise: inputExercise, // 주 횟수
          Notice: inputNotice,
          goal: goal,
          level: exerciseLevel,
        })
      })
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false); // 로딩 종료
      triggerUpdate();
    }
  }

  const chartConfig = {
    backgroundGradientFrom: "#fff", // 밝은 배경
    backgroundGradientTo: "#f5fff2", // 밝은 배경
    decimalPlaces: 1, // 소수점 아래 한 자리
    color: (opacity = 1) => `rgba(60, 201, 9, ${opacity})`, // 파란색 계열
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
              style={{ borderRadius: 10, margin: 15 }}
            />
          )
        )}

        <View style={info_styles.inputGroup}>
          <Text style={{ width: 70, fontSize: 20, fontFamily: "jua", marginLeft: 10 }}>몸무게</Text>
          <Info_TextInput
            placeholder="몸무게 입력"
            keyboardType="numeric"
            onChangeText={text => setWeight(text)} // 입력된 텍스트를 weight 상태로 설정
          />
          <Text style={{ width: 70, fontSize: 20, fontFamily: "jua", marginLeft: 10 }}>Kg</Text>
          <CustomBtn onPress={submitWeight} title="입력"></CustomBtn>
        </View>
        <CustomBtn
          title="정보 재설정"
          onPress={() => setModalVisible(true)}>
        </CustomBtn>

        {/* 정보 재성정 모달 창 */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          style={styles.modalView}
        >
          <SafeAreaView style={info_styles.modalContainer}>
            {isSubmitting ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <View style={{ padding: 20 }}>
                <Text style={info_styles.header}>정보 재설정</Text>
                <View style={info_styles.inputGroup}>
                  <Text style={info_styles.label}>키</Text>
                  <Info_TextInput
                    placeholder="키 입력"
                    keyboardType="numeric"
                    onChangeText={setHeight}
                    value={inputHeight}
                  />
                  <Text style={info_styles.unit}>cm</Text>
                </View>

                <View style={info_styles.picker_container}>
                  <Text style={info_styles.label}>운동 수준</Text>
                  <View style={{ flex: 1, marginBottom: 115 }}>
                    <Picker
                      selectedValue={exerciseLevel}
                      style={info_styles.picker}
                      itemStyle={{ fontSize: 14 }}
                      onValueChange={(itemValue, itemIndex) => setExerciseLevel(itemValue)}>
                      <Picker.Item label="초보" value="beginner" />
                      <Picker.Item label="중급" value="intermediate" />
                      <Picker.Item label="상급" value="advanced" />
                    </Picker>
                  </View>
                </View>

                <View style={info_styles.picker_container}>
                  <Text style={info_styles.label}>운동 목표</Text>
                  <View style={{ flex: 1, marginBottom: 120 }}>
                    <Picker
                      selectedValue={goal}
                      style={info_styles.picker}
                      itemStyle={{ fontSize: 14 }}
                      onValueChange={(itemValue, itemIndex) => setGoal(itemValue)}>
                      <Picker.Item label="체중 감량" value="weight_loss" />
                      <Picker.Item label="근육 증가" value="muscle_gain" />
                      <Picker.Item label="체력 증진" value="stamina_improvement" />
                    </Picker>
                  </View>
                </View>

                <View style={info_styles.inputGroup}>
                  <Text style={info_styles.label}>운동 횟수</Text>
                  <Info_TextInput
                    placeholder="주당 운동 횟수(ex)주 3회)"
                    keyboardType="numeric"
                    onChangeText={setExercise}
                    value={inputExercise}
                  />
                  <Text style={info_styles.unit}>회</Text>
                </View>
                <View style={info_styles.inputGroup}>
                  <Text style={info_styles.label}>제약 사항</Text>
                  <Info_TextInput
                    placeholder="제약사항 입력(부상 등)"
                    keyboardType="default"
                    onChangeText={setNotice}
                    value={inputNotice}
                  />
                </View>
                <CustomBtn
                  title="설정 완료"
                  onPress={() => {
                    reSetUserData().then(() => {
                      setModalVisible(false);
                    });
                  }
                  }>
                </CustomBtn>
              </View>
            )}
          </SafeAreaView>
        </Modal>
      </View>
      <TabBar router={router} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFEFDF', // 밝은 배경색
  },
  headerText: {
    fontFamily: "jua",
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c7800',
    padding: 16,
    textAlign: 'center',
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
});

export default AnalysisScreen;
