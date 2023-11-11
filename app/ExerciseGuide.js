import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
// 유튜브 영상을 표시하기 위해 필요한 라이브러리를 임포트해야 합니다. (예: react-native-youtube)
import { images } from '../constants';

const ExerciseGuide = () => {
  // 가상의 데이터, 실제로는 API로부터 받아와야 합니다.
  const exerciseData = {
    name: '푸시업',
    imageUrl: images.pushup,
    description: '푸시업은 상체 근력을 키우는데 아주 좋은 운동입니다. 팔꿈치를 구부리면서 ...',
    youtubeVideoId: 'abc123def' // 실제 유튜브 영상 ID가 들어가야 합니다.
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{exerciseData.name}</Text>
      <Image
        source={images.pushup}
        style={styles.image}
      />
      <Text style={styles.description}>{exerciseData.description}</Text>
      {/* 여기에 유튜브 영상을 표시하는 컴포넌트를 추가해야 합니다. */}
      <Image
        source={images.pushup}
        style={styles.image}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: 200, // 또는 적절한 높이 설정
    resizeMode: 'contain',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 20,
  },
  // 유튜브 영상 스타일도 추가해야 합니다.
});

export default ExerciseGuide;
