const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/final-exam', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const jokeSchema = new mongoose.Schema({
  joke: String,
  numberOfChars: Number,
})

const Jokes = mongoose.model("JokesCol", jokeSchema);

// invoke an instance of express application.
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.set('port', 3000);
app.set('view engine', 'ejs');


const baseURL = 'https://sv443.net/jokeapi/v2/joke/Any?type=single';
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());

app.get('/', (req, res) => {
  return res.render('index');
});

app.get('/getJokes', async (req, res) => {
  try {
    const response = await axios.get(baseURL);
    const jokeStr = response.data['joke'];
    var joke = new Jokes({
      joke: jokeStr,
      numberOfChars: jokeStr.length
    });
    joke.save(function(err, doc) {
      if (err) return console.error(err);
      console.log("Document inserted succussfully!");
    });
    return res.send(jokeStr);
  } catch (error) {
    res.status(500).send("failed API request");
  }
});

app.get('/getAvgNumber', async (req, res) => {
  try {
    const num = Number(req.query.n);
    var jokes = await Jokes.find().sort({'_id': -1}).limit(num);
    var number = new Number;
    jokes.forEach(joke => {
      number += joke.numberOfChars;
    });
    number = Math.round(number/num);
    res.send(String(number));
  } catch (error) {
    res.status(500).send("failed ");
  }
});

// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});

app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));