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


exports.postChecklist = async function(res,req){
    
    try{
        const q = req.body
    const ex = await prisma.users.findMany({
      where: {
        name: q.name,
      },
      select: {
        id: true,
        exp: true,
        plans: {
          select: {
            day: true,
            exercises: true
          }
        }
      }
    })
    
    res.status(200).json({ name: "Checklist",check : "check",data : ex });
}catch(e){
    res.status(500).json({ name: "Checklist",check : "false",data : e })
}
}