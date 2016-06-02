(function () {
  'use strict';

angular.module('myApp.home', ['ngRoute','ngMaterial'])
 
// Declared route 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'home/home.html',
        controller: 'HomeCtrl'
    });
}])

.directive('myChip', function(){
  return {
    restrict: 'EA',
    link: function(scope, elem, attrs) {
      var myChip = elem.parent().parent();
      myChip.addClass('_played');
      
      scope.$watch(function(){
        return scope.$chip.played
      }, function(newVal){
        if (newVal) {
          myChip.addClass('_played');
          console.log('add class active');
        } else {
          myChip.removeClass('_played');
          console.log('remove class active');
        }
      })
      
    }
  };
})
// Home controller
.controller('HomeCtrl', DemoCtrl); 

function DemoCtrl ($timeout, $q, $log, $scope) {

    $scope.imagePath = 'img/cardHeader3.jpg';
    var self = this;
    self.readonly = false;
    self.removable = true;
    self.songPicks = this;
    self.songPicks.picks = [
      {text:"Sand", played:true},
      {text:"Birds of a Feather", played:false},
      {text:"Sample", played:true}
    ];
//picks
    self.songPicks.picks2 = [
      {text:"DWD", played:false},
      {text:"Rift", played:true},
    ];
    
    self.songPicks.addPick = addPick;
    function addPick(pick) {
      if (pick && self.songPicks.picks.length <= 4) {
      self.songPicks.picks.push({text:pick, done:false});
      };
      self.clear();
    };
    self.songPicks.score = score;
    function score(picks){
      var count =0;
      angular.forEach(picks, function(pick){
        count += pick.played ? 1 : 0;
      });
      return count;
    };
    
    self.clear = function() {
      self.searchText = '';
    };
//firebase

function createNewGame() {

 var newGameKey = firebase.database().ref().push().key;
  firebase.database().ref('games/' + newGameKey).set({
    desc: "my new game",
    date: "20160601"
  });
}

//autocomplete    

    self.simulateQuery = false;
    self.isDisabled    = false;
    // list of `state` value/display objects
    self.states        = loadAll();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    self.newState = newState;
    function newState(state) {
      alert("Sorry! Song not found" + state + " first!");
    }
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }
    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }
    /**
     * Build `states` list of key/value pairs
     */
    function loadAll() {
      var allStates = '5:15, 555, 1999, 46 Days, 50 Ways to Leave Your Lover, 99 Problems, A Apolitical Blues, A Day in the Life, A Song I Heard the Ocean Sing, AC/DC Bag, Access Me, Acoustic Army, After Midnight, After Midnight Reprise, Aint Love Funny, Alaska, Albuquerque, All Along the Watchtower, All Down the Line, All of These Dreams, All That You Dream, All the Pain Through the Years, All Things Reconsidered, Also Sprach Zarathustra, Alumni Blues, Alumni Blues Jam, Amazing Grace, Amazing Grace Jam, Amidst the Peals of Laughter, Amoreena, Any Colour You Like, Anything But Me, Arc, Architect, Army of One, Art Jam, Auld Lang Syne, Avenu Malkenu, Axilla, Axilla (Part II), Baby Elephant Walk, Baby Lemonade, Babylon Baby, Back at the Chicken Shack, Back in the U.S.S.R., Back on the Train, Backwards Down the Number Line, Band/Crew Football Theme Song, Bathtub Gin, Beaumont Rag, Beauty of a Broken Heart, Beauty of My Dreams, Been Caught Stealing, Bell Boy, Big Alligator, Big Ball Jam, Big Ball Jam Reprise, Big Balls, Big Black Furry Creature from Mars, Big Black Furry Creature from Mars Jam, Big Black Furry Creature from Mars Reprise, Big Pimpin, Bike, Bill Bailey,  Wont You Please Come Home?, Billie Jean Jam, Billy Breathes, Birds of a Feather, Birthday, Bitchin Again, Bittersweet Motel, Black and Tan Fantasy, Blackbird, Black-Eyed Katy, Blaze On, Blister in the Sun, Blister in the Sun Jam, Blue Bayou, Blue Moon, Blue Skies, Bobby Jean, Bohemian Rhapsody, Bold As Love, Boogie On Reggae Woman, Born to Run, Born Under Punches (The Heat Goes On), Bouncing Around the Room, Brain Damage, Breathe, Breathe Jam, Brian and Robert, Brother, Brown Eyed Girl, Buffalo Bill, Bug, Buried Alive, Buried Alive Reprise, Burn That Bridge, Burning Down the House, But Anyway, Bye Bye Foot, California Love Jam, Camel Walk, Cannonball Jam, Cant Always Listen, Caravan, Carefree, Carini, Carolina, Cars Trucks Buses, Casino Boogie, Catapult, Cavern, Cecilia, Chalk Dust Torture, Chalk Dust Torture Reprise, Champagne Supernova, Character Zero, Chariots of Fire, Che Hun Ta Mo, Choo Choo Ch Boogie, Cinnamon Girl, Cities, Clone, Cocaine Jam, Cold as Ice, Cold Rain and Snow, Cold Water, Colonel Forbins Ascent, Come On Baby, Come Together, Communication Breakdown, Contact, Cool It Down, Cool Jerk, Corinna, Costume Contest, Cracklin Rosie, Crimes of the Mind, Crosseyed and Painless, Crossroads, Crowd Control, Cry Baby Cry, Cryin, Cut My Hair, Dahlia, Daniel Saw the Stone, Daves Energy Guide, David Bowie, Day or Night, Dear Prudence, Dem Bones, Demand, Destiny Unbound, Devotion To a Dream, Diamond Girl, Dickie Scotland, Digital Delay Loop Jam, Dinner and a Movie, Dirt, Discern, Divided Sky, Dixie, Dixie Cannonball, Dixie Chicken, Doctor Jimmy, Dog Faced Boy, Dog Log, Dogs Stole Things, Doin My Time, Donna Lee, Dont Bogart That Joint, Dont Get Me Wrong, Dont Pass Me By, Dont You Want To Go?, Dooley, Down By the River, Down with Disease, Down with Disease Jam, Dr. Gabel, Drifting, Driver, Drowned, Drums, Dust in the Wind, Earache My Eye, Earlier in the day, Easy To Slip, Eclipse, El Paso, Eliza, Emotional Rescue, Energy, Entrance of the Gladiators, Esther, Everybodys Got Something to Hide Except Me and My Monkey, Everyday I Have the Blues, Faht, Family Picture, Farmhouse, Fast Enough for You, Fat Man in the Bathtub, Feats Dont Fail Me Now, Fee, Feel the Heat, Fikus, Final Flight, Fire, First Tube, Fixin to Die, Flat Fee, Fluffhead, Fly Famous Mockingbird, Fly Like an Eagle, Foam, Foggy Mountain Breakdown, Fooled Around and Fell in Love, Foreplay/Long Time, Four Strong Winds, Frankenstein, Frankie Says, Free, Free Bird, Free Man in Paris, Friday, Frost, Fuck Your Face, Fuego, Funky Bitch, Garden Party, Gettin Jiggy Wit It, Ghost, Ginseng Sullivan, Girls Girls Girls, Glass Onion, Glide, Glide II, Glide Reprise, Gloria, Glory Days, Goin Down Slow, Gold Soundz, Golden Age, Golden Lady, Golgi Apparatus, Gone, Good Times Bad Times, Got My Mojo Working, Gotta Jibboo, Grind, Guelah Papyrus, Gumbo, Guy Forget, Guyute, Gypsy Queen, Ha Ha Ha, Halfway to the Moon, Halleys Comet, Happiness Is a Warm Gun, Happy, Happy Birthday to You, Harpua, Harry Hood, Hava Nagila, Have Mercy, Head Held High, Heart and Soul, Heartbreaker, Heavy Rotation, Heavy Things, Hello My Baby, Help Me, Helpless, Helpless Dancer, Helter Skelter, High-Heel Sneakers, Highway to Hell, Hold to a Dream, Hold Whatcha Got, Hold Your Head Up, Hold Your Head Up Jam, Honey Pie, Honky Tonk Women, Honky Tonk Women Jam, Hoochie Coochie Man, Horn, Hot Blooded, Houses in Motion, How High the Moon, How Many People Are You, I Am Hydrogen, I Am the Sea, I Am the Walrus, I Been Around, I Been to Georgia on a Fast Train, I Didnt Know, I Dont Care, I Found a Reason, I Get a Kick Out of You, I Just Want To See His Face, I Kissed a Girl, I Shall Be Released, I Told You So, I Walk the Line, I Wanna Be Like You, I Want To Be a Cowboys Sweetheart, I Will, I Wish, Icculus, Idea, If I Could, If I Only Had a Brain, If You Need a Fool, Ill Come Running, Im Blue,  Im Lonesome, Im Gonna Be (500 Miles), Im One, Im So Tired, Immigrant Song Jam, In the Aeroplane Over the Sea, Instant Karma!, Intro, Invisible, Iron Man, Is It In My Head?, Is This What You Wanted, Its Ice, Its My Life, Ive Had Enough, Izabella, Jägermeister Song, Jam, Jean Pierre, Jennifer Dances, Jessica Jam, Jesus Just Left Chicago, Johnny B. Goode, Joy, Julia, Julius, Jump Monk, Jumpin Jack Flash, Jungle Boogie, Keyboard Army, Kill Devil Falls, Killer Joe, Killing in the Name, Kung, L.A. Woman, La Grange, Lawn Boy, Layla, Legalize It, Lengthwise, Leprechaun, Let It Loose, Let Me Lie, Lets Go, Lets Go Downtown, Letter to Jimmy Page, Life on Mars?, Lifeboy, Light, Light Up Or Leave Me Alone, Limb By Limb, Listening Wind, Lit O Bit, Little Red Rooster, Little Tiny Butter Biscuits, Lively Up Yourself, Llama, Llama Reprise, Lonesome Cowboy Bill, Long Cool Woman in a Black Dress, Long Long Long, Look Out Cleveland, Loup Garou, Love, Love Me, Love Me Like a Man, Love You, Loving Cup, Low Rider, Lullaby of Birdland, MacArthur Park, Magilla, Makisupa Policeman, Mallory, Manteca, Manteca Reprise, Martha My Dear, Martian Monster, Maze, McGrupp and the Watchful Hosemasters, Mean Mr. Mustard, Meat, Meat Reprise, Meatstick, Meatstick Reprise, Mellow Mood, Memories, Mercenary Territory, Mercury, Merry Pranksters Jam, Messin with The Kid, Metal Bagel Death, Mexican Cousin, Middle of the Road, Midnight on the Highway, Midnight Rider Jam, Mikes Song, Mind Left Body Jam, Minute by Minute, Mirror in the Bathroom, Misty Mountain Hop, Mo Better Blues, Moby Dick, Mock Song, Money, Monkey Man, Moonlight in Vermont, Moose the Mooche, Mother Natures Son, Mound, Mountains in the Mist, Mozambique, Mr. Completely, Mr. P.C., Mustang Sally, My Friend,  My Friend, My Generation, My Left Toe, My Life As a Pez, My Long Journey Home, My Minds Got a Mind of its Own, My Problem Right There, My Soul, My Sweet One, Nellie Kane, Never, New Age, New York,  New York, NICU, Night Moves Jam, Night Nurse, Ninety-Nine Years (and One Dark Day), No Dogs Allowed, No Good Trying, No Men In No Mans Land, No Quarter, NO2, Nothin But A Nothin, Nothing, O Mio Babbino Caro, Ob-La-Di,  Ob-La-Da, Ob-La-Di,  Ob-La-Da Jam, Ocelot, Oh Atlanta, Oh! Sweet Nuthin, Old Folks Boogie, Olivias Pool, On My Knees, On the Road Again, On The Run, On Your Way Down, Once in a Lifetime, One Meatball, Oye Como Va, Oye Como Va Jam, Party Time, Paul and Silas, Peaches en Regalia, Pebbles and Marbles, P-Funk Medley, Piano Duet, Pig in a Pen, Piggies, Pigtail, Piper, Plasma, Poor Heart, Poor Heart Reprise, Possum, Prince Caspian, Proud Mary, Psycho Killer, Punch You In the Eye, Purple Haze, Purple Rain, Pusherman Jam, Quadrophenia, Quadrophonic Toppling, Quinn the Eskimo, Ramble On, Rappers Delight, Reba, Reign Oer Me, Revolution 1, Revolution 9, Revolutions Over, Rhinoceros, Rhombus Narration, Rhymes, Ride Captain Ride, Rift, Rip This Joint, Roadrunner, Rock A William, Rock and Roll, Rock and Roll All Nite Jam, Rock and Roll Part Two, Rock Me Baby, Rocket in My Pocket, Rocket Man, Rocks Off, Rocky Mountain Way Jam, Rocky Raccoon, Rocky Top, Roggae, Roll in My Sweet Babys Arms, Roll Like a Cantaloupe, Roses Are Free, Rotation Jam, Round Room, Run Like an Antelope, Runaway Jim, Runnin with the Devil, Sabotage, Sad Lisa, Sailin Shoes, Salt Peanuts, Sample in a Jar, Samson Variation, Sand, Sanity, Satin Doll, Savoy Truffle, Saw It Again, Say Something, Scabbard, Scent of a Mule, Scents and Subtle Sounds, Sea and Sand, Secret Language Instructions, Secret Smile, Seen and Not Seen, Self, Setting Sail, Seven Below, Sexual Healing, Sexy Sadie, Shade, Shafty, Shaggy Dog, Shake Your Hips, She Caught the Katy and Left Me a Mule to Ride, She Thinks I Still Care, Shine, Shine a Light, Shipwreck, Show of Life, Silent in the Morning, Simple, Sing Monica, Sixteen Candles, Skin It Back, Slave to the Traffic Light, Sleep, Sleep Again, Sleeping Monkey, Smells Like Teen Spirit, Smoke on the Water Jam, Sneakin Sally Through the Alley, Snow, So Lonely, Something, Somewhere Over the Rainbow, Soul Shakedown Party, Soul Survivor, Spanish Moon, Sparkle, Sparks, Speak to Me, Spices, Split Open and Melt, Split Open and Melt Jam, Spocks Brain, Spooky, Spooky Jam, Spread It Round, Stairway to Heaven, Stand!, Stash, Stealing Time From the Faulty Plan, Steam, Steep, Stop Breaking Down, Strange Design, Sugar Shack, Summer of 89, Suspicious Minds, Susskind Hotel, Suzy Greenberg, Sweet Adeline, Sweet Black Angel, Sweet Emotion Jam, Sweet Jane, Sweet Virginia, Swept Away, Swing Low,  Sweet Chariot, T.V. Show, Take Me Out to the Ballgame, Take Me to the River, Take the A Train, Takin Care of Business, Talk, Taste, Taste That Surrounds, Tela, Tennessee Waltz, Terrapin, Terrapin Station, Thank You, Thats Alright Mama, The Asse Festival, The Ballad of Curtis Loew, The Birds, The Birdwatcher, The Chase, The Chinese Water Torture, The Connection, The Continuing Story of Bungalow Bill, The Cover of Rolling Stone, The Curtain, The Curtain With, The Dirty Jobs, The Dogs, The Fog That Surrounds, The Gambler, The Great Curve, The Great Gig in the Sky, The Happy Whip and Dung Song, The Haunted House, The Horse, The Inlaw Josie Wales, The Landlady, The Last Step, The Line, The Lion Sleeps Tonight, The Little Drummer Boy, The Lizards, The Maker, The Man Who Stepped Into Yesterday, The Mango Song, The Moma Dance, The Ocean, The Oh Kee Pa Ceremony, The Old Home Place, The Overload, The Prison Joke, The Punk Meets the Godfather, The Real Me, The Rock, The Rover, The Sloth, The Squirming Coil, The Star Spangled Banner, The Tears of a Clown, The Thrill is Gone, The Unsafe Bridge, The Very Long Fuse, The Vibration of Life, The Way It Goes, The Wedge, Them Changes, Theme from Jeopardy!, Theme from Popeye, Theme from Star Trek, Theme From the Bottom, Theme from The Brady Bunch, Theme from The Flintstones, Three Little Birds, Thunder Road, Thunderhead, Timber, Timber (Jerry), Time, Time Loves a Hero, Time Turns Elastic, To France, Tomorrows Song, Torn and Frayed, Touch Me, Train Round the Bend, Train Song, Trench Town Rock, Tripe Face Boogie, Tube, Tubthumping, Tuesdays Gone, Tumbling Dice, Turd on the Run, Tweezer, Tweezer Reprise, Twenty Years Later, Twist, Two Versions of Me, Uncle Pen, Uncloudy Day, Under Pressure, Undermind, United We Stand, Us and Them, Vacuum Solo, Ventilator Blues, Viola Lee Blues, Vultures, Wading in the Velvet Sea, Wait, Waiting All Night, Waking Up, Walfredo, Walk Away, Walk This Way, Walls of the Cave, Waste, Water in the Sky, Waves, Weekapaug Groove, Weekapaug Groove Reprise, Weigh, Were an American Band, Were Not Gonna Take It, West L.A. Fadeaway, What Things Seem, Whats the Use?, When Something is Wrong with My Baby, When the Cactus is in Bloom, When the Circus Comes, While My Guitar Gently Weeps, Whipping Post, White Rabbit Jam, Who By Fire, Who Do? We Do!, Who Knows Jam, Who Loves the Sun?, Whole Lotta Love, Whole Lotta Love Jam, Why Dont We Do It in the Road?, Why You Been Gone So Long?, Wild Honey Pie, Wildwood Weed, Will It Go Round in Circles?, Will the Circle Be Unbroken?, Willin, Wilson, Wind Beneath My Wings, Windora Bug, Windy City, Wingsuit, Winterqueen, Wipe Out, Wolfmans Brother, Wombat, Woodstock, Work Song, Wormtown Jam, Ya Mar, Yarmouth Road, Yer Blues, Yerushalayim Shel Zahav, You Aint Goin Nowhere, You Better Believe It Baby, You Dont Love Me, You Enjoy Myself, You Gotta See Mama Every Night, You Never Know, You Shook Me All Night Long, Your Pet Cat';
      return allStates.split(/, +/g).map( function (state) {
        return {
          value: state.toLowerCase(),
          display: state
        };
      });
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }
    
    
    
    
  }

})();
 
