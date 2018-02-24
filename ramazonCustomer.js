// require mysql
var mysql = require("mysql");
// require inquirer
var inquirer = require("inquirer");
// require clear
var clear = require("clear");
// require table
var {table} = require("table");

// global boolean for determining if console should be cleared or not
var isNewSession = true;


// create mysql connection
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "Ramazon_DB"
});

// connect
connection.connect(function(err) {
  // if error received, throw error
  if(err) throw err;
  // launch displayItemsForSale()
  displayItemsForSale();
});

function displayItemsForSale() {
  // check global boolean
  if (isNewSession) {
    // clear console
    clear();
    // welcome message
    console.log("WELCOME TO RAMAZON: A CLI ETHEREUM PALACE");
    // update global boolean
    isNewSession = false;
  }

  // read entire products table
  connection.query("SELECT * FROM products", function(err, products) {
    // initialize rows array (array of arrays) with header row filled
    var rows = [["Product ID", "Name", "Brand", "Department", "Price (ETH)"]];
    // initialize an array that will hold all item objects
    var items = [];
    // loop through products array
    for (i = 0; i < products.length; i++) {
      // store current product as a variable
      var currentProduct = products[i];
      // push row of data (array) to rows array
      rows.push([currentProduct.id, currentProduct.product_name, currentProduct.brand_name, currentProduct.department_name, currentProduct.price]);
      // push item object to items array
      items.push(currentProduct);
    }
    // log table
    console.log(table(rows));

    // call promptCustomer
    promptCustomer();
  });
}

function promptCustomer() {
  // first inquirer prompt
  inquirer.prompt({
    name: "choice",
    message: "What would you like to do?",
    type: "list",
    choices: ["Make a purchase", "Exit"]
  }).then(function(answers) {
    // if user chose exit
    if (answers.choice === "Exit") {
      // clear console
      clear();
      // end connection
      connection.end();
    } else {
      // otherwise present user with purchase prompt
      inquirer.prompt([
        {
          name: "item",
          message: "Please enter the Product ID for the item you wish to buy: ",
          type: "input"
        },
        {
          name: "amount",
          message: "Please enter the number of items you wish to buy (enter 0 if you changed your mind): ",
          type: "input"
        }
      ]).then(function(answers) {
        // if user entered something other than a number in either answer
        if (!isNumeric(answers.amount) || !isNumeric(answers.item)) {
          // log error message
          console.log("Error! Only numbers are allowed. Please try again.");
          // call promptCustomer
          promptCustomer();
        } else if (parseInt(answers.amount) === 0) {
          // if user entered 0 for amount, call promptCustomer
          promptCustomer()
        } else {
          // otherwise call makePurchase, passing answers as an arg
          makePurchase(answers);
        }
      });
    }
  });
}

// returns true if string contains only numbers
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function makePurchase(answers) {
  // select match from DB
  connection.query(`SELECT * FROM products WHERE id = ${answers.item}`, function(err, products) {
    // error handling
    if (err) throw err;
    // check if user entered an invalid ID (no match)
    if (products.length <= 0) {
      // clear console
      clear();
      // log invalid ID message
      console.log("Invalid Product ID. Please try again.");
      // call displayItemsForSale
      displayItemsForSale();
    } else {
      // otherwise the user entered a valid ID, save item match as a variable
      var itemMatch = products[0];
      // if user requested more than we have
      if (parseInt(answers.amount) > itemMatch.stock_quantity) {
        // clear console
        clear();
        // log message
        console.log(`We're sorry, we don't have that many ${itemMatch.product_name}s in stock. Please try again.`);
        // call displayItemsForSale
        displayItemsForSale()
      } else {
        // otherwise attempt to update DB
        // calculate total cost
        var totalCost = itemMatch.price * parseInt(answers.amount);
        // update DB
        connection.query(`UPDATE products SET stock_quantity = ${itemMatch.stock_quantity - parseInt(answers.amount)}, product_sales = ${itemMatch.product_sales + totalCost} WHERE id = ${answers.item}`, function(err, res) {
          // error handling
          if (err) throw err;
          // if there was 1 row affected (successful update)
          if (res.affectedRows === 1) {
            // clear console
            clear();
            // display success message to user (different if single or mulitple)
            if (parseInt(answers.amount) === 1) {
              console.log(`RPS Success! You purchased 1 ${itemMatch.product_name} for ${itemMatch.price} Ether. Enjoy! PALACE2018`);
            } else {
              console.log(`RPS Success! You purchased ${parseInt(answers.amount)} ${itemMatch.product_name}s for a total cost of ${totalCost} Ether. Enjoy! PALACE2018`);
            }
            // call displayItemsForSale
            displayItemsForSale();
          } else {
            // otherwise the DB was NOT updated but didn't throw an error, display message
            console.log("We're sorry, there appears to be some sort of issue with our database. Plesae try again later.");
            // end connection
            connection.end();
          }
        });
      }
    }
  });
}
