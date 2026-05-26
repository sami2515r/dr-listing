-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 26, 2026 at 05:01 AM
-- Server version: 8.4.7
-- PHP Version: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `listing_dir`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_image` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_id` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `phone`, `profile_image`, `status`, `created_id`, `created_at`, `updated_id`, `updated_at`) VALUES
(1, 'Super Admin\r\n', 'admin@gmail.com', '$2y$10$jc/cW5vybJEBph/8a.wzwO5K2JGHiOUSetXNUTP8YFHAS7.VS1vjS', '9999999999', '', 1, NULL, '2026-05-15 10:45:42', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `degrees`
--

DROP TABLE IF EXISTS `degrees`;
CREATE TABLE IF NOT EXISTS `degrees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `institute_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `year_of_passing` int NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `created_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_id` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `degree_id` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `degree_id` (`degree_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `degrees`
--

INSERT INTO `degrees` (`id`, `doctor_id`, `institute_name`, `year_of_passing`, `status`, `created_id`, `created_at`, `updated_id`, `updated_at`, `degree_id`) VALUES
(1, 5, 'AIIMS Delhi', 2020, 0, NULL, '2026-05-20 12:27:01', NULL, '2026-05-21 12:24:57', 1),
(2, 6, 'AIIMS Mumbai', 2020, 1, NULL, '2026-05-20 12:29:47', NULL, NULL, 1),
(3, 6, 'MBIT', 2024, 0, NULL, '2026-05-20 12:33:01', NULL, '2026-05-20 12:37:22', 3);

-- --------------------------------------------------------

--
-- Table structure for table `degree_masters`
--

DROP TABLE IF EXISTS `degree_masters`;
CREATE TABLE IF NOT EXISTS `degree_masters` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_id` int UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_id` int UNSIGNED DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `degree_masters`
--

INSERT INTO `degree_masters` (`id`, `name`, `status`, `created_id`, `created_at`, `updated_id`, `updated_at`) VALUES
(1, 'MBBS', 1, NULL, '2026-05-20 06:47:32', NULL, '2026-05-25 07:25:54'),
(2, 'MD', 1, NULL, '2026-05-20 06:47:32', NULL, NULL),
(3, 'MS', 1, NULL, '2026-05-20 06:47:32', NULL, '2026-05-23 09:24:15'),
(4, 'BDS', 1, NULL, '2026-05-20 06:47:32', NULL, '2026-05-25 07:25:51'),
(5, 'MDS', 1, NULL, '2026-05-20 06:47:32', NULL, NULL),
(6, 'BMDS', 1, NULL, '2026-05-20 10:57:53', NULL, '2026-05-25 07:25:53'),
(7, 'TEST DEGREEE', 1, NULL, '2026-05-23 16:45:51', NULL, NULL),
(8, 'added', 1, NULL, '2026-05-24 13:54:33', NULL, '2026-05-24 14:00:50');

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
CREATE TABLE IF NOT EXISTS `doctors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` int NOT NULL,
  `profile_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `qualification` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `consulting_fee` decimal(12,0) DEFAULT NULL,
  `availability_status` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `average_status` decimal(12,0) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_id` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `name`, `email`, `password`, `phone`, `profile_image`, `description`, `qualification`, `consulting_fee`, `availability_status`, `average_status`, `status`, `created_id`, `created_at`, `updated_id`, `updated_at`) VALUES
(2, 'Dr Raj', 'raj@gmail.com', '$2y$10$YexPwWdxaSDzn7.VVe3ETej2hYOK2BduuweL35DJ57OqKXc6NoK5e', 2147483647, NULL, NULL, 'MBBS', NULL, NULL, NULL, 1, NULL, '2026-05-16 13:02:08', NULL, '2026-05-18 14:55:51'),
(3, 'Dr.Pratham', 'pratham@gmail.com', '$2y$10$fhqoGqPE8nTiei/6sx4qsO03019DLnXSe.AAE2XsgeYGH7mBwoM2m', 2147483647, NULL, 'Cardiologist with 10 years experience', 'MBBS, MD', 500, 'Available', NULL, 1, NULL, '2026-05-16 14:45:06', NULL, NULL),
(4, 'Dr.Piyush Lakhwani', 'piyush@gmail.com', '$2y$10$sIwwA4iqw5pdCvbD50hWLetez6kU01ka.RqAyfB.yI.m.HBdS335q', 88888888, NULL, 'updatred description ', 'MBBS,MD', 1000, 'Available', NULL, 2, NULL, '2026-05-16 14:49:50', NULL, '2026-05-25 15:25:32'),
(5, 'Dr.Sami', 'sami@gmail.com', '$2y$10$G0m.l5c31/0AFKrpGPwqtenjmsJfz2eoX10YKDLWrqCSGFs0tL.KS', 2147483647, '1779350667_6a0ebc8b2fa9e.jpeg', 'Cardiologist with 10 years experience', 'MBBS, MD', 500, 'Available', NULL, 1, NULL, '2026-05-16 14:53:07', NULL, '2026-05-21 13:34:27'),
(6, 'Dr.kush', 'kush@gmail.com', '$2y$10$F2VNi8B.HR12vOo6JoyaJ.rJxJQ4.RpIKV7qjwCzhCGGLoNgvDiN6', 2147483647, NULL, 'Cardiologist with 10 years experience', 'MBBS, MD', 1000, 'Available', NULL, 1, NULL, '2026-05-18 11:52:34', NULL, NULL),
(7, 'Dr.Harsh', 'harsh@gmail.com', '$2y$10$lB1VVZdQyHNqwLUgwXBfae66Q4Rb0/p5ymxRBqHU0jnMdSmEhksuW', 2147483647, NULL, 'Cardiologist with 10 years experience', 'MBBS, MD', 1500, 'Available', NULL, 1, NULL, '2026-05-18 12:35:24', NULL, NULL),
(8, 'Dr.Test', 'test@gmail.com', '$2y$10$grwuxXjU0M6QXtLtHY/tc.p8ArKxT1cpek4qbTZ4P5NFFQoyikR9K', 888888888, NULL, 'Cardiologist', 'MBBS', 800, 'Available', NULL, 1, NULL, '2026-05-18 16:14:12', NULL, NULL),
(10, 'test1', 'test1@gmail.com', '$2y$10$aC91MS1iO80.vLpsOYSO9.hpQ80BwRvJWJV7DfzxTLs4B9muIVyIy', 999999999, NULL, 'Experienced doctor', 'MBBS, MD', 1000, 'Available', NULL, 1, NULL, '2026-05-22 20:59:57', NULL, '2026-05-24 21:12:40'),
(11, 'lastfinal', 'lastfinal@gmail.com', '$2y$10$I.vDYxAlc/oVReLzVhGy8esJYtAVD7UGsteIzBqE3SBIGSmB1d4aS', 999999999, NULL, 'Experienced dentist', 'MBBS', 1498, 'Available', NULL, 0, NULL, '2026-05-23 15:18:50', NULL, NULL),
(12, 'check', 'check@gmail.com', '$2y$10$P.p/90WYnvRbg5mU6lflNujY/VJMSu6AxvsXQvQFfCuL/Gpj5zMnS', 999999999, NULL, 'jhb', 'MBBS', 1498, 'Busy', NULL, 1, NULL, '2026-05-23 15:27:37', NULL, '2026-05-25 14:14:23'),
(13, 'idk', 'idontknow@gmail.com', '$2y$10$eVxM9mz9B4pRgi7pNXap0OfUGgB3f0Qi9NILryi8ou/qj4RgmuoXy', 333333333, '1779627271_6a12f507ebdb1.png', 'i donkt know', 'MBBS', 1000, 'Available', NULL, 2, NULL, '2026-05-24 11:56:09', NULL, '2026-05-24 20:53:04'),
(14, 'addeddoctor', 'added@gmail.com', '$2y$10$S.oO1u.QlAEBinhj668vfOijWLA.rxjbm9lqoLCx0OphR8Nko5jgG', 555555555, '1779632606_6a1309de83320.png', 'added', 'added', 1000, 'Busy', NULL, 1, NULL, '2026-05-24 19:53:26', NULL, '2026-05-24 21:12:51'),
(19, 'qw,cjf', 'sjhwct.j@vfskjdb', '$2y$10$4EwAA0WiM7RxI5U7XVDBsuBFYy0fnx8usyJdLbtmfbFBx5U7MJbFO', 0, NULL, 'a,jsvbh', 'BDS', 56444, 'Available', NULL, 0, NULL, '2026-05-25 15:33:18', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `doctor_specializations`
--

DROP TABLE IF EXISTS `doctor_specializations`;
CREATE TABLE IF NOT EXISTS `doctor_specializations` (
  `doctor_id` int NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `status` tinyint NOT NULL DEFAULT '0',
  `created_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_id` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `specialization_id` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `specialization_id` (`specialization_id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `doctor_specializations`
--

INSERT INTO `doctor_specializations` (`doctor_id`, `id`, `status`, `created_id`, `created_at`, `updated_id`, `updated_at`, `specialization_id`) VALUES
(5, 1, 0, NULL, '2026-05-20 11:08:12', NULL, '2026-05-20 11:57:43', 1),
(13, 2, 0, NULL, '2026-05-24 11:56:09', NULL, '2026-05-24 20:19:55', 6),
(13, 3, 0, NULL, '2026-05-24 17:53:12', NULL, '2026-05-24 20:19:55', 5),
(13, 4, 1, NULL, '2026-05-24 18:24:31', NULL, '2026-05-24 20:19:55', 4),
(14, 5, 1, NULL, '2026-05-24 19:53:26', NULL, NULL, 7),
(12, 6, 1, NULL, '2026-05-25 14:14:23', NULL, NULL, 2),
(15, 7, 1, NULL, '2026-05-25 14:37:02', NULL, NULL, 8),
(16, 8, 1, NULL, '2026-05-25 15:03:06', NULL, NULL, 8),
(17, 9, 1, NULL, '2026-05-25 15:07:55', NULL, NULL, 2),
(18, 10, 1, NULL, '2026-05-25 15:18:30', NULL, NULL, 4),
(19, 11, 1, NULL, '2026-05-25 15:33:18', NULL, NULL, 2);

-- --------------------------------------------------------

--
-- Table structure for table `hospitals`
--

DROP TABLE IF EXISTS `hospitals`;
CREATE TABLE IF NOT EXISTS `hospitals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hospital_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_id` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_id` int NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hospitals`
--

INSERT INTO `hospitals` (`id`, `name`, `hospital_type`, `phone`, `description`, `status`, `created_id`, `created_at`, `updated_id`, `updated_at`) VALUES
(1, 'Apollo Hospital', 'dentist', '9999999999', 'Updated Description', 1, 0, '2026-05-19 12:02:09', 0, '2026-05-19 13:13:23'),
(2, '0', '', '9999999999', 'Best Hospital', 0, 0, '2026-05-19 12:03:25', 0, '2026-05-19 13:27:39'),
(3, 'unknown', 'unknowntype', '8888888888', 'unknown Hospital', 1, 0, '2026-05-19 12:07:45', 0, '2026-05-24 18:45:45'),
(4, 'Sai Hospital', '', '7777777777', 'Best Hospital', 1, 0, '2026-05-19 12:11:29', 0, NULL),
(5, 'addeshos', 'addeshos@gmail.com', '444444', ',jhb ', 1, 0, '2026-05-24 20:11:10', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `hospital_addresses`
--

DROP TABLE IF EXISTS `hospital_addresses`;
CREATE TABLE IF NOT EXISTS `hospital_addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hospital_id` int DEFAULT NULL,
  `addresses_line1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `addresses_line2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pincode` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` decimal(12,0) NOT NULL,
  `longitude` decimal(12,0) NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `created_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_id` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hospital_addresses`
--

INSERT INTO `hospital_addresses` (`id`, `hospital_id`, `addresses_line1`, `addresses_line2`, `city`, `state`, `country`, `pincode`, `latitude`, `longitude`, `status`, `created_id`, `created_at`, `updated_id`, `updated_at`) VALUES
(1, 1, 'SG Highway', '', 'Ahemdabad', 'Gujarat', 'India', '380001', 23, 73, 1, NULL, '2026-05-19 12:02:09', NULL, '2026-05-19 13:13:23'),
(2, 2, '', 'Near Mail', 'Ahemdabad', 'Gujarat', 'India', '380001', 23, 73, 1, NULL, '2026-05-19 12:03:25', NULL, NULL),
(3, 3, 'india', 'world', 'Ahemdabad', 'Gujarat', 'India', '380001', 23, 73, 1, NULL, '2026-05-19 12:07:45', NULL, '2026-05-24 18:45:45'),
(4, 4, '', 'Near Mail', 'Ahemdabad', 'Gujarat', 'India', '380001', 23, 73, 1, NULL, '2026-05-19 12:11:29', NULL, NULL),
(5, 5, ',hb', ',jhv', 'addeshos', 'addeshos', 'India', '412', 64, 5, 1, NULL, '2026-05-24 20:11:10', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `hospital_doctors`
--

DROP TABLE IF EXISTS `hospital_doctors`;
CREATE TABLE IF NOT EXISTS `hospital_doctors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `hospital_id` int NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `created_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_id` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hospital_doctors`
--

INSERT INTO `hospital_doctors` (`id`, `doctor_id`, `hospital_id`, `status`, `created_id`, `created_at`, `updated_id`, `updated_at`) VALUES
(1, 3, 1, 1, NULL, '2026-05-19 13:35:09', NULL, NULL),
(2, 5, 1, 1, NULL, '2026-05-24 13:57:56', NULL, NULL),
(6, 5, 3, 1, NULL, '2026-05-25 16:39:04', NULL, '2026-05-25 16:59:11'),
(4, 12, 5, 1, NULL, '2026-05-24 22:27:13', NULL, NULL),
(5, 5, 4, 2, NULL, '2026-05-25 16:11:16', NULL, '2026-05-25 16:59:15');

-- --------------------------------------------------------

--
-- Table structure for table `hospital_doctor_schedules`
--

DROP TABLE IF EXISTS `hospital_doctor_schedules`;
CREATE TABLE IF NOT EXISTS `hospital_doctor_schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hospital_doctor_id` int NOT NULL,
  `day_of_week` enum('monday','tuesday','wednesday','thursday','friday','saturday','sunday') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` int NOT NULL,
  `created_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_id` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hospital_doctor_schedules`
--

INSERT INTO `hospital_doctor_schedules` (`id`, `hospital_doctor_id`, `day_of_week`, `start_time`, `end_time`, `status`, `created_id`, `created_at`, `updated_id`, `updated_at`) VALUES
(1, 1, 'tuesday', '11:00:00', '15:00:00', 1, NULL, '2026-05-19 15:10:12', NULL, '2026-05-19 15:47:36'),
(2, 1, 'monday', '10:00:00', '14:00:00', 1, NULL, '2026-05-19 15:46:57', NULL, NULL),
(3, 2, 'monday', '11:00:00', '21:00:00', 1, NULL, '2026-05-24 22:41:40', NULL, '2026-05-25 10:41:44'),
(4, 2, 'monday', '09:00:00', '21:00:00', 0, NULL, '2026-05-24 23:31:21', NULL, '2026-05-25 09:00:36'),
(5, 2, 'monday', '14:08:00', '01:22:00', 1, NULL, '2026-05-25 15:20:21', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `patient_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `patient_email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` decimal(2,1) NOT NULL DEFAULT '0.0',
  `review_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_approved` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint NOT NULL DEFAULT '0',
  `created_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_id` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `review_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `doctor_id`, `patient_name`, `patient_email`, `rating`, `review_text`, `is_approved`, `status`, `created_id`, `created_at`, `updated_id`, `updated_at`, `review_title`) VALUES
(1, 5, 'piyush lakhwani', 'piyush@gmail.com', 4.5, 'Very professional and good doctor', 1, 0, NULL, '2026-05-20 12:59:37', NULL, '2026-05-25 11:35:29', 'Excellent docto'),
(2, 5, 'test', 'test@gmail.com', 5.0, 'VERY GOOD SERVICE', 1, 1, NULL, '2026-05-23 12:57:26', NULL, '2026-05-23 12:57:42', 'BEST DOCTOR'),
(3, 5, 'testreview', 'test@gmail.com', 2.5, 'XYZ', 1, 1, NULL, '2026-05-23 13:14:44', NULL, '2026-05-23 13:18:06', 'BEST DOCTOR'),
(4, 10, 'akavb', 'test@gmail.com', 3.5, 'ahjvbfhjvb ', 1, 1, NULL, '2026-05-23 13:22:33', NULL, '2026-05-23 13:22:45', 'BEST DOCTORavava'),
(5, 10, 'k.sern', 'test@gmail.com', 3.5, 'kegg', 1, 1, NULL, '2026-05-23 13:35:04', NULL, '2026-05-23 13:38:37', 'BEST DOCTORavava'),
(6, 3, 'hgckgh', 'new@gmail.com', 5.0, 'jv', 1, 1, NULL, '2026-05-24 16:51:35', NULL, '2026-05-25 11:39:21', 'jc'),
(7, 8, 'kjsdgjhsd', 'new@gmail.com', 5.0, 'JHVDSC', 0, 0, NULL, '2026-05-25 11:40:40', NULL, '2026-05-25 11:44:44', 'jc'),
(8, 8, 'qqqqq', 'b6113705@gmail.com', 4.5, 'kuy', 0, 0, NULL, '2026-05-25 11:47:59', NULL, '2026-05-25 11:51:37', ',jjb'),
(9, 5, 'ok0ok', 'b6113705@gmail.com', 5.0, 'lpkmolp)L_', 1, 0, NULL, '2026-05-25 14:18:22', NULL, '2026-05-25 15:26:06', ',jjb');

-- --------------------------------------------------------

--
-- Table structure for table `specialization_masters`
--

DROP TABLE IF EXISTS `specialization_masters`;
CREATE TABLE IF NOT EXISTS `specialization_masters` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_id` int UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_id` int UNSIGNED DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `specialization_masters`
--

INSERT INTO `specialization_masters` (`id`, `name`, `status`, `created_id`, `created_at`, `updated_id`, `updated_at`) VALUES
(1, 'Primary Care Physician', 1, NULL, '2026-05-19 11:27:07', NULL, '2026-05-25 07:17:32'),
(2, 'Dentist', 1, NULL, '2026-05-19 11:27:07', NULL, NULL),
(3, 'Neurologist', 1, NULL, '2026-05-19 11:27:07', NULL, NULL),
(4, 'Orthopedic', 1, NULL, '2026-05-19 11:27:07', NULL, NULL),
(5, 'Psychiatrist', 1, NULL, '2026-05-20 10:39:05', NULL, NULL),
(6, 'TEST SPECIALIZATION', 1, NULL, '2026-05-23 16:56:12', NULL, NULL),
(7, 'added', 1, NULL, '2026-05-24 14:01:08', NULL, '2026-05-24 14:01:21'),
(8, 'General Physician', 1, NULL, '2026-05-25 09:03:26', NULL, NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
