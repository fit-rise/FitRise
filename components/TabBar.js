// TabBar.js
import React from 'react';
import { TouchableOpacity,StyleSheet,Image,SafeAreaView, } from 'react-native';
import { icons } from '../constants';

const TabBar = ({ router }) => {
  return (
    <SafeAreaView style={styles.tabBar}>
      <TouchableOpacity style={styles.tabBarIconContainer} onPress={() => router.push('/MainScreen')}>
        <Image source={icons.tab_home} style={styles.tabBarIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabBarIconContainer} onPress={() => router.push('/RankingScreen')}>
        <Image source={icons.tab_rank} style={styles.tabBarIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabBarIconContainer} onPress={() => router.push('/CalendarScreen')}>
        <Image source={icons.tab_calendar} style={styles.tabBarIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabBarIconContainer} onPress={() => router.push('/AnalysisScreen')}>
        <Image source={icons.tab_profile} style={styles.tabBarIcon} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TabBar;
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#999',
  },
  tabBarIconContainer: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center', // 세로 축에서 아이콘을 중앙 정렬
  },
  tabBarIcon: {
    width: 35, // 아이콘의 너비 설정
    height: 35, // 아이콘의 높이 설정
    resizeMode: 'contain', // 이미지의 비율을 유지
  },
  });  