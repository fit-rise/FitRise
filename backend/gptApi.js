const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const { PrismaClient } = require('@prisma/client');
const app = express();
app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
const prisma = new PrismaClient({});


const userProfile = {

    height: 180,
    weight: 70,
    level: "advanced", // 운동 수준
    exerciseGoal: "Strengthening shoulders", // 운동 목표
    weeklyExerciseFrequency: 4 // 주 운동 횟수
  };
const gpt = require('./gpt');//gpt모듈 가져오기

exports.getGPT = function(res,req){
    gpt.processUserInput(userProfile)
    .then(response => {
      console.log(response)
      const responseJson = JSON.parse(response)


      // 운동하는 총 일수를 추출합니다.
      const totalWorkoutDays = responseJson.workoutDays;
      console.log(`Total workout days: ${totalWorkoutDays}`);

      // 각 일자별 운동 계획을 추출하고 출력합니다.
      responseJson.exercisePlan.forEach((dayPlan, index) => {
        const dayKey = `Day ${index + 1}`; // JSON 객체에서 "Day 1", "Day 2", 등의 키를 생성합니다.
        const exercises = dayPlan[dayKey];

        // 해당 일자의 운동 목록을 출력합니다.
        console.log(`Exercises for ${dayKey}:`);

        // 해당 일자의 각 운동에 대한 정보를 추출하고 출력합니다.
        exercises.forEach(exercise => {
          console.log(`Exercise: ${exercise.exercise}`);
          console.log(`Sets: ${exercise.sets}`);
          console.log(`Reps: ${exercise.reps}`);
        });
      });
      // 수정: response를 그대로 전송합니다.
      res.send(responseJson);
    })
    .catch(error => {
      // 에러 발생 시, 클라이언트에 500 에러를 전송합니다.
      console.error(error);
      res.status(500).send('Error processing the request');
    });
}