-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: test
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `customerNumber` int NOT NULL AUTO_INCREMENT,
  `customerName` varchar(50) NOT NULL,
  `contactLastName` varchar(50) NOT NULL,
  `contactFirstName` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `addressLine1` varchar(50) NOT NULL,
  `addressLine2` varchar(50) DEFAULT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `country` varchar(50) NOT NULL,
  `salesRepEmployeeNumber` int DEFAULT NULL,
  `creditLimit` decimal(10,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`customerNumber`),
  KEY `salesRepEmployeeNumber` (`salesRepEmployeeNumber`),
  CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`salesRepEmployeeNumber`) REFERENCES `employees` (`employeeNumber`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Minh Anh','Nguyen Hoang','Minh Anh','08533998780','Kim Chung, Hoai Duc , Ha Noi',NULL,'Ha Noi',NULL,NULL,'Vietnam',4,NULL,'2023-05-31 03:48:34','2023-05-31 03:48:34'),(3,'Phuong','Nguyen Thi','Phuong','085339987812','Kim Chung, Hoai Duc , Ha Noi',NULL,'Ha Noi',NULL,NULL,'Vietnam',5,NULL,'2023-05-31 04:12:16','2023-05-31 04:12:16'),(4,'Phuong Lan','Nguyen Thi','Phuong Lan','085339987813','Kim Chung, Hoai Duc , Ha Noi',NULL,'Ha Noi',NULL,NULL,'Vietnam',5,NULL,'2023-05-31 09:04:51','2023-05-31 09:04:51'),(5,'Phuong Thu','Nguyen Thi','Phuong Thu','085339987823','Kim Chung, Hoai Duc , Ha Noi',NULL,'Ha Noi',NULL,NULL,'Vietnam',4,NULL,'2023-05-31 09:07:10','2023-05-31 09:07:10'),(6,'Phuong Ha','Nguyen Thi','Phuong Ha','085339987823','Kim Chung, Hoai Duc , Ha Noi',NULL,'Ha Noi',NULL,NULL,'Vietnam',5,NULL,'2023-05-31 09:29:35','2023-05-31 09:29:35'),(7,'Ngoc Lan','Nguyen Thi','Ngoc Lan','085339987819','Cau Giay ,Ha Noi',NULL,'Ha Noi',NULL,NULL,'Vietnam',4,NULL,'2023-06-04 11:33:43','2023-06-04 11:33:43'),(9,'Ngoc Khang','Nguyen Thanh','Ngoc Khang','085339987811','Ha Dong ,Ha Noi',NULL,'Ha Noi',NULL,NULL,'Vietnam',5,NULL,'2023-06-04 11:38:54','2023-06-04 11:40:38');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `employeeNumber` int NOT NULL AUTO_INCREMENT,
  `lastName` varchar(50) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `extension` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `officeCode` varchar(10) NOT NULL,
  `reportsTo` int DEFAULT NULL,
  `jobTitle` varchar(255) NOT NULL,
  `roleId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`employeeNumber`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'Khanh','Nguyen Van','c123','vankhanh@gmail.com','124',NULL,'President',1,'2023-05-31 03:14:07','2023-05-31 07:31:39'),(2,'Dung','Tran Van','c123','vankhanh@gmail.com','124',1,'Manager',2,'2023-05-31 03:14:49','2023-05-31 07:34:00'),(3,'Minh','Hoang Dai','c123','vankhanh@gmail.com','124',12,'Leader',3,'2023-05-31 03:15:26','2023-05-31 03:15:26'),(4,'Dang','Hoang Hai','c123','vankhanh@gmail.com','124',2,'Staff',4,'2023-05-31 03:15:43','2023-05-31 07:29:50'),(5,'Chung','Tran Van','c123','vankhanh@gmail.com','123',12,'Staff',4,'2023-05-31 04:03:03','2023-05-31 04:03:03'),(6,'Thai','Pham Van','c123','vanthui@gmail.com','123',12,'Staff',4,'2023-06-01 03:03:09','2023-06-01 03:03:40');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Roles_role_unique` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'President','2023-05-31 03:13:40','2023-05-31 03:13:40'),(2,'Manager','2023-05-31 03:13:47','2023-05-31 03:13:47'),(3,'Leader','2023-05-31 03:13:52','2023-05-31 03:13:52'),(4,'Staff','2023-05-31 03:13:58','2023-05-31 03:13:58');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `username` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `employeeNumber` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `Users_employeeNumber_unique` (`employeeNumber`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`employeeNumber`) REFERENCES `employees` (`employeeNumber`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('hoangdang123','$2b$10$w8TP1DIpjXx3P0KFEw8TJ.1fbLooNoGBoYlqu2zHDEvk..9nDDcKG',4,'2023-05-31 03:29:26','2023-05-31 03:29:26'),('hoangminh123','$2b$10$co.VcfpOpJ5AiALZB2z1WOwEO.8LhSW3WOu8WeSYzgu7z/ifuDBK6',3,'2023-05-31 03:29:17','2023-05-31 03:29:17'),('nguyenchung123','$2b$10$yiTTn0T3mTexahw4DAIP4eKAAaMurjwCtb6WVdp1ti6YEDqjap4j6',5,'2023-05-31 04:03:48','2023-05-31 04:03:48'),('nguyenkhanh123','$2b$10$0ZEmXOZ7ZPAMw2T4XtVypOU.ikBve/d85vtP/2InXhX3GBSg2eJXy',1,'2023-05-31 03:23:59','2023-05-31 03:23:59'),('trandung123','$2b$10$po5PUEKDe7aNcSdE02Hgb.JvsXjK3EHHJku9axEe2srUXs3T3SEpu',2,'2023-05-31 03:28:56','2023-05-31 03:28:56');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-08 14:22:28
