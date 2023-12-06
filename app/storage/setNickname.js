import AsyncStorage from '@react-native-async-storage/async-storage';

export const setNickname = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    
    // 저장값 확인을 위한 console.log
    console.log(`setItem... ${key} : ${value}`);
    const res = await AsyncStorage.getItem(key);
    console.log("data.." + res)
  } catch (e) {
    throw e;
  }
};


export const getItem = async (key) => {
  try {
    const res = await AsyncStorage.getItem(key);
    return res || '';
  } catch (e) {
    throw e;
  }
}