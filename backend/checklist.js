const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const { PrismaClient } = require('@prisma/client');
const app = express();
app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
const prisma = new PrismaClient({});

exports.postChecklist = async function(req,res){
   
    try{
    const q = req.body
    console.log("data..."+req.body.name)
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
    
    res.status(200).json(ex);
}catch(e){
    res.status(500).json({ name: "Checklist",check : "false",data : e })
}
}