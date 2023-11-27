// TabBar.js
import React from 'react';
import { View, Text, TouchableOpacity,StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TabBar = ({ router }) => {
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity style={styles.tabBarIcon} onPress={() => router.push('/MainScreen')}>
        <Ionicons name="home-outline" size={24} color="black" />
        <Text>홈</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabBarIcon} onPress={() => router.push('/RankingScreen')}>
        <Ionicons name="trophy-outline" size={24} color="black" />
        <Text>랭킹</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabBarIcon} onPress={() => router.push('/CalendarScreen')}>
        <Ionicons name="calendar-outline" size={24} color="black" />
        <Text>달력</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabBarIcon} onPress={() => router.push('/AnalysisScreen')}>
        <Ionicons name="person-outline" size={24} color="black" />
        <Text>프로필</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabBar;
const styles = StyleSheet.create({
    tabBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
      borderTopWidth: 1,
      borderColor: '#e1e1e1',
    },
    tabBarIcon: {
        alignItems:'center'
    }
  });  