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
const { MongoClient } = require('mongodb')
// 사용자 정보를 저장할 객체
const userProfile = {

  height: 180,
  weight: 70,
  level: "advanced", // 운동 수준
  exerciseGoal: "Strengthening shoulders", // 운동 목표
  weeklyExerciseFrequency: 4 // 주 운동 횟수
};

// 랭킹 집계
async function calculateRanking(name,userTier) {
  const uri =  process.env.DATABASE_URL;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db("FitRise");
    const users = database.collection("users");

    // MongoDB의 집계 파이프라인 사용
    const pipeline = [
      {
        $match: { tier: { $eq: userTier } } // '티어 1'인 사용자만 선택
      },
      {
        $sort: { exp: -1 } // 경험치(exp) 기준으로 내림차순 정렬
      },
      {
        $group: {
          _id: "$tier", // 티어별로 그룹화
          users: {
            $push: { // 각 사용자의 정보를 배열로 만듬
              name: "$name",
              tier: "$tier",
              exp: "$exp"
            }
          }
        }
      },
      {
        $unwind: { // users 배열을 풀어 각 사용자별로 문서를 만듬
          path: "$users",
          includeArrayIndex: "rank" // 순위를 배열 인덱스로 사용
        }
      },
      {
        $project: { // 결과 문서 형식 정의
          _id: 0,
          rank: { $add: ["$rank", 1] }, // 순위는 0부터 시작하므로 1을 더함
          name: "$users.name",
          tier: "$users.tier",
          exp: "$users.exp",

        }
      }
    ];

    const ranking = await users.aggregate(pipeline).toArray();
    console.log(ranking);
    const userRank = ranking.find(user => user.name === name);
  
    console.log('순위 : '+userRank);

    return { ranking, userRank}
  } finally {
    await client.close();
  }
}



app.get('/ddd', (req, res) => {
  gpt.processUserInput(userProfile)
    .then(response => {
      console.log(response)
      const responseJson = JSON.parse(response)


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

// 랭킹 반환
app.post('/rank', async(req, res) => {

  const userId = req.body.userId;

   // 해당 사용자의 티어를 조회합니다.
   const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      tier: true,
      exp : true
    },
  });

  const result = await calculateRanking(user.name,user.tier);
  res.json(result);
})



// 몸무게 기록
app.post('/weight', async(req, res) =>{


  const weight = parseInt(req.body.weight, 10);

  console.log('뭄무게 도착 '+weight)

  const userId = "655de6c451a5a1fdd749aff1";

  // 유저의 키 조회
  const user = await prisma.users.findUnique({
   where: {
     id: userId,
   },
   select: {
    height: true
   },
  });

  // BMI 계산
  const heightInMeters = user.height / 100;
  const bmi = weight / (heightInMeters * heightInMeters );

  // 오늘 날짜 구하기
  const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식;

  const analysis = await prisma.analysis.create({
    data: {
      date: today,
      weight: weight,
      bmi: Math.round(bmi),
      userId : userId
    }
  });

  console.log(analysis)

  res.status(200).json(analysis);

})


// 그래프 조회
app.post('/analysis', async(req, res) => {

  try{

    const userId = req.body.userId;
    console.log('분석 조회'+userId)

    // 현재 날짜에서 7일 전의 날짜 계산
    const date = new Date();
    date.setDate(date.getDate() - 7);
    const sevenDaysAgo = date.toISOString().split('T')[0];
 
    
     // 최근 일주일 간의 데이터 조회
     const analysis = await prisma.Analysis.findMany({
       where: {
         userId: userId,
         date: {
           gte: sevenDaysAgo, 
         }
       },
       select: {
         date: true,
         weight: true,
         bmi: true
       },
       orderBy: {
         date: 'asc' 
       }
     });

     console.log(analysis);
     res.json(analysis);

  }catch (error) {
    res.status(500).json({ error: error.message });
  }
 
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