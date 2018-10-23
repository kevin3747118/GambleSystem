-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: gamble
-- ------------------------------------------------------
-- Server version	5.7.17-log

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
  `bet` json NOT NULL COMMENT '{''G1'': ''BOS'', ''G2'': ''MIL'', ''G3'': ''BOS}\n{''G1'': ''MIL''}\n{''G1'': ''BOS'', ''G2'': ''MIL''}',
  `money` int(11) NOT NULL,
  `totaloddperset` float NOT NULL,
  `status` int(11) NOT NULL,
  `createdate` datetime NOT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `_id_UNIQUE` (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bets`
--

LOCK TABLES `bets` WRITE;
/*!40000 ALTER TABLE `bets` DISABLE KEYS */;
/*!40000 ALTER TABLE `bets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bets2`
--

DROP TABLE IF EXISTS `bets2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bets2` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(45) NOT NULL,
  `nickname` varchar(45) DEFAULT NULL,
  `combination` int(11) NOT NULL,
  `game1id` varchar(8) NOT NULL,
  `game2id` varchar(8) DEFAULT NULL,
  `bet1` varchar(8) NOT NULL,
  `bet2` varchar(8) DEFAULT NULL,
  `money` int(11) NOT NULL,
  `totaloddperset` float NOT NULL,
  `status` int(11) NOT NULL,
  `createdate` datetime NOT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `_id_UNIQUE` (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bets2`
--

LOCK TABLES `bets2` WRITE;
/*!40000 ALTER TABLE `bets2` DISABLE KEYS */;
INSERT INTO `bets2` VALUES (1,'jay.tblink@gmail.com','杰哥',1,'G1','','LAD','',200,1.5,0,'2018-10-15 00:00:00'),(2,'jay.tblink@gmail.com','杰哥',2,'G1','G2','LAD','HOU',800,2.78,0,'2018-10-15 00:00:00'),(3,'jay.tblink@gmail.com','杰哥',1,'G2','','HOU','',1000,1.85,0,'2018-10-15 00:00:00'),(4,'jay.tblink@gmail.com','杰哥',1,'G2','','HOU','',1000,1.85,0,'2018-10-15 00:00:00'),(5,'jay.tblink@gmail.com','杰哥',1,'G1','','LAD','',850,1.5,0,'2018-10-15 00:00:00'),(6,'kevin','kevin',1,'G1','','LAD','',200,1.5,0,'2018-10-15 00:00:00');
/*!40000 ALTER TABLE `bets2` ENABLE KEYS */;
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
INSERT INTO `logins` VALUES ('123','$2a$10$8w42R8T2hyFPzoblUAEnMuezRsBjr0KYXgDzov5R9mBGKdg4mCx5S','123',''),('jay.tblink@gmail.com','$2a$10$ex50oa8TtA29skG9enBF.u0TiSB9KwVcfI27Kx.mJDtge8Muhurz2','杰哥',''),('kevin','$2a$10$7/S/TC/S8EcczLaBHBnGierwi6I2fjQw/s0l7HWZ./M87.wA09OXa','kevin',''),('markchu33','$2a$10$mDZmCBwDeVeq1FuGUqHM7eSUdwAPdo5eesNc8gc6tERxsX/KTE4mO','master chu',''),('swanson','$2a$10$YjWbNmhlULJIWCSqlBwAZeEOeePD2xgR3aWrksAreP47xUbXbqGu.','HANDSOME',''),('tiger','$2a$10$tkSlo76ORC3prqoEBKfEE.GnQaBmJ1rciXpK1D9cKC0oPZMVDoxgW','tiger',''),('tigeree','$2a$10$oyzr4UxzoZWsVDW2RESsJu4A.5uoLizsazjOVanCfdsHZ6Of0wLNC','123',''),('tigerf','$2a$10$uWOKtrVthHfTSSdHnxZPy.kQvQ4dkBPN2ZrZLXVSgNXZ4Xsc9lVd6','233','');
/*!40000 ALTER TABLE `logins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiger_game`
--

DROP TABLE IF EXISTS `tiger_game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tiger_game` (
  `gameid` varchar(20) NOT NULL,
  `gamename` varchar(20) DEFAULT NULL,
  `gamedate` datetime DEFAULT NULL,
  `createdate` datetime DEFAULT NULL,
  PRIMARY KEY (`gameid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiger_game`
--

LOCK TABLES `tiger_game` WRITE;
/*!40000 ALTER TABLE `tiger_game` DISABLE KEYS */;
INSERT INTO `tiger_game` VALUES ('G10','BOS vs. HOU','2018-10-18 00:00:00','2018-10-17 00:00:00'),('G100','MLB World Champion','9999-12-31 00:00:00','2018-10-17 00:00:00'),('G20','MIL vs. LAD','2018-10-18 00:00:00','2018-10-17 00:00:00'),('G50','ALDS','9999-12-31 00:00:00','2018-10-17 00:00:00'),('G60','NLDS','9999-12-31 00:00:00','2018-10-17 00:00:00');
/*!40000 ALTER TABLE `tiger_game` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiger_game_option`
--

DROP TABLE IF EXISTS `tiger_game_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tiger_game_option` (
  `optid` varchar(20) DEFAULT NULL,
  `gameid` varchar(20) DEFAULT NULL,
  `optname` varchar(20) DEFAULT NULL,
  `optodd` float DEFAULT NULL,
  `optmsg` varchar(80) DEFAULT NULL,
  `status` int(11) DEFAULT NULL COMMENT 'win ? 1 : 0',
  `createdate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiger_game_option`
--

LOCK TABLES `tiger_game_option` WRITE;
/*!40000 ALTER TABLE `tiger_game_option` DISABLE KEYS */;
INSERT INTO `tiger_game_option` VALUES ('G10BOS','G10','Boston Red Sox',2.05,'Rick Porcello  17W7L  4.28ERA',1,'2018-10-17 23:45:44'),('G10HOU','G10','Huston Astros',1.5,'Charles Morton  15W3L  3.13ERA',0,'2018-10-17 23:45:44'),('G20MIL','G20','Milwaukee Brewers',2.3,'Wade Miley  5W2L  2.57ERA',1,'2018-10-17 23:45:44'),('G20LAD','G20','Los Angeles Dodgers',1.4,'Clayton Kershaw  9W5L  2.73ERA',0,'2018-10-17 23:45:44'),('G50HOU','G50','Huston Astros',2.15,'',0,'2018-10-17 23:45:44'),('G50BOS','G50','Boston Red Sox',1.45,'',1,'2018-10-17 23:45:44'),('G60LAD','G60','Los Angeles Dodgers',1.45,'',1,'2018-10-17 23:45:44'),('G60MIL','G60','Milwaukee Brewers',2.15,'',0,'2018-10-17 23:45:44'),('G100HOU','G100','HOU',3.25,'去年世界冠軍!!',1,'2018-10-17 23:45:44'),('G100BOS','G100','BOS',2.25,'',0,'2018-10-17 23:45:44'),('G100MIL','G100','MIL',4.25,'YELICH大爆發',0,'2018-10-17 23:45:44'),('G100LAD','G100','LAD',3.1,'',0,'2018-10-17 23:45:44');
/*!40000 ALTER TABLE `tiger_game_option` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiger_user_bet`
--

DROP TABLE IF EXISTS `tiger_user_bet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tiger_user_bet` (
  `betid` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(20) DEFAULT NULL,
  `combination` varchar(10) DEFAULT NULL,
  `money` int(11) DEFAULT NULL,
  `odd` float DEFAULT NULL,
  `createdate` datetime DEFAULT NULL,
  PRIMARY KEY (`betid`),
  UNIQUE KEY `betid_UNIQUE` (`betid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiger_user_bet`
--

LOCK TABLES `tiger_user_bet` WRITE;
/*!40000 ALTER TABLE `tiger_user_bet` DISABLE KEYS */;
INSERT INTO `tiger_user_bet` VALUES (1,'kevin','2',100,4.71,'2018-10-18 09:19:39'),(2,'kevin','2',100,0,'2018-10-18 09:19:54');
/*!40000 ALTER TABLE `tiger_user_bet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiger_user_bet_option`
--

DROP TABLE IF EXISTS `tiger_user_bet_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tiger_user_bet_option` (
  `betid` int(11) DEFAULT NULL,
  `optid` varchar(20) DEFAULT NULL,
  `optodd` float DEFAULT NULL,
  `createdate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiger_user_bet_option`
--

LOCK TABLES `tiger_user_bet_option` WRITE;
/*!40000 ALTER TABLE `tiger_user_bet_option` DISABLE KEYS */;
INSERT INTO `tiger_user_bet_option` VALUES (1,'G10BOS',2.05,'2018-10-18 09:19:39'),(1,'G20MIL',2.3,'2018-10-18 09:19:39'),(2,'G100BOS',2.25,'2018-10-18 09:19:54');
/*!40000 ALTER TABLE `tiger_user_bet_option` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-10-18 14:17:58
