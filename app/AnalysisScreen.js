import React from 'react';
import {Stack, useRouter} from "expo-router";
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import TabBar from '../components/TabBar'
import ScreenHeaderBtn from '../components/ScreenHeaderBtn'
import info_styles from "../components/info.style"
import Info_TextInput from '../components/Info_TextInput'

const AnalysisScreen = () => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
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
        <LineChart
          data={data}
          width={screenWidth}
          height={screenHeight * 0.40}
          chartConfig={chartConfig}
          bezier // 부드러운 곡선 표시
        />
        <View style={info_styles.inputGroup}>
            <Text style={info_styles.label}>몸무게</Text>
            <Info_TextInput
                    placeholder="몸무게 입력"
                    keyboardType="numeric"
                />
            <Text style={info_styles.unit}>cm</Text>
        </View>
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
});

export default AnalysisScreen;
