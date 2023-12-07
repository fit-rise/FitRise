const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const { PrismaClient } = require('@prisma/client');
const app = express();
app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
const prisma = new PrismaClient({});


exports.postUserInfoData = async function (req, res) {

  try {
    const q = req.body
    const userProfile = {
      height: Number(q.height),
      weight: Number(q.weight),
      level: q.ex_level, // 운동 수준
      exerciseGoal: q.ex_goal, // 운동 목표
      weeklyExerciseFrequency: q.Exercise // 주 운동 횟수
    };

    const gpt = require('./gpt')
    const response = await gpt.processUserInput(userProfile)
    const responseJson = JSON.parse(response)

    const UserData = {
      height: Number(q.height),
      weight: Number(q.weight),
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
    res.status(200).send("유저생성완료");
  } catch (e) {
    console.log(e)
    res.status(500).send(e);
  }

}

exports.getNameCheck = async function (req, res) {
  const p = req.body;
  try {
    const user = await prisma.users.findMany({
      where: {
        name: p.name,
      },
    });


    res.json(user[0].name);

  } catch (e) {
    res.status(500).json("user not found")
  }
}