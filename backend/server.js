const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const { PrismaClient } = require('@prisma/client');
const app = express();
const port = 50123;
app.use(express.json());
app.use(cors())
const prisma = new PrismaClient({});
app.use(bodyParser.urlencoded({ extends: true }))
// gpt.js 모듈을 가져옴
const gpt = require('./gpt');
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// 사용자 정보를 저장할 객체

const userProfile = {

    height: 180,
    weight: 70, 
    level: "advanced", // 운동 수준
    exerciseGoal: "Strengthening shoulders", // 운동 목표
    weeklyExerciseFrequency: 4 // 주 운동 횟수
};
app.get('/', (req, res)=>{
  console.log(req)
  res.status(200).json({ name: "true  " ,server:"진우의 서버" ,data: req.body });
})
app.get('/GPT', (req, res) => {
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
      res.send(
        
      );
    })
    .catch(error => {
      // 에러 발생 시, 클라이언트에 500 에러를 전송합니다.
      console.error(error);
      res.status(500).send('Error processing the request');
    });
});


app.post('/UserInfoData',async (req, res)=>{
  try{
    console.log("wwwwwwwwwwwwww")
    console.log(req.body);
    const UserData = {
      height : Number(req.body.height) , 
      weight : Number(req.body.weight),
      ex_level : req.body.exerciseLevel, 
      ex_goal : req.body.goal,
      name : req.body.name,
    };
    console.log("111111111111")
    await prisma.users.create({
      data: UserData,
      include: {
        plans : {  
          include: {
            days: {
              include: {
                exercises: true
              }
            }
          }
        }
      }
    });
    res.status(200).json({ name: "UserInfoData",check : "OK",res : req.body});
  }catch(e){
    console.log(e)
    res.status(500).send(e);
  }


})
app.post('/CalendarScreen/doexercise', async (req, res) => {
  const q = req.body
  const ex = await prisma.users.findMany({
    where: {
      name: q.name,
    },
    select: {
      calender: {
        select: {
          day: true,
          doexercises: {
            select: {
              exercise: true,
              sets: true,
              reps: true,
            }
          }
        }
      }
    }
  })
  res.json(ex)
})
app.post('/MainScreen/food', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  let calendarDay = await prisma.calenderDay.findFirst({
    where: {
      day: today
    }
  });
  if (!calendarDay) {
    calendarDay = await prisma.calenderDay.create({
      data: {
        day: today,
        userId: req.body.id,
      }
    });
  }
  // Exercise 정보 찾기
  for (const exerciseId of req.body.exid) {
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId }
    });

    // Exercise 정보를 기반으로 doExercise 추가
    if (exercise) {
      await prisma.doExercise.create({
        data: {
          exercise: exercise.exercise,
          sets: exercise.sets,
          reps: exercise.reps,
          CalenderDayId: calendarDay.id
        }
      });
      //체크된 운동 삭제
      const deletedExercise = await prisma.Exercise.delete({
        where: {
          id: exerciseId
        },
      });
      // 해당 WorkoutDay의 남은 Exercise 개수 확인
      const remainingExercises = await prisma.Exercise.count({
        where: { workoutDayId: deletedExercise.workoutDayId },
      });

      // Exercise가 더 이상 없으면 WorkoutDay 삭제
      if (remainingExercises === 0) {
        await prisma.workoutDay.delete({
          where: { id: deletedExercise.workoutDayId },
        });
      }
    }
  }
  //exp 업데이트
  const updateUser = await prisma.users.update({
    where: {
      id: req.body.id,
    },
    data: {
      exp: req.body.exp,
    },
  })
  //업데이트된 유저 read
  const user = await prisma.users.findMany({
    where: {
      id: req.body.id,
    },
    select: {
      id: true,
      exp: true,
      plans: {
        select: {
          day: true,
          exercises: true,
        }
      }
    }
  });

  res.json(user);
});