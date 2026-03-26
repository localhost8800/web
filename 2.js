/*append contents */
/*create 2 txt files f1.txt and f2.txt */
    
const http = require('http');
const fs = require('fs');
const url = require('url');

http.createServer(function(req, res) {

    if (req.url == "/") {
        // HTML form direct send
        res.write(`
            <html>
            <body>
            <form action="/process">
                First File: <input type="text" name="f1"><br><br>
                Second File: <input type="text" name="f2"><br><br>
                <input type="submit" value="Submit">
            </form>
            </body>
            </html>
        `);
        return res.end();
    }

    if (req.url.startsWith("/process")) {
        var q = url.parse(req.url, true).query;

        var f1 = q.f1;
        var f2 = q.f2;

        // read first file
        fs.readFile(f1, 'utf8', function(err, data) {
            if (err) {
                res.write("Error reading file1");
                return res.end();
            }

            // append into second file
            fs.appendFile(f2, data, function(err) {
                if (err) {
                    res.write("Error appending");
                    return res.end();
                }

                // delete first file
                fs.unlink(f1, function(err) {
                    if (err) {
                        res.write("Error deleting file1");
                        return res.end();
                    }

                    res.write("Success! File appended and deleted.");
                    res.end();
                });
            });
        });
    }

}).listen(3000);

console.log("Server running at http://localhost:3000");

/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Date and time
// first file name module.js

exports.getDateTime = function () {
    return new Date().toString();
};

--------------------------------------------------------------------------------------
// second file name q2.js

const http = require('http');
const myModule = require('./module'); // import your module

http.createServer(function (req, res) {

    res.write("Current Date & Time: " + myModule.getDateTime());
    res.end();

}).listen(3000);

console.log("Server running at http://localhost:3000");

///////////////////////////////////////////////////////////////////////////////////////////////////////////

//  event-driven application triggers a callback function
// q3.js

const http = require('http');
const url = require('url');

const htmlContent = `
<!DOCTYPE html>
<html>
<body>

  <h2>Click on a Button to Trigger an Event!</h2>

  <button onclick="sendEvent('Click')">Click Event</button>
  <button ondblclick="sendEvent('Double Click')">Double Click Event</button>
  <button onmouseover="sendEvent('Mouse Over')">Mouse Over Event</button>
  <button onmouseout="sendEvent('Mouse Out')">Mouse Out</button>
  
  <script>
    function sendEvent(eventName) {
      fetch('/event?name=' + eventName)
    }

    document.onkeydown = (event) => {
      if (event.key === 'Enter') {
        sendEvent('Key Press (Enter)');
      }
    };
  </script>
</body>
</html>
`;
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/event' && parsedUrl.query.name) {
    const eventName = parsedUrl.query.name;
    console.log(` Event Triggered: ${eventName}`); 
    res.end();
  } 
  else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
  }
});
server.listen(3000, () => {
  console.log(' Server running at http://localhost:3000');
});

/////////////////////////////////////////////////////////////////////////////////////////////////////

// Calculate the area and circumference of a circle
           // first file name: circle.js
exports.area = function(r) {
    return Math.PI * r * r;
};

exports.circumference = function(r) {
    return 2 * Math.PI * r;
};

---------------------------------------------------------------------------------------

// second file name: q4.js

const http = require('http');
const url = require('url');
const circle = require('./circle');

http.createServer((req, res) => {

    // HOME PAGE (FORM)
    if (req.url === "/") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`
            <h2>Circle Calculator</h2>
            <form action="/calc" method="get">
                Enter Radius: <input type="text" name="r"><br><br>
                <input type="submit" value="Calculate">
            </form>
        `);
        res.end();
    }

    // CALCULATION PAGE
    else if (req.url.startsWith("/calc")) {
        res.writeHead(200, { 'Content-Type': 'text/html' });

        let q = url.parse(req.url, true).query;
        let r = Number(q.r);

        res.write("<h2>Result</h2>");

        if (isNaN(r) || r <= 0) {
            res.write("<p style='color:red'>Invalid radius</p>");
        } else {
            res.write("<p>Radius: " + r + "</p>");
            res.write("<p>Area: " + circle.area(r) + "</p>");
            res.write("<p>Circumference: " + circle.circumference(r) + "</p>");
        }

        res.end();
    }

}).listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});

///////////////////////////////////////////////////////////////////////////////////////

//reads a file and counts the occurrences 
// create any txt file for eg f1.txt 

const http = require('http');
const fs = require('fs');
const url = require('url');

http.createServer((req, res) => {

    // HOME PAGE (FORM)
    if (req.url === "/") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`
            <h2>Word Count</h2>
            <form action="/count" method="get">
                File Name: <input type="text" name="file"><br><br>
                Word: <input type="text" name="word"><br><br>
                <input type="submit" value="Count">
            </form>
        `);
        return res.end();
    }

    // COUNT LOGIC
    if (req.url.startsWith("/count")) {
        let q = url.parse(req.url, true).query;
        let file = q.file;
        let word = q.word;

        res.writeHead(200, { 'Content-Type': 'text/html' });

        // validation
        if (!file || !word) {
            res.end("<p style='color:red'>Invalid input</p>");
            return;
        }

        fs.readFile(file, 'utf8', (err, data) => {

            if (err) {
                res.end("<p style='color:red'>File not found</p>");
                return;
            }

            // case-insensitive
            let text = data.toLowerCase();
            let w = word.toLowerCase();

            let count = text.split(w).length - 1;

            res.write("<h2>Result</h2>");
            res.write("<p>Word: " + word + "</p>");
            res.write("<p>Count: " + count + "</p>");
            res.end();
        });
    }

}).listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});

