const http = require('http');
const express = require('express');
const path = require('path');
const app = express();

var formidable = require('formidable');
var fs = require('fs');


const speech = require('@google-cloud/speech');

app.use(express.json());
app.use(express.static("express"));

// default URL for website
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/express/index.html'));
    //__dirname : It will resolve to your project folder.
});

app.post('/processaudio', async function(req, res) {
    // console.log("ping");
    var form = new formidable.IncomingForm();
    form.parse(req, async function(err, fields, files) {
        var oldpath = files.filetoupload.path;

        const client = new speech.SpeechClient();

        const file = fs.readFileSync(oldpath);
        const audioBytes = file.toString('base64');
        // console.log(audioBytes);
        const audio = {
            content: audioBytes
        };

        const config = {
            encoding: 'LINEAR16',
            sampleRaterHertz: 1600,
            languageCode: 'en-US'
        };

        const request = {
            audio: audio,
            config: config
        };

        const [response] = await client.recognize(request);
        const transcription = response.results.map(result =>
            result.alternatives[0].transcript).join('\n');
        console.log('Transcription:' + transcription);


        //res.write(transcription);
        res.end();

        res.render('transcribe', { message: transcription });
    });
});

const server = http.createServer(app);
const port = 3002;
server.listen(port);
console.debug('Server listening on port ' + port);
console.log("hi")

console.log();