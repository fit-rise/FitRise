const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const { PrismaClient } = require('@prisma/client');
const app = express();
const port = 3000;
app.use(express.json()) // body parsing 관련
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
const prisma = new PrismaClient({});


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
app.get('/:name', UserInfoDataAPI.getNameCheck);//닉네임 중복확인 api


const ckeckListAPI = require('./checklist')//체크리스트 api
app.post('/checklist', ckeckListAPI.postChecklist)


const CalendarScreen =require('./CalendarScreen')//켈린더 스크린 api
app.post('/CalendarScreen/doexercise',CalendarScreen.postCalendarScreen)

const MainScreen = require('./MainScreen')//메인 스크린 api
app.post('/MainScreen/food', MainScreen.postMainScreen)

const AnalysisScreen = require('./AnalysisScreen') // 그래프 조회 api
app.post('/AnalysisScreen/analysis',AnalysisScreen.postAnalysis)
app.post('/AnalysisScreen/weight', AnalysisScreen.postWeight)
app.post('/AnalysisScreen/checkWeight',AnalysisScreen.postCheckWeight)

const RankingScreen = require('./RankingScreen') // 랭킹 조회 api
app.post('/RankingScreen/rank', RankingScreen.postRank)
