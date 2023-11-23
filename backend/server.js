const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const { PrismaClient } = require('@prisma/client');
const app = express();
const port = 50123;
app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extends: true }))
const prisma = new PrismaClient({});

// gpt.js 모듈을 가져옴
const gpt = require('./gpt');


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// 사용자 정보를 저장할 객체

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
app.post('/CalendarScreen/doexercise',(res,req)=>{

})

const MainScreen = require('./MainScreen')//메인 스크린 api
app.post('/MainScreen/food', MainScreen.postMainScreen)
  