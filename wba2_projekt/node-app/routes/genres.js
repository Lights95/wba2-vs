//Funktioniert vom Prinzip her, wie die Artists.

//Einbindung der Module
var express = require('express');
var Ajv = require('ajv');
var redis = require('redis');
var router = express.Router();
var db = redis.createClient();
var ajv = Ajv({allErrors: true});
var async = require('async');

//Datenhaltung von Genre wird definiert
var genreSchema={
    'properties': {
        'name':{
            'type': 'string',
            'maxProperties': 1,
            'minLength': 2
        }
    },
    'required': ['name']
};

//Validierungsvariable
var validate = ajv.compile(genreSchema);

/*Genres*/
router.post('/', function(req, res){
  //Validierung des Datentyps
  var valid = validate(req.body);
  if(!valid) return res.status(406).json({message: "Ungültiges Schema!"});
  var gesetzt= false;

  /*Filtert alle Genres - führt Funktionen nacheinander aus, nach Erhalt des Callbacks wird fortgesetzt */
  async.series([
    function(callback){
      db.keys('genre:*', function(err, keys){
        /*Gibt alle Genres aus der DB zurück*/
        db.mget(keys, function(err, genres){
          /*Überprüft, ob Variable einen Wert hat*/
          if(genres===undefined){
            genres =[];
          }
          /*Gibt neues Array an User zurück, welches alle User enthält*/
          genres=genres.map(function(genre){
            return JSON.parse(genre);
          });

          /*Überprüft, ob der neue Nutzername vorhanden ist*/
          async.each(genres, function(genre, callback){
            if(genre.name === req.body.name) {
              gesetzt=true;
              callback();
            }else return callback();
          });
          callback();
        });
      });
    }], function(err){
      if(gesetzt){
        return res.status(406).json({message : "Genre bereits vorhanden."});
      }
      /*Erstellt neues Genre in der Datenbank*/
      db.incr('genreID', function(err, id){
        var genre = req.body;
        genre.id=id;
        db.set('genre:' + genre.id, JSON.stringify(genre), function(err, newGenre){
          /*neues Genre wird als JSON Objektzurückgegeben*/
          res.status(201).json(genre);
        });
      });
  });
});


//Genre ausgeben
router.get('/', function(req, res){
  db.keys('genre:*', function(err,keys){
    if(err)res.status(404).type('plain').send('Error beim Auslesen oder Datenbank leer.');
    else{
      db.mget(keys, function(err, genres){
        if(err)res.status(404).type('plain').send('Error beim Auslesen oder Datenbank leer.');
        else{
          genres=genres.map(function(genre){
            return JSON.parse(genre);
          });
          res.status(200).json(genres);
        }
      });
    }
  });
});

/*Einzelnes Genre bearbeiten
router.put('/:id', function(req,res){
    var id= req.params.id;
    db.exists('genre:'+id,function(err,rep){
       if(rep==1){
           var updatedGenre = req.body;
           updatedGenre.id = id;
           db.set('genre:' + updatedGenre.id , JSON.stringify(updatedGenre),function(err,rep){
               res.status(200).json(updatedGenre);
           });
       }
        else res.status(404).type('plain').send('Das Genre mit der ID ' + req.params.id + ' ist nicht vorhanden.');
    });
});

/*Bestimmtes Genre ausgeben
router.get('/:id', function(req, res){
   db.get('genre:'+req.params.id, function(err,rep){
       if(rep){
           res.status(200).type('json').send(rep);
       }
       else{
           res.status(404).type('plain').send('Das Genre mit der ID: ' + req.params.id +' ist nicht vorhanden.');
       }
   });
});

//Genre löschen
router.delete('/:id', function(req, res){
    var id = req.params.id;
    db.exists('genre:'+id, function(err,rep){
        if(!rep)res.status(404).type('plain').send('Es ist exitiert kein Genre mit der ID '+id);
        else{
           db.del('genre:'+id ,function (err, rep) {
               res.status(204).send('Genre mit der ID' + req.params.id + ' erfolgreich gelöscht.');
           });
        }
    });
});

*/

module.exports = router;
