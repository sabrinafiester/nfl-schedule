const byeRouter = require('express').Router()
const db = require("../db.js")


byeRouter.get('/', (req, res) => {
    let byeSelect = `SELECT season, week, abbr, city_state, team_name FROM bye_weeks 
    JOIN teams ON (teams.team_id = bye_weeks.team_id) and (year=season)`;
    if(req.query.team && req.query.season) {
        byeSelect += `WHERE season = ` + req.query.season + ` AND abbr = '` + req.query.team.toUpperCase() + `'`;

    }
    if(req.query.season) {
        byeSelect += `WHERE season = ` + req.query.season;
    }
    if(req.query.team) {
        byeSelect += `WHERE abbr = '` + req.query.team.toUpperCase() + `'`;
    }
    db.all(byeSelect, (err, rows) => {
        if (err) {
            console.log(err.message);
        }
        res.json(rows);
      });
});

byeRouter.get('/points', (req, res) => {
    if(!req.query.team) {
        res.json({'message': 'Please specify a team'});
        return;
    }
    let period = 'total';
    if(req.query.period) {
        period = req.query.period;
    }
    const team = req.query.team.toUpperCase();
    const pointSelect = `SELECT AVG(${period})
    FROM team_scores
    JOIN team_games ON team_scores.game_id = team_games.game_id AND team_scores.team_id = team_games.team_id
    WHERE team_scores.team_id=(SELECT team_id from teams WHERE year=2018 AND abbr='${team}') 
    AND week > (SELECT week from bye_weeks WHERE team_id=(SELECT team_id from teams WHERE year=2018 AND abbr='${team}') and season=2018)
    AND season=2018;`
    db.get(pointSelect, (err, row) => {
        if(err) {
            console.log(err.message);
        }
        res.json(row);
      });
    })
module.exports = byeRouter