create table users (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
email VARCHAR(250) UNIQUE NOT NULL,
password VARCHAR(250) NOT NULL);


create table projects (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
title VARCHAR(250) NOT NULL, 
deploy VARCHAR(250) NOT NULL, 
description VARCHAR(250) NOT NULL, 
idUser INT NOT NULL, FOREIGN KEY(idUser) REFERENCES users(id));
