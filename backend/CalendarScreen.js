const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const { PrismaClient } = require('@prisma/client');
const app = express();
app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
const prisma = new PrismaClient({});

exports.postCalendarScreen = async function (req, res) {
  try {
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
    res.status(200).json(ex);
  } catch (e) {
    console.log(e)
    res.status(500).json({ name: "CalendarScreen", check: "false", data: e })
  }
}