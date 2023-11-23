const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const port = 3000;
const cors = require('cors')
app.use(express.json()) // body parsing 관련
app.use(cors())
app.use(express.urlencoded({ extended: true })) // body parsing관련
const prisma = new PrismaClient({});


exports.postCalendarScreen = async function(req,res){
  
    try{
      con
        const q = req.body
        const ex = await prisma.users.findMany({
          where: {
            name: q.name,
          },
          select: {
            calender: {
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