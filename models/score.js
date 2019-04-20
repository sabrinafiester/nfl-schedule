module.exports = class Score {
    constructor(x) {
        this.total = x.pointTotal;
        this.q1 = x.pointQ1;
        this.q2 = x.pointQ2;
        this.q3 = x.pointQ3;
        this.q4 = x.pointQ4;
        this.ot = x.pointOT;
    }
}