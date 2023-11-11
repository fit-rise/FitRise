const mongoose = require("mongoose");

//유저 스키마
const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: {type: String, required: true},
});

//유저 데이터 스키마
const udataSchema = new mongoose.Schema({

})

//유저 날짜별 루틴
const uplanSchema = new mongoose.Schema({



  
})

//유저 경험치
// 먹이 서브-도큐먼트 스키마
const foodSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    exp: {
      type: Number,
      required: true
    }
  });
  
  // 메인 스키마
  const uexpSchema = new mongoose.Schema({
    exp: {
      type: Number,
      required: true
    },
    foods: [foodSchema] // 'food' 필드는 서브-도큐먼트의 배열로 정의됩니다.
  });
  
//유저 경험치 모델 생성
const Uexp = mongoose.model('Uexp', uexpSchema);

//유저 모델 생성
const personModel = mongoose.model("users",personSchema);

module.exports = personModel;

