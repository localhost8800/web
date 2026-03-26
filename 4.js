// Create User Login System using Express JS containing login form details i.e. 
// username and password.and also Validate username such that it should not 
// contain more than 6 characters in it. 

const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

// 🔹 Login Form
app.get('/', (req, res) => {
    res.send(`
        <h2>Login Form</h2>
        <form method="POST" action="/login">
            Username: <input type="text" name="username"><br><br>
            Password: <input type="password" name="password"><br><br>
            <button type="submit">Login</button>
        </form>
    `);
});

// 🔹 Login Validation
app.post('/login', (req, res) => {

    let uname = req.body.username;
    let pass = req.body.password;

    // validation
    if (!uname || !pass) {
        return res.send("<p style='color:red'>All fields required</p>");
    }

    if (uname.length > 6) {
        return res.send("<p style='color:red'>Username must be max 6 characters</p>");
    }

    // success
    res.send(`<p style='color:green'>Login Successful! Welcome ${uname}</p>`);
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});

/////////////////////////////////////////////////////////////////////////////////////////////////////

// Develop a Node.js application using Express.js and EJS to build a dynamic 
// recipe book featuring multiple pages like Home and Recipe Details. The 
// application must implement routing to render EJS templates, pass dynamic 
// data to views, and provide functionality to       add and delete          recipes through 
// dedicated POST and DELETE routes. Ensure the system manages recipe 
// storage effectively and handles user interactions. 

//  create folder   recipe
//   file name app.js
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

// Dummy storage (array)
let recipes = [
    { id: 1, name: "Poha", description: "Delicious breakfast" },
    { id: 2, name: "Pasta", description: "Italian dish" }
];

// 🏠 Home Page
app.get('/', (req, res) => {
    res.render('home', { recipes });
});

// 📄 Recipe Details
app.get('/recipe/:id', (req, res) => {
    const recipe = recipes.find(r => r.id == req.params.id);
    res.render('details', { recipe });
});

// ➕ Add Recipe Page
app.get('/add', (req, res) => {
    res.render('add');
});

// ➕ Add Recipe (POST)
app.post('/add', (req, res) => {
    const { name, description } = req.body;
    const newRecipe = {
        id: recipes.length + 1,
        name,
        description
    };
    recipes.push(newRecipe);
    res.redirect('/');
});

// ❌ Delete Recipe
app.post('/delete/:id', (req, res) => {
    recipes = recipes.filter(r => r.id != req.params.id);
    res.redirect('/');
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

-----------------------------------------------------------------------------
// new folder  views
// file name add.ejs
<!DOCTYPE html>
<html>
<head>
    <title>Add Recipe</title>
    
</head>
<body>
    <h1>Add New Recipe</h1>
    
    <form method="POST" action="/add">
        <div class="form-group">
            <label for="name">Recipe Name:</label>
            <input type="text" id="name" name="name" required>
        </div>
        
        <div class="form-group">
            <label for="description">Description:</label>
            <textarea id="description" name="description" rows="4" required></textarea>
        </div>
        
        <button type="submit">Add Recipe</button>
        <a href="/">Cancel</a>
    </form>
</body>
</html>

-----------------------------------------------------------------------------
// second file name details.ejs
<!DOCTYPE html>
<html>
<head>
    <title>Recipe Details</title>
    
</head>
<body>
    <h1>Recipe Details</h1>
    
    <% if (recipe) { %>
        <div class="details">
            <h2><%= recipe.name %></h2>
            <p><strong>Description:</strong> <%= recipe.description %></p>
            <p><strong>ID:</strong> <%= recipe.id %></p>
            
            <form method="POST" action="/delete/<%= recipe.id %>" style="display: inline;">
                <button type="submit" class="delete-btn" onclick="return confirm('Are you sure?')">Delete Recipe</button>
            </form>
        </div>
    <% } else { %>
        <p>Recipe not found.</p>
    <% } %>
    
    <a href="/" class="back-btn">← Back to Home</a>
</body>
</html>
-------------------------------------------------------------------------
// third file name home.ejs
<!DOCTYPE html>
<html>
<head>
    <title>Recipe App</title>
    
</head>
<body>
    <h1> Recipe App</h1>
    
    <a href="/add" class="btn">Add New Recipe</a>
    
    <h2>Available Recipes:</h2>
    <% if (recipes.length > 0) { %>
        <% recipes.forEach(recipe => { %>
            <div class="recipe">
                <h3><%= recipe.name %></h3>
                <p><%= recipe.description %></p>
                <a href="/recipe/<%= recipe.id %>">View Details</a>
            </div>
        <% }); %>
    <% } else { %>
        <p>No recipes available yet. <a href="/add">Add one now!</a></p>
    <% } %>
</body>
</html>


/////////////////////////////////////////////////////////////////////////////////////////////////////////////

//  Node.js web application using Express.js download a file as an attachment

const express = require('express');
const path = require('path');
const app = express();

// 🔹 Home Page (Download Button)
app.get('/', (req, res) => {
    res.send(`
        <h2>File Download</h2>
        <a href="/download">
            <button>Download File</button>
        </a>
    `);
});

// 🔹 Download Route
app.get('/download', (req, res) => {

    const filePath = path.join(__dirname, 'f1.txt');

    res.download(filePath, 'myfile.txt', (err) => {
        if (err) {
            res.send("<p style='color:red'>File not found!</p>");
        }
    });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Using Node.JS, create a web page(Use EJS Template Engine) to accept the 
//employee details and render that page on the browser. Process the filled data 
//using the POST method and display the data on the next page.   

// folder name project
// file name app.js

const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Form page
app.get('/', (req, res) => {
    res.render('form');
});

// Handle POST request
app.post('/submit', (req, res) => {
    const { name, email, salary } = req.body;
    res.render('result', { name, email, salary });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
----------------------------------------------

// new folder name views
// file name form.ejs
<!DOCTYPE html>
<html>
<head>
    <title>Employee Form</title>
</head>
<body>
    <h2>Enter Employee Details</h2>

    <form action="/submit" method="POST">
        Name: <input type="text" name="name" required><br><br>
        Email: <input type="email" name="email" required><br><br>
        Salary: <input type="number" name="salary" required><br><br>

        <button type="submit">Submit</button>
    </form>
</body>
</html>
----------------------------------------------
// file name result.ejs
<!DOCTYPE html>
<html>
<head>
    <title>Employee Details</title>
</head>
<body>
    <h2>Employee Details</h2>

    <p><b>Name:</b> <%= name %></p>
    <p><b>Email:</b> <%= email %></p>
    <p><b>Salary:</b> <%= salary %></p>

    <a href="/">Back</a>
</body>
</html>
//////////////////////////////////////////////////////////////////////////////////////////////////////////////</br></br>