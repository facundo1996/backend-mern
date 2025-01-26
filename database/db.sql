create database dbtasks;
use dbtasks;
-- Table tasks
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description VARCHAR(300),
  done BOOLEAN NOT NULL DEFAULT 0,
  createAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id varchar(36) PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(12) NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create table users(id varchar(36), name varchar(200));
insert into users values(uuid(), 'Andromeda');
select * from users;
drop table exampleusers;
DELETE from users where id = '5';

ALTER TABLE users MODIFY COLUMN id varchar(36) NOT NULL;
ALTER TABLE users MODIFY COLUMN password VARCHAR(200) NOT NULL;