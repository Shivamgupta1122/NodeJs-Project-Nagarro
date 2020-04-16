const { Sequelize } = require('sequelize');   
var sqlite3 = require('sqlite3').verbose(); 
const { DataTypes } = require("sequelize"); 

//create the connection with the database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/todo.db'
  });
  

sequelize
.authenticate()
.then(function(err) {
  console.log('Connection has been established successfully.');
}, function (err) { 
  console.log('Unable to connect to the database:', err);
});

//Defining Tasks Table attributes
var Task = sequelize.define('Task', { 
    title: {type: DataTypes.STRING,primaryKey: true,allowNull: false},
    description: {type: DataTypes.STRING, allowNull: true},
    due_date: {type: DataTypes.DATEONLY, allowNull: false},
    status: {type: DataTypes.STRING, defaultValue: 'incomplete', allowNull: true},
    priority: {type: DataTypes.STRING, allowNull: true, defaultValue: 'medium'}},
    {timestamps : false});

//Defining Notes Table attributes
var Notes = sequelize.define('Notes', {
    Id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    Note: {type: DataTypes.STRING, allowNull: false},
    title: {type: DataTypes.STRING, allowNull: false}},
    {timestamps : false});


// Task.hasMany(Notes, {foreignKey: 'title', sourceKey: 'title'});
// Notes.belongsTo(Task, {foreignKey: 'title', targetKey: 'title'});

sequelize.sync().then(() => console.log('database synchronised')).catch(console.error)
   
Task.sync({alter: true}).then(() => {           
    console.log('New Task table created');
    }
    )
Notes.sync({alter: true}).then(() => {
    console.log('New Notes table created');
    }
    )

//Use this table to drop the table
// Task.drop().then(() => {
//     console.log('table deleted');
// }).finally(() => { 
// });

//Adding Raw data to Task Table
const Seed = async function Task() {     //Add raw data to Tasks Table
    await db.sync()
    await Task.bulkCreate([{
        title: "Learn  Nodejs",           //1
        description: "Complete NodeJs Assignment",
        due_date: "16/04/2020",
        status: "Incomplete",
        priority: "High"
    }
    ,
        {title: "Learn Angular",         //2
        description: "Complete TypeScript till now",
        due_date: "20/02/2020",
        status: "Incomplete",
        priority: "Medium"
    }],
    {
    IgnoreDuplicates : true
    })
}

//Added raw data to Notes table
const Seed2 = async function Note() {     //Add raw data to Tasks Table
    await db.sync()
    await Notes.bulkCreate([{
        Id : 01,
        Note : "Learn Nodejs",
        title: "Learn  Nodejs",           //1
        description: "Complete NodeJs Assignment",
    }
    ,
        {
            Id : 02,
            Note : "Learn Angular",
            title: "Learn  Nodejs",           //2
            description: "Complete Angular Assignment",
    }],
    {
    IgnoreDuplicates : true
    })
}


Seed()
Seed2()

exports = module.exports = {      
  Task, Notes
}