const express = require('express');
const mongoClient = require('mongodb').MongoClient;

const app = express();
const PORT = process.env.port || 3000;
const connectionString = 'mongodb+srv://sfcc:qwerty123456@cluster0.luunjwy.mongodb.net/sfcc?retryWrites=true&w=majority';
const client = new mongoClient(connectionString);

const ageMajority = 18;

const start = async () => {
    try {
        await client.connect();
        app.listen(PORT, () => console.log('Server has been started at port...' + PORT))
    } catch (err) {
        console.log(err);
    }
};

const addNewEmployee = async (employee) => {
    const employees = client.db().collection('employees');
    await employees.insertOne(employee);
};

app.get('/users', (req, res) => {
    const name = req.query.name ?? '';
    const surname = req.query.surname ?? '';
    const age = parseInt(req.query.age);

    if (age > ageMajority) {
        res.send(`Hello ${name} ${surname}`);
    }
});

app.get('/employees', (req, res) => {
    const employee = {
        name: req.query.name ?? '',
        surname: req.query.surname ?? '',
        email: req.query.email ?? '',
        age: parseInt(req.query.age)
    };

    if (employee.age > ageMajority) {
        addNewEmployee(employee);
        res.send(`Done!`);
    } else {
        res.send(`You don't have access!`);
    }
});

app.get('/employees/search', (req, res) => {
    const empEmail = req.query.email ?? '';

    const employees = client.db().collection('employees');
    employees.find({email: empEmail}).toArray(function(err, employees) {      
        if(err) return console.log(err);
        res.send(employees)
    });
});

start();