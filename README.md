# RAmazon
$RPS. A Node.js and MySQL CLI Storefront for rare items. PALACE2018 

# Description
RAmazon is a simple Node.js and MySQL storefront application that uses Ethereum to make trasactions for clothing, skateboards, and drones. There are three separate sub-applications representing different permissions to the same backend data, which are further described and demonstrated below:

Customer (ramazonCustomer.js)
Manager (ramazonManager.js)
Supervisor (ramazonSuper.js)

# Installation
RAmazon utilizes Node Package Manager (NPM) to install features. The user will need to install a number of packages in order to use the application.

# Clone Ramazon Repository
In the console, navigate to the directory where you wish to install RAmazon. Type git clone https://github.com/richtt18/RAmazon.git to clone the repository. This will create a local copy of RAmazon files on your system.

# Packages
All dependencies are tracked in the provided package.json and package-lock.json files. In the console, navigate into the cloned directory ("ramazon") and type npm install This will install the following NPM packages:

mysql
inquirer
clear

# MySQL Creation
There is one .sql file included in this repo (ramazon.sql). The user will need a MySQL server running and a MySQL database management application such as Sequel Pro or MySQLWorkbench to get started. Run the MySQL commands in ramazon.sql either by opening the file in your management application or by copying and pasting the commands and executing from within the application query. Once the tables are created, you will be able to run the RAmazon Node applications. Change the database connection parameters in each of the .js files if necessary (e.g. default settings for connecting to the MySQL server are user name "root" with no password, and a port is assigned in the files as well).



# Files
ramazonCustomer.js: Running this file in Node launches the Customer application. The customer is presented with the current items for sale and is able to make purchases or exit.

ramazonManager.js: Running this file in Node launches the Manager application. The manager is presented with a more detailed view of current stock and department information, and is able to execute many more commands, such as viewing low inventory, adding to inventory, adding a new item, and deleting items.

ramazonSuper.js: Running this file in Node launches the Supervisor application. The supervisor is presented with the option to view a department summary, which details the overhead costs, total sales, and total profit for each department.
