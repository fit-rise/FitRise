import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { IconBtn } from '../components';
import { icons } from '../constants';
import { useRouter } from "expo-router";

import React,{ useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';
import {ChatScreen_API_KEY}from "@env"

const ChatScreen = () => {
    const router = useRouter()
    const [messages, setMessages] = useState([])
    const handleSend = async (newMessages = []) => {
        try {
            //사용자 메세지 가져옴
            const userMessage = newMessages[0];

            //사용자 메세지 메세지 상태에 추가
            setMessages(previousMessages => GiftedChat.append(previousMessages,userMessage));
            const messageText = userMessage.text.toLowerCase();
            const keywords = [
                '운동 루틴', '근력 훈련', '유산소 운동', '스트레칭', '회복 운동', '운동 강도', '휴식 기간', '운동 계획', 
                '개인화된 운동', '운동 효과', '운동 기록', '몸매 목표', '운동 동기 부여', '운동 부상 예방', '운동 기구', 
                '영양소 균형', '건강한 식습관', '칼로리 섭취', '식사 계획', '체중 관리', '영양 보충제', '식품 다양성', 
                '건강한 간식', '수분 섭취', '식사 준비', '식단 추적', '알레르기 고려', '식단 목표 설정', '식단상담', '식습관 변화',
                '운동','식단'
            ];                  

            //사용자가 입력한 메세지에 키워드가 안들어가 있을때 
            if (!keywords.some(keyword => messageText.includes(keyword))){
                const botMessage = {
                    _id: new Date().getTime() + 1,
                    text: "죄송합니다. 저는 헬스 매니저입니다. 식단이나 운동 관련 질문을 해주시면 친절히 응답하겠습니다.",
                    createdAt: new Date(),
                    user:{
                        _id: 2,
                        name: 'Health Manager'
                    }
                };
                setMessages(previousMessages => GiftedChat.append(previousMessages,botMessage));
                return;
            }
            // 사용자가 입력한 메세지에 키워드 들어가 있을 때
            const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions',{
                prompt: `${messageText}`,
                max_tokens: 500,
                temperature: 0.2,
                n:1,
            }, {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ChatScreen_API_KEY}`
                }
            });

            console.log(response.data);

            const response_text = response.data.choices[0].text.trim();
            const botMessage ={
                _id: new Date().getTime() +1,
                text:response_text,
                createdAt: new Date(),
                user:{
                    _id: 2,
                    name: 'Health Manager'
                }
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages,botMessage));

        }catch (error) {
            console.log(error);
        }
    };

    return (
      <SafeAreaView style={styles.container}>
          <View style={styles.header}>
              <Text style={styles.headerText}>PT 쌤</Text>
              <IconBtn 
                  iconUrl={icons.tab_home} 
                  dimension='100%'
                  handlePress={() => router.push('/MainScreen')}
              />
          </View>
          <GiftedChat
              style={styles.chat}
              messages={messages}
              onSend={newMessages => handleSend(newMessages)}
              user={{ _id: 1 }}
          />
      </SafeAreaView>
  );  
}

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#DFEFDF',
    },
    header: {
      flexDirection: 'row',
      backgroundColor: '#F5F5F5',
      padding: 10,
      alignItems: 'center',
      borderBottomWidth: 1,
      marginTop: 40,
      marginBottom: 5,
      justifyContent: 'center',
  },

  headerText: {
      flex: 1,  // width 대신 flex 사용
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',  // 텍스트를 중앙 정렬
      marginLeft: 10,  // 아이콘과 텍스트 사이에 간격을 주기 위해
      fontFamily:"jua"
  },
    chat: {
      flex: 1,
      width: '100%',
    }
  });