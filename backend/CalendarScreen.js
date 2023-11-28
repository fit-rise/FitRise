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

exports.postCalendarScreen = async function(req,res){
  console.log("!11111")
    try{
     
        const q = req.body
        const ex = await prisma.users.findMany({
          where: {
            name: q.name,
          },
          select: {
            calendar: {
              select: {
                day: true,
                doexercises: {
                  select: {
                    exercise: true,
                    sets: true,
                    reps: true,
                  }
                }
              }
            }
          }
        })
        console.log("!222222")
        res.status(200).json({ name: "CalendarScreen",check : "check",data : ex });
    }catch(e){
      console.log(e)
        res.status(500).json({ name: "CalendarScreen",check : "false",data : e })
    }
}