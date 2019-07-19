"use strict";
const express = require('express');
const app = express();
const port = 3100;
const controllers = require('./controllers');


app.get('/', (req, res) => res.send('Hello World!'));
app.get('/grf/behavior/:graphParams', controllers.behaviorGraph);

app.get('/grf/traits/:graphParams', controllers.traitGraph);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
