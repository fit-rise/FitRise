const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});
const { MongoClient } = require('mongodb')

// 랭킹 집계
async function calculateRanking(name,userTier) {
  const uri =  process.env.DATABASE_URL;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db("FitRise");
    const users = database.collection("users");

     // MongoDB의 집계 파이프라인 사용
     const pipeline = [
      {
        $match: { tier: { $eq: userTier } } // '티어 1'인 사용자만 선택
      },
      {
        $sort: { exp: -1 } // 경험치(exp) 기준으로 내림차순 정렬
      },
      {
        $limit: 10 // 상위 10개 문서만 선택
      },
      {
        $group: {
          _id: "$tier", // 티어별로 그룹화
          users: {
            $push: { // 각 사용자의 정보를 배열로 만듬
              name: "$name",
              tier: "$tier",
              exp: "$exp"
            }
          }
        }
      },
      {
        $unwind: { // users 배열을 풀어 각 사용자별로 문서를 만듬
          path: "$users",
          includeArrayIndex: "rank" // 순위를 배열 인덱스로 사용
        }
      },
      {
        $project: { // 결과 문서 형식 정의
          _id: 0,
          rank: { $add: ["$rank", 1] }, // 순위는 0부터 시작하므로 1을 더함
          name: "$users.name",
          tier: "$users.tier",
          exp: "$users.exp",

        }
      }
    ];

    const rankingResult  = await users.aggregate(pipeline).toArray();

    // 공동 순위 계산 로직
    let prevExp = null;
    let actualRank = 1;
    for (let i = 0; i < rankingResult.length; i++) {
      if (rankingResult[i].exp !== prevExp) {
        actualRank = i + 1;
      }
      rankingResult[i].rank = actualRank;
      prevExp = rankingResult[i].exp;
    }
    const userRank = rankingResult.find(user => user.name === name);

    return { ranking: rankingResult, userRank };
  } finally {
    await client.close();
  }
}

// 랭킹 조회
const postRank = async function (req, res) {

    const username = req.body.name;
    console.log('postRank : '+username)

    try{

          // 해당 사용자의 티어를 조회합니다.
      const user = await prisma.users.findFirst({
        where: {
          name: username,
        },
        select: {
          name: true,
          tier: true,
          exp : true
        },
      });
      console.log('user.name:'+user.name)

      const result = await calculateRanking(user.name,user.tier);
      
      res.json(result);
    }catch(error){
      res.status(500).json({ error: error.message });
    }

}

module.exports = {
    postRank
}
