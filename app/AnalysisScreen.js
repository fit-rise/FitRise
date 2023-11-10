import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const AnalysisScreen = () => {
  // 임의의 데이터
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55],
        color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`, // 파란색 계열
        strokeWidth: 2
      }
    ],
    legend: ["체중 변화"]
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

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>나의 신체변화</Text>
      <LineChart
        data={data}
        width={screenWidth}
        height={screenHeight * 0.65}
        chartConfig={chartConfig}
        bezier // 부드러운 곡선 표시
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // 밝은 배경색
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
  // ... 나머지 스타일 설정
});

export default AnalysisScreen;
