
// 사용자 정보를 저장할 객체



//정보 입력시 사




//체크리스트 반환




//exp 추가 && 해당 exercise삭제 && calender에 운동추가
app.post('/MainScreen/food', async (req, res) => {
  console.log("dd");
  const gpt = require('./gpt')
  const today = new Date().toISOString().split('T')[0];
  let calendarDay = await prisma.calendarDay.findFirst({
    where: {
      day: today,
      userId: req.body.id
    }
  });
  if (!calendarDay) {
    calendarDay = await prisma.calendarDay.create({
      data: {
        day: today,
        userId: req.body.id,
      }
    });
  }
  // Exercise 정보 찾기
  for (const exerciseId of req.body.exid) {
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId }
    });
    console.log("dd");
    // Exercise 정보를 기반으로 doExercise 추가
    if (exercise) {
      await prisma.doExercise.create({
        data: {
          exercise: exercise.exercise,
          sets: exercise.sets,
          reps: exercise.reps,
          CalendarDayId: calendarDay.id
        }
      });
      //체크된 운동 삭제
      const deletedExercise = await prisma.Exercise.delete({
        where: {
          id: exerciseId
        },
      });
      // 해당 WorkoutDay의 남은 Exercise 개수 확인
      const remainingExercises = await prisma.Exercise.count({
        where: { workoutDayId: deletedExercise.workoutDayId },
      });

      // Exercise가 더 이상 없으면 WorkoutDay 삭제
      if (remainingExercises === 0) {
        await prisma.workoutDay.delete({
          where: { id: deletedExercise.workoutDayId },
        });
      }
      //plans user확인
      const user_plan = await prisma.users.findUnique({
        where: {
          id: req.body.id,
        },
        select: {
          height: true,
          weight: true,
          frequency:true,
          ex_level: true,
          ex_goal: true,
          plans: true, // plans도 포함
        },
      });

      if (user_plan && user_plan.plans.length > 0) {
        // plans 배열에 항목이 남아 있음
        console.log("남은 plans가 있습니다.");
      } else {
        // 해당 사용자에게 plans가 없는 경우, 새로운 plans를 생성
        const responseJson = JSON.parse(gpt.processUserInput({
          height: user_plan.height,
          weight: user_plan.weight,
          level: user_plan.level, // 운동 수준
          exerciseGoal: user_plan.ex_goal, // 운동 목표
          weeklyExerciseFrequency: user_plan.frequency // 주 운동 횟수
        }))
        
        const createdPlans = await prisma.users.update({
          where: {
            id: req.body.id,
          },
          data: {
            plans: {
              create: responseJson.exercisePlan.map((day, index) => ({
                day: `Day ${index + 1}`,
                exercises: {
                  create: day[`Day ${index + 1}`].map(exercise => ({
                    exercise: exercise.exercise,
                    sets: exercise.sets,
                    reps: exercise.reps
                  }))
                }
              }))
            }
          },
        });
      }
    }
  }
  //exp 업데이트
  const updateUser = await prisma.users.update({
    where: {
      id: req.body.id,
    },
    data: {
      exp: req.body.exp,
    },
  })
  //업데이트된 유저 read
  const user = await prisma.users.findMany({
    where: {
      id: req.body.id,
    },
    select: {
      id: true,
      exp: true,
      plans: {
        select: {
          day: true,
          exercises: true,
        }
      }
    }
  });

  res.json(user);
});
//했던 운동들 날짜리스트 반환 calendar




/*
create
const user = await prisma.user.create({
  data: {
    email: 'elsa@prisma.io',
    name: 'Elsa Prisma',
  },
})
ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
read
한개
const user = await prisma.user.findUnique({
  where: {
    email: 'elsa@prisma.io',
  },
})
여러개
const users = await prisma.user.findMany({
  where: {
    email: {
      endsWith: 'prisma.io',
    },
  },
})
ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
update
한개
const updateUser = await prisma.user.update({
  where: {
    email: 'viola@prisma.io',
  },
  data: {
    name: 'Viola the Magnificent',
  },
})
여러개
const updateUsers = await prisma.user.updateMany({
  where: {
    email: {
      contains: 'prisma.io',
    },
  },
  data: {
    role: 'ADMIN',
  },
})
ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
delete
한개
const deleteUser = await prisma.user.delete({
  where: {
    email: 'bert@prisma.io',
  },
})
여러개
const deleteUsers = await prisma.user.deleteMany({
  where: {
    email: {
      contains: 'prisma.io',
    },
  },
})
*/