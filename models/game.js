module.exports = class Game {
    constructor(x) {
        this.gameId = x.gameId;
        this.seasonType = x.seasonType;
        this.season = x.season;
        this.week = x.week;
        this.date = x.gameDate;
        this.time = x.gameTimeEastern;
        this.homeTeam = x.homeTeamId;
        this.visitorTeam = x.visitorTeamId;
    }
}
