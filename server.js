const express = require('express');
const app = express();
const path = require('path');
const API_KEY = 'RGAPI-77fdca5f-2ff0-4804-8f31-f17ab5ae3706';
const asiaApi = 'https://asia.api.riotgames.com';
const krApi = 'https://kr.api.riotgames.com';

app.listen(8080, function(){
    console.log('listening on 8080');
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
        const summonerId = summonerIdData.id;

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
        res.json({ puuid, summonerId, matchDetails });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }

});