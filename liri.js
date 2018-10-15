'My Liri Bot'
require("dotenv").config();
var keys = require('./keys');
var moment = require('moment');
var fs = require('fs');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var input;
if (!process.argv[3] === undefined) {
    var input = process.argv.slice(3).join(' ');
}
runLiRi(command, input);
function runLiRi(command, input) {
    switch (command) {
        case 'concert-this':
        input === undefined ? runBandsInTown("Shakira"):
            runBandsInTown(input);
            break;
        case 'spotify-this-song':
        input === undefined ? runSpotify("Havana"):
            runSpotify(input);
            break;
        case 'movie-this':
        input === undefined ? runOMBD('Deadpool'):
            runOMBD(input);
            break;
        case 'do-what-it-says':
            runRandom(command, input);
            break;
    }
};
function runSpotify(input) {
    spotify.search({ type: 'track', query: input, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error ocurred: ' + err);
        } else {
            song = data.tracks.items[0];
            console.log('n\nArtist: ' + song.artists[0].name + '\nSong: ' + song.name + '\nPreview Link:' + song.preview_url + '\nAlbum' + song.album.name + '\n\n');
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
        if (results.length < 1) {
            console.log("try another artist.\n");
        } else {
            console.log('\n Have fun watchin the live perfomance of ' + input + '\n');
            for (let i = 0; i < 5 && i < results.length; i++) {
                console.log('Venue:' + results[i].venue.name + '\n' + 'Location:' + results[i].venue.city + ', ' + results[i].venue.county);
                var partyDate = results[i].datetime.split('T')[0];
                partyDate = moment(partyDate, 'YYYY-MM-DD').format('MMM DD, YYYY');
                if (partyDate) {
                    console.log('Date: ' + partyDate + '\n');
                } else {
                    console.log('Date: Call again to find out later.... TBA')
                }
            }
        }
    });
};
function runOMBD(input) {
    var request2 = require('request');
    request2('http://www.omdbapi.com/?apikey=trilogy&t=' + input, function (error, response, body) {

        if (error) {
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode);
        } else {
            movie = JSON.parse(body);
            console.log("\n\nTitle: " + movie.Title);
            console.log("Year: " + movie.Year);
            console.log("IMDB Rating: " + movie.imdbRating);
            console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
            console.log("Country: " + movie.Country);
            console.log("Language: " + movie.Language);
            console.log("Plot: " + movie.Plot);
            console.log("Actors: " + movie.Actors);
        }
    });
};
function runRandom(command, input) {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log(error)
        }
        data = data.split('"');
        var dataArr = data;
        command = dataArr[0].split(',')[0];
        input = dataArr[1];
        runLiRi(command, input);
    });
};
