
      /*Connecting mit DienstnutzerAPI*/
      var socket = io.connect('http://localhost:8080');

      /*Anfordern der Daten*/
      socket.emit("getPassword");
      socket.emit("getQueue");
      socket.emit("getSongs");
      socket.emit("getGenres");
      socket.emit("getArtists");
      socket.emit("getAllowedGenres");

      /*Bei empfangen der Daten*/
      socket.on('resQueue', function(data){
        document.getElementById("songsInQueue").innerHTML = data.length;
        displayQueue(data);
      });

      socket.on('resSongs', function(data){
        document.getElementById("songsInDB").innerHTML = data.length;
        displaySongs(data);
      });

      socket.on('resFilteredSongs', function(data){
        displaySongsFiltered(data);
      });

      socket.on('resGenres', function(data){
        displayGenres(data);
      });

      socket.on('resArtists', function(data){
        displayArtists(data);
      });

      /*Sobald eine Meldung eingeht*/
      socket.on('resMeldung', function(msg){
        meldung(msg);
      });

      socket.on('resAllowedGenres', function(data){
        displayAllowedGenres(data);
      });

      function displayAllowedGenres(data){
        if(data.length === 0){
          document.getElementById("allowedGenres").innerHTML = " ";
          document.getElementById("allowedGenres").innerHTML = "Alle";
        }else{
          document.getElementById("allowedGenres").innerHTML = " ";
          for(var i=0; i<data.length; i++){
            if(i===0) document.getElementById("allowedGenres").innerHTML = data[i].name;
            else document.getElementById("allowedGenres").innerHTML +=", " + data[i].name;
          }
        }
      }

      function displayQueue(data) {
        if (data.length === 0) document.getElementById("queue").innerHTML = '<section class="section--center" style="text-align: center;"><p>Zur Zeit keine Songs in der Warteliste!</p></section>';
        else {
          document.getElementById("queue").innerHTML = "";
          for (var i = 0; i < data.length; i++) {
            var note;
            if(i === 0) note = '(next Song!)';
            else note = '';
            var newQueueObject = document.createElement("section");
            newQueueObject.className = "section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp";
            var stringJS = "";
            if (i==(0)) {
              stringJS= 'onclick="playSong();" id="next-song"';
            }
            newQueueObject.innerHTML =
            '<header ' + stringJS + ' class="section__play-btn mdl-cell mdl-cell--3-col-desktop mdl-cell--2-col-tablet mdl-cell--4-col-phone mdl-color--teal-100 mdl-color-text--white">' +
              '<i class="material-icons">play_circle_filled</i>'+
            '</header>'+
            '<div class="mdl-card mdl-cell mdl-cell--9-col-desktop mdl-cell--6-col-tablet mdl-cell--4-col-phone">'+
              '<div class="mdl-card__supporting-text">'+
                '<h4>#'+(i+1)+' '+data[i].title+' '+note+'</h4>'+
                'Interpret: '+data[i].artist+ ' <br>Genre: '+data[i].genre+
              '</div>'+
            '</div>';
            document.getElementById("queue").appendChild(newQueueObject);
          }
        }
      }

      function displaySongsFiltered(data) {
        if (data.length === 0) {
          document.getElementById("songs").innerHTML = '<section class="section--center" style="text-align: center;"><p>Zur Zeit keine Songs in der Warteliste!</p></section>';
        }
        else {
          document.getElementById("songs").innerHTML = "";
          for (var i = 0; i < data.length; i++) {
            var newSonglistObject = document.createElement("section");
            newSonglistObject.className = "section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp";
            newSonglistObject.innerHTML =
            '<header class="section__play-btn mdl-cell mdl-cell--3-col-desktop mdl-cell--2-col-tablet mdl-cell--4-col-phone mdl-color--teal-100 mdl-color-text--white">' +
              '<i class="material-icons">play_circle_filled</i>'+
            '</header>'+
            '<div class="mdl-card mdl-cell mdl-cell--9-col-desktop mdl-cell--6-col-tablet mdl-cell--4-col-phone">'+
              '<div class="mdl-card__supporting-text">'+
                '<h4>#'+(i+1)+' '+data[i].title+'</h4>'+
                'Interpret: '+data[i].artist+ ' <br>Genre: '+data[i].genre+
              '</div>'+
              '<div class="mdl-card__actions">'+
                '<a href="#" class="mdl-button" onclick="addToQueue('+data[i].id+');">Zur Warteliste hinzufügen</a>'+
              '</div>'+
            '</div>';

            document.getElementById("songs").appendChild(newSonglistObject);
          }
        }
      }

      function displaySongs(data) {
        if (data.length === 0) {
          //document.getElementById("songs").innerHTML = '<section class="section--center" style="text-align: center;"><p>Zur Zeit keine Songs in der Warteliste!</p></section>';
          document.getElementById("admin-song-list").innerHTML = '<p>Zur Zeit keine Songs in der Warteliste!</p>';
        }
        else {
          //document.getElementById("songs").innerHTML = "";
          document.getElementById("admin-song-list").innerHTML = "";
          for (var i = 0; i < data.length; i++) {
            var newSonglistObject = document.createElement("section");
            newSonglistObject.className = "section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp";
            newSonglistObject.innerHTML =
            '<header class="section__play-btn mdl-cell mdl-cell--3-col-desktop mdl-cell--2-col-tablet mdl-cell--4-col-phone mdl-color--teal-100 mdl-color-text--white">' +
              '<i class="material-icons">play_circle_filled</i>'+
            '</header>'+
            '<div class="mdl-card mdl-cell mdl-cell--9-col-desktop mdl-cell--6-col-tablet mdl-cell--4-col-phone">'+
              '<div class="mdl-card__supporting-text">'+
                '<h4>#'+(i+1)+' '+data[i].title+'</h4>'+
                'Interpret: '+data[i].artist+ ' <br>Genre: '+data[i].genre+
              '</div>'+
              '<div class="mdl-card__actions">'+
                '<a href="#" class="mdl-button" onclick="addToQueue('+data[i].id+');">Zur Warteliste hinzufügen</a>'+
              '</div>'+
            '</div>';

            var newAdminSonglistObject = document.createElement("label");
            newAdminSonglistObject.className ="mdl-radioCustom mdl-js-radio mdl-js-ripple-effect";
            newAdminSonglistObject.setAttribute("for", "admin-delete-song"+data[i].id);
            newAdminSonglistObject.innerHTML =
            '<input type="radio" id="admin-delete-song'+data[i].id+'" class="mdl-radio__button" name="options-song" value="'+data[i].id+'">'+
            '<span class="mdl-radio__label">'+ data[i].title +"-<i>"+ data[i].artist+ "//"+ data[i].genre+ "</i><br></span>";

            //document.getElementById("songs").appendChild(newSonglistObject);
            document.getElementById("admin-song-list").appendChild(newAdminSonglistObject);
          }
        }
      }

      function displayGenres(data) {
        if (data.length === 0) {
          document.getElementById("admin-genre-list").innerHTML = '<p>Zur Zeit keine Genres verfügbar!</p>';
          document.getElementById("admin-addSong-genre-radios").innerHTML = '<p>Zur Zeit keine Genres verfügbar!</p>';
          document.getElementById("admin-options-genre-radios").innerHTML = '<p>Zur Zeit keine Genres verfügbar!</p>';

        }
        else {
          document.getElementById("admin-genre-list").innerHTML = " ";
          document.getElementById("admin-addSong-genre-radios").innerHTML = " ";
          document.getElementById("admin-options-genre-radios").innerHTML = " ";
          for (var i = 0; i < data.length; i++) {
            var newObject = document.createElement("li");
            newObject.innerHTML =
            data[i].name + "(" +data[i].id+ ")<br>";


            var newObject2 = document.createElement("label");
            newObject2.className = "mdl-radio mdl-js-radio mdl-js-ripple-effect";
            newObject2.setAttribute("for", "admin-addSong-genre-radios__option-"+data[i].id);
            newObject2.innerHTML =
            '<input type="radio" id="admin-addSong-genre-radios__option-'+ data[i].id +'" class="mdl-radio__button" name="options-genre1" value="'+data[i].id+'">'+
            '<span class="mdl-radio__label">'+data[i].name+'</span>';


            var newObject3 = document.createElement("label");
            newObject3.className = "mdl-radio mdl-js-radio mdl-js-ripple-effect";
            newObject3.setAttribute("for", "admin-options-genre-radios__option-"+data[i].id);
            newObject3.innerHTML =
            '<input type="checkbox" id="admin-options-genre-radios__option-'+data[i].id+'" class="mdl-radio__button" name="options-genre2" value="'+data[i].id+'">'+
            '<span class="mdl-radio__label">'+data[i].name+'</span>';



            document.getElementById("admin-genre-list").appendChild(newObject);
            document.getElementById("admin-addSong-genre-radios").appendChild(newObject2);
            document.getElementById("admin-options-genre-radios").appendChild(newObject3);
          }
        }
      }

      function displayArtists(data) {
        if (data.length === 0) {
          document.getElementById("admin-artist-list").innerHTML = '<p>Zur Zeit keine Artisten verfügbar!</p>';
          document.getElementById("admin-addSong-artist-radios").innerHTML = '<p>Zur Zeit keine Artisten verfügbar!</p>';
        }
        else {
          document.getElementById("admin-artist-list").innerHTML = " ";
          document.getElementById("admin-addSong-artist-radios").innerHTML = " ";
          for (var i = 0; i < data.length; i++) {

            var newObject = document.createElement("li");
            newObject.innerHTML = data[i].name + "(" +data[i].id+ ")<br>";

            var newObject2 = document.createElement("label");
            newObject2.className = "mdl-radio mdl-js-radio mdl-js-ripple-effect";
            newObject2.setAttribute("for", "admin-addSong-artist-radios__option-"+data[i].id);
            newObject2.innerHTML =
            '<input type="radio" id="admin-addSong-artist-radios__option-'+data[i].id+'" class="mdl-radio__button" name="options-artist" value="'+data[i].id+'">'+
            '<span class="mdl-radio__label">'+data[i].name+'</span>';

            document.getElementById("admin-artist-list").appendChild(newObject);
            document.getElementById("admin-addSong-artist-radios").appendChild(newObject2);
          }
        }
      }


      /*werden über Button ausgelöst*/
      function addToQueue(id) {
        socket.emit("postQueue", id);
      }

      function addArtist() {
        socket.emit("postArtist", document.getElementById("artist_name").value);
      }

      function addGenre() {
        socket.emit("postGenre", document.getElementById("genre_bezeichnung").value);
      }

      // create a new parser from a node ReadStream


      function addSong() {
        var title = document.getElementById("song_title").value;
        var artistID, genreID;
        var radios = document.getElementsByName('options-artist');

        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                // do whatever you want with the checked radio
                artistID = radios[i].value;

                // only one radio can be logically checked, don't check the rest
                break;
            }
        }

        radios = document.getElementsByName('options-genre1');

        for (i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                // do whatever you want with the checked radio
                genreID = radios[i].value;

                // only one radio can be logically checked, don't check the rest
                break;
            }
        }

        var data = {};
        data.title = title;
        data.artistID = artistID;
        data.genreID = genreID;

        socket.emit("postSong", data);
      }

      function deleteSong() {
        var songID;
        var radios = document.getElementsByName('options-song');
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                // do whatever you want with the checked radio
                songID = radios[i].value;

                // only one radio can be logically checked, don't check the rest
                break;
            }
        }

        socket.emit("deleteSong", songID);
      }

      function playSong() {
        socket.emit("deleteFirstQueueItem");
      }

      function login() {
        var value = document.getElementById('access').value
        socket.emit("getPassword");
        socket.on('resPassword', function(data){
          if (data.pass === value) {
            document.getElementById('admin-panel').classList.remove("display-none");
            document.getElementById('login-panel').classList.add("display-none");
            document.getElementById('passwort').value = data.pass;
          }
        });
      }

      function saveConfig() {
        var genreID =[];
        var checkboxes = document.getElementsByName('options-genre2');

        for (var i = 0, length = checkboxes.length; i < length; i++) {
            if (checkboxes[i].checked) {
                // do whatever you want with the checked radio
                genreID.push(checkboxes[i].value);
            }
        }
        var password = document.getElementById("passwort").value;
        socket.emit("putPassword", password);
        socket.emit("putAllowedGenres", genreID);
      }

      /*Um Meldungen zu machen*/
      function meldung(msg) {
        (function() {
          'use strict';
          window.counter = 0;
          var snackbarContainer = document.querySelector('#demo-toast-example');
            'use strict';
            var data = {message: msg};
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }());
      }
