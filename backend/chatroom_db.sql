CREATE DATABASE  IF NOT EXISTS `chatroom_db` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `chatroom_db`;
-- MariaDB dump 10.17  Distrib 10.4.10-MariaDB, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: chatroom_db
-- ------------------------------------------------------
-- Server version	10.4.10-MariaDB

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
-- Table structure for table `cr_private`
--

DROP TABLE IF EXISTS `cr_private`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cr_private` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ufrom` int(11) NOT NULL,
  `uto` int(11) NOT NULL,
  `content` text NOT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ufrom` (`ufrom`),
  KEY `uto` (`uto`),
  CONSTRAINT `ufrom` FOREIGN KEY (`ufrom`) REFERENCES `cr_user` (`id`),
  CONSTRAINT `uto` FOREIGN KEY (`uto`) REFERENCES `cr_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cr_private`
--

LOCK TABLES `cr_private` WRITE;
/*!40000 ALTER TABLE `cr_private` DISABLE KEYS */;
INSERT INTO `cr_private` VALUES (1,2,1,'aaa对test说话',0),(2,1,2,'test对aaa说话',1),(3,2,1,'你好啊',1576944993793),(4,1,2,'不理我？',1576945095850),(5,1,2,'你好啊',1576945184809),(6,2,1,'你好',1576945304769),(7,2,1,'你好呀',1576945324315),(8,2,1,'搞不懂',1576945526897),(9,1,1,'防守打法',1576945728231),(10,2,2,'和自己说话',1576945779333),(11,1,1,'哈哈哈',1576945786214),(12,1,2,'发的说法是否为',1576945799019);
/*!40000 ALTER TABLE `cr_private` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cr_public`
--

DROP TABLE IF EXISTS `cr_public`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cr_public` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `content` text NOT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `uid` (`userid`),
  CONSTRAINT `uid` FOREIGN KEY (`userid`) REFERENCES `cr_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cr_public`
--

LOCK TABLES `cr_public` WRITE;
/*!40000 ALTER TABLE `cr_public` DISABLE KEYS */;
INSERT INTO `cr_public` VALUES (1,1,'测试内容',0),(2,3,'哈哈啊啊',1),(3,3,'哈哈',1),(4,2,'测试',1576937874786),(5,2,'测试2',1576937954369),(6,4,'测试3',1576938082428),(7,1,'kkk',1576938370085),(8,1,'测测',1576938477060),(9,2,'偶遇',1576945538529),(10,2,'iiirwer我撒旦法啊',1576945571263);
/*!40000 ALTER TABLE `cr_public` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cr_user`
--

DROP TABLE IF EXISTS `cr_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cr_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `nickname` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `sex` varchar(5) NOT NULL,
  `age` int(11) NOT NULL,
  `hobby` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cr_user`
--

LOCK TABLES `cr_user` WRITE;
/*!40000 ALTER TABLE `cr_user` DISABLE KEYS */;
INSERT INTO `cr_user` VALUES (1,'test','测试','123456','男',20,'编程'),(2,'aaa','小明','123','男',18,'跑步'),(3,'bbb','小红','123','女',18,'听歌'),(4,'ccc','呵呵','123','男',18,'666');
/*!40000 ALTER TABLE `cr_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-12-22  0:53:31
