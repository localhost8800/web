//Design a Node.js application that establishes a connection to a MongoDB 
// database, creates a collection named “customers”, and inserts five 
// customer records into it. The application should retrieve all records from 
// the collection, store them in a result object, and display the results on 
// console.  

const http = require('http');
const { MongoClient } = require('mongodb');

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

http.createServer(async (req, res) => {

    res.writeHead(200, { 'Content-Type': 'text/html' });

    try {
        await client.connect();

        const db = client.db("CustomerDB");
        const collection = db.collection("customers");

        // insert records
        await collection.insertMany([
            { name: "Amit", age: 25, city: "Pune" },
            { name: "Riya", age: 22, city: "Mumbai" },
            { name: "John", age: 30, city: "Delhi" },
            { name: "Sara", age: 28, city: "Chennai" },
            { name: "Raj", age: 35, city: "Bangalore" }
        ]);

        // fetch all records
        const result = await collection.find({}).toArray();

        // display in browser
        res.write("<h2>Customer Records</h2>");

        result.forEach(c => {
            res.write(`<p>${c.name} - ${c.age} - ${c.city}</p>`);
        });

        res.end();

    } catch (err) {
        res.end("<p style='color:red'>Error: " + err + "</p>");
    }

}).listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});

/////////////////////////////////////////////////////////////////////////////////////////////////

// Design a Node.js application that establishes a connection to a database to 
// insert multiple records into a “student” table and displays the resulting 
// object on the console. The application must implement robust error 
// handling to manage connection failures or query issues. 

const http = require('http');
const url = require('url');
const { MongoClient } = require('mongodb');

const client = new MongoClient("mongodb://127.0.0.1:27017");

http.createServer(async (req, res) => {

    res.writeHead(200, { 'Content-Type': 'text/html' });

    try {
        await client.connect();
        const db = client.db("studentDB");
        const col = db.collection("student");

        let q = url.parse(req.url, true).query;

        // 🔹 FORM
        if (!q.name) {
            res.write(`
                <h2>Insert Student</h2>
                <form method="get">
                    Name: <input type="text" name="name"><br><br>
                    Age: <input type="number" name="age"><br><br>
                    <input type="submit" value="Insert">
                </form>
            `);
        } else {
            // 🔹 INSERT STUDENT
            await col.insertOne({ name: q.name, age: Number(q.age) });
            res.write(`<p style="color:green">Inserted: ${q.name} - ${q.age}</p>`);
        }

        // 🔹 DISPLAY ALL STUDENTS
        const students = await col.find().toArray();
        res.write("<h3>All Students:</h3>");
        students.forEach(s => {
            res.write(`<p>${s.name} - ${s.age}</p>`);
        });

        res.end();

    } catch (err) {
        res.end("<p style='color:red'>Error: " + err + "</p>");
    }

}).listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});

/////////////////////////////////////////////////////////////////////////////////////////

// Create a node.js file that Select all records from the “customers” table, and 
// delete a specific record based on a given condition. 

// Insert Delete Update Search in MongoDB using NodeJS


const http = require('http');
const url = require('url');
const { MongoClient } = require('mongodb');

const client = new MongoClient("mongodb://127.0.0.1:27017");

http.createServer(async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    try {
        await client.connect();
        const db = client.db("CustomerDB"); // existing DB
        const col = db.collection("customers");

        const q = url.parse(req.url, true).query;

        // 🔹 INSERT FORM
        res.write(`
            <h2>Insert Customer</h2>
            <form method="get">
                Name: <input type="text" name="insertName" required>
                Age: <input type="number" name="insertAge" required>
                <input type="submit" value="Insert">
            </form>
            <hr>
        `);

        // 🔹 UPDATE FORM
        res.write(`
            <h2>Update Customer Age</h2>
            <form method="get">
                Name: <input type="text" name="updateName" required>
                New Age: <input type="number" name="updateAge" required>
                <input type="submit" value="Update">
            </form>
            <hr>
        `);

        // 🔹 DELETE FORM
        res.write(`
            <h2>Delete Customer</h2>
            <form method="get">
                Name: <input type="text" name="delName" required>
                <input type="submit" value="Delete">
            </form>
            <hr>
        `);

        // 🔹 SEARCH FORM
        res.write(`
            <h2>Search Customer</h2>
            <form method="get">
                Name: <input type="text" name="searchName">
                <input type="submit" value="Search">
            </form>
            <hr>
        `);

        // 🔹 INSERT LOGIC
        if (q.insertName && q.insertAge) {
            await col.insertOne({ name: q.insertName, age: Number(q.insertAge) });
            res.write(`<p style="color:green">Inserted: ${q.insertName} - ${q.insertAge}</p>`);
        }

        // 🔹 UPDATE LOGIC
        if (q.updateName && q.updateAge) {
            const updateResult = await col.updateOne(
                { name: q.updateName },
                { $set: { age: Number(q.updateAge) } }
            );
            if (updateResult.matchedCount > 0) {
                res.write(`<p style="color:blue">Updated ${q.updateName} to Age ${q.updateAge}</p>`);
            } else {
                res.write(`<p style="color:red">No customer found with name: ${q.updateName}</p>`);
            }
        }

        // 🔹 DELETE LOGIC
        if (q.delName) {
            const delResult = await col.deleteOne({ name: q.delName });
            if (delResult.deletedCount > 0) {
                res.write(`<p style="color:red">Deleted: ${q.delName}</p>`);
            } else {
                res.write(`<p style="color:red">No customer found with name: ${q.delName}</p>`);
            }
        }

        // 🔹 SEARCH / DISPLAY LOGIC
        let query = {};
        if (q.searchName) query = { name: q.searchName };
        const customers = await col.find(query).toArray();

        // 🔹 DISPLAY IN TABLE
        res.write("<h3>Customer Records</h3>");
        if (customers.length === 0) {
            res.write("<p>No customers found</p>");
        } else {
            res.write(`<table border="1" cellpadding="5" cellspacing="0">
                <tr style="background-color:#f2f2f2"><th>Name</th><th>Age</th></tr>
            `);
            customers.forEach(c => {
                res.write(`<tr><td>${c.name}</td><td>${c.age}</td></tr>`);
            });
            res.write("</table>");
        }

        res.end();

    } catch (err) {
        res.end(`<p style='color:red'>Error: ${err}</p>`);
    }

}).listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});