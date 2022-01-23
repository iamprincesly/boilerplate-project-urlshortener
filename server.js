require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const URLs = [];

function validateURL(url, callback) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ 
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ 
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ 
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ 
    '(\\#[-a-z\\d_]*)?$','i'); 

    if (pattern.test(url)) {
      callback(null, url)
    } {
      callback({error: 'Invalid url'}, null)
    }
}

app.post('/api/shorturl', (req, res) =>{
  const urlToShort = req.body.url;

  validateURL(urlToShort, (err, data) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    } else {
      const short_url = (Math.random() + 1).toString(36).substring(7);

      const urls = { original_url: urlToShort, short_url: short_url };

      URLs.push(urls);

      return res.json(urls);
    }
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const { short_url } = req.params;

  let urlToGo;

  URLs.forEach(url => {
    if (url.short_url === short_url) {
      urlToGo = url.original_url
    }
  });

  if (urlToGo) {
    return res.redirect(urlToGo);
  } else {
    return res.json({
       error: 'Short url does not exist!'
     });
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
