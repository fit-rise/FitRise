import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet,ImageBackground, ActivityIndicator } from 'react-native';
import { useRouter } from "expo-router";

import TabBar from '../components/TabBar'
import { images } from '../constants';
import {IP_URL}from "@env"
import { getItem } from './storage/setNickname';

const RankingScreen = () => {
  const [userRankings, setUserRankings] = useState([]);
  const [currentUser, setCurrentUser] = useState({ ranking: null, tier: '', exp: 0 });
  const router = useRouter()
  const [stoageValue, setStoageValue] = useState('');
  const [isLoading, setisLoading] = useState(false);

useEffect(() => {
  getItem('key').then((userNickName)=>{
     
    setStoageValue(userNickName);
    setisLoading(true);
 
  
      console.log('ranking'+userNickName);

      fetch(`${IP_URL}/RankingScreen/rank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: userNickName })
      }).then((response)=>response.json())
      .then((result) =>{
        const data = result;
      setUserRankings(data.ranking);
      setCurrentUser({
        ranking: data.userRank.rank,
        tier: data.userRank.tier,
        exp: data.userRank.exp,
      });
      setisLoading(false);
      }).catch((error)=>{
        console.error('error : ',error)
      });

  });
  
}, []);

  const renderRankingItem = ({ item}) => (
    <View style={styles.rankingItem}>
      <Text style={styles.listItemText}>{item.rank}</Text>
      <Text style={styles.listItemText}>{item.name}</Text>
      <Text style={styles.listItemText}>{item.tier}</Text>
      <Text style={styles.listItemText}>{item.exp} EXP</Text>
    </View>
  );

  const getTierImage = (tier) => {
    switch(tier) {
      case 1:
        return images.tier1;
      case 2:
        return images.tier2;
      case 3:
        return images.tier3;
    }
  };



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
            source={getTierImage(currentUser.tier)}
            style={styles.medalImage}
            resizeMode="stretch"
          />
        </View>
        <View style={styles.listHeader}>
          <Text style={styles.headerItem}>순위</Text>
          <Text style={styles.headerItem}>닉네임</Text>
          <Text style={styles.headerItem}>티어</Text>
          <Text style={styles.headerItem}>경험치</Text>
        </View>
      {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={userRankings}
            renderItem={renderRankingItem}
            keyExtractor={item => item.id}
            style={styles.rankingList}
          />
        )}
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
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 20,
    marginHorizontal:5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // 헤더 배경색, 원하는 색으로 변경 가능
  },
  headerItem: {
    fontWeight: 'bold', // 헤더 텍스트를 굵게
    fontFamily:"jua"
  },
});

export default RankingScreen;