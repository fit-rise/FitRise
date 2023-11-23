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


exports.postMainScreen = async function(req,res){
    try{
        const today = new Date().toISOString().split('T')[0];
        let calendarDay = await prisma.calenderDay.findFirst({
          where: {
            day: today
          }
        });
        if (!calendarDay) {
          calendarDay = await prisma.calendarDay.create({
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
                CalendarDayId: calendarDay.id
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
      
        res.status(200).json({ name: "MainScreen",check : "check",data : user });
    }catch(e){
        res.status(500).json({ name: "MainScreen",check : "false",data : e })
    }
}