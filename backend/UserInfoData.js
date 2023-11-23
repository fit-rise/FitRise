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


exports.postUserInfoData = async function (req,res){
    try{
        const q = req.body
        const response = await gpt.processUserInput(userProfile)
        const responseJson = JSON.parse(response)
      
        const UserData = {
            height: q.height,
            weight: q.weight,
            ex_level: q.ex_level,
            ex_goal: q.ex_goal,
            name: q.name,
            plans: {
              create: responseJson.exercisePlan.map((day, index) => ({
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