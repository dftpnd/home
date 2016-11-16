var express = require('express');
var app = express();

app.use('/home', express.static('./'))

app.listen(3000);
