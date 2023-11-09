const express = require('express');
const app = express();
const port = 3000;

// gpt.js 모듈을 가져옴
const gpt = require('./gpt');

// 사용자 정보를 저장할 객체
const userProfile = {

    height: 180,
    weight: 70, 
    level: "advanced", // 운동 수준
    exerciseGoal: "Strengthening shoulders", // 운동 목표
    weeklyExerciseFrequency: 4 // 주 운동 횟수
};

app.get('/', (req, res) => {
    gpt.processUserInput(userProfile)
    .then(response => {
      console.log(response)
      const responseJson = JSON.parse(response)

       // JSON 객체를 반복하며 각 값을 추출합니다.
      responseJson.exercisePlan.forEach(dayPlan => {
      console.log(`Day: ${dayPlan.day}`);
      dayPlan.exercises.forEach(exercise => {
        console.log(`Exercise: ${exercise.name}`);
        console.log(`Sets: ${exercise.sets}`);
        console.log(`Reps: ${exercise.reps}`);
      });
    });

    res.send(responseJson);
    })
    .catch(error => {
      // 에러 발생 시, 클라이언트에 500 에러를 전송합니다.
      console.error(error);
      res.status(500).send('Error processing the request');
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
