function searchSummonerInfo() {
    const searchBar = document.getElementById("search-bar").value;
    const [name, tag] = searchBar.split("#");
    const summonerInfoUrl = `/summoner/info/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`;
    
    // 전적 검색
    fetch(summonerInfoUrl)
        .then(response => response.json())
        .then(data => {
            console.log('PUUID:', data.puuid);
            console.log('Summoner ID:', data.summonerId);
            console.log('match', data.matchDetails);

            console.log("닉네임", document.getElementById("search-bar").value);
            console.log("레벨:", data.summonerLevel);
            console.log("티어:", data.rank);
            
            data.matchDetails.forEach((match, index) => {
                if (match.info && match.info.participants.find(p => p.puuid === data.puuid)) {
                    let gameMode;
                    switch (match.info.queueId) {
                        case 420:
                            gameMode = '개인/2인 랭크';
                            break;
                        case 440:
                            gameMode = '자유 랭크';
                            break;
                        case 450:
                            gameMode = '칼바람 나락';
                            break;
                        default:
                            gameMode = '일반';
                    }
                    console.log(`Match ${index + 1} (${gameMode}):`);
                    const p = match.info.participants.find(p => p.puuid === data.puuid);     
                    console.log(`라인: ${p.lane}`);
                    console.log(`챔피언: ${p.championName}`);           
                    console.log(`KDA: ${p.kills}/${p.deaths}/${p.assists}`);
                    console.log(`골드 흭득량: ${p.goldEarned}`);
                    console.log(`피해량: ${p.totalDamageDealtToChampions}`);
                    if (p.win) {
                        console.log("승리");
                    } else {
                        console.log("패배");
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}