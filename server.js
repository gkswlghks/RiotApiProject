const express = require('express');
const app = express();
const path = require('path');
const API_KEY = 'RGAPI-77fdca5f-2ff0-4804-8f31-f17ab5ae3706';
const asiaApi = 'https://asia.api.riotgames.com';
const krApi = 'https://kr.api.riotgames.com';

app.listen(8000, function(){
    console.log('listening on 8000');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 전적검색 버튼 동작 -> PUUID, SummonerID, 소환사 매치 정보 반환
app.get('/summoner/info/:name/:tag', async (req, res) => {
    const { name, tag } = req.params;

    try {
        // PUUID
        const summonerPuuidUrl = `${asiaApi}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?api_key=${API_KEY}`;
        const puuidResponse = await fetch(summonerPuuidUrl);
        const puuidData = await puuidResponse.json();
        const puuid = puuidData.puuid;

        // SummonerID
        const summonerIdUrl = `${krApi}/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`;
        const summonerIdResponse = await fetch(summonerIdUrl);
        const summonerIdData = await summonerIdResponse.json();
        const summonerLevel = summonerIdData.summonerLevel;
        const summonerId = summonerIdData.id;
        const profileIconId = summonerIdData.profileIconId;

        //이미지 URL 생성
        const profileIconUrl = `https://ddragon.leagueoflegends.com/cdn/14.22.1/img/profileicon/${profileIconId}.png`;

        // 랭크 정보 가져오기
        const leagueUrl = `${krApi}/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${API_KEY}`;
        const leagueResponse = await fetch(leagueUrl);
        const leagueData = await leagueResponse.json();
        const rankedInfo = leagueData.find(queue => queue.queueType === 'RANKED_SOLO_5x5');
        const rank = rankedInfo ? `${rankedInfo.tier} ${rankedInfo.rank} ${rankedInfo.leaguePoints}` : 'Unranked';
        const rankIMG = rankedInfo.tier;
        const rankRatioWin = rankedInfo ? `${rankedInfo.wins}` : '';
        const rankRatioLoss = rankedInfo ? `${rankedInfo.losses}` : '';

        // MATCH-V5에서 매치 ID 목록 
        const matchV5Url = `${asiaApi}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${API_KEY}`;
        const matchV5Response = await fetch(matchV5Url);
        const matchIds = await matchV5Response.json();

        // 각 매치 ID에 대한 상세 정보 
        const matchDetailsPromises = matchIds.map(async (matchId) => {
            const matchDetailUrl = `${asiaApi}/lol/match/v5/matches/${matchId}?api_key=${API_KEY}`;
            const matchDetailResponse = await fetch(matchDetailUrl);
            return matchDetailResponse.json();
        });
        
        const matchDetails = await Promise.all(matchDetailsPromises);
        
        res.json({
            rankIMG,
            rankRatioWin,
            rankRatioLoss,
            leagueData,
            summonerIdData,
            profileIconId,
            summonerLevel,
            profileIconUrl,
            rank,
            puuid,
            summonerId,
            matchDetails,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }

});


//11월 (챔피언 티어 정리, 소환사 순위 나열) 
//12월  ==> HTML, CSS 디자인.