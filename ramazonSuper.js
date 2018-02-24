// require mysql
var mysql = require("mysql");
// require inquirer
var inquirer = require("inquirer");
// require clear
var clear = require("clear");
// require table
var {table} = require("table");

// global booleans for deciding whether or not to clear console
var isNewSession = true;
var choseView = false;

// create mysql connection
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "ramazon_DB"
});

// connect
connection.connect(function(err) {
  // if error received, throw error
  if(err) throw err;
  // launch promptManager
  promptSupervisor();
});

function promptSupervisor() {
  // clear console if new session
  if (isNewSession) {
    clear();
    console.log("RAMAZON ETH PALACE: SUPERVISOR VIEW");
    isNewSession = false;
  }

  // inquirer prompt
  inquirer.prompt({
    name: "action",
    message: "What would you like to do?",
    type: "list",
    choices: ["View Product Sales by Department", "Exit"]
  }).then(function(answers) {
    // clear console
    clear();
    // answer switch function
    switch (answers.action) {
      case "View Product Sales by Department":
        choseView = true;
        console.log("ETHER PALACE SUPER VIEW: VIEW PRODUCTS BY DEPARTMENT");
        viewProductsByDepartment();
        break;
      case "Create New Department":
        choseView = false;
        console.log("ETHER PALACE SUPER VIEW: CREATE NEW DEPARTMENT");
        createNewDepartment();
        break;
      case "Exit":
        // end connection
        connection.end();
        break;
    }
  });
}

function viewProductsByDepartment() {
  // save query as a variable
  // query grabs all columns from departments table and joins a sum of product_sales grouped by department_name from products table
  // it also orders by departmnet_id for a more sensible table
  var query = "SELECT d.department_id, d.department_name, d.over_head_costs, SUM(products.product_sales) AS product_sales ";
  query += "FROM products ";
  query += "INNER JOIN departments d ";
  query += "ON d.department_name = products.department_name ";
  query += "GROUP BY d.department_name, d.department_id, d.over_head_costs ";
  query += "ORDER BY d.department_id";

  // grab department table and inner join
  connection.query(query, function(err, res) {
    if (err) throw err;

    // initialize rows array (array of arrays) with header row (array) filled
    var rows = [["Department ID", "Department Name", "Overhead Costs", "Product Sales", "Total Profit"]];

    // loop through selected table data (res)
    for (i = 0; i < res.length; i++) {
      // push row of data (an array) to rows array
      // this push includes total profit, which is product sales - overhead costs
      rows.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, (res[i].product_sales - res[i].over_head_costs).toFixed(2)]);
    }

    // log table
    console.log(table(rows));
    console.log("ALERT: All values in ETH.\n");
    connection.end();

  });
}
