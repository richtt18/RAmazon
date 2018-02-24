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
  promptManager();
});

// promptManager function
function promptManager() {
  // clear console if new session
  if (isNewSession) {
    clear();
    console.log("RAMAZON ETHER PALACE STOREFRONT: MANAGER VIEW");
    isNewSession = false;
  }
  // inquirer prompt
  inquirer.prompt(
    {
      name: "action",
      message: "What would you like to do?",
      type: "list",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Delete Product", "Exit"]
    }
  ).then(function(answer) {
    // clear console
    clear();
    // answer.action switch statement
    switch(answer.action) {
      case "View Products for Sale":
        // set global boolean
        choseView = true;
        // log manager view message
        console.log("MANAGER VIEW: ALL PRODUCTS");
        // call viewProducts
        viewProducts();
        break;
      case "View Low Inventory":
        // set global boolean
        choseView = false;
        // call viewLowInventory
        viewLowInventory();
        break;
      case "Add to Inventory":
        // set global boolean
        choseView = false;
        // call addToInventory
        addToInventory();
        break;
      case "Add New Product":
        // set global boolean
        choseView = false;
        // call addNewProduct
        addNewProduct();
        break;
      case "Delete Product":
        // set global boolean
        choseView = false;
        // call deleteProduct
        deleteProduct();
        break;
      case "Exit":
        // end connection
        connection.end()
        // clear console
        clear();
    }
  });
}

// viewProducts function
function viewProducts() {
  // read entire products table
  connection.query("SELECT * FROM products", function(err, products) {
    // initialize rows array (array of arrays) with header row (array) filled
    var rows = [["Product ID", "Name", "Brand", "Department", "Price (ETH)", "Stock"]];
    // loop through products array
    for (i = 0; i < products.length; i++) {
      // store current product as a variable
      var currentProduct = products[i];
      // push row of data (array) to rows array
      rows.push([currentProduct.id, currentProduct.product_name, currentProduct.brand_name, currentProduct.department_name, currentProduct.price, currentProduct.stock_quantity]);
    }
    // log table
    console.log(table(rows));
  });

  // if user initiated viewProducts from inquirer prompt, call promptManager
  // otherwise viewProducts was called from another menu function and it should be allowed to continue as normal
  if (choseView) {
    // prompt manager for action
    setTimeout(promptManager, 10);
  }
}

// viewLowInventory function
function viewLowInventory() {
  // log manager view message
  console.log("MANAGER VIEW: LOW INVENTORY");
  // select products from table where stock_quantity is less than 5
  connection.query("SELECT * FROM products WHERE stock_quantity < 2", function(err, products) {
    // initialize rows array (array of arrays) with header row (array) filled
    var rows = [["Product ID", "Name", "Brand", "Department", "Price (ETH)", "Stock"]];
    // loop through products array
    for (i = 0; i < products.length; i++) {
      // store current product as a variable
      var currentProduct = products[i];
      // push row of data (array) to rows array
      rows.push([currentProduct.id, currentProduct.product_name, currentProduct.brand_name, currentProduct.department_name, currentProduct.price, currentProduct.stock_quantity]);
    }
    // log table
    console.log(table(rows));
  });

  // prompt user for action
  setTimeout(promptManager, 10);
}

function addToInventory() {
  // log manager view message
  console.log("MANAGER VIEW: ADD TO INVENTORY");
  // call viewProducts
  viewProducts();

  // setTimeout required to allow viewProducts to full update console with table
  setTimeout(function() {
    // inquirer prompt
    inquirer.prompt([
      {
        name: "item",
        message: "Please enter the Product ID for the item you wish to update: ",
        type: "input"
      },
      {
        name: "amount",
        message: "Please enter the number of units to be added to the inventory: ",
        type: "input"
      }
    ]).then(function(answers) {
      // get current stock_quantity for selected item
      connection.query(`SELECT * FROM products WHERE id = ${answers.item}`, function(err, product) {
        // error handling
        if (err) throw err;
        // save product to variable
        var productMatch = product[0];
        // do math for new quantity
        var newQuantity = productMatch.stock_quantity + parseInt(answers.amount);

        // attempt to update quantity
        connection.query(`UPDATE products SET stock_quantity = ${newQuantity} WHERE id = ${answers.item}`, function(err, res) {
          // error handling
          if (err) {
            console.log(err);
            connection.end();
          } else if (res.affectedRows === 1) {
            // if 1 row was changed (i.e. the DB was successfully updated)
            // clear console
            clear();
            // viewProducts (essentially updates table dynamically)
            viewProducts();
            // log success message and then call promptManager
            setTimeout(function() {
              console.log(`RPS Success! You added ${answers.amount} units to the ${productMatch.product_name} stock. PALACE2018\n`);
              promptManager();
            }, 10);
          } else {
            // otherwise something else went wrong but didn't return an error, message and end connection
            console.log("We're sorry, there appears to be some sort of problem. Please try again later.\n");
            connection.end();
          }
        });
      });
    });
  }, 10);
}

function addNewProduct() {
  // log manager view message
  console.log("MANAGER VIEW: ADD NEW PRODUCT");

  setTimeout(function() {
    // inquirer prompt
    inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the item you would like to add?"
      },
      {
        name: "brand",
        type: "input",
        message: "Who makes this item?"
      },
      {
        name: "stock",
        type: "input",
        message: "What is the initial stock of the item?"
      },
      {
        name: "price",
        type: "input",
        message: "What is the unit cost of the item?"
      },
      {
        name: "dept",
        type: "list",
        message: "In what department does this item belong?",
        choices: ["Clothing", "Skateboard", "Drone"]
      }
    ]).then(function(answers) {
      // insert into db
      connection.query("INSERT INTO products SET ?",
    {
      product_name: answers.name,
      brand_name: answers.brand,
      department_name: answers.dept,
      price: parseFloat(answers.price),
      stock_quantity: parseInt(answers.stock)
    }, function(err, res) {
      if (err) {
        console.log(err);
      } else if (res.affectedRows === 1) {
        // call viewProducts
        viewProducts()
        // log success message
        setTimeout(function() {
          console.log(`RPS Success! You added new item "${answers.name}" by ${answers.brand} to the ${answers.dept} Department with an initial stock of ${answers.stock} and a price of ${answers.price} ETH. PALACE2018.\n`);
        }, 10)
      } else {
        console.log("We're sorry, there appears to be some sort of problem. Please try again later.\n");
      }
      // promptManager
      setTimeout(promptManager, 10);
    });
    });
  }, 10);
}

function deleteProduct() {
  // log manager view message
  console.log("MANAGER VIEW: DELETE PRODUCT");
  // call viewProducts
  viewProducts();

  // inquirer prompt
  setTimeout(function() {
    inquirer.prompt([
      {
        name: "item",
        message: "Please enter the Product ID for the item you wish to delete: ",
        type: "input"
      },
      {
        name: "confirmOne",
        message: "Are you sure you want to delete this item?",
        type: "confirm"
      },
      {
        name: "confirmTwo",
        message: "Are you REALLY sure you want to delete this rare item???",
        type: "confirm"
      }
    ]).then(function(answers) {
      // if user answered yes to both confirmations
      if (answers.confirmOne && answers.confirmTwo) {
        // init productName for future message purposes
        var productName = "";
        // grab name from DB for message purposes
        connection.query(`SELECT * FROM products WHERE id = ${answers.item}`, function(err, product) {
          // error handling
          if (err) throw err;
          // save matched item's name to variable for message purposes
          productName = product[0].product_name;
        });
        // delete item from DB
        connection.query(`DELETE FROM products WHERE id = ${answers.item}`, function(err, res) {
          if (err) {
            console.log(err);
          } else if (res.affectedRows === 1) {
            clear();
            // call viewProducts
            viewProducts();
            // log success message
            setTimeout(function() {
              console.log(`RPS Successfully deleted ${productName} from inventory. PALACE2018`);
            }, 10);
          } else {
            console.log("We're sorry, there appears to be some sort of problem. Please try again later.\n");
          }
          // promptManager
          setTimeout(promptManager, 10);
        });
      } else {
        // otherwise the user didn't say yes to both confirm questions, call promptManager
        clear();
        promptManager();
      }
    });
  }, 10);
}
