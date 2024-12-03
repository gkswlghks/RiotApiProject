//검색바의 정보를 가져오는 함수
function searchBarSummonerInfo() {
    const searchBar = document.getElementById("search-bar").value;
    const splitInput = searchBar.split("#");
    const [name, tag] = splitInput;
    // console.log(name, tag);
    searchSummonerInfo(name, tag);
}


//메인화면 소환사 랭킹에서 정보를 가져오는 함수
function topSummonerInfo(name, tag) {
    // console.log(name, tag);
    searchSummonerInfo(name, tag);
}

//소환사 정보를 찾고, html을 작성하는 함수
function searchSummonerInfo(summonerName, summonerTag) {
    const summonerInfoUrl = `/summoner/info/${encodeURIComponent(summonerName)}/${encodeURIComponent(summonerTag)}`; 
    fetch(summonerInfoUrl)
        .then(response => response.json())
        .then(data => {
            // 데이터 확인용
            // console.log("summonerID:", data.summonerIdData);
            // console.log("match:",data.matchDetails);
            // console.log("leagueData:",data.leagueData);

            let today = new Date();   
            const topSummoners = document.getElementById("summoner-rank-table");
            const summonerInfo = document.getElementById("summoner-info");
            const summonerRankInfo = document.getElementById("summoner-rank-info");
            const matchResult = document.getElementById("match-result");

            
            document.getElementById("searchBar").innerHTML = '';
            document.querySelector(".summoner-info-display").style.display = "flex";
            document.querySelector(".rank-section").style.display = 'none';
            topSummoners.innerHTML = '';
            matchResult.innerHTML = `
            <h3>매치 정보</h3>
            <h5>${today} 기준</h5>
            `;

            summonerInfo.innerHTML = `
                <span>
                    <img src="${data.profileIconUrl}" alt="프로필 사진" width = '100' height = '100'>
                </span>
                <span>
                    <p>닉네임</p>
                    <p>${summonerName}#${summonerTag}</p>
                    <p>레벨: ${data.summonerLevel}</p>
                </span>

            `;

            summonerRankInfo.innerHTML = `
                <span>
                    <img src="./Ranked_Emblems/${data.rankIMG}.png" alt="티어 사진" width = '100' height = '100'>
                </span>
                <span>
                    <p>티어: ${data.rank}LP</p>
                    <p>승/패: ${data.rankRatioWin}/${data.rankRatioLoss}</p>
                </span>
            `;

            // matchDetails 배열을 순회하며 각 매치에 대해 처리
            data.matchDetails.forEach((match, index) => {
                // 매치 정보에 참가자들이 있는지 확인
                if (match.info && match.info.participants) {
                    // 현재 사용자의 PUUID에 해당하는 참가자 찾기
                    const participant = match.info.participants.find(p => p.puuid === data.puuid);
                    // 참가자가 존재하면 매치 정보 처리
                    if (participant) {
                        let gameMode;
                        switch (match.info.queueId) {
                            case 420: gameMode = '개인/2인 랭크'; 
                                break;
                            case 440: gameMode = '자유 랭크'; 
                                break;
                            case 450: gameMode = '칼바람 나락'; 
                                break;
                            default: gameMode = '일반'; 
                                break;
                        }

                        const matchInfo = document.createElement("div");
                        let gradePoint = (participant.kills+participant.assists) / participant.deaths
                        gradePoint = gradePoint.toFixed(1);
                        matchInfo.innerHTML = `
                            <div class="gameInfo">
                                <div>
                                    <h2>Match ${participant.win ? '승리' : '패배'} (${gameMode})</h2>
                                    <div class="champion-info">
                                        <img src="https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${participant.championName}.png" alt="챔피언 사진">
                                        <span>챔피언: ${participant.championName} </span>
                                        <span>라인: ${participant.lane} </span>
                                    </div>
                                    <div class="match-stats">
                                        <span>레벨: ${participant.champLevel} </span>
                                        <span>KDA: ${participant.kills}/${participant.deaths}/${participant.assists} </span>
                                        <span>골드 획득량: ${participant.goldEarned} </span>
                                        <span>피해량: ${participant.totalDamageDealtToChampions}</span>
                                        <span id="gradePoint"><h3>평점: ${gradePoint}:1</h3></span>
                                    </div>
                                    <button id="show-players-${index}">매치 더보기</button>
                                </div>
                            </div>
                            <div id="participants-info-${index}" style="display: none;"></div>
                        `;
                        matchInfo.style.background = participant.win ? 'linear-gradient(145deg, #4a4a9e, #30307a)' : '#CD3861';
                        matchInfo.style.borderRadius = '10px';
                        matchResult.appendChild(matchInfo);

                        // 버튼 클릭 이벤트 => 초기화 후 참가자 10명 정보 추가
                        document.getElementById(`show-players-${index}`).addEventListener("click", () => {
                            const participantsInfoDiv = document.getElementById(`participants-info-${index}`);
                        
                            // 내용 표시/숨김 처리
                            if (participantsInfoDiv.style.display === "none") {
                                participantsInfoDiv.style.display = "block";
                                participantsInfoDiv.innerHTML = "";
                        
                                // 블루팀과 레드팀 섹션 생성
                                const blueTeamDiv = document.createElement("div");
                                blueTeamDiv.classList.add("team-container", "blue-team-section");
                        
                                const redTeamDiv = document.createElement("div");
                                redTeamDiv.classList.add("team-container", "red-team-section");
                        
                                // 각 참가자 정보를 분리하여 처리
                                match.info.participants.forEach((participant) => {
                                    // 플레이어 정보를 담을 카드 생성
                                    const playerInfo = document.createElement("div");
                                    playerInfo.classList.add("participant-card", participant.win ? "blue-team" : "red-team");
                                    playerInfo.addEventListener('click', () => {
                                        // console.log(participant.riotIdGameName, participant.riotIdTagline);
                                        topSummonerInfo(participant.riotIdGameName, participant.riotIdTagline);
                                    });
                                    playerInfo.innerHTML = `
                                        <img src="https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${participant.championName}.png" alt="챔피언 사진">
                                        <h4>${participant.summonerName}</h4>
                                        <span>챔피언: ${participant.championName}</span>
                                        <span>레벨: ${participant.champLevel}</span>
                                        <span>KDA: ${participant.kills}/${participant.deaths}/${participant.assists}</span>
                                        <span>골드 획득량: ${participant.goldEarned}</span>
                                        <span>피해량: ${participant.totalDamageDealtToChampions}</span>
                                    `;
                        
                                    // 각 팀에 맞는 섹션에 추가
                                    if (participant.win) {
                                        blueTeamDiv.appendChild(playerInfo);
                                    } else {
                                        redTeamDiv.appendChild(playerInfo);
                                    }
                                });
                        
                                // 섹션을 부모 컨테이너에 추가
                                participantsInfoDiv.appendChild(blueTeamDiv);
                                participantsInfoDiv.appendChild(redTeamDiv);
                        
                            } else {
                                participantsInfoDiv.style.display = "none";
                            }
                        });                        
                    }
                }
            });
        })
        .catch(error => alert('사용자 정보가 없습니다.'));
}


//메인화면 소환사 랭킹 함수
function mainInfo() { 
    fetch('/main')  
        .then(response => response.json())
        .then(data => {
            // 이전 데이터 초기화, 변수 선언
            let today = new Date(); 
            document.getElementById("summoner-rank").innerHTML += `${today}`;
            document.querySelector(".summoner-info-display").style.display = "none";
            const topSummoners = document.getElementById("summoner-rank-table");

            //데이터 확인용
            // console.log(data.topSummonerDetails);

            // 데이터가 존재하고 배열 형태일 경우에만 map을 실행
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
        })
        .catch(error => console.log('페이지 오류:', error));
}
mainInfo();