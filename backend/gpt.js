const { OpenAI } = require('openai');

// OpenAI API 키를 환경 변수에서 로드
require("dotenv").config();

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



// 사용자 입력을 받아서 GPT-3 모델에 전달하고 응답을 반환하는 함수
async function processUserInput(userProfile) {
    console.log(userProfile)
  try {
    // OpenAI API에서 응답 생성
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
     {
      role: "system",
      content: "You are an AI personal trainer. Provide a personalized exercise plan for the user based on their profile and structure it into a JSON object with the specified format. Ensure that the 'exercisePlan' is an array with objects for each day, and each 'Day' object contains an array of exercises, with each exercise having 'exercise', 'sets', and 'reps' as keys."
    },
        {
          role: "user",
          content: JSON.stringify(userProfile)
        },
        {
          role: "assistant",
          content:  `The plan will be structured into a JSON object with 'workoutDays' representing the total number of days to work out in a week, and 'exercisePlan' which includes each workout session labeled from 'Day 1' to 'Day ${userProfile.weeklyExerciseFrequency}'. Each day will include the name of the exercise, the number of sets, and the number of reps.`
        },      
        // The assistant's response message will be generated based on previous messages.
      ],
      
    });

    // AI 모델이 생성한 응답 추출
    const completion_text = completion.choices[0].message.content;
    console.log(completion_text);
    
    return completion_text;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  processUserInput,
};
