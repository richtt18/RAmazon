-- Drop RamazonDB if it exists --
DROP DATABASE IF EXISTS Ramazon_DB;
-- Create RamazonDB --
CREATE DATABASE Ramazon_DB;
-- Use RamazonDB --
USE Ramazon_DB;

-- Create products table --
CREATE TABLE products (
  id INT(4) ZEROFILL NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50),
  brand_name VARCHAR(50),
  department_name VARCHAR(50),
  price DECIMAL(10,6),
  stock_quantity INT(666),
  product_sales DECIMAL(20,6),
  PRIMARY KEY (id)
);

-- Initial stock --
INSERT INTO products
  (product_name, brand_name, department_name, price, stock_quantity, product_sales)
VALUES
  ("RICH Hoodie", "MANAKIN SUPREME", "Clothing", 1.333, 10, 0),
  ("Distresed future punk t-shirt", "MANAKIN SUPREME", "Clothing", 0.287, 555, 0),
  ("Hollywood comfort skinny jean", "MANAKIN SUPREME", "Clothing", 2.222, 100, 0),
  ("DAYTONA Hoodie", "MANAKIN SUPREME", "Clothing", 1.666, 18, 0),
  ("Reflective henley shirt", "MANAKIN SUPREME", "Clothing", 0.5606, 250, 0),
  ("Digital blessings","PALACE", "Skateboard", 1.0033, 80, 0),
  ("Rich Schmitt pro series 1st edition","PALACE", "Skateboard", 0.8887, 500, 0),
  ("AI weed head","PALACE", "Skateboard", 0.8644, 666, 0),
  ("Object Zero","MANARK RACING", "Drone", 2.5656, 400, 0),
  ("Object 18","MANARK RACING", "Drone", 4.3333, 1, 0);

  -- Create departments table --
  CREATE TABLE departments (
    department_id INT(4) ZEROFILL NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50),
    over_head_costs DECIMAL(10,2),
    PRIMARY KEY (department_id)
  );

  -- Initial department data --
  INSERT INTO departments
    (department_name, over_head_costs)
  VALUES
    ("Weapons", 1000),
    ("Vehicles", 5000),
    ("Devices", 2500),
    ("Books", 100),
    ("Replicants", 5000);
