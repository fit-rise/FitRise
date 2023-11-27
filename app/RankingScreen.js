import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions } from 'react-native';
import {Stack, useRouter} from "expo-router";
import TabBar from '../components/TabBar'
import { images } from '../constants';

const RankingScreen = () => {
  const screenWidth = Dimensions.get('window').width;
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
      <Text>{index + 1}</Text>
      <Text>{item.name}</Text>
      <Text>{item.tier}</Text>
      <Text>{item.xp} XP</Text>
    </View>
  );

  return (
    <View style={{flex:1}}>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <Text style={styles.rankingText}>현재 순위: {currentUser.ranking}</Text>
          <Image 
            source={images.level_1}
            style={{ width: 100, height: 100}}
            resizeMode="stretch"
          />
        </View>

        <FlatList
          data={userRankings}
          renderItem={renderRankingItem}
          keyExtractor={item => item.id}
          style={styles.rankingList}
        />
      </View>
      <TabBar router = {router}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: Dimensions.get('window').height * 0.3,
  },
  rankingText: {
    fontSize: 20,
    fontWeight: 'bold',
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
  },
});

export default RankingScreen;

