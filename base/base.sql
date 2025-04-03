CREATE DATABASE apiTest;
use apiTest;

-- ENTITY
CREATE TABLE entity (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50),
  description TEXT,
  siret VARCHAR(20),
  keyLicence VARCHAR(250),
  website VARCHAR(100),
  createdAt DATETIME
);

-- donnee test entity.....
INSERT INTO entity (name, description, siret, keyLicence, website, createdAt) VALUES
('Entreprise A', 'Description test A', '11111111111111', 'KEY-AAA-111', 'http://test-a.com', NOW()),
('Entreprise B', 'Description test B', '22222222222222', 'KEY-BBB-222', 'http://test-b.com', NOW()),
('Entreprise C', 'Description test C', '33333333333333', 'KEY-CCC-333', 'http://test-c.com', NOW()),
('Entreprise D', 'Description test D', '44444444444444', 'KEY-DDD-444', 'http://test-d.com', NOW());
INSERT INTO entity (name, description, siret, keyLicence, website, createdAt) VALUES
('Entreprise G', 'Description test E', '44444444444444', 'KEY-DDD-444', 'http://test-d.com', NOW());

-- USER
CREATE TABLE user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(80),
  firstName VARCHAR(50),
  language VARCHAR(2),
  email VARCHAR(100),
  password VARCHAR(250),
  lastLogin DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO user (name, firstName, language, email, password, lastLogin) VALUES
('Martin', 'Luc', 'fr', 'luc.martin@test.com', 'azerty123', '2025-01-15 08:30:00'),
('Dubois', 'Thomas', 'en', 'thomas.dubois@test.com', 'qwerty789', '2025-03-10 11:20:00');

INSERT INTO user (name, firstName, language, email, password, lastLogin) VALUES
('Tojo', 'be', 'mg', 'tojo.be@test.com', 'azerty123', '2025-01-15 08:30:00');

-- USER ENTITY
CREATE TABLE userEntity (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  entity_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (entity_id) REFERENCES entity(id)
);


INSERT INTO userEntity (user_id, entity_id) VALUES
(1,3),
(1,4),
(3,4);
(2,6);
 

SELECT * FROM userentity;

