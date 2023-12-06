const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const { PrismaClient } = require('@prisma/client');
const app = express();
app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
const prisma = new PrismaClient({});

exports.postReSetUserData = async function (req,res){
    console.log("왔니")
    try{
        console.log(req.body)
    }catch(e){

    }
}