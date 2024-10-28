function searchSummonerInfo() {
    const searchName = document.querySelector("#search-bar-name").value;
    const searchTag = document.querySelector("#search-bar-tag").value;

    // URL을 올바르게 생성
    const summonerInfoUrl = `/summoner/info/${encodeURIComponent(searchName)}/${encodeURIComponent(searchTag)}`;

    // API 요청
    fetch(summonerInfoUrl)
        .then(response => response.json())
        .then(data => {
            // puuid와 summonerId 확인
            console.log('PUUID:', data.puuid);
            console.log('Summoner ID:', data.summonerId);
            console.log('match', data.matchDetails);
            
            data.matchDetails.forEach((match, index) => {
                if (match.info && match.info.participants.find(p => p.puuid === data.puuid)) {
                    const p = match.info.participants.find(p => p.puuid === data.puuid);                  
                    console.log(`  Match ${index + 1}:`);
                    console.log(`  Kills: ${p.kills}`);
                    console.log(`  Deaths: ${p.deaths}`);
                    console.log(`  Assists: ${p.assists}`);
                    console.log(`  Gold: ${p.goldEarned}`);
                    console.log(`  Total Damage: ${p.totalDamageDealtToChampions}`);
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}