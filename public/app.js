function searchSummonerInfo() {
    const searchBar = document.getElementById("search-bar").value;
    const [name, tag] = searchBar.split("#");
    const summonerInfoUrl = `/summoner/info/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`;
    
    fetch(summonerInfoUrl)
        .then(response => response.json())
        .then(data => {
            console.log("summonerID:", data.summonerIdData);
            console.log("match:",data.matchDetails);
            console.log("leagueData:",data.leagueData);


            const summonerInfo = document.getElementById("summoner-info");
            const summonerRankInfo = document.getElementById("summoner-rank-info");
            const matchResult = document.getElementById("match-result");
            const championInfo = document.getElementById("champion-info");
            championInfo.innerHTML = "";
            matchResult.innerHTML = "<h3>매치 정보</h3>";

            summonerInfo.innerHTML = `
                <img src="${data.profileIconUrl}" alt="프로필 사진">

                <p>닉네임: ${searchBar}</p>
                <p>레벨: ${data.summonerLevel}</p>
            `;

            summonerRankInfo.innerHTML = `
                <img src="./Ranked_Emblems/${data.rankIMG}.png" alt="티어 사진">
                <p>티어: ${data.rank}LP</p>
                <p>승/패: ${data.rankRatioWin}/${data.rankRatioLoss}</p>
            `;

            data.matchDetails.forEach((match, index) => {
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
                        matchInfo.id = `gameInfo${index}`;
                        matchInfo.innerHTML = `
                            <div id="gameInfo">
                                <img src="https://ddragon.leagueoflegends.com/cdn/14.22.1/img/champion/${participant.championName}.png" alt="챔피언 사진">
                                <h4>Match ${participant.win ? '승리' : '패배'} (${gameMode})</h4>
                                <span>라인: ${participant.lane}</span>
                                <span>챔피언: ${participant.championName}</span>
                                <span>레벨: ${participant.champLevel}</span>
                                <span>KDA: ${participant.kills}/${participant.deaths}/${participant.assists}</span>
                                <span>골드 획득량: ${participant.goldEarned}</span>
                                <span>피해량: ${participant.totalDamageDealtToChampions}</span>
                                <button id="show-players-${index}">매치</button>
                                <div id="participants-info-${index}" style="display: none;"></div>
                            </div>  
                        `;

                        matchInfo.style.backgroundColor = participant.win ? 'blue' : 'red';
                        matchResult.appendChild(matchInfo);

                        // 버튼 클릭 이벤트 => 초기화 후 참가자 10명 정보 추가
                        document.getElementById(`show-players-${index}`).addEventListener("click", () => {
                            const participantsInfoDiv = document.getElementById(`participants-info-${index}`);
                            if (participantsInfoDiv.style.display === "none") {
                                participantsInfoDiv.style.display = "block";
                                participantsInfoDiv.innerHTML = ""; 
                                
                                match.info.participants.forEach((participant) => {
                                    const playerInfo = document.createElement("div");
                                    playerInfo.innerHTML = `
                                        <img src="https://ddragon.leagueoflegends.com/cdn/14.22.1/img/champion/${participant.championName}.png" alt="챔피언 사진">
                                        <h4>${participant.summonerName}</h4>
                                        <span>챔피언: ${participant.championName}</span>
                                        <span>레벨: ${participant.champLevel}</span>
                                        <span>KDA: ${participant.kills}/${participant.deaths}/${participant.assists}</span>
                                        <span>골드 획득량: ${participant.goldEarned}</span>
                                        <span>피해량: ${participant.totalDamageDealtToChampions}</span>
                                    `;
                                    playerInfo.style.backgroundColor = participant.win ? 'lightblue' : 'lightcoral';
                                    participantsInfoDiv.appendChild(playerInfo);
                                });
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
