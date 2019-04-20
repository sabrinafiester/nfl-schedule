let sqlite3 = require('sqlite3').verbose();

/*
 * Database configuration
 */
let db = new sqlite3.Database("nfl.db", (err) => {
    if (err) {
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to database.')
    }
});

const dbSchema = `
    CREATE TABLE IF NOT EXISTS games
    (
    game_id INTEGER NOT NULL PRIMARY KEY,
    season_type      TEXT,
    season          INTEGER,
    week            INTEGER,
    game_date       TEXT,
    game_time        TEXT,
    home_team_id      INTEGER,
    visitor_team_id   INTEGER,
    score_id         INTEGER
    );
    CREATE TABLE IF NOT EXISTS teams
    (
      team_id          INTEGER NOT NULL,
      year              INTEGER NOT NULL,
      abbr            TEXT,
      city_state       TEXT,
      team_name        TEXT,
      conference_abbr  TEXT,
      division_abbr    TEXT
    );
    CREATE UNIQUE INDEX IF NOT EXISTS teams_id_year on teams ( team_id, year ) ;
    CREATE TABLE IF NOT EXISTS team_scores
    (
      team_id          INTEGER,
      game_id          INTEGER,
      total           INTEGER,  
      q1              INTEGER,
      q2              INTEGER,
      q3              INTEGER,
      q4              INTEGER,
      ot              INTEGER
    );
    CREATE UNIQUE INDEX IF NOT EXISTS scores_team_game on team_scores ( team_id, game_id ) ;
    CREATE TABLE IF NOT EXISTS team_games
    (
        team_id          INTEGER,
        game_id          INTEGER,
        season          INTEGER,
        week            INTEGER
    );
    CREATE UNIQUE INDEX IF NOT EXISTS games_team_game on team_games ( team_id, game_id ) ;
    CREATE TABLE IF NOT EXISTS bye_weeks
    (
      team_id          INTEGER,
      season          INTEGER,  
      week            INTEGER
    );
    CREATE UNIQUE INDEX IF NOT EXISTS bye_team_season_week on bye_weeks ( team_id, season, week ) ;
    `;

db.exec(dbSchema, (err) => {
    if(err) {
        console.log(err);
    }
});


module.exports = db
