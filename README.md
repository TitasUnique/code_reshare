TABLE super_admin :

CREATE TABLE eventra_db.super_admin (
id BIGINT PRIMARY KEY AUTO_INCREMENT UNIQUE,
f_name VARCHAR(45) NOT NULL,
m_name VARCHAR(45) NOT NULL,
l_name VARCHAR(45) NOT NULL,
username VARCHAR(50) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
role INT NOT NULL,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
deleted_at DATETIME NULL
);

TABLE states:

CREATE TABLE eventra_db.states (
id INT AUTO_INCREMENT PRIMARY KEY,
state_name VARCHAR(100) NOT NULL
);

TABLE district:

CREATE TABLE eventra_db.districts (
id INT AUTO_INCREMENT PRIMARY KEY,
district_name VARCHAR(100) NOT NULL,
state_id INT NOT NULL,
FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE RESTRICT
);

TABLE business:

CREATE TABLE eventra_db.business (  
 id BIGINT PRIMARY KEY AUTO_INCREMENT,  
 business_name VARCHAR(255) NOT NULL,  
 has_valid_subscription BIT DEFAULT 0,  
 plan_id BIGINT NULL,  
 state_id INT NOT NULL,  
 district_id INT NOT NULL,  
 city VARCHAR(50) NULL,  
 business_code VARCHAR(50) UNIQUE NOT NULL,  
 sub_end_date DATE NULL,  
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  
 updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
deleted_at DATETIME NULL,
FOREIGN KEY (plan_id) REFERENCES master_plan(id),
FOREIGN KEY (state_id) REFERENCES states(id),
FOREIGN KEY (district_id) REFERENCES districts(id)
);

TABLE user:

CREATE TABLE eventra_db.users (
id BIGINT PRIMARY KEY AUTO_INCREMENT,
business_id BIGINT NOT NULL,
state_id INT NOT NULL,
district_id INT NOT NULL,
dept_id INT NOT NULL,
address VARCHAR(255) NULL,
city VARCHAR(50) NULL,
pin_code VARCHAR(10) NOT NULL,
employee_code VARCHAR(50) UNIQUE NOT NULL,
designation VARCHAR(50) NULL,
personal_email VARCHAR(100) UNIQUE NULL,
work_email VARCHAR(100) UNIQUE NULL,
pan_no VARCHAR(20) UNIQUE NULL,
joining_date DATE NULL,
blood_group VARCHAR(5) NULL,
emergency_contact VARCHAR(20) NULL,
bank_account_no VARCHAR(50) NOT NULL,
bank_ifsc VARCHAR(20) NOT NULL,
bank_name VARCHAR(50) NOT NULL,
uan VARCHAR(50) NULL,
reporting_to BIGINT NULL,
remark VARCHAR(255) NULL,
gender VARCHAR(10) NULL,
f_name VARCHAR(50) NOT NULL,
m_name VARCHAR(50) NULL,
l_name VARCHAR(50) NOT NULL,
username VARCHAR(50) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
dob DATE NULL,
contact_no VARCHAR(20) NOT NULL,
role INT NOT NULL, -- 1=super_admin, 2=business_admin, 3=employee
skills VARCHAR(255) NULL,
extra_skills VARCHAR(255) NULL,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
deleted_at DATETIME NULL,
FOREIGN KEY (business_id) REFERENCES business(id),
FOREIGN KEY (state_id) REFERENCES states(id),
FOREIGN KEY (district_id) REFERENCES districts(id),
FOREIGN KEY (reporting_to) REFERENCES users(id)
);

TABLE transaction:

CREATE TABLE eventra_db.`transaction` (
id BIGINT PRIMARY KEY AUTO_INCREMENT,
business_id BIGINT NOT NULL,
user_id BIGINT NOT NULL,
transaction_mode INT NOT NULL, -- e.g., credit_card, upi, bank_transfer
transaction_amount DECIMAL(10,2) NOT NULL,
ref_no VARCHAR(100) UNIQUE NOT NULL,
transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (business_id) REFERENCES business(id),
FOREIGN KEY (user_id) REFERENCES users(id)
);

TABLE master:

CREATE TABLE eventra_db.master_plan (
id BIGINT PRIMARY KEY AUTO_INCREMENT,
plan_name VARCHAR(100) NOT NULL,
description VARCHAR(500) NULL,
is_active BIT DEFAULT 1, -- 1 = active, 0 = inactive
max_employee INT NOT NULL,
plan_price DECIMAL(10,2) NOT NULL,
duration_days INT NOT NULL,
current_users INT DEFAULT 0,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
deleted_at DATETIME NULL
);

TABLE dept:

CREATE TABLE eventra_db.business_dept(
id BIGINT PRIMARY KEY AUTO_INCREMENT,
dept_name VARCHAR(100) NOT NULL,
business_id BIGINT NOT NULL,
current_users INT DEFAULT 0,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
deleted_at DATETIME NULL,
FOREIGN KEY (business_id) REFERENCES business(id)
);
