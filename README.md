# nfl-schedule
NFL Schedule API using Express, NodeJS, and SQLite

    GET /bye returns bye weeks. team (abbreviation) and season (year) as parameters
    GET /bye/points returns average points after bye. team (abbreviation) parameter is required, period (q1, q2, q3, q4, ot) is optional
    
    Database is currently populated with /fetch endpoints. Outside of demo purposes, this would ideally be housed and run elsewhere.

### Instructions

Install required packages

    npm install 

Run server 

    npm run start 

Visit `http://localhost:8000/`

### Examples:
http://localhost:8000/bye/points?period=q3&team=min
http://localhost:8000/bye?team=tb
http://localhost:8000/bye/points?team=kc

