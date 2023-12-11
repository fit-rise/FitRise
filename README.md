# Fit-Rise
### :ChaGPT 기반 사용자 맞춤형 운동 루틴 제공 및 캐릭터 성장 동기부여 어플리케이션
<img src="/assets/images/Fit_Rise_Logo.png" height="350" width="100%">



<br/><br/>

# 목차

<details open="open">
  <ol>
    <li><a href="#features"> 기능 설명</a></li>
    <li><a href="#stacks"> 사용한 기술 스택 (Techniques Used) </a></li>
    <li><a href="#install"> 프로젝트 사용법 (Getting Started)</a></li>
    <li><a href="#team"> 팀 정보 (Team Information)</a></li>
  </ol>
</details>

<br/><br/>

<br/><br/>

<h1 id="features"> :iphone: 1. 기능 설명 </h1>

### 인공지능을 통한 체크리스트

<img src="/assets/images/체크리스트 생성.gif" width="200" height="300"/>

### 체크리스트를 통한 캐릭터 성장

<img src="/assets/images/캐릭터 성장.gif" width="200" height="300"/>

### 운동사전

<img src="/assets/images/운동사전.gif" width="200" height="300"/>

### 운동관련 챗봇

<img src="/assets/images/운동관련챗봇.gif" width="200" height="300"/>

### 랭킹표

<img src="/assets/images/랭킹표.gif" width="200" height="300"/>

### 기록&분석

<img src="/assets/images/캘린더화면.gif" width="200" height="300"/><img src="/assets/images/분석.gif" width="200" height="300"/>


### 정보 재설정

<img src="/assets/images/정보재설정.gif" width="200" height="300"/>


<br/><br/>

<br/><br/>

<h1 id="stacks"> :octocat: 2. 사용한 기술 스택 (Techniques Used) </h1>

## Front-end

 |[React-Native 0.72.5](https://ko.reactjs.org/)|
 |:-------------------:|
 [<img src = "https://reactjs.org/logo-og.png" width = 50% height="50%">](https://reactnative.dev/)|
 |Expo 앱|

## Back-end(Server,DataBase)

 |[NodeJs 16.18.0](https://nodejs.org/ko/)|[Express 4.18.2](https://expressjs.com/ko/)|[MongoDB atlas](https://www.mongodb.com/)|[Prisma 5.6.0](https://www.prisma.io/)
|:---------------------------------:|:---------------------------------:|:-----------------------:|:---------------------------------:|
| [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/220px-Node.js_logo.svg.png" width="100%">](https://nodejs.org/ko/) | [<img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" width="100%">](https://expressjs.com/ko/) | [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MongoDB_Logo.svg/2560px-MongoDB_Logo.svg.png" width="50%">](https://www.mongodb.com/) | [<img src="/assets/images/Prisma_Logo.jpg" width="100%">](https://www.prisma.io/) |
|  서버 구현 |  서버 구현 |  NoSQL Database |  데이터베이스 ORM |

## 사용한 Open API
-OpenAI "GPT4.0 API"
<br/>
-Google APIs의 “YouTube Data API v3”
<br/>
-Ninjas의 “exercises apis “



<br/><br/>

<br/><br/>

<h1 id="install"> :hammer_and_wrench: 3. 프로젝트 사용법 (Getting Started) </h1>

### 다운로드 및 패키지 설치 안내

### Environment Variables (환경변수들)

```
//FrontEnd .env
IP_URL="Server IP"
ChatScreen_API_KEY2="Chat Gpt API"
```

```
//BackEnd .env
DATABASE_URL="Mongodb DataBase URL"
OPENAI_API_KEY="Chat Gpt API"
```
<br/>

### APP Frontend

```console
$ git clone https://github.com/fit-rise/FitRise.git
$ yarn or npm install
// 위에 서술된 환경변수들 저장
$ npx expo start
```

<br/>

### Backend

```console
$ git clone https://github.com/fit-rise/FitRise.git
$ cd ./backend
$ yarn or npm install
// 위에 서술된 환경변수들 저장
$ node server.js
```

<br/><br/>
<br/><br/>

<h1 id="team"> :family_man_man_girl_boy: 4. 팀 정보 (Team Information) </h1>
<br/>

|  팀원  |     역할     |     GitHub     |         Email         |
| :----: | :----------: | :------------: | :-------------------: |
| 최우진 |   Front-End  |   woojin0518   |  twinsno119@gmail.com |
| 신은화 |   Back-End   |   eunhwa0308   |  eunhwa3458@gmail.com |
| 엄득용 |   Full-Stack |   EomDeukyong  |  emrdyd664@gmail.com  |
| 이진우 |   Full-Stack |   nickcopy     |  golove010@gmail.com  |
