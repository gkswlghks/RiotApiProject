# RiotAPI를 활용한 전적검색 사이트
nodejs를 활용한 리그 오브 레전드 플레이어들이 자신의 전적을 쉽게 검색할 수 있는 웹 페이지 제작
DB는 없으므로 필요시 적용하세요
[RiotAPI](https://developer.riotgames.com/)
[ddrgon](https://developer.riotgames.com/docs/lol)
## 사용방법
### npm 모듈을 설치 해준다.
```
npm install 
```
### 실행 방법
```
npm start
```
or
```
node server.js
```
http://localhost:8000 으로 접속

## 구조
riotapiproject/
├── public/               
│   ├── style.css
│   ├── app.js
│   ├── Ranked_Emblems
│   └── index.html   
├── node_modules
├── server.js              
├── package-lock.json              
├── package.json           
└── README.md           
