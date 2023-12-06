const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const { PrismaClient } = require('@prisma/client');
const app = express();
const gpt = require('./gpt')
app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
const prisma = new PrismaClient({});


exports.postMainScreen = async function (req, res) {
  try {
    const today = new Date().toISOString().split('T')[0];
    let calendarDay = await prisma.calendarDay.findFirst({
      where: {
        day: today,
        userId: req.body.id
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
    //plans user확인
    const user_plan = await prisma.users.findUnique({
      where: {
        id: req.body.id,
      },
      select: {
        height: true,
        weight: true,
        frequency: true,
        ex_level: true,
        ex_goal: true,
        plans: true, // plans도 포함
      },
    });

    if (user_plan && user_plan.plans.length > 0) {
      // plans 배열에 항목이 남아 있음
      console.log("남은 plans가 있습니다.");
    } else {
      // 해당 사용자에게 plans가 없는 경우, 새로운 plans를 생성
      const response = await gpt.processUserInput({
        height: user_plan.height,
        weight: user_plan.weight,
        level: user_plan.level, // 운동 수준
        exerciseGoal: user_plan.ex_goal, // 운동 목표
        weeklyExerciseFrequency: user_plan.frequency // 주 운동 횟수
      })
      const responseJson = JSON.parse(response)
      console.log(responseJson);
      const createdPlans = await prisma.users.update({
        where: {
          id: req.body.id,
        },
        data: {
          plans: {
            create: responseJson.exercisePlan.map(plan => ({
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
        },
      });
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

    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ name: "MainScreen", check: "false", data: e })
  }
}