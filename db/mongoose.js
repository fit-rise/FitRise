const mongoose = require('mongoose');
const Person = require("./schema");
//mongoose db연결
mongoose.set("strictQuery",false);

mongoose
    .connect("mongodb+srv://yong:U2xiqxZLVUev9YR1@cluster0.9ttwjhd.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp",{ 
        dbName: 'FitRise',
        useNewUrlParser: true 
    })
    .then(console.log("connected to MongoDB"));



//ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡCRUDㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ   
//DB 데이터 CREATE
//모델에 따른 데이터 생성
const eom = new Person({
    "name":"Andy Park",
    "age":30,
    "email":"andy@backend.com",
});

async function createPerson() {
    try {
      //첫번쨰 방법 save();
      const create1=await eom.save();
      console.log('Document saved:', create1);
      //두번째 방법 create({});
      const create2=await Person.create({
        "name":"Andy Lee",
        "age":100,
        "email":"andyLee@backend.com",
      })
      console.log('Document saved:', create2);
    } catch (err) {
      console.error('Error document:', err);
    }
}
// createPerson();

//DB 데이터 READ (다른 컬렉션 데이터 참조:populate)
async function readPerson() {
    try {
        //첫번째 find(); 일치하는거 전부가져오기
        const read1=await Person.find({ age: 100});
        console.log(read1);
        //두번쨰 findOne(); 일치하는거 하나만 가져오기
        const read2=await Person.findOne({ age: 100});
    } catch (err) {
      console.error('Error document:', err);
    }
}
// readPerson();

//DB 데이터 UPDATE
async function updatePerson() {
    try {
        //첫번째 findByIdAndUpdate() 해당 id document 수정
        const update1 =await Person.findByIdAndUpdate(/*id값*/"65489cbcdb5ddf7d676747e3", {name: "Andy Panda"});
        console.log(update1);
        //두번쨰 updateOne(); 조건에 부합하는 document 수정
        const update2=await Person.updateOne({ age: 100},{ name: "Andy Candy" });
        console.log(update2);
    } catch (err) {
      console.error('Error document:', err);
    }
}
// updatePerson();

//DB 데이터 DELETE
async function deletePerson() {
    try {
        //첫번째 findOneAndDelete(); 조건에 부합한 데이터를 삭제 return O
        const delete1=await Person.findOneAndDelete({ age: 100});
        console.log(delete1);
        //두번쨰 deleteOne 조건에 부합한 데이터를 삭제  return x
    } catch (err) {
      console.error('Error document:', err);
    }
}

//deletePerson();




