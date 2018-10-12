-- MySQL dump 10.13  Distrib 5.7.23, for osx10.13 (x86_64)
--
-- Host: 127.0.0.1    Database: gamble
-- ------------------------------------------------------
-- Server version	5.7.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bets`
--

DROP TABLE IF EXISTS `bets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bets` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(45) NOT NULL,
  `nickname` varchar(45) DEFAULT NULL,
  `combination` int(11) NOT NULL,
  `bet1` varchar(45) NOT NULL,
  `bet2` varchar(45) NOT NULL,
  `money` int(11) NOT NULL,
  `totaloddperset` float NOT NULL,
  `status` int(11) NOT NULL,
  `createdate` datetime NOT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `_id_UNIQUE` (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bets`
--

LOCK TABLES `bets` WRITE;
/*!40000 ALTER TABLE `bets` DISABLE KEYS */;
INSERT INTO `bets` VALUES (1,'kevin','雨刷買一送一',1,'BOS','',100,1.7,1,'2018-10-12 00:00:00'),(2,'kevin','雨刷買一送一',2,'BOS','LAD',100,2.125,0,'2018-10-14 00:00:00'),(4,'kevin3747118@outlook.com','ha',1,'BOS','',500,2.45,1,'2018-10-23 00:00:00'),(5,'kevin3747118@outlook.com','ha',1,'BOS','',5000,2.45,1,'2018-10-23 00:00:00'),(6,'kevin3747118@outlook.com','tony',2,'BOS','MIL',10,2.12,1,'2018-10-23 00:00:00'),(7,'kevin3747118@outlook.com','vincent',2,'BOS','MIL',10,2.4,1,'2018-10-23 00:00:00'),(8,'kevin3747118@outlook.com','vincent',1,'BOS','',100,1.1,1,'2018-10-23 00:00:00'),(9,'ke','vincent',1,'MIL','',100,1.5,0,'2018-10-23 00:00:00');
/*!40000 ALTER TABLE `bets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `games` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `gameid` varchar(10) NOT NULL,
  `teamname` varchar(45) NOT NULL,
  `sp` varchar(45) NOT NULL,
  `court` varchar(4) NOT NULL,
  `oddperset` float NOT NULL,
  `gamedate` datetime NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `_id_UNIQUE` (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,'G1','MIL','Gio Gonzalez','Home',2.05,'2018-10-13 00:00:00','0'),(2,'G1','LAD','Clayton Kershaw','Away',1.5,'2018-10-13 00:00:00','0'),(3,'G2','BOS','Chris Sale','Home',1.65,'2018-10-14 00:00:00','0'),(4,'G2','HOU','Justin Verlander','Away',1.85,'2018-10-14 00:00:00','0');
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logins`
--

DROP TABLE IF EXISTS `logins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `logins` (
  `_id` varchar(45) NOT NULL,
  `password` varchar(100) NOT NULL,
  `nickname` varchar(45) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `_id_UNIQUE` (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logins`
--

LOCK TABLES `logins` WRITE;
/*!40000 ALTER TABLE `logins` DISABLE KEYS */;
INSERT INTO `logins` VALUES ('kevin3747118@outlook.com','$2a$10$8aHQersGrEkD8MlSCC3K/erwFN2CSQyPOK4Ksiu6C6sRNKqvG5azy','測試','');
/*!40000 ALTER TABLE `logins` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-10-12 22:22:34
