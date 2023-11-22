import React, { useState } from 'react';
//alert 창 누른 없앤 후에 넘어갈 수 있도록 Alert 컴포넌트 사용
import { View, Text, } from 'react-native';
import {Stack, useRouter} from "expo-router";
import TabBar from '../components/TabBar'



const RankingScreen = () => {
  const router = useRouter()

  return (
    <View style={{flex:1}}>
        <View style={{flex:1}}>
            <Text>랭킹 스크린</Text>
        </View>
        <TabBar router = {router}/>
    </View>

  );
};

export default RankingScreen