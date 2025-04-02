const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Parses incoming JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded data
