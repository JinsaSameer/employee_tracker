const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
// import inquirer 
const inquirer = require('inquirer'); 
//const cTable = require('console.table'); 
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'rootroot',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
  );
  console.log("`------------------------------------`");
  console.log("|                                     |");
  console.log("|           EMPLOYEE MANAGER          |");
  console.log("|                                     |");
  console.log("`------------------------------------`");
 
  const promptChoice = () => {
    inquirer.prompt ([
    {
        type: 'list',
        name: 'choices',
        message: 'What would you like to do?',
        choices: ['View all Departments',
                   'View all Roles',
                   'View all Employees',
                   'Add a Department',
                   'Add a Role',
                   'Add an Employee',
                   'Update Employee Role',
                ]
            } 
        ])   
      .then((answers) => {
        const {choices} = answers;
        console.log(answers);
        if(choices == "View all Departments"){
            viewDepartments();
        }

        if(choices == "View all Roles"){
            viewRoles();
        }

        if(choices == "View all Employees"){
            viewEmployees();
        }

        if(choices == "Add a Departments"){
            addDepartment();
        }

        if(choices == "Add a Role"){
            addRole();
        }

        if(choices == "Add an Employee"){
            addEmployee();
        }

        if(choices == "Update Employee Role"){
            updateEmpRole();
        }
      });

      
      
  }
  promptChoice();

// Query database
    viewDepartments = () => {
      console.log("All Departments.........\n")

      db.query('SELECT * FROM department', function (err, results) {
      console.log(results);
      promptChoice();
   });
}
    viewRoles = () => {
      db.query('SELECT * FROM role', function (err, results) {
      console.log(results);
      promptChoice();
  });
}
    viewEmployees =() => {

      db.query('SELECT * FROM employee', function (err, results) {
      console.log(results);
      promptChoice();
  });
}

addDepartment = () => {
    const questions = [
        {
          type: 'input', 
          name: 'addDept',
          message: "What department do you want to add?",
        },
        {
            type: 'input', 
            id: 'addDept_id',
            message: "Enter Department id",
        },
          
        
      ];
      prompt([...questions]).then((answer) => { 
        const sql = `INSERT INTO department (name),(id)
        VALUES (?,?)`;
        db.query(sql,answer.addDept,answer.id, (err,results) => {
            if(err) throw err;
            console.log('Added ' + answer.addDept + answer.id + " to departments!"); 
            viewDepartments();
        }
        );
      });
    
}
addDepartment();
addRole = () => {
    const questions = [
        {
          type: 'input', 
          name: 'addRole',
          message: "What Role do you want to add?",
        },
        {
            type: 'input', 
            id: 'Role_id',
            message: "Enter Role id",
        },
        {
            type: 'input', 
            dept_id: 'addDept_id',
            message: "Enter Department id",
        },
        {
            type: 'input', 
            name: 'salary',
            message: "Enter Salary",
        },
        
      ];
      prompt([...questions]).then((answer) => { 
        const params = [answer.addRole,answer.Role_id,answer.salary,answer.dept_id]
        const sql = `INSERT INTO role (id,title,salary,department_id)
        VALUES (?,?,?,?)`;
        db.query(sql,answer.addDept,answer.id, (err,results) => {
            if(err) throw err;
            console.log('Added ' + answer.Role_id + answer.addRole + answer.salary +answer.dept_id + " to departments!"); 
            viewRoles();
        }
        );
      });
    }
  
    addEmployee = () => {
      const questions = [
        {
          type: 'input', 
          id: 'empId',
          message: "Enter Employee Id",
        },
        
        
        
        {
            type: 'input', 
            name: 'firstName',
            message: "Enter the First Name of Employee",
          },
          {
              type: 'input', 
              name: 'lastName',
              message: "Enter the Last Name of Employee",
          },
            
          
        ];
        prompt([...questions]).then((answer) => { 
          const params = [answer.fistName, answer.lastName]
          const roleQuerry = `SELECT role.id, role.title FROM role`;

          db.promise().query(roleQuerry, (err, data) => {
            if (err) throw err; 
            
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
          const sql = `INSERT INTO employee (name),(id)
          VALUES (?,?)`;
          db.query(sql,answer.addDept,answer.id, (err,results) => {
              if(err) throw err;
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'role',
                  message: "What is the employee's role?",
                  choices: roles
                }
              ])
              .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);
  
                const managerQuerry = `SELECT * FROM employee`;
  
                db.promise().query(managerQuerry, (err, data) => {
                  if (err) throw err;
  
                  const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                  inquirer.prompt([
                    {
                      type: 'list',
                      name: 'manager',
                      message: "Who is the employee's manager?",
                      choices: managers
                    }
                  ])
                    .then(managerChoice => {
                      const manager = managerChoice.manager;
                      params.push(manager);
  
                      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                      VALUES (?, ?, ?, ?)`;
  
                      db.query(sql, params, (err, result) => {
                      if (err) throw err;
          
                      console.log("Employee has been added!")
  
                          viewEmployees();
                      });    
                });
              });
            });
          });
       });
    });
  }
  


             
          
        
