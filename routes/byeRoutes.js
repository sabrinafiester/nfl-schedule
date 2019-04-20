const byeRouter = require('express').Router()
const db = require("../db.js")


byeRouter.get('/season/:season', (req, res) => {
    const byeSelect = `SELECT week, abbr, city_state, team_name FROM bye_weeks 
    JOIN teams ON (teams.team_id = bye_weeks.team_id) and (year=season)
    WHERE season = ? ORDER BY week ASC`;
    const params = [req.params.season]
    db.all(byeSelect, params, (err, rows) => {
        if (err) {
          throw err;
        }
        res.json(rows);
      });
});

byeRouter.get('/team/:abbr', (req, res) => {
    const byeSelect = `SELECT season, week FROM teams 
    JOIN bye_weeks ON (teams.team_id = bye_weeks.team_id) and (year=season)
    WHERE abbr = ? ORDER BY season DESC`
    const params = [req.params.abbr.toUpperCase()];
    db.all(byeSelect, params, (err, rows) => {
        if (err) {
          throw err;
        }
        res.json(rows);
      });
});

byeRouter.get('/', (req, res) => {
    const byeSelect = `SELECT week, abbr, city_state, team_name FROM bye_weeks 
    JOIN teams ON (teams.team_id = bye_weeks.team_id) and (year=season)
    ORDER BY season DESC`;
    const params = [req.params.season]
    db.all(byeSelect, params, (err, rows) => {
        if (err) {
          throw err;
        }
        res.json(rows);
      });
    });

module.exports = byeRouter