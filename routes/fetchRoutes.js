const fetchRouter = require('express').Router()
const fetch = require('node-fetch');
const db = require("../db.js");
const Game = require('../models/game');
const Score = require('../models/score');
const TeamGame = require('../models/teamGame');


fetchRouter.get('/season/:season', (req, res) => {
  const reqUrl = 'https://api.ngs.nfl.com/league/schedule?season=' + req.params.season + '&seasonType=REG';
  fetch(reqUrl)
    .then(res => res.json())
    .then(json => {
      saveAllData(json, req.params.season);
      res.send(json);
    });
});

fetchRouter.get('/season/:season/:type', (req, res) => {
  const reqUrl = 'https://api.ngs.nfl.com/league/schedule?season=' + req.params.season + '&seasonType=' + req.params.type;
  fetch(reqUrl)
    .then(res => res.json())
    .then(json => {
      saveAllData(json, req.params.season);
      res.send(json);
    });
});

fetchRouter.get('/', (req, res) => {
  const reqUrl = 'https://api.ngs.nfl.com/league/schedule?season=2018&seasonType=REG';
  fetch(reqUrl)
    .then(res => res.json())
    .then(json => {
      saveAllData(json, 2018);
      res.send(json);
    });
  });

function saveAllData(games, season) {
  let weeklyTeams = [
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]
  ];
  games.forEach(gameResp => {

    saveGame(new Game(gameResp));
    saveScore(new Score(gameResp.score.homeTeamScore), gameResp.gameId, gameResp.homeTeamId);
    saveScore(new Score(gameResp.score.visitorTeamScore), gameResp.gameId, gameResp.visitorTeamId);
    saveTeamGame(new TeamGame(gameResp), gameResp.homeTeamId);
    saveTeamGame(new TeamGame(gameResp), gameResp.visitorTeamId);
    if(gameResp.week < 3) {
      saveTeam(gameResp.homeTeam);
      saveTeam(gameResp.visitorTeam);
    }
    weeklyTeams[gameResp.week - 1].push(gameResp.homeTeamId, gameResp.visitorTeamId);
  });
  saveByeWeeks(weeklyTeams, season);
}

function saveGame(game) {
  const insGame =  `INSERT OR REPLACE INTO games 
    (game_id, season_type, season, week, game_date, game_time, home_team_id, visitor_team_id) 
    VALUES (?,?,?,?,?,?,?,?)`;
    const params = [game.gameId, game.seasonType, game.season, game.week, game.date, game.time, game.homeTeam, game.visitorTeam];
    db.run(insGame, params, (err) => {
      if(err) {
          console.log(err.message);
      }
    });
};
function saveScore(score, gameId, teamId) {
  const insScore = `INSERT OR REPLACE INTO team_scores 
  (team_id, game_id, total, q1, q2, q3, q4, ot) 
  VALUES (?,?,?,?,?,?,?,?)`;
  const params = [teamId, gameId, score.total, score.q1, score.q2, score.q3, score.q4, score.ot];
  db.run(insScore, params, (err) => {
    if(err) {
        console.log(err.message);
    }
  });
};
function saveTeamGame(teamGame, teamId) {
  const insGame = `INSERT OR IGNORE INTO team_games 
  (team_id, game_id, season, week) 
  VALUES (?,?,?,?)`;
  const params = [teamId, teamGame.gameId, teamGame.season, teamGame.week];
  db.run(insGame, params, (err) => {
    if(err) {
        console.log(err.message);
    }
  });
};
function saveTeam(teamData) {
  const insTeam = `INSERT OR IGNORE INTO teams 
  (team_id, year, abbr, city_state, team_name, conference_abbr, division_abbr) 
  VALUES (?,?,?,?,?,?,?)`;
  const params = [teamData.teamId, teamData.season, teamData.abbr, teamData.cityState, teamData.nick, teamData.conferenceAbbr, teamData.divisionAbbr];
  db.run(insTeam, params, (err) => {
    if(err) {
        console.log(err.message);
    }
  });
};
function saveByeWeeks(weeks, season) {
  let byeWeeks = [];
  const allTeams = [ '3900','1050','0920','0325','1540','1800','5110','3410',
      '2100','2120', '0200','3300','3430','0610','1400','2520',
      '4400','2310','2200','2250','4900','0750','3700','1200',
      '2700','3200','3000','0810','2510','3800','4500','4600' ];
  weeks.forEach((teams, week) => {
    if(teams.length < 32) {
      teams = allTeams.filter(team => {
        return teams.indexOf(team) < 0;
      });
      byeWeeks[week] = teams;
    }
  });

  byeWeeks.forEach((teams, week) => {
    teams.forEach(team => {
      const insertBye =  `INSERT OR IGNORE INTO bye_weeks 
      (team_id, season, week) 
      VALUES (?,?,?)`;
      const params = [team, season, week+1];
      db.run(insertBye, params, (err) => {
        if(err) {
            console.log(err.message);
        }
      });    
    })
  });
}

module.exports = fetchRouter