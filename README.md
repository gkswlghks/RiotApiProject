# RiotAPI를 활용한 전적검색 사이트
리그 오브 레전드 플레이어들이 자신의 전적을 쉽게 검색할 수 있는 웹 페이지 제작
[RiotAPI](https://developer.riotgames.com/)

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

## 코드 설명
### 메인 화면 
```js
function mainInfo() {
fetch('/main')  
    fetch('/main')  
        .then(response => response.json())
        .then(data => {
        <!-- 생략 -->
            }
        })
}
mainInfo();
```
mainInfo()가 실행 되면 /main으로 요청을 보내고
```js
app.get('/main', async (req, res) => {   
      //생략
});
```
server.js를 통해 받은 topSummonerDetails 데이터를 다시 app.js로 보내준다.
```js
if (data.topSummonerDetails && Array.isArray(data.topSummonerDetails)) {
                topSummoners.innerHTML = data.topSummonerDetails.map(summonerDetail => `
                    <tr onclick="topSummonerInfo('${summonerDetail.summonerInfo.gameName}', '${summonerDetail.summonerInfo.tagLine}')">
                        <td><img src="https://ddragon.leagueoflegends.com/cdn/14.23.1/img/profileicon/${summonerDetail.profileIconId}.png" alt="Profile Icon"  width="30" height="30"></td>
                        <td>${summonerDetail.summonerInfo.gameName}</td>
                        <td>${summonerDetail.leagueInfo.tier} ${summonerDetail.leagueInfo.rank}</td>
                        <td>${summonerDetail.leagueInfo.leaguePoints}</td>
                    </tr>
                `).join('');
            } else {
                topSummoners.innerHTML = "<p>소환사 데이터를 불러올 수 없습니다.</p>";
            }
```
서버에서 받아온 데이터를 기반으로 HTML 테이블을 동적으로 생성한다.

### 소환사 검색 
```html
<header>
    <h1><a href="http://localhost:8000/">LOL.GG</a></h1>
    <div class="search-bar" id="searchBar">
        <input id="search-bar" type="text" placeholder="이름#태그 (예: Hide on bush#KR1)">
        <button onclick="searchBarSummonerInfo()">검색</button>
    </div>
</header>
```
버튼을 누르면 app.js에 searchBarSummonerInfo()가 실행된다.
```js
function searchBarSummonerInfo() {
    const searchBar = document.getElementById("search-bar").value;
    const splitInput = searchBar.split("#");
    const [name, tag] = splitInput;
    // console.log(name, tag);
    searchSummonerInfo(name, tag);
}
```
searchSummonerInfo(name, tag) 가 실행되고
```js
function searchSummonerInfo(summonerName, summonerTag) {
    const summonerInfoUrl = `/summoner/info/${encodeURIComponent(summonerName)}/${encodeURIComponent(summonerTag)}`; 
    fetch(summonerInfoUrl)
        .then(response => response.json())
        .then(data => {

            //생략

            });
        })
        .catch(error => alert('사용자 정보가 없습니다.'));
}
```
/summoner/info/${encodeURIComponent(summonerName)}/${encodeURIComponent(summonerTag)}로 데이터를 요청하면

```js
app.get('/summoner/info/:name/:tag', async (req, res) => {
          //생략
});
```
server.js로 부터 leagueData, puuid, matchdetails 등의 데이터를 다시 app.js로 보낸다.
위와 같이 서버에서 받아온 데이터를 기반으로 html을 동적으로 작성한다.
