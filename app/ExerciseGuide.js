import React, { useState , useEffect} from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useRouter,useLocalSearchParams,useNavigation  } from 'expo-router';
import YoutubePlayer from 'react-native-youtube-iframe';
import { images } from '../constants'; 

const ExerciseGuide = () => {
  // 가상의 데이터, 실제로는 API로부터 받아와야 합니다.
  const exerciseData = {
    name: '푸시업',
    imageUrl: images.pushup,
    description: '푸시업은 상체 근력을 키우는데 아주 좋은 운동입니다. 팔꿈치를 구부리면서 ...',
    youtubeVideoId: 'abc123def' // 실제 유튜브 영상 ID가 들어가야 합니다.
  };

  const router = useRouter();
  const  { exerciseName}  = useLocalSearchParams();
  console.log('exerciseName : '+exerciseName)
  // 라우터 파라미터에서 운동 이름을 추출
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchYoutubeVideos(exerciseName);
  }, [exerciseName]);

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
      <Image
        source={images.pushup}
        style={styles.image}
      />
      <Text style={styles.description}>{exerciseData.description}</Text>
      
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
  videoContainer:{
    marginBottom:20,
    alignItems: 'center'
  }
});

export default ExerciseGuide;
