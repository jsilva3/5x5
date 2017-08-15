(function () {
  'use strict';

  var homeMVC = angular.module('myApp.home', ['ngRoute', 'ngMaterial', 'firebase', 'angular-clipboard', 'ngAnimate'])

    // Declared route 
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/home/:gameNumber', {
        templateUrl: 'home/home.html'

      });
    }])

    .factory('songService', function ($http) {
      return {
        getSong: function () {
          return $http.get('https://sleepy-caverns-50749.herokuapp.com/json');
        }
      }
    })
    //test filter
    .filter('object2Array', function () {
      return function (input) {
        var out = [];
        var i;
        for (i in input) {
          if (input[i].picks) {
            out.push(input[i]);
          };
        }
        return out;
      }
    })
    // Home controller
    .controller('HomeCtrl', HomeCtrl);

  function HomeCtrl($timeout, $q, $log, $location, $scope, $rootScope, $firebaseArray, $firebaseObject, songService, $http, $mdToast, $routeParams, clipboard) {
    $log.info($routeParams.gameNumber);
    if ($routeParams.gameNumber) {
      var game = $routeParams.gameNumber;
    } else {
      console.log("error, no game id")
    };

    $scope.imagePath = "img/cardHeader5for5.png";
    $scope.imageBetaPath = "img/betabadge5.svg";
    //var showid = "20160622";
    var self = this;
    // $scope.songData = [];
    $scope.options = {
      hideOld: false,
      cb4: true,
      cb5: false
    };
    //toast code
    var animation = false;

    var last = {
      bottom: true,
      top: false,
      left: true,
      right: false
    };
    $scope.toastPosition = angular.extend({}, last);
    $scope.getToastPosition = function () {
      sanitizePosition();
      return Object.keys($scope.toastPosition)
        .filter(function (pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };
    function sanitizePosition() {
      var current = $scope.toastPosition;
      if (current.bottom && last.top) current.top = false;
      if (current.top && last.bottom) current.bottom = false;
      if (current.right && last.left) current.left = false;
      if (current.left && last.right) current.right = false;
      last = angular.extend({}, current);
    }
    $scope.showSimpleToast = function (toastText) {
      var pinTo = $scope.getToastPosition();
      $mdToast.show(
        $mdToast.simple()
          .textContent(toastText)
          .position('bottom center')
          .hideDelay(3500)
      );
    };

    ////clipboard
    $scope.copySupported = false;
    $scope.locationAbsUrl = $location.absUrl();
    //console.log($location.absUrl());
    //var copyUrl = $location.path();
    $scope.copyTextToCopy = $scope.locationAbsUrl;
    $scope.copySuccess = function () {
      //console.log('Copied!');
      $scope.showSimpleToast("Game link copied. Send it to your friends!");
    };
    $scope.copyFail = function (err) {
      console.error('Error!', err);
    };

    //check value of self.songs, delay for async load
    //$timeout(function() {
    //console.log(self.songs);
    //}, 2000);

    function myLoad() {
      var promise =
        songService.getSong()
      promise.then(
        function (payload) {
          var songData1 = [];
          songData1 = payload.data[0];
          self.songs = songData1.map(function (song) {
            return song;
          });
        },
        function (errorPayload) {
          $log.error('failure loading song', errorPayload);
        });
    };
    ///////////
    //$scope.hideText = true;
    self.readonly = false;
    self.removable = true;
    self.songPicks = this;

    self.songPicks.addPick = addPick;
    function addPick(pick, frequency) {
      //this is where i left off trying to add score to firebase
      //var aScore = lookupScore(frequency);
      if (pick) {
        addSongFire(pick, $scope.uid, lookupPoints(frequency));
        if (pick == "Auld Lang Syne") {
          $scope.showSimpleToast("Weaksauce song pick doot! Only worth 1pt.");
        };
        if (pick == "Maze") {
          $scope.showSimpleToast("These violent delights have violent ends ;-)");
        };
        if (pick == "Daniel Saw the Stone") {
          $scope.showSimpleToast("FALSE! - Daniel Saw a Pita Chip");
        };
      };
      self.clear();
    };
    self.songPicks.score = score;
    function score(picks) {
      var count = 0;
      var uid;
      angular.forEach(picks, function (pick) {
        //console.log(pick.points);
        if (typeof pick.points == "undefined") {
          count += pick.played ? 1 : 0;
        }
        else {
          count += pick.played ? pick.points : 0;
        };
        uid = pick.uid;
      });
      var addData = {
        score: count
      };
      //var playerNameref = firebase.database().ref("games/" + game + "/" + uid);
      if (uid) {
        firebase.database().ref("/games/" + game + "/" + uid).update(addData);
        //console.log(count,uid,game);
      };
      return count;
    };
    self.songPicks.possiblePoints = possiblePoints;
    function possiblePoints(picks) {
      var count = 0;
      angular.forEach(picks, function (pick) {

        count += pick.points;
      });
      if (count != 0) {
        var a = self.songPicks.score(picks);
        if (a / count == 1) {
          if (!animation) {
            var b = confetti(window);
            animation = true;
            window.dispatchEvent(new Event('resize'));
          };
        };
      };
      return count;
    };


    self.clear = function () {
      self.searchText = "";
    };


    //self.bindSongs = bindSongs;
    function bindSongs(uid, showid) {
      var mysongs = [];
      var gameanduserid = game + "_" + uid;
      //tie mypicks to listener to catch delete chip
      var myPicksRef = firebase.database().ref("picks/" + showid);
      var query = myPicksRef
        .orderByChild("gameanduserid")
        .equalTo(gameanduserid);

      $scope.myPicks = $firebaseArray(query);
      // console.log($scope.myPicks);
      $scope.deleteThis = function (index) {
        //console.log(index);
        $scope.myPicks.$remove(index);
      };

      //players
      var allPlayersRef = firebase.database().ref("games/" + game);
      var query7 = allPlayersRef
        .orderByChild("player");
      $scope.allPlayers = $firebaseArray(query7);
      //console.log($scope.allPlayers);

      //get unique players in a game
      var otherPicksRef = firebase.database().ref("games/" + game);
      otherPicksRef
        .on("value", function (snapshot) {
          var arr = [];
          angular.forEach(snapshot.val(), function (player, key) {

            if (player.player == $scope.uid) {
              //todo - move my pick here
              var playerNameref = firebase.database().ref("games/" + game + "/" + player.player)
              var syncObject = $firebaseObject(playerNameref);
              syncObject.$bindTo($scope, "playerFire").then(function (x) {
                getShowDetails($scope.playerFire.showid);
              }).catch(function (error) {
                console.error("Error:", error);
              });

            } else {
              var allPicksRef = firebase.database().ref("picks/" + showid);
              var gameanduserid = game + "_" + player.player;
              var query3 = allPicksRef
                .orderByChild("gameanduserid")
                .equalTo(gameanduserid);
              $scope.playerName = player;
              var tempObj = {};
              var tempPicks = $firebaseArray(query3);

              if ($scope.playerName.timestamp) {
                tempObj = ({
                  name: $scope.playerName.name,
                  picks: tempPicks,
                  score: $scope.playerName.score
                });
                arr.push(tempObj);
              };
              $scope.otherPicks = arr;

            };
          });
          //this is when the arr is complete
          //console.log($scope.otherPicks); 
        });

      ////load show details
      function getShowDetails(showid) {
        if (!showDetailsRef) {
          var showDetailsRef = firebase.database().ref("shows/" + showid);
          $scope.showDetails = $firebaseObject(showDetailsRef);
          $scope.showDetails.$loaded().then(function (x) {
            //console.log($scope.showDetails);
          }).catch(function (error) {
            console.error("Error:", error);
          });
        };
      };
    };

    // register user
    //  
    function registerUser(uid, showid) {
      //var newUserKey = firebase.database().ref().child("games").push().key;
      var updates = {};
      var newPostKey = firebase.database().ref().child("/users/" + $scope.uid + "/" + showid).push().key;
      var ref = firebase.database().ref("games/" + game);
      ref.once("value")
        .then(function (snapshot) {
          var gameCreated = snapshot.exists();
          if (gameCreated) {
            var obj = {};
            obj["player"] = $scope.uid;
            var updates = {};
            var addData = {
              player: $scope.uid,
              timestamp: Date.now(),
              showid: showid
            };
            var addData2 = {
              gameid: game,
              timestamp: Date.now(),
              showid: showid,
              date_abrev: showid.toString().substring(4, 6) + "/" + showid.toString().substring(6, 8)
            };
            //figure out why this overwrites name
            updates["/users/" + $scope.uid + "/" + showid + "/" + game] = addData2;
            // updates["/games/" + game + "/" + $scope.uid] = addData;
            firebase.database().ref().update(updates);
            firebase.database().ref("/games/" + game + "/" + $scope.uid).update(addData);
          } else {
            $location.path("/newGame");
          };
          //console.log (gameCreated);

        }, function (error) {
          // The Promise was rejected.
          console.error(error);
        });
    };

    self.updatePlayed = updatePlayed;
    function updatePlayed(song) {
      //var newUserKey = firebase.database().ref().child("games").push().key;
      var obj = {};
      obj["player"] = $scope.uid;
      var updates = {};
      var songandshowid = song + "_" + $scope.showidnew.showid;
      var addDataTrue = {
        played: true,
        timestamp: Date.now()
      };
      var addDataFalse = {
        played: false,
        timestamp: Date.now()
      };
      var songsRefQuery = firebase.database().ref("picks/" + $scope.showidnew.showid);
      songsRefQuery
        .orderByChild("song")
        .equalTo(song)
        .once("value", function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            var songsRefQuery = firebase.database().ref("picks/" + $scope.showidnew.showid + "/" + childSnapshot.key);
            if (childSnapshot.val().played) {
              songsRefQuery.update(addDataFalse);
            } else {
              songsRefQuery.update(addDataTrue);
            };
          });
        });
    };

    self.removeChipFire = removeChipFire;
    function removeChipFire(chip, index) {
      //console.log(chip, index);
      var ref2 = firebase.database().ref("picks/" + $scope.showidnew.showid);
      ref2
        .orderByChild("gameid")
        .startAt(game).endAt(game)
        .once("value", function (snapshot) {
          angular.forEach(snapshot.val(), function (pick, key) {
            if ((pick.song == chip.song) && (pick.uid == $scope.uid)) {
              var ref2 = firebase.database().ref("picks/" + $scope.showidnew.showid + "/" + key);
              ref2.remove()
                .then(function () {
                  console.log("Remove succeeded.")
                })
                .catch(function (error) {
                  console.log("Remove failed: " + error.message)
                });
            } else {
              console.log("couldn't find key")
            };
          });
        });
      bindSongs($scope.uid, $scope.showidnew.showid);
    };
    ///
    ////function to add songs to current game picks
    ///


    //function for checking if duplicate song chosen
    function hasValue(arr, song) {
      return arr.some(function (el) {
        return el.song === song;
      });
    };

    //these two functions dont work yet
    //function hasValue2(obj, value) {
    //  return Object.keys(obj).some((key) => obj[key] == value);
    //};

    function lookupPoints(frequency) {
      var result = 0;
      angular.forEach($scope.scoring, function (value, key) {
        if (key === frequency)
          result = value;
      });
      return result;
    };

    self.addSongFire = addSongFire;
    function addSongFire(pick, uid, points) {
      var existIn = hasValue($scope.myPicks, pick);
      if (($scope.myPicks.length < 5) && !existIn) {
        var newPostKey = firebase.database().ref().child("picks" + "/" + $scope.showidnew.showid).push().key;
        var songMatch = pick.toLowerCase();
        var addData = {
          uid: uid,
          gameid: game,
          gameanduserid: game + "_" + uid,
          song: pick,
          points: points,
          songmatch: songMatch,
          songandgameid: pick + "_" + game,
          songandshowid: pick + "_" + $scope.showidnew.showid,
          played: false,
          timestamp: Date.now()
        };
        var updates = {};
        updates["/picks/" + "/" + $scope.showidnew.showid + "/" + newPostKey] = addData;
        return firebase.database().ref().update(updates);
      }
      else {
        if (!($scope.myPicks.length < 5)) {
          $scope.showSimpleToast("You have 5 songs! Remove a song if you want to change up your picks.");
        }
        else {
          $scope.showSimpleToast("Don't pick the same song twice!");
        };
      };
    };
    //
    //autocomplete from sample
    //
    self.hideOld = $scope.options.hideOld;
    self.simulateQuery = false;
    self.isDisabled = false;
    self.noCache = true;
    //self.songs         = myLoadFunction();
    //self.songs         = $scope.songData;
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch(query) {
      var results = query ? self.songs.filter(createFilterFor(query)) : self.songs,
        deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }
    function searchTextChange(text) {
      //$log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
      //$log.info('Item changed to ' + JSON.stringify(item));
    }
    /**
  
     */

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(item) {
        if (!$scope.options.hideOld) {
          return ((item.song_name.indexOf(lowercaseQuery) >= 0 && parseInt(item.gap_shows) <= 100));
        }
        else {
          return item.song_name.indexOf(lowercaseQuery) >= 0
        };
      };
    }
    //init and auth  
    Array.prototype.select = function (closure) {
      for (var n = 0; n < this.length; n++) {
        if (closure(this[n])) {
          return this[n];
        }
      }

      return null;
    };
    //confetti add
    ////
    function confetti(global) {
      console.log("running script");
      var COLORS, Confetti, NUM_CONFETTI, PI_2, canvas, confetti, context, drawText, drawCircle, drawCircle2, drawCircle3, i, range, xpos;
      NUM_CONFETTI = 50;
      COLORS = [
        [235, 90, 70],
        [97, 189, 79],
        [242, 214, 0],
        [0, 121, 191],
        [195, 119, 224]
      ];
      PI_2 = 2 * Math.PI;
      canvas = document.getElementById("confetti");
      context = canvas.getContext("2d");
      window.w = 0;
      window.h = 0;
      window.resizeWindow = function () {
        window.w = canvas.width = window.innerWidth;

        return window.h = canvas.height = window.innerHeight
      };
      window.addEventListener("resize", resizeWindow, !1);
      window.onload = function () {
        return setTimeout(resizeWindow, 0)
      };
      range = function (a, b) {
        return (b - a) * Math.random() + a
      };
      drawText = function () {
        context.font = '50pt Calibri, sans-serif';
        context.textAlign = 'center';
        context.fillStyle = 'white';
        context.fillText('5 for 5!', canvas.width / 2, 165);
        return;
      };
      drawCircle = function (a, b, c, d) {
        context.beginPath();
        context.moveTo(a, b);
        context.bezierCurveTo(a - 17, b + 14, a + 13, b + 5, a - 5, b + 22);
        context.lineWidth = 2;
        context.strokeStyle = d;
        return context.stroke()
      };
      drawCircle2 = function (a, b, c, d) {
        context.beginPath();
        context.moveTo(a, b);
        context.lineTo(a + 6, b + 9);
        context.lineTo(a + 12, b);
        context.lineTo(a + 6, b - 9);
        context.closePath();
        context.fillStyle = d;
        return context.fill()
      };
      drawCircle3 = function (a, b, c, d) {
        context.beginPath();
        context.moveTo(a, b);
        context.lineTo(a + 5, b + 5);
        context.lineTo(a + 10, b);
        context.lineTo(a + 5, b - 5);
        context.closePath();
        context.fillStyle = d;
        return context.fill()
      };

      drawBanana = function (a, b, c, d) {
        context.beginPath();
        context.moveTo(388.75, 93.75);
        context.bezierCurveTo(370, 76.25, 420, 63.75, 426.25, 70);
        context.bezierCurveTo(436.25, 75, 417.5, 78.75, 418.75, 87.5);
        context.bezierCurveTo(420, 96.25, 418.75, 142.5, 428.75, 145);
        context.bezierCurveTo(438.75, 147.5, 451.25, 156.25, 451.25, 168.75);
        context.bezierCurveTo(482.5, 246.25, 360, 458.75, 70, 352.5);
        context.bezierCurveTo(65, 348.75, 37.5, 317.5, 32.5, 310);
        context.bezierCurveTo(30, 301.25, 26.25, 280, 41.25, 272.5);
        context.bezierCurveTo(170, 238.75, 318.75, 305, 386.25, 153.75);
        context.bezierCurveTo(397.5, 127.5, 388.75, 93.75, 388.75, 93.75);
        context.closePath();
        context.fill("evenodd");
        context.stroke();
        context.restore();
        context.save();
        var g = context.createLinearGradient(96.3189323875, 221.63990401276072, 479.6875, 124.80122363025333);
        g.addColorStop(0, "rgba(255, 255, 255, 0.52499998)");
        g.addColorStop(1, "rgba(255, 255, 255, 0)");
        context.fillStyle = g;
        context.lineWidth = 1.3333333333333333;
        context.font = "   15px ";
        context.beginPath();
        context.moveTo(43.75, 290);
        context.lineTo(46.25, 277.5);
        context.bezierCurveTo(138.75, 242.5, 310, 316.25, 392.5, 157.5);
        context.bezierCurveTo(351.25, 270, 278.75, 338.75, 43.75, 290);
        context.closePath();
        context.fill("evenodd");
        context.stroke();
        context.restore();
        context.save();
        context.fillStyle = "#442400";
        context.lineWidth = 1.3333333333333333;
        context.font = "   15px ";
        context.beginPath();
        context.moveTo(386.15267, 89.13626);
        context.bezierCurveTo(389.06731, 71.53588, 415.26511, 71.062953, 422.59733, 70.191604);
        context.bezierCurveTo(434.58256, 71.75792, 407.11069, 91.63626, 386.15267, 89.13626);
        context.closePath();
        context.fill("evenodd");
        context.stroke();
        context.restore();
        context.save();
        context.fillStyle = "#442400";
        context.lineWidth = 1.3333333333333333;
        context.font = "   15px ";
        context.beginPath();
        context.moveTo(32.517518, 305.14122);
        context.bezierCurveTo(31.584832, 286.77137, 30.652137, 280.71298, 41.261429, 274.65459);
        context.bezierCurveTo(45.878219, 281.57977, 45.01142, 303.02443, 32.517518, 305.14122);
        context.closePath();
        context.fill("evenodd");
        context.stroke();
        context.restore();
        context.save();
        var g = context.createLinearGradient(133.75000000000003, 272.0214491018803, 452.90937500000007, 272.0214491018803);
        g.addColorStop(0, "rgba(255, 255, 255, 0)");
        g.addColorStop(1, "rgba(95, 14, 0, 0.41666666)");
        context.fillStyle = g;
        context.lineWidth = 1.3333333333333333;
        context.font = "   15px ";
        context.beginPath();
        context.moveTo(133.75, 366.25);
        context.bezierCurveTo(352.5, 421.25, 426.74042, 283.12802, 440, 250);
        context.bezierCurveTo(462.5, 210, 448.75, 165, 448.75, 165);
        context.bezierCurveTo(447.5, 300, 306.25, 408.75, 133.75, 366.25);
        context.closePath();
        context.fill("evenodd");
        context.stroke();
        context.restore();
        context.restore();
        context.restore();

      };

      xpos = 0.9;
      document.onmousemove = function (a) {
        return xpos = a.pageX / w
      };
      window.requestAnimationFrame = function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) {
          return window.setTimeout(a, 5)
        }
      }();
      Confetti = function () {
        function a() {
          this.style = COLORS[~~range(0, 5)];
          this.rgb = "rgba(" + this.style[0] + "," + this.style[1] + "," + this.style[2];
          this.r = ~~range(2, 6);
          this.r2 = 2 * this.r;
          this.replace()
        }
        a.prototype.replace = function () {
          this.opacity = 0;
          this.dop = 0.03 * range(1, 4);
          this.x = range(-this.r2, w - this.r2);
          this.y = range(-20, h - this.r2);
          this.xmax = w - this.r;
          this.ymax = h - this.r;
          this.vx = range(0, 2) + 8 * xpos - 5;
          return this.vy = 0.7 * this.r + range(-1, 1)
        };
        a.prototype.draw = function () {
          var a;
          this.x += this.vx;
          this.y += this.vy;
          this.opacity +=
            this.dop;
          1 < this.opacity && (this.opacity = 1, this.dop *= -1);
          (0 > this.opacity || this.y > this.ymax) && this.replace();
          if (!(0 < (a = this.x) && a < this.xmax)) this.x = (this.x + this.xmax) % this.xmax;
          //drawText();
          drawCircle(~~this.x, ~~this.y, this.r, this.rgb + "," + this.opacity + ")");
          drawCircle3(0.5 * ~~this.x, ~~this.y, this.r, this.rgb + "," + this.opacity + ")");
          return drawCircle2(1.5 * ~~this.x, 1.5 * ~~this.y, this.r, this.rgb + "," + this.opacity + ")")
        };
        return a
      }();
      confetti = function () {
        var a, b, c;
        c = [];
        i = a = 1;
        for (b = NUM_CONFETTI; 1 <= b ? a <= b : a >= b; i = 1 <= b ? ++a : --a) c.push(new Confetti);

        return c
      }();
      window.step = function () {
        var a, b, c, d;
        requestAnimationFrame(step);
        context.clearRect(0, 0, w, h);
        d = [];
        b = 0;
        for (c = confetti.length; b < c; b++) a = confetti[b], d.push(a.draw());
        return d
      };
      step();;
    } (window);

    $scope.init = function () {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          // User is signed in.
          var isAnonymous = user.isAnonymous;
          $rootScope.uid = user.uid;
          console.log("user is signed in " + JSON.stringify($scope.uid));
          // get showid 
          //new game key
          var getShowIdRef = firebase.database().ref("/gameshow/" + game + "/");
          var getShowScoringRef = firebase.database().ref("/scoring/");
          $scope.scoring = $firebaseObject(getShowScoringRef);
          $scope.showidnew = $firebaseObject(getShowIdRef);
          $scope.showidnew.$loaded().then(function (x) {
            bindSongs($scope.uid, $scope.showidnew.showid);
            registerUser($scope.uid, $scope.showidnew.showid);
            myLoad();
          }).catch(function (error) {
            console.error("Error:", error);
          });
          // ...
        } else {
          console.log("user is not signed in")
          // User is signed out.
          // ...
        }  // ...
      });
    };
  }
})();