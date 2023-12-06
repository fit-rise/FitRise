const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const { PrismaClient } = require('@prisma/client');
const app = express();
const port = 50123;
app.use(express.json()) // body parsing 관련
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
const prisma = new PrismaClient({});

// gpt.js 모듈을 가져옴
const gpt = require('./gpt');

const { MongoClient } = require('mongodb')

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res)=>{
  console.log(req)
  res.status(200).json({ name: "true  " ,server:"진우의 서버" ,data: req.body });
})
const GPTAPI = require('./gptApi')
app.get('/GPT', GPTAPI.getGPT);


const UserInfoDataAPI = require('./UserInfoData')
app.post('/UserInfoData',UserInfoDataAPI.postUserInfoData)//유저데이터 저장 api
app.post('/name', UserInfoDataAPI.getNameCheck);//닉네임 중복확인 api


const ckeckListAPI = require('./checklist')//체크리스트 api
app.post('/checklist', ckeckListAPI.postChecklist)


const CalendarScreen =require('./CalendarScreen')//켈린더 스크린 api
app.post('/CalendarScreen/doexercise',CalendarScreen.postCalendarScreen)

const MainScreen = require('./MainScreen')//메인 스크린 api
app.post('/MainScreen/food', MainScreen.postMainScreen)

const ReSetUserData = require("./reSetUserData")
app.post("/ReSetUserData",ReSetUserData.postReSetUserData)
