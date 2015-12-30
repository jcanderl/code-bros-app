var express = require('express');
var app = express();
var pg = require('pg');
var bodyParser = require('body-parser');

app.use(bodyParser.json({ type: 'application/json' }));

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/signups', function(req, res) {
var sql = 'SELECT * FROM signups'; 
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query(sql, function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
        res.statusCode = 201;
        res.json(result.rows);

    });
  });
});

app.post('/signups', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    var sql = "INSERT INTO signups (id, name, email) values ($1, $2, $3) RETURNING id"; 
    var data = [
      req.body.id,
      req.body.name,
      req.body.email
    ];
    client.query(sql, data, function(err, result) {
      done();
      if (err) {
       console.error(err);
        res.statusCode = 500;
        return res.json({
          errors: ['Could not create signup']
      }); }
      else {
        res.statusCode = 201;
        res.json(result.rows[0]);
      }
    });
  });
});

/* DELETE SIGNUP BY ID IN ROUTE */
app.delete('/signups/:id', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    var sql = "DELETE FROM signups WHERE id = $1 RETURNING id";
    var data = [
      req.params.id,
      ];
    client.query(sql, data, function(err, result) {
      done();
      if (err) {
       console.error(err);
        res.statusCode = 500;
        return res.json({
          errors: ['Could not delete signup']
      }); }
      else {
        res.statusCode = 200;
        res.json(result.rows[0]);
      }
    });
  });  
});

/* DELETE SIGNUP BY ID IN JSON */
app.delete('/signups', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    var sql = "DELETE FROM signups WHERE id = $1 RETURNING id";
    var data = [
      req.body.id,
      ];
    client.query(sql, data, function(err, result) {
      done();
      if (err) {
       console.error(err);
        res.statusCode = 500;
        return res.json({
          errors: ['Could not delete signup']
      }); }
      else {
        res.statusCode = 200;
        res.json(result.rows[0]);
      }
    });
  });  
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
