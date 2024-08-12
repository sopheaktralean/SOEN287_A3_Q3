const http = require('http');
const fs = require('fs');
const qs = require('querystring');

// Function to validate phone number format
function validatePhoneNumber(phonenumber){
    const regex = /^\d{3}-\d{3}-\d{4}$/;
    return regex.test(phonenumber);
}

// Creating the server
http.createServer((req, res) => {
    // Serving the HTML form
    if(req.method === 'GET' && req.url === '/'){
        fs.readFile('exercise3.html', (err,data) => {
            if(err){
                res.writeHead(500, {'Content-Type' : 'text/plain'});
                res.end('Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }

    else if(req.method === 'POST' && req.url === '/submit'){
        let body='';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () =>{
            const parsedData = qs.parse(body);
            const name = parsedData.name;
            const phonenumber = parsedData.phonenumber; 

            // Validating the phone number
            if (validatePhoneNumber(phonenumber)) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`<h1 style="color: green;">Thank you, ${name}!</h1><p>Your phone number is valid.</p>`);
            } else {
                res.writeHead(400, { 'Content-Type': 'text/html' });
                res.end(`<h1 style="color:red;">Error!</h1><p>The phone number you entered (${phonenumber}) is invalid. Please use the format ddd-ddd-dddd.</p>`);
            }            
        });
    }
    else{
        res.writeHead(404, { 'Content-Type' : 'text/plain' });
        res.end('Not Found');
    }

}).listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
