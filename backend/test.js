
// 사용자 정보를 저장할 객체



//정보 입력시 사




//체크리스트 반환




//exp 추가 && 해당 exercise삭제 && calender에 운동추가
app.post('/MainScreen/food', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  let calendarDay = await prisma.calenderDay.findFirst({
    where: {
      day: today
    }
  });
  if (!calendarDay) {
    calendarDay = await prisma.calenderDay.create({
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

    // Exercise 정보를 기반으로 doExercise 추가
    if (exercise) {
      await prisma.doExercise.create({
        data: {
          exercise: exercise.exercise,
          sets: exercise.sets,
          reps: exercise.reps,
          CalenderDayId: calendarDay.id
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
//했던 운동들 날짜리스트 반환 calender




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