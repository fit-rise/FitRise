const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({}
    );
// 그래프 조회
const postAnalysis = async function (req, res) {
    try{

        const userId = req.body.userId;
        console.log('분석 조회'+userId)
    
        // 현재 날짜에서 7일 전의 날짜 계산
        const date = new Date();
        date.setDate(date.getDate() - 7);
        const sevenDaysAgo = date.toISOString().split('T')[0];
     
        
         // 최근 일주일 간의 데이터 조회
         const analysis = await prisma.Analysis.findMany({
           where: {
             userId: userId,
             date: {
               gte: sevenDaysAgo, 
             }
           },
           select: {
             date: true,
             weight: true,
             bmi: true
           },
           orderBy: {
             date: 'asc' 
           }
         });
    
         console.log(analysis);
         res.json(analysis);
    
    }catch (error) {
    res.status(500).json({ error: error.message });
    }
}

// 몸무게 기록
const postWeight = async function (req, res) {

    const weight = parseInt(req.body.weight, 10);

    const userId = "655de6c451a5a1fdd749aff1";

    // 유저의 키 조회
    const user = await prisma.users.findUnique({
    where: {
        id: userId,
    },
    select: {
        height: true
    },
    });

    // BMI 계산
    const heightInMeters = user.height / 100;
    const bmi = weight / (heightInMeters * heightInMeters );

    // 오늘 날짜 구하기
    const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식;

    const analysis = await prisma.analysis.create({
        data: {
        date: today,
        weight: weight,
        bmi: Math.round(bmi),
        userId : userId
        }
    });

    console.log(analysis)

    res.status(200).json(analysis);
  }

  const postCheckWeight = async function (req, res) {
    const date  = new Date().toISOString().split('T')[0];
    const userId = "655de6c451a5a1fdd749aff1";

    const record = await prisma.analysis.findMany({
        where: {
          userId,
          date
        }
      });
      if (record.length > 0) {
        res.json(record);
      } else {
        res.status(404).json({ message: 'No weight record found for today.' });
      }

  }


module.exports = {
    postAnalysis, postWeight, postCheckWeight
}