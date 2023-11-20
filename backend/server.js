const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const port = 3000;
const cors = require('cors')
app.use(express.json()) // body parsing 관련
app.use(cors())
app.use(express.urlencoded({ extended: true })) // body parsing관련
// gpt.js 모듈을 가져옴
const gpt = require('./gpt');
const prisma = new PrismaClient({});
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
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//정보 입력시 사용자정보&계획 저장
app.post("/Input", async (req, res) => {
  const q = req.body
  //가져온 데이터로 chatgpt 결과 생성후 아래 DB에 저장
  const response = await gpt.processUserInput(userProfile)
  const responseJson = JSON.parse(response)


  const UserData = {
    height: q.height,
    weight: q.weight,
    ex_level: q.ex_level,
    ex_goal: q.ex_goal,
    name: q.name,
    plans: {
      create: responseJson.exercisePlan.map((day,index) => ({
        day: `Day ${index + 1}`,
        exercises: {
          create: day[`Day ${index + 1}`].map(exercise => ({
            exercise: exercise.exercise,
            sets: exercise.sets,
            reps: exercise.reps
          }))
        }
      }))
    }
  };

  await prisma.users.create({
    data: UserData,
    include: {
      plans: {
        include: {
          exercises: true
        }
      }
    }
  });
  res.send("정보입력완료")
})
//name 중복인지 확인
app.get('/:name', async (req, res) => {
  const p = req.params;
  const user = await prisma.users.findMany({
    where: {
      name: p.name,
    },
  });

  if (user) {
    res.json(user);
  } else {
    res.send('User not found');
  }
});
//체크리스트 반환
app.post('/checklist', async (req, res) => {
  const q = req.body
  const ex = await prisma.users.findMany({
    where: {
      name: q.name,
    },
    select:{
      exp: true,
      plans: {
        select: {
          day:true,
          exercises:true
        }
      }
    }
  })
  res.json(ex)
})

/*
create
const user = await prisma.user.create({
  data: {
    email: 'elsa@prisma.io',
    name: 'Elsa Prisma',
  },
})
ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
read
한개
const user = await prisma.user.findUnique({
  where: {
    email: 'elsa@prisma.io',
  },
})
여러개
const users = await prisma.user.findMany({
  where: {
    email: {
      endsWith: 'prisma.io',
    },
  },
})
ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
update
한개
const updateUser = await prisma.user.update({
  where: {
    email: 'viola@prisma.io',
  },
  data: {
    name: 'Viola the Magnificent',
  },
})
여러개
const updateUsers = await prisma.user.updateMany({
  where: {
    email: {
      contains: 'prisma.io',
    },
  },
  data: {
    role: 'ADMIN',
  },
})
ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
delete
한개
const deleteUser = await prisma.user.delete({
  where: {
    email: 'bert@prisma.io',
  },
})
여러개
const deleteUsers = await prisma.user.deleteMany({
  where: {
    email: {
      contains: 'prisma.io',
    },
  },
})
*/