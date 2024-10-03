const express = require('express');
const app = express();

app.set('port', 5500);

app.use(express.static(__dirname + "/src"));

app.get( function (request, response) {
    response.sendFile(__dirname + "/index.html");
});

app.listen(app.get('port'))