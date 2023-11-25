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
      model: "gpt-4-1106-preview",
      messages: [
       {
          role: "system",
          content: "You are an AI personal trainer. json"
        },
        {
          role: "user",
          content: JSON.stringify(userProfile)
        },     
      ],
      response_format : {
        "type" : "json_object"
      },
      functions: [
        {
          name: "exercise_routine",
          description: "개인 맞춤형 운동 루틴 추천",
          parameters: {
            type: "object",
            properties: {
              exercisePlan : {
                type: "array",
                items:{
                  type:"object",
                  properties: {
                    day: {
                      type: "string",
                      description: `'1' to '${userProfile.weeklyExerciseFrequency}'`
                    },
                    exercises : {
                      type: "array",
                      items:{
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                            description: "운동 이름"
                          },
                          sets: {
                            type: "string",
                            description: "운동 세트 수"
                          },
                          reps: {
                            type:"string",
                            description:"운동 세트 당 횟수"                 
                        
                          } 
                        }
                      }                 
                    }                
                  }               
                }
              }
            }  
            ,
            required: ["exercisePlan"]

          }
          
          
        }
      ],
      function_call:{name: "exercise_routine"}
       
    });

    // AI 모델이 생성한 응답 추출
    const completion_text = completion.choices[0].message.function_call.arguments;
    console.log(completion_text);
    
    return completion_text;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  processUserInput,
};
