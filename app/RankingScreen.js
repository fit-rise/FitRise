import React from 'react';
import { View, Text, Image, FlatList, StyleSheet,ImageBackground } from 'react-native';
import {useRouter} from "expo-router";
import TabBar from '../components/TabBar'
import { images } from '../constants';

const RankingScreen = () => {
  const router = useRouter()

  // 사용자 순위 데이터
  const userRankings = [
    { id: '1', name: 'User1', tier: 'Gold', xp: 1200 },
    { id: '2', name: 'User2', tier: 'Silver', xp: 1100 },
  ];

  // 현재 사용자 정보
  const currentUser = { ranking: 5, tier: 'Gold', xp: 1350 };

  const renderRankingItem = ({ item, index }) => (
    <View style={styles.rankingItem}>
      <Text style={styles.listItemText}>{index + 1}</Text>
      <Text style={styles.listItemText}>{item.name}</Text>
      <Text style={styles.listItemText}>{item.tier}</Text>
      <Text style={styles.listItemText}>{item.xp} XP</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={images.rank_background} // 배경 이미지 경로 설정
        style={styles.imageBackground}
        resizeMode="cover" // 이미지의 리사이즈 모드
      >
        <View style={styles.topSection}>
          <Text style={styles.rankingText}>현재 순위: {currentUser.ranking}</Text>
          <Image 
            source={images.gold_medal}
            style={styles.medalImage}
            resizeMode="stretch"
          />
        </View>
        <FlatList
          data={userRankings}
          renderItem={renderRankingItem}
          keyExtractor={item => item.id}
          style={styles.rankingList}
        />
      </ImageBackground>
       {/* TabBar의 배경을 위한 View */}
      <View style={styles.tabBarBackground}>
        <TabBar router = {router}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 215, 0.7)',
    borderRadius: 20,
    marginVertical: 50,
    marginHorizontal:15,
  },
  rankingText: {
    fontSize: 26,
    fontWeight: 'bold',
    color:'#555',
    fontFamily: "jua",
  },
  medalImage: {
    width: 100,
    height: 100,
  },
  rankingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rankingList: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    borderRadius: 20,
    marginHorizontal:5,
    marginVertical:5
  },
  listItemText: {
    fontFamily: "jua",
    fontWeight: 'bold',
    marginRight: 10,
    color: "#555",
    fontSize: 20,
  },
  tabBarBackground: {
    backgroundColor: 'rgba(167, 19, 0, 0.7)',
  },
});

export default RankingScreen;