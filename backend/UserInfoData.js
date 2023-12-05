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
exports.postUserInfoData = async function (req,res){
    try{
        const q = req.body
        const gpt = require('./gpt')
        const response = await gpt.processUserInput(userProfile)
        const responseJson = JSON.parse(response)
      
        const UserData = {
          height: q.height,
          weight: q.weight,
          ex_level: q.ex_level,
          ex_goal: q.ex_goal,
          name: q.name,
          plans: {
            create: responseJson.exercisePlan.map((plan) => ({
              day: `Day ${plan.day}`,
              exercises: {
                create: plan.exercises.map(exercise => ({
                  exercise: exercise.name, // 'name' 필드로 변경됨
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
        
      }catch(e){
        console.log(e)
        res.status(500).send(e);
      }
    
}

exports.getNameCheck = async function(res,req){
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
}