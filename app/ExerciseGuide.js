import React, { useState , useEffect} from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useRouter,useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { images } from '../constants';


const ExerciseGuide = () => {
  const router = useRouter();

  // ExerciseDictionary에서 넘겨준 값
  const { name,instructions,muscle } = useLocalSearchParams();
  console.log(name)

  const exerciseData = {
    name: name,
    imageUrl: images.pushup,
    description: instructions,
    muscle: muscle,
  
  };

  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchYoutubeVideos(name);
  }, [name]);

  const fetchYoutubeVideos = async (query) => {
    const API_KEY = 'AIzaSyDxrHO2kXoQvRfaRPX6e2E9817yFKJxT_c'; // YouTube Data API 키
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&chart=mostPopular&maxResults=3&regionCode=kr&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setVideos(data.items);
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
    }
 };


  return (
    <ScrollView style={styles.container}>
        <Text style={styles.title}>{exerciseData.name}</Text>
        <View style={styles.horizontalView}>
           <Text style={styles.muscleText}>운동 부위 : </Text>
           <Text style={styles.muscleText}>{exerciseData.muscle}</Text>
        </View>
        <Image source={images.pushup} style={styles.image} />

        <View style={styles.descriptionContainer}>
            <ScrollView nestedScrollEnabled={true}>
                <Text style={styles.description}>{exerciseData.description}</Text>
            </ScrollView>
        </View>
      
      {videos.map((video, index) => (
        <View key={index} style={styles.videoContainer}>
          <YoutubePlayer
            height={405}
            width={720}
            videoId={video.id.videoId} // YouTube 동영상 ID
          />
        </View>
      ))}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5', // 배경색 추가
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333', // 타이틀 색상
    textAlign: 'center',
    marginVertical: 20,
  },
  horizontalView: {
    flexDirection: 'row', // 가로 방향으로 요소 정렬
    alignItems: 'center', // 세로축 중앙 정렬
    marginBottom: 10, // 여백 추가
    justifyContent:'center' //가운데 정렬
  },
  muscleText:{
    fontSize: 18,
    fontWeight:'bold',
    color: '#333',
    marginRight: 5, // 오른쪽 여백 추가  
  },
  descriptionContainer: {
    backgroundColor: '#eaeaea',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    maxHeight: 200, // 최대 높이 설정
  },
  description: {
    fontSize: 18,
    color: '#333',
    textAlign: 'justify', // 양쪽 정렬
    lineHeight: 24, // 줄 간격
  },
  image: {
    width: '100%',
    height: 250, // 이미지 높이 조정
    resizeMode: 'resize',
    marginVertical: 20,
    borderRadius: 10, // 이미지 모서리 둥글게
    borderWidth: 1, // 테두리
    borderColor: '#ddd', // 테두리 색상
  },
  // 유튜브 영상 스타일 추가
  videoContainer: {
    height: 200, // 유튜브 영상 높이
    borderRadius: 10,
    overflow: 'hidden', // 모서리 둥글게 처리
    marginVertical: 20,
  },

});


export default ExerciseGuide;
