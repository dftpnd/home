var express = require('express');
var app = express();

app.use('/home', express.static('./dest'))

app.listen(3000);
