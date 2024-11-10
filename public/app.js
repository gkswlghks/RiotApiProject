function searchSummonerInfo() {
    const searchBar = document.getElementById("search-bar").value;
    const [name, tag] = searchBar.split("#");
    const summonerInfoUrl = `/summoner/info/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`;
    
    fetch(summonerInfoUrl)
        .then(response => response.json())
        .then(data => {
            const playerInfo = document.getElementById("summoner-info");
            const matchResult = document.getElementById("match-result");
            const championInfo = document.getElementById("champion-info");
            const summonerRankTable = document.getElementById("summoner-rank-table");
            championInfo.innerHTML = "";
            summonerRankTable.innerHTML = "";
            matchResult.innerHTML = "<h3>매치 정보</h3>";
            console.log(data.summonerIdData);
            console.log(data.profileIconId);

            playerInfo.innerHTML = `
                <img src="${data.profileIconUrl}" alt="프로필 사진">
                <p>닉네임: ${searchBar}</p>
                <p>레벨: ${data.summonerLevel}</p>
                <p>티어: ${data.rank}</p>
            `;

            // 매치 정보 표시
            data.matchDetails.forEach((match, index) => {
                // match.info가 정의되어 있는지 확인
                if (match.info && match.info.participants) {
                    const participant = match.info.participants.find(p => p.puuid === data.puuid);
                    
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
                        matchInfo.innerHTML = `
                            <div id="gameInfo">
                                <h4>Match ${participant.win ? '승리' : '패배'} (${gameMode})</h4>
                                <span>라인: ${participant.lane}</span>
                                <span>챔피언: ${participant.championName}</span>
                                <span>KDA: ${participant.kills}/${participant.deaths}/${participant.assists}</span>
                                <span>골드 획득량: ${participant.goldEarned}</span>
                                <span>피해량: ${participant.totalDamageDealtToChampions}</span>
                            </div>  
                        `;


                        if (participant.win) {
                            matchInfo.style.backgroundColor = 'blue';
                        } else {
                            matchInfo.style.backgroundColor = 'red';
                        }
                        // `matchResult` 요소에 매치 정보 추가
                        matchResult.appendChild(matchInfo);

                    }
                } else {
                    console.warn(`Match ${index + 1}에 대한 정보가 없습니다.`);
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}
