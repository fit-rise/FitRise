const mongoose = require("mongoose");

//유저 스키마
const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: {type: String, required: true},
});

//유저 모델 생성
const personModel = mongoose.model("users",personSchema);

module.exports = personModel;

