const express = require("express")
const app = express()
const fetchRoute = require('./routes/fetchRoutes.js')
const byeRoute = require('./routes/byeRoutes.js');

const HTTP_PORT = 8000 
app.listen(HTTP_PORT, () => {
    console.log("Server running on port " + HTTP_PORT);
});
app.use('/fetch', fetchRoute);
app.use('/bye', byeRoute);

app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});
app.use(function(req, res){
    res.status(404);
});