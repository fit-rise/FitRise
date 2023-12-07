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

exports.postReSetUserData = async function (req, res) {

    try {
        const user = await prisma.users.findUnique({
            where: {
                name: req.body.name
            }
        });

        if (!user) {
            throw new Error('사용자를 찾을 수 없습니다.');
        }
        // 해당 사용자의 모든 WorkoutDay ID 찾기
        const workoutDays = await prisma.workoutDay.findMany({
            where: {
                userId: user.id
            },
            select: {
                id: true
            }
        });

        // 각 WorkoutDay에 대해 모든 Exercise 삭제
        for (const workoutDay of workoutDays) {
            await prisma.exercise.deleteMany({
                where: {
                    workoutDayId: workoutDay.id
                }
            });
        }

        // 해당 사용자의 모든 WorkoutDay 삭제
        await prisma.workoutDay.deleteMany({
            where: {
                userId: user.id
            }
        });

        console.log(`사용자의 모든 WorkoutDay와 Exercise가 삭제되었습니다.`);
        const response = await gpt.processUserInput({
            height: req.body.height,
            weight: `${user.weight}`,
            level: req.body.level, // 운동 수준
            exerciseGoal: req.body.goal, // 운동 목표
            weeklyExerciseFrequency: req.body.Exercise // 주 운동 횟수
        })
        const responseJson = JSON.parse(response)
        const updatedUser = await prisma.users.update({
            where: {
                name: req.body.name,
            },
            data: {
                height: parseInt(req.body.height, 10),
                weight: user.weight,
                frequency: parseInt(req.body.Exercise, 10),
                ex_level: req.body.level,
                ex_goal: req.body.goal,
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
        res.json({ message: 'User data updated successfully', updatedUser });
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ error: error.message });
    }
}