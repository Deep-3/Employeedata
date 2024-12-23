// models/index.js

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('Employee', 'root', 'Deep@0308', {
  host: 'localhost',
  dialect: 'mysql',
});

const Employee = sequelize.define('Employee', {
  EmployeeID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  Department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  JoiningDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

// Define Department Model
const Departments = sequelize.define('Department', {
        DepartmentID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
      },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

// Sync models with the database
sequelize.sync({alter:true})
  .then(() => console.log('Database synced successfully'))
  .catch((error) => console.error('Error syncing database:', error));

module.exports = { sequelize, Employee, Departments };
