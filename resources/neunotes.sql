CREATE DATABASE  IF NOT EXISTS `neunotes3` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `neunotes3`;
-- MySQL dump 10.13  Distrib 8.0.40, for macos14 (arm64)
--
-- Host: localhost    Database: neunotes3
-- ------------------------------------------------------
-- Server version	9.1.0

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
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) NOT NULL,
  `action` varchar(255) NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `activities_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (1,'7ad8035e-b804-4972-b84e-bb0528f61bb3','User registered','2025-04-18 03:59:14'),(2,'7ad8035e-b804-4972-b84e-bb0528f61bb3','User logged in','2025-04-18 03:59:33'),(3,'7ad8035e-b804-4972-b84e-bb0528f61bb3','User logged in','2025-04-18 04:08:22'),(4,'7efaf7b0-93a8-4e6e-a16d-1493839adc1a','User registered','2025-04-18 04:09:43'),(5,'7efaf7b0-93a8-4e6e-a16d-1493839adc1a','User logged in','2025-04-18 04:09:51'),(6,'7efaf7b0-93a8-4e6e-a16d-1493839adc1a','User logged in','2025-04-18 04:12:34'),(7,'7ad8035e-b804-4972-b84e-bb0528f61bb3','User logged in','2025-04-18 04:13:59'),(8,'7efaf7b0-93a8-4e6e-a16d-1493839adc1a','User logged in','2025-04-18 04:14:11'),(9,'7efaf7b0-93a8-4e6e-a16d-1493839adc1a','Created category: asdas','2025-04-18 04:14:14'),(10,'7efaf7b0-93a8-4e6e-a16d-1493839adc1a','Created subcategory: asdasd','2025-04-18 04:14:19'),(11,'7efaf7b0-93a8-4e6e-a16d-1493839adc1a','Created subcategory: asdasd','2025-04-18 04:14:19'),(12,'7efaf7b0-93a8-4e6e-a16d-1493839adc1a','Uploaded note: akmdasd.pdf','2025-04-18 04:14:32'),(13,'7efaf7b0-93a8-4e6e-a16d-1493839adc1a','Added note to favorites','2025-04-18 04:14:34'),(14,'7efaf7b0-93a8-4e6e-a16d-1493839adc1a','Rated upload #1 with 5 stars','2025-04-18 04:14:38'),(15,'7efaf7b0-93a8-4e6e-a16d-1493839adc1a','Commented on upload #1','2025-04-18 04:14:39'),(16,'7efaf7b0-93a8-4e6e-a16d-1493839adc1a','Commented on upload #1','2025-04-18 04:14:41'),(17,'7efaf7b0-93a8-4e6e-a16d-1493839adc1a','Created tag: ADsd','2025-04-18 04:14:45'),(18,'7efaf7b0-93a8-4e6e-a16d-1493839adc1a','Added tag \"ADsd\" to a note','2025-04-18 04:14:45'),(19,'7efaf7b0-93a8-4e6e-a16d-1493839adc1a','Deleted category: asdas','2025-04-18 04:15:16'),(20,'60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','User registered','2025-04-18 04:25:40'),(21,'60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','User logged in','2025-04-18 04:25:49'),(22,'7efaf7b0-93a8-4e6e-a16d-1493839adc1a','Updated user role for ap@gmail.com to FACULTY','2025-04-18 04:26:09'),(23,'60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','User logged in','2025-04-18 04:27:57'),(24,'60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','Created category: Computer Science','2025-04-18 04:28:05'),(25,'60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','Created category: Algorithm 5800','2025-04-18 04:28:23'),(26,'60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','Created category: PDP CS5100','2025-04-18 04:28:52'),(27,'60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','Updated category: PDP CS5100','2025-04-18 04:28:56'),(28,'60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','Created category: DBMS 5200','2025-04-18 04:29:51'),(29,'7efaf7b0-93a8-4e6e-a16d-1493839adc1a','Created category: Fundamental of Cloud Computing CS6620','2025-04-18 04:33:18'),(30,'60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','Created subcategory: Week - 1 Structure of the Course','2025-04-18 04:36:47'),(31,'60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','Created subcategory: Week - 1 Structure of the Course','2025-04-18 04:36:47'),(32,'7ad8035e-b804-4972-b84e-bb0528f61bb3','User logged in','2025-04-18 04:37:12'),(33,'7ad8035e-b804-4972-b84e-bb0528f61bb3','Updated profile information','2025-04-18 04:50:34'),(34,'7dbe788e-a3c8-40c6-8d6f-ad82c2a51bcb','User registered','2025-04-18 05:28:04'),(35,'7dbe788e-a3c8-40c6-8d6f-ad82c2a51bcb','User logged in','2025-04-18 05:28:15'),(36,'7efaf7b0-93a8-4e6e-a16d-1493839adc1a','Updated user role for db@gmail.com to FACULTY','2025-04-18 05:28:59'),(37,'7dbe788e-a3c8-40c6-8d6f-ad82c2a51bcb','User logged in','2025-04-18 05:29:30'),(38,'7ad8035e-b804-4972-b84e-bb0528f61bb3','User logged in','2025-04-18 05:30:27'),(39,'60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','Created category: DBMS3','2025-04-18 05:30:47'),(40,'60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','Created subcategory: Week - 3','2025-04-18 05:31:00'),(41,'60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','Created subcategory: Week - 3','2025-04-18 05:31:00'),(42,'7ad8035e-b804-4972-b84e-bb0528f61bb3','Enrolled in category: DBMS3','2025-04-18 05:31:21'),(43,'60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','Uploaded note: Achyut_katiyar_Resume.pdf','2025-04-18 05:32:22'),(44,'7ad8035e-b804-4972-b84e-bb0528f61bb3','Uploaded note: Achyut_Katiyar_Event_Coordinator_Resume.pdf','2025-04-18 05:32:48'),(45,'7ad8035e-b804-4972-b84e-bb0528f61bb3','Added note to favorites','2025-04-18 05:33:02'),(46,'7ad8035e-b804-4972-b84e-bb0528f61bb3','Rated upload #3 with 5 stars','2025-04-18 05:33:06'),(47,'60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','Rated upload #3 with 4 stars','2025-04-18 05:33:44'),(48,'7ad8035e-b804-4972-b84e-bb0528f61bb3','Created tag: DBMS','2025-04-18 05:34:02'),(49,'7ad8035e-b804-4972-b84e-bb0528f61bb3','Added tag \"DBMS\" to a note','2025-04-18 05:34:02'),(50,'7ad8035e-b804-4972-b84e-bb0528f61bb3','Commented on upload #3','2025-04-18 05:34:10');
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(6) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(512) DEFAULT NULL,
  `created_by` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `subcategory_count` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (2,'COM223','Computer Science','https://miro.medium.com/v2/resize:fit:1080/1*02hVPjwDvp2-oQQUXNimXA@2x.jpeg','60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','2025-04-18 04:28:05',0),(3,'ALG973','Algorithm 5800','https://www.computersciencedegreehub.com/wp-content/uploads/2021/10/algorithm-specialist.jpg','60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','2025-04-18 04:28:23',0),(4,'PDP497','PDP CS5100','https://miro.medium.com/v2/resize:fit:750/0*hL-usWd0WA_PzX6H.jpg','60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','2025-04-18 04:28:52',0),(5,'DBM364','DBMS 5200','https://cdn.hackr.io/uploads/topics_svg/1510809253n0FxvPZURP.svg','60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','2025-04-18 04:29:51',1),(6,'FUN763','CC CS6620','https://cdn.sanity.io/images/tlr8oxjg/production/ed1c7038238cbf0914ff4d18d0207964bc63cf14-1280x890.png?w=1920&q=95&fit=clip&auto=format','7efaf7b0-93a8-4e6e-a16d-1493839adc1a','2025-04-18 04:33:18',0),(7,'DBM229','DBMS3',NULL,'60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','2025-04-18 05:30:47',1);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `upload_id` int NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `upload_id` (`upload_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`upload_id`) REFERENCES `uploads` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (3,3,'7ad8035e-b804-4972-b84e-bb0528f61bb3','Great Note!','2025-04-18 05:34:10');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_comment_insert` AFTER INSERT ON `comments` FOR EACH ROW BEGIN
    UPDATE uploads SET
        comment_count = (SELECT COUNT(*) FROM comments WHERE upload_id = NEW.upload_id)
    WHERE id = NEW.upload_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_comment_delete` AFTER DELETE ON `comments` FOR EACH ROW BEGIN
    UPDATE uploads SET
        comment_count = (SELECT COUNT(*) FROM comments WHERE upload_id = OLD.upload_id)
    WHERE id = OLD.upload_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(36) NOT NULL,
  `category_id` int NOT NULL,
  `enrolled_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_id` (`student_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
INSERT INTO `enrollments` VALUES (1,'7ad8035e-b804-4972-b84e-bb0528f61bb3',7,'2025-04-18 05:31:21');
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) NOT NULL,
  `upload_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`upload_id`),
  KEY `upload_id` (`upload_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`upload_id`) REFERENCES `uploads` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (2,'7ad8035e-b804-4972-b84e-bb0528f61bb3',3,'2025-04-18 05:33:02');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file_metadata`
--

DROP TABLE IF EXISTS `file_metadata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file_metadata` (
  `id` int NOT NULL AUTO_INCREMENT,
  `upload_id` int NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_type` varchar(100) NOT NULL,
  `file_size` int NOT NULL,
  `file_url` varchar(512) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `upload_id` (`upload_id`),
  CONSTRAINT `file_metadata_ibfk_1` FOREIGN KEY (`upload_id`) REFERENCES `uploads` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file_metadata`
--

LOCK TABLES `file_metadata` WRITE;
/*!40000 ALTER TABLE `file_metadata` DISABLE KEYS */;
INSERT INTO `file_metadata` VALUES (2,2,'Achyut_katiyar_Resume.pdf','application/pdf',119624,'/uploads/1744954342189-Achyut_katiyar_Resume.pdf',NULL),(3,3,'Achyut_Katiyar_Event_Coordinator_Resume.pdf','application/pdf',105212,'/uploads/1744954368311-Achyut_Katiyar_Event_Coordinator_Resume.pdf',NULL);
/*!40000 ALTER TABLE `file_metadata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `note_tags`
--

DROP TABLE IF EXISTS `note_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `note_tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `upload_id` int NOT NULL,
  `tag_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `upload_id` (`upload_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `note_tags_ibfk_1` FOREIGN KEY (`upload_id`) REFERENCES `uploads` (`id`) ON DELETE CASCADE,
  CONSTRAINT `note_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `note_tags`
--

LOCK TABLES `note_tags` WRITE;
/*!40000 ALTER TABLE `note_tags` DISABLE KEYS */;
INSERT INTO `note_tags` VALUES (2,3,2,'2025-04-18 05:34:02');
/*!40000 ALTER TABLE `note_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) NOT NULL,
  `upload_id` int NOT NULL,
  `rating` tinyint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`upload_id`),
  KEY `upload_id` (`upload_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`upload_id`) REFERENCES `uploads` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
INSERT INTO `ratings` VALUES (2,'7ad8035e-b804-4972-b84e-bb0528f61bb3',3,5,'2025-04-18 05:33:06','2025-04-18 05:33:06'),(3,'60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5',3,4,'2025-04-18 05:33:44','2025-04-18 05:33:44');
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_rating_insert` AFTER INSERT ON `ratings` FOR EACH ROW BEGIN
    UPDATE uploads SET
        average_rating = (SELECT AVG(rating) FROM ratings WHERE upload_id = NEW.upload_id),
        rating_count = (SELECT COUNT(*) FROM ratings WHERE upload_id = NEW.upload_id)
    WHERE id = NEW.upload_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_rating_update` AFTER UPDATE ON `ratings` FOR EACH ROW BEGIN
    UPDATE uploads SET
        average_rating = (SELECT AVG(rating) FROM ratings WHERE upload_id = NEW.upload_id),
        rating_count = (SELECT COUNT(*) FROM ratings WHERE upload_id = NEW.upload_id)
    WHERE id = NEW.upload_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_rating_delete` AFTER DELETE ON `ratings` FOR EACH ROW BEGIN
    UPDATE uploads SET
        average_rating = IFNULL((SELECT AVG(rating) FROM ratings WHERE upload_id = OLD.upload_id), 0),
        rating_count = (SELECT COUNT(*) FROM ratings WHERE upload_id = OLD.upload_id)
    WHERE id = OLD.upload_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `subcategories`
--

DROP TABLE IF EXISTS `subcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category_id` int NOT NULL,
  `created_by` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `file_count` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `subcategories_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategories`
--

LOCK TABLES `subcategories` WRITE;
/*!40000 ALTER TABLE `subcategories` DISABLE KEYS */;
INSERT INTO `subcategories` VALUES (2,'Week - 1 Structure of the Course',5,'60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','2025-04-18 04:36:47',0),(3,'Week - 3',7,'60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','2025-04-18 05:31:00',0);
/*!40000 ALTER TABLE `subcategories` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_subcategory_insert` AFTER INSERT ON `subcategories` FOR EACH ROW BEGIN
    UPDATE categories
    SET subcategory_count = (
        SELECT COUNT(*) FROM subcategories WHERE category_id = NEW.category_id
    )
    WHERE id = NEW.category_id;
    
    INSERT INTO activities (user_id, action)
    VALUES (NEW.created_by, CONCAT('Created subcategory: ', NEW.name));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_subcategory_delete` AFTER DELETE ON `subcategories` FOR EACH ROW BEGIN
    UPDATE categories
    SET subcategory_count = (
        SELECT COUNT(*) FROM subcategories WHERE category_id = OLD.category_id
    )
    WHERE id = OLD.category_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `created_by` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'ADsd','7efaf7b0-93a8-4e6e-a16d-1493839adc1a','2025-04-18 04:14:45'),(2,'DBMS','7ad8035e-b804-4972-b84e-bb0528f61bb3','2025-04-18 05:34:02');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uploads`
--

DROP TABLE IF EXISTS `uploads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uploads` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uploaded_by` varchar(36) NOT NULL,
  `subcategory_id` int DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `file_data` longblob,
  `average_rating` decimal(3,2) DEFAULT '0.00',
  `rating_count` int DEFAULT '0',
  `comment_count` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `subcategory_id` (`subcategory_id`),
  KEY `uploaded_by` (`uploaded_by`),
  CONSTRAINT `uploads_ibfk_1` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `uploads_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uploads`
--

LOCK TABLES `uploads` WRITE;
/*!40000 ALTER TABLE `uploads` DISABLE KEYS */;
INSERT INTO `uploads` VALUES (2,'60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5',3,'2025-04-18 05:32:22',NULL,0.00,0,0),(3,'7ad8035e-b804-4972-b84e-bb0528f61bb3',3,'2025-04-18 05:32:48',NULL,4.50,2,1);
/*!40000 ALTER TABLE `uploads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','FACULTY','STUDENT') DEFAULT 'STUDENT',
  `status` enum('Undergraduate','Graduate') DEFAULT 'Undergraduate',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('60b214e7-0ad0-456c-a7dc-3c6b2e54d1f5','Anand','Pinannamaneni','ap@gmail.com','123456789','FACULTY','Undergraduate','2025-04-18 04:25:40'),('7ad8035e-b804-4972-b84e-bb0528f61bb3','A','k','ak@gmail.com','123456789','STUDENT','Undergraduate','2025-04-18 03:59:14'),('7dbe788e-a3c8-40c6-8d6f-ad82c2a51bcb','D','B','db@gmail.com','123456','FACULTY','Undergraduate','2025-04-18 05:28:04'),('7efaf7b0-93a8-4e6e-a16d-1493839adc1a','Achyut','Katiyar','achyutkatiyar21@gmail.com','123456789','ADMIN','Undergraduate','2025-04-18 04:09:43');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'neunotes3'
--

--
-- Dumping routines for database 'neunotes3'
--
/*!50003 DROP FUNCTION IF EXISTS `generate_category_code` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `generate_category_code`(name VARCHAR(255)) RETURNS varchar(6) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
    DECLARE code VARCHAR(6);
    SET code = CONCAT(UPPER(LEFT(name, 3)), LPAD(FLOOR(RAND() * 900) + 100, 3, '0'));
    RETURN code;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `add_comment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_comment`(
    IN p_user_id VARCHAR(36),
    IN p_upload_id INT,
    IN p_content TEXT,
    OUT p_comment_id INT
)
BEGIN
    -- Validate content
    IF LENGTH(TRIM(p_content)) = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Comment content cannot be empty';
    END IF;
    
    -- Insert comment
    INSERT INTO comments (upload_id, user_id, content)
    VALUES (p_upload_id, p_user_id, p_content);
    
    SET p_comment_id = LAST_INSERT_ID();
    
    -- Log activity
    INSERT INTO activities (user_id, action)
    VALUES (p_user_id, CONCAT('Commented on upload #', p_upload_id));
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `add_or_update_rating` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_or_update_rating`(
    IN p_user_id VARCHAR(36),
    IN p_upload_id INT,
    IN p_rating INT,
    OUT p_rating_id INT,
    OUT p_is_new BOOLEAN
)
BEGIN
    DECLARE existing_id INT DEFAULT NULL;
    
    -- Validate rating
    IF p_rating < 1 OR p_rating > 5 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Rating must be between 1 and 5';
    END IF;
    
    -- Check if user already rated this note
    SELECT id INTO existing_id
    FROM ratings
    WHERE user_id = p_user_id AND upload_id = p_upload_id;
    
    IF existing_id IS NOT NULL THEN
        -- Update existing rating
        UPDATE ratings 
        SET rating = p_rating, updated_at = CURRENT_TIMESTAMP 
        WHERE id = existing_id;
        
        SET p_rating_id = existing_id;
        SET p_is_new = FALSE;
        
        -- Log activity
        INSERT INTO activities (user_id, action)
        VALUES (p_user_id, CONCAT('Updated rating for upload #', p_upload_id, ' to ', p_rating, ' stars'));
    ELSE
        -- Create new rating
        INSERT INTO ratings (user_id, upload_id, rating)
        VALUES (p_user_id, p_upload_id, p_rating);
        
        SET p_rating_id = LAST_INSERT_ID();
        SET p_is_new = TRUE;
        
        -- Log activity
        INSERT INTO activities (user_id, action)
        VALUES (p_user_id, CONCAT('Rated upload #', p_upload_id, ' with ', p_rating, ' stars'));
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `create_category` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `create_category`(
    IN p_name VARCHAR(255),
    IN p_image VARCHAR(512),
    IN p_created_by VARCHAR(36),
    OUT p_id INT,
    OUT p_code VARCHAR(6)
)
BEGIN
    -- Generate a unique code
    SET p_code = generate_category_code(p_name);
    
    -- Insert the category
    INSERT INTO categories (code, name, image, created_by)
    VALUES (p_code, p_name, p_image, p_created_by);
    
    -- Return the created ID
    SET p_id = LAST_INSERT_ID();
    
    -- Log the activity
    INSERT INTO activities (user_id, action)
    VALUES (p_created_by, CONCAT('Created category: ', p_name));
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-18  1:49:11
