'My Liri Bot'
require("dotenv").config();
var keys = require('./keys');
var moment = require('moment');
var fs = require('fs');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var argArray = [];
var input;
for (var i = 3; i < argArray.length; i++) {
    input = argArray[i];
}
console.log(input);
runLiri(command, input);
function runLiRi(command, input) {
    switch (command) {
        case 'concert-this':
            runBandsInTown(input);
            break;
        case 'spotify-this-song':
            runSpotify(input);
            break;
        case 'movie-this':
            runOMBD(input);
            break;
        case 'do-what-itsays':
            runRandom(command, input);
            break;
    }
};
function runSpotify(input) {
    spotify.search({ type: 'track', query: input, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error ocurred: ' + err);
        } else {
            data = data.tracks.items[0];
            console.log('n\nArtist: ' + data.artists[0].name + '\nSong: ' + data.name + '\nPreview Link:' + data.preview_url + '\nAlbum' + data.album.name + '\n\n');
        }
    });
};
function runBandsInTown(input) {
    var request = require('request');
    request("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp", function (error, response, body) {
        if (error) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        }
        results = JSON.parse(body);
        if(results.length <1){
            console.log("try another artist.\n");
        }else{
            console.log('\n Have fun watchin the live perfomance of ' + input + '\n');
            for (let i = 0; i < 5 && i < results.length; i ++){
                console.log('Venue:' + results[i].venue.name + '\n' + 'Location:' + results[i].venue.city + ', ' + results[i].venue.county);
                var partyDate = results[i].datetime.split('T')[0];
                partyDate = moment(partyDate, 'YYYY-MM-DD').format('MMM DD, YYYY');
                if(partyDate){
                    console.log('Date: ' + partyDate + '\n');
                }else{
                    console.log('Date: Call again to find out later.... TBA')
                }
            }
        }
    });
};
function runOMBD(input){
    var request2 = require('request');
    request2('http://www.omdbapi.com/?apikey=[trilogy]&' + input, function(error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
    });
};
function runRandom(command, input){
    fs.readFile("random.txt", "utf8", function (error, data){
        if (error) {
            console.log(error)
        }
        data = data.split('"');
        var dataArr = data.split(",");

        command = dataArr[0];
        input = dataArr[1];
        runLiRi(command, input);
    });
};
