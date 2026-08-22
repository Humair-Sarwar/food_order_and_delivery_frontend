-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 22, 2026 at 03:58 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `online_food_ordering_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `country` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `apartment` varchar(255) DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `postcode` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `country`, `first_name`, `last_name`, `address`, `apartment`, `city`, `postcode`, `phone`, `created_at`, `updated_at`) VALUES
('01a02879-f469-706b-b628-828d6e618318', '01a02876-ccf5-71a5-98b9-1ff202878b78', 'Pakistan', 'Humair', 'Sarwar', 'Rawalpdin, Pakistan', NULL, 'Rawalpindi', 'H5353C7', '+92 3088340373', '2026-08-22 02:57:56', '2026-08-22 02:57:56'),
('01a0288d-cc47-71ec-a4da-a87a83c508f9', '01a0288a-6e0b-715c-b502-e7908b86e91f', 'Pakistan', 'Virtual', 'University', 'Lahore, Pakistan', NULL, 'Lahore', '775459', '+92 300123456', '2026-08-22 03:19:36', '2026-08-22 03:19:36'),
('01a0289d-faff-719e-9632-9c114021a0e2', '01a02899-1487-7212-bbd6-545a442ec299', 'Pakistan', 'Asad', 'Majeed', 'Rawalpdin, Pakistan', NULL, 'Rawalpindi', '63554534', '+92 3088340373', '2026-08-22 03:37:17', '2026-08-22 03:37:17'),
('01a0289f-8a72-7024-a96d-fa340bf7b59e', '01a02899-1487-7212-bbd6-545a442ec299', 'Pakistan', 'Asad', 'Majeed', 'Rawalpdin, Pakistan', 'eee', 'Rawalpindi', '63554534', '+92 3088340373', '2026-08-22 03:38:59', '2026-08-22 03:38:59');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `created_at`, `updated_at`) VALUES
('01a02898-77a1-7372-a060-ec5705e01434', '01a0288a-6e0b-715c-b502-e7908b86e91f', '2026-08-22 03:31:15', '2026-08-22 03:31:15');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` char(36) NOT NULL,
  `cart_id` char(36) NOT NULL,
  `food_item_id` char(36) NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`id`, `cart_id`, `food_item_id`, `quantity`, `created_at`, `updated_at`) VALUES
('01a02898-77b0-737f-9543-35301900844f', '01a02898-77a1-7372-a060-ec5705e01434', '01a027ca-d24d-7267-af81-048afdbe9cf0', 1, '2026-08-22 03:31:15', '2026-08-22 03:31:15');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category_slug` varchar(255) NOT NULL,
  `sort_order` int(11) NOT NULL,
  `image_id` char(36) DEFAULT NULL,
  `cover_image_id` char(36) DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` longtext DEFAULT NULL,
  `page_description` longtext DEFAULT NULL,
  `level` int(11) NOT NULL DEFAULT 0,
  `parent_category_id` char(36) DEFAULT NULL,
  `listing_design` int(11) NOT NULL DEFAULT 1,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `title`, `category_slug`, `sort_order`, `image_id`, `cover_image_id`, `meta_title`, `meta_description`, `page_description`, `level`, `parent_category_id`, `listing_design`, `deleted_at`, `created_at`, `updated_at`) VALUES
('01a01ee4-5cdd-72a0-a4b9-ae35df35bc0e', 'Pizza', 'pizza', 1, '01a01eeb-4aa8-70d3-aac5-6cbf7735731c', '01a01f09-7259-70d1-880d-d7c9c953eab9', NULL, NULL, 'Enjoy freshly baked pizzas topped with delicious cheese, flavorful sauces, and a variety of fresh toppings.', 0, NULL, 1, NULL, '2026-08-20 06:17:57', '2026-08-20 06:58:33'),
('01a01ee4-b6a8-71f2-8cf2-9797c9fe3b63', 'Burgers', 'burgers', 2, '01a01f0b-4bc6-7369-b39f-997c23ba2d7d', '01a01f0b-e1ff-72ce-ba94-22301c3da647', NULL, NULL, 'Juicy and delicious burgers made with fresh buns, flavorful patties, crispy vegetables, cheese, and special sauces.', 0, NULL, 1, NULL, '2026-08-20 06:18:20', '2026-08-20 07:01:17'),
('01a01ee5-0f7d-70ee-9927-f9989b73b146', 'Fried Chicken', 'fried-chicken', 3, '01a022a8-ac80-7004-88f0-2ab0a227a3ca', '01a022a9-8f3f-712c-9f86-28617ed6068d', NULL, NULL, 'Crispy and juicy fried chicken seasoned with delicious spices and cooked to perfection for a satisfying meal.', 0, NULL, 1, NULL, '2026-08-20 06:18:43', '2026-08-20 23:52:18'),
('01a01ee5-58c7-72bb-bee6-7269d3bad80a', 'Wraps & Shawarma', 'wraps-shawarma', 4, '01a022ab-05eb-701c-9066-99275258ae8e', '01a022ab-b487-72b7-92bb-2e4e02e6e935', NULL, NULL, 'Tasty wraps and shawarma filled with seasoned chicken, fresh vegetables, creamy sauces, and flavorful spices.', 0, NULL, 1, NULL, '2026-08-20 06:19:02', '2026-08-20 23:54:52'),
('01a01ee5-a8ce-72b6-93dc-bac41bf39763', 'Pasta', 'pasta', 5, '01a022ae-7f01-7101-bd47-6a6eb4f7a848', '01a022af-34c1-736e-8813-1e9e4c678df7', NULL, NULL, 'Delicious pasta prepared with creamy or flavorful sauces, fresh ingredients, and perfectly cooked pasta.', 0, NULL, 1, NULL, '2026-08-20 06:19:22', '2026-08-20 23:58:29'),
('01a01ee5-ef53-72c3-b2b8-503d1855fd32', 'Rice & Biryani', 'rice-biryani', 6, '01a022b1-0661-7278-82c2-ef4aff1a53e1', '01a022b2-2990-7283-8f29-1ac3111c4232', NULL, NULL, 'Aromatic rice dishes and traditional biryani prepared with flavorful spices, tender meat, and rich ingredients.', 0, NULL, 1, NULL, '2026-08-20 06:19:40', '2026-08-21 00:01:42'),
('01a01ee6-69c3-727b-8c81-3fb0909ca95d', 'Sandwiches', 'sandwiches', 7, '01a027aa-c97c-7036-abf0-5076e4c39109', '01a027ab-5847-711c-9209-b1baee07dc67', NULL, NULL, 'Freshly prepared sandwiches filled with delicious meats, vegetables, cheese, and special sauces for a quick meal.', 0, NULL, 1, NULL, '2026-08-20 06:20:11', '2026-08-21 23:12:21'),
('01a01ee6-bcb2-728f-a166-d22156d6d090', 'Salads', 'salads', 8, '01a027ac-5b39-71ad-9750-4198fba4c8c9', '01a027ac-cc42-70fd-a6a8-09099ce22c73', NULL, NULL, 'Fresh and healthy salads made with crisp vegetables, flavorful toppings, and delicious dressings.', 0, NULL, 1, NULL, '2026-08-20 06:20:33', '2026-08-21 23:13:59'),
('01a01ee7-18a5-70f6-9e95-3e3fc1c2860b', 'Ice Cream', 'ice-cream', 9, '01a027ae-1eba-72a7-b317-4f9d5c309fef', '01a027ae-a4a8-737a-85b0-dbdc9d1ac906', NULL, NULL, 'Cool and creamy ice cream available in a variety of delicious flavors, perfect for satisfying your sweet cravings.', 0, NULL, 1, NULL, '2026-08-20 06:20:56', '2026-08-21 23:15:56'),
('01a01ee7-9f16-7304-9db4-2408ceea410c', 'Coffee & Tea', 'coffee-tea', 10, '01a027af-ba60-71f6-8d80-222e695e051c', '01a027b0-c4b4-73d8-9508-4e8be4e67d13', NULL, NULL, 'Enjoy freshly prepared coffee and tea with rich flavors, perfect for relaxing or enjoying with snacks.', 0, NULL, 1, NULL, '2026-08-20 06:21:31', '2026-08-21 23:18:19'),
('01a01ee7-e611-7068-b3ad-a28cc6bcbd7c', 'BBQ & Grills', 'bbq-grills', 11, '01a027b2-1cf1-714a-95e5-fce851ab3b9c', '01a027b4-6502-720d-a7e4-4545aa4e2e70', NULL, NULL, 'Delicious grilled and BBQ dishes prepared with marinated meats, traditional spices, and smoky flavors.', 0, NULL, 1, NULL, '2026-08-20 06:21:49', '2026-08-21 23:22:15');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `food_items`
--

CREATE TABLE `food_items` (
  `id` char(36) NOT NULL,
  `title` longtext NOT NULL,
  `category_id` char(36) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 1,
  `description` longtext DEFAULT NULL,
  `restaurant_id` char(36) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `image_id` char(36) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `regular_price` double DEFAULT NULL,
  `sale_price` double DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` longtext DEFAULT NULL,
  `keywords` longtext DEFAULT NULL,
  `is_on_sale` tinyint(1) DEFAULT 0,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `food_items`
--

INSERT INTO `food_items` (`id`, `title`, `category_id`, `sort_order`, `description`, `restaurant_id`, `slug`, `image_id`, `is_available`, `regular_price`, `sale_price`, `meta_title`, `meta_description`, `keywords`, `is_on_sale`, `is_published`, `deleted_at`, `created_at`, `updated_at`) VALUES
('01a027b9-3a07-70f0-91e1-3019af59d285', 'Chicken Fajita Pizza', '01a01ee4-5cdd-72a0-a4b9-ae35df35bc0e', 1, 'A delicious pizza topped with spicy chicken fajita, onions, capsicum, mozzarella cheese, and flavorful pizza sauce.', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'Chicken Fajita Pizza', '01a027b8-e4cb-7209-9419-c19a05361531', 1, 899, 899, NULL, NULL, NULL, 0, 1, NULL, '2026-08-21 23:27:25', '2026-08-21 23:27:25'),
('01a027be-ef24-7242-be6e-c6a26d084c90', 'Chicken Tikka Pizza', '01a01ee4-5cdd-72a0-a4b9-ae35df35bc0e', 2, 'Classic pizza topped with juicy chicken tikka, onions, capsicum, mozzarella cheese, and special tikka sauce.', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'Chicken Tikka Pizza', '01a027be-b61e-71d5-9fde-df567fb40f6d', 1, 949, 949, NULL, NULL, NULL, 0, 1, NULL, '2026-08-21 23:33:39', '2026-08-21 23:33:39'),
('01a027c0-c903-71bf-9ef6-572fe58832c4', 'Pepperoni Pizza', '01a01ee4-5cdd-72a0-a4b9-ae35df35bc0e', 3, 'A cheesy pizza loaded with flavorful pepperoni slices, mozzarella cheese, and rich tomato pizza sauce.', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'Pepperoni Pizza', '01a027c0-7c60-7356-8c25-66137f036e4c', 1, 1099, 999, NULL, NULL, NULL, 1, 1, NULL, '2026-08-21 23:35:40', '2026-08-21 23:35:40'),
('01a027c2-f9c8-7145-a0f8-e11da3f83f99', 'Cheese Lover Pizza', '01a01ee4-5cdd-72a0-a4b9-ae35df35bc0e', 4, 'A rich and cheesy pizza made with a blend of mozzarella and cheddar cheese for a deliciously creamy taste.', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'Cheese Lover Pizza', '01a027c2-c57f-7140-b125-530a5db68ca7', 1, 799, 799, NULL, NULL, NULL, 0, 1, NULL, '2026-08-21 23:38:04', '2026-08-21 23:38:04'),
('01a027c5-5301-7029-bd8a-521ae6bff448', 'Zinger Burger', '01a01ee4-b6a8-71f2-8cf2-9797c9fe3b63', 5, 'Crispy fried chicken fillet with fresh lettuce, creamy mayo, and a soft toasted bun.', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'Zinger Burger', '01a027c5-18b7-700f-ae42-390b8c2e1798', 1, 499, 499, NULL, NULL, NULL, 0, 1, NULL, '2026-08-21 23:40:38', '2026-08-21 23:41:10'),
('01a027c7-d7d9-7350-8771-b62a219324ca', 'Chicken Cheese Burger', '01a01ee4-b6a8-71f2-8cf2-9797c9fe3b63', 6, 'Juicy chicken patty topped with melted cheese, fresh lettuce, onions, and special burger sauce.', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'Chicken Cheese Burger', '01a027c7-be23-72c5-8d81-8068bc0ccc42', 1, 449, 449, NULL, NULL, NULL, 0, 1, NULL, '2026-08-21 23:43:23', '2026-08-21 23:43:23'),
('01a027c9-3db4-7056-932a-a609e632736a', 'Beef Classic Burger', '01a01ee4-b6a8-71f2-8cf2-9797c9fe3b63', 7, 'Grilled beef patty served with fresh lettuce, onions, tomatoes, cheese, and delicious signature sauce.', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'Beef Classic Burger', '01a027c9-1a0c-7048-a8a7-11d6808c574f', 1, 599, 599, NULL, NULL, NULL, 0, 1, NULL, '2026-08-21 23:44:55', '2026-08-21 23:44:55'),
('01a027ca-d24d-7267-af81-048afdbe9cf0', 'Double Chicken Burger', '01a01ee4-b6a8-71f2-8cf2-9797c9fe3b63', 8, 'Two crispy chicken patties layered with cheese, fresh vegetables, and creamy signature sauce.', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'Double Chicken Burger', '01a027ca-b9a9-73cd-87d8-a27c350a1f0a', 1, 699, 599, NULL, NULL, NULL, 1, 1, NULL, '2026-08-21 23:46:38', '2026-08-21 23:46:38'),
('01a027cc-9870-7193-bfbf-a17c5179b374', 'Crispy Chicken Piece', '01a01ee5-0f7d-70ee-9927-f9989b73b146', 9, 'Juicy chicken coated in a crispy, flavorful seasoning and fried to golden perfection.', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'Crispy Chicken Piece', '01a027cc-8077-709d-a644-466c5de71468', 1, 299, 299, NULL, NULL, NULL, 0, 1, NULL, '2026-08-21 23:48:34', '2026-08-21 23:48:34'),
('01a027ce-919e-7201-a94b-b2d021c44298', 'Spicy Fried Chicken', '01a01ee5-0f7d-70ee-9927-f9989b73b146', 10, 'Crunchy fried chicken with a spicy coating, perfect for those who love bold and hot flavors.', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'Spicy Fried Chicken', '01a027ce-7302-72f7-ab01-68d69d2dac9e', 0, 349, 349, NULL, NULL, NULL, 0, 1, NULL, '2026-08-21 23:50:44', '2026-08-21 23:55:50'),
('01a027d0-2008-7346-a9a4-a2978a7fdae5', 'Chicken Strips', '01a01ee5-0f7d-70ee-9927-f9989b73b146', 11, 'Tender chicken strips coated in crispy breading and served with a delicious dipping sauce.', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'Chicken Strips', '01a027d0-0440-7087-b6a6-1005c7f865aa', 1, 399, 299, NULL, NULL, NULL, 1, 1, NULL, '2026-08-21 23:52:26', '2026-08-21 23:52:26'),
('01a027d2-1938-73e1-b0b6-f909e41a7a60', 'Chicken Wings', '01a01ee5-0f7d-70ee-9927-f9989b73b146', 12, 'Crispy and juicy chicken wings seasoned with flavorful spices and fried until perfectly golden.', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'Chicken Wings', '01a027d1-c9d3-7081-a116-9ed27c03739c', 1, 449, 349, NULL, NULL, NULL, 1, 1, NULL, '2026-08-21 23:54:35', '2026-08-21 23:54:35'),
('01a027d6-0616-7048-b4e0-81fc9394b9fd', 'Chicken Shawarma', '01a01ee5-58c7-72bb-bee6-7269d3bad80a', 13, 'Juicy seasoned chicken wrapped with fresh vegetables, creamy garlic sauce, and flavorful spices.', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'Chicken Shawarma', '01a027d5-dfb4-7079-acaa-268b01e710a8', 1, 299, 299, NULL, NULL, NULL, 0, 1, NULL, '2026-08-21 23:58:52', '2026-08-21 23:58:52'),
('01a027d7-3c6b-734c-b4db-5b591115c6f2', 'Chicken Cheese Wrap', '01a01ee5-58c7-72bb-bee6-7269d3bad80a', 14, 'Tender chicken, melted cheese, fresh vegetables, and special sauce wrapped in a soft tortilla.', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'Chicken Cheese Wrap', '01a027d7-206e-70bb-a7fe-2b39104962c8', 1, 399, 399, NULL, NULL, NULL, 0, 1, NULL, '2026-08-22 00:00:12', '2026-08-22 00:00:12'),
('01a027d9-0096-71f7-aa31-7cb1de342524', 'Chicken Alfredo Pasta', '01a01ee5-a8ce-72b6-93dc-bac41bf39763', 15, 'Creamy Alfredo pasta with tender chicken, mushrooms, herbs, and melted cheese for a rich flavor.', '01a01edc-636b-7287-87e7-80bfe65b18f9', 'Chicken Alfredo Pasta', '01a027d8-b4aa-701b-83d8-6e07d03720e0', 1, 599, 599, NULL, NULL, NULL, 0, 1, NULL, '2026-08-22 00:02:08', '2026-08-22 00:02:08'),
('01a027da-55c2-7386-9587-e8e689f3823e', 'Chicken Cheese Pasta', '01a01ee5-a8ce-72b6-93dc-bac41bf39763', 16, 'Delicious pasta cooked with juicy chicken, creamy cheese sauce, and flavorful herbs.', '01a01edc-636b-7287-87e7-80bfe65b18f9', 'Chicken Cheese Pasta', '01a027da-336b-70dc-9e30-d005b57e84c7', 1, 549, 549, NULL, NULL, NULL, 0, 1, NULL, '2026-08-22 00:03:35', '2026-08-22 00:03:35'),
('01a027dc-2532-72b7-9766-77daeacea09b', 'Chicken Biryani', '01a01ee5-ef53-72c3-b2b8-503d1855fd32', 17, 'Aromatic basmati rice cooked with tender chicken, traditional spices, and flavorful biryani masala.', '01a01edc-636b-7287-87e7-80bfe65b18f9', 'Chicken Biryani', '01a027dc-0309-7020-92f6-72dc6a0bac1c', 1, 399, 399, NULL, NULL, NULL, 0, 1, NULL, '2026-08-22 00:05:34', '2026-08-22 00:05:34'),
('01a027dd-c7aa-70be-ad47-f25bdfa5a3ec', 'Chicken Pulao', '01a01ee5-ef53-72c3-b2b8-503d1855fd32', 18, 'Fragrant rice cooked with tender chicken, mild spices, and delicious traditional flavors.', '01a01edc-636b-7287-87e7-80bfe65b18f9', 'Chicken Pulao', '01a027dd-a6ac-7010-aa56-850314baa187', 1, 349, 249, NULL, NULL, NULL, 1, 1, NULL, '2026-08-22 00:07:21', '2026-08-22 00:07:21'),
('01a027e0-1658-707c-b0f9-8f135716d795', 'Chicken Club Sandwich', '01a01ee6-69c3-727b-8c81-3fb0909ca95d', 19, 'Layers of tender chicken, fresh lettuce, tomatoes, cheese, and creamy mayo served in toasted bread.', '01a01edc-636b-7287-87e7-80bfe65b18f9', 'Chicken Club Sandwich', '01a027df-f596-73c5-ae0b-ae9805792927', 1, 499, 499, NULL, NULL, NULL, 0, 1, NULL, '2026-08-22 00:09:52', '2026-08-22 00:09:52'),
('01a027e2-ce65-701e-8453-7fc30489878a', 'Chicken Grilled Sandwich', '01a01ee6-69c3-727b-8c81-3fb0909ca95d', 20, 'Grilled chicken with melted cheese, fresh vegetables, and special sauce in crispy toasted bread.', '01a01edc-636b-7287-87e7-80bfe65b18f9', 'Chicken Grilled Sandwich', '01a027e2-b3ae-7245-a346-a13bfe9c76fe', 1, 449, 449, NULL, NULL, NULL, 0, 1, NULL, '2026-08-22 00:12:50', '2026-08-22 00:12:50'),
('01a027e5-eb1f-73a1-8f37-a45d88cba913', 'Chicken Caesar Salad', '01a01ee6-bcb2-728f-a166-d22156d6d090', 21, 'Fresh lettuce topped with grilled chicken, crunchy croutons, parmesan cheese, and creamy Caesar dressing.', '01a01edc-636b-7287-87e7-80bfe65b18f9', 'Chicken Caesar Salad', '01a027e5-d2af-71df-99c5-58fa14d89048', 1, 499, 499, NULL, NULL, NULL, 0, 1, NULL, '2026-08-22 00:16:14', '2026-08-22 00:16:14'),
('01a027e7-6bdb-7123-acd2-3e33876ecb91', 'Fresh Garden Salad', '01a01ee6-bcb2-728f-a166-d22156d6d090', 22, 'A refreshing mix of crisp lettuce, tomatoes, cucumbers, onions, and fresh seasonal vegetables.', '01a01edc-636b-7287-87e7-80bfe65b18f9', 'Fresh Garden Salad', '01a027e7-5809-7145-9bf1-3fa63c688fc6', 1, 299, 299, NULL, NULL, NULL, 0, 1, NULL, '2026-08-22 00:17:52', '2026-08-22 00:17:52'),
('01a027e8-e009-72b7-815b-261812878ba9', 'Vanilla Ice Cream', '01a01ee7-18a5-70f6-9e95-3e3fc1c2860b', 23, 'Smooth and creamy vanilla ice cream with a rich, classic flavor that everyone loves.', '01a01ee0-762d-7275-8a7e-0019f6182fbf', 'Vanilla Ice Cream', '01a027e8-ceef-73c2-bf2e-370ceacbeb87', 1, 199, 199, NULL, NULL, NULL, 0, 1, NULL, '2026-08-22 00:19:28', '2026-08-22 00:19:28'),
('01a027ea-6f25-710e-a842-c1035618f7e2', 'Chocolate Ice Cream', '01a01ee7-18a5-70f6-9e95-3e3fc1c2860b', 24, 'Rich and creamy chocolate ice cream packed with delicious cocoa flavor for chocolate lovers.', '01a01ee0-762d-7275-8a7e-0019f6182fbf', 'Chocolate Ice Cream', '01a027ea-5bfc-727e-a7d0-ea7b817d7b0a', 1, 249, 249, NULL, NULL, NULL, 0, 1, NULL, '2026-08-22 00:21:10', '2026-08-22 00:21:10'),
('01a027ec-081b-71f1-9a40-cb5b13ece976', 'Cappuccino', '01a01ee7-9f16-7304-9db4-2408ceea410c', 25, 'Smooth espresso topped with steamed milk and creamy foam for a rich and balanced coffee experience.', '01a01ee0-762d-7275-8a7e-0019f6182fbf', 'Cappuccino', '01a027eb-dfa2-7055-931e-28c2505486df', 1, 349, 349, NULL, NULL, NULL, 0, 1, NULL, '2026-08-22 00:22:55', '2026-08-22 00:22:55'),
('01a027ed-179e-7061-ad68-8b76cf7f3257', 'Café Latte', '01a01ee7-9f16-7304-9db4-2408ceea410c', 26, 'A delicious blend of espresso and steamed milk with a smooth, creamy texture and mild flavor.', '01a01ee0-762d-7275-8a7e-0019f6182fbf', 'Café Latte', '01a027ec-fcf2-7397-bc21-b450577972d1', 1, 399, 399, NULL, NULL, NULL, 0, 1, NULL, '2026-08-22 00:24:04', '2026-08-22 00:24:04'),
('01a027ef-8014-726e-869c-e6f39e58a4fc', 'Chicken Tikka', '01a01ee7-e611-7068-b3ad-a28cc6bcbd7c', 27, 'Juicy chicken pieces marinated with traditional spices and grilled over charcoal for a smoky, delicious flavor.', '01a01ee0-762d-7275-8a7e-0019f6182fbf', 'Chicken Tikka', '01a027ef-4b41-7200-9799-bd8365acac62', 1, 499, 399, NULL, NULL, NULL, 1, 1, NULL, '2026-08-22 00:26:42', '2026-08-22 00:27:27'),
('01a027f1-d8f1-7229-8daa-1840aa19e6d1', 'Chicken Malai Boti', '01a01ee7-e611-7068-b3ad-a28cc6bcbd7c', 28, 'Soft and juicy chicken pieces marinated in creamy spices and grilled for a rich, tender, and smoky flavor.', '01a01ee0-762d-7275-8a7e-0019f6182fbf', 'Chicken Malai Boti', '01a027f1-c38e-73a4-b70d-273826921cce', 1, 599, 599, NULL, NULL, NULL, 0, 1, NULL, '2026-08-22 00:29:16', '2026-08-22 00:29:16');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` char(36) NOT NULL,
  `media_path` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`id`, `media_path`, `created_at`, `updated_at`) VALUES
('01a01ed8-e513-7375-9d13-1c15ae75239f', 'images/1787223925_images.png', '2026-08-20 06:05:26', '2026-08-20 06:05:26'),
('01a01eda-0bf1-72f9-a1c0-9622615e94fc', 'images/1787224001_755221091_1530151869152768_5116426401974230797_n.jpg', '2026-08-20 06:06:41', '2026-08-20 06:06:41'),
('01a01edc-26b7-7315-81da-c99560e0e418', 'images/1787224139_images.jpg', '2026-08-20 06:08:59', '2026-08-20 06:08:59'),
('01a01edd-804d-7126-97cd-7b5fb725e5ee', 'images/1787224227_66f9ca914c963.jpg', '2026-08-20 06:10:27', '2026-08-20 06:10:27'),
('01a01edf-e855-71fe-bc4a-eb5b015d5c71', 'images/1787224385_kfc-logo.jpg', '2026-08-20 06:13:05', '2026-08-20 06:13:05'),
('01a01ee0-5e98-71bb-a974-cb23bf778505', 'images/1787224415_images (1).jpg', '2026-08-20 06:13:35', '2026-08-20 06:13:35'),
('01a01eeb-4aa8-70d3-aac5-6cbf7735731c', 'images/1787225131_pizza-delicious-isolated-white-transparent-background-png-file-ready-to-use-pizza-delicious-isolated-white-transparent-293224138-removebg-preview.png', '2026-08-20 06:25:31', '2026-08-20 06:25:31'),
('01a01f09-7259-70d1-880d-d7c9c953eab9', 'images/1787227107_1000_F_229732806_UnMDwlZUKZs8yYltp4ir9p0JwSWu7wLS.jpg', '2026-08-20 06:58:27', '2026-08-20 06:58:27'),
('01a01f0b-4bc6-7369-b39f-997c23ba2d7d', 'images/1787227229_close-up-fresh-beef-burger-isolated-on-transparent-background-removebg-preview.png', '2026-08-20 07:00:29', '2026-08-20 07:00:29'),
('01a01f0b-e1ff-72ce-ba94-22301c3da647', 'images/1787227267_360_F_294305868_QTSSjWvyGvUCPfuH7bPuq6tBqF08hT0x.jpg', '2026-08-20 07:01:07', '2026-08-20 07:01:07'),
('01a022a8-ac80-7004-88f0-2ab0a227a3ca', 'images/1787287871_crispy-fried-chicken-pieces-ready-to-eat-on-transparent-background-removebg-preview.png', '2026-08-20 23:51:14', '2026-08-20 23:51:14'),
('01a022a9-8f3f-712c-9f86-28617ed6068d', 'images/1787287932_fried-chicken-wings-in-a-paper-cup-on-a-red-background-photo.jpg', '2026-08-20 23:52:12', '2026-08-20 23:52:12'),
('01a022ab-05eb-701c-9066-99275258ae8e', 'images/1787288028_pngtree-a-delicious-shawarma-wrap-isolated-on-transparent-background-filled-with-grilled-png-image_17370663-removebg-preview.png', '2026-08-20 23:53:48', '2026-08-20 23:53:48'),
('01a022ab-b487-72b7-92bb-2e4e02e6e935', 'images/1787288073_delicious-shawarma-wrap-with-vibrant-ingredients-image-free-photo.jpg', '2026-08-20 23:54:33', '2026-08-20 23:54:33'),
('01a022ae-7f01-7101-bd47-6a6eb4f7a848', 'images/1787288256_images__2_-removebg-preview.png', '2026-08-20 23:57:36', '2026-08-20 23:57:36'),
('01a022af-34c1-736e-8813-1e9e4c678df7', 'images/1787288302_360_F_125473198_Ug0BJFGiyu5HtXjtQt5T9PSZfi9uECKZ.jpg', '2026-08-20 23:58:22', '2026-08-20 23:58:22'),
('01a022b1-0661-7278-82c2-ef4aff1a53e1', 'images/1787288421_images__3_-removebg-preview.png', '2026-08-21 00:00:21', '2026-08-21 00:00:21'),
('01a022b2-2990-7283-8f29-1ac3111c4232', 'images/1787288496_pakistani-food-biryani-rice-chicken-raita-yoghurt-dip-delicious-hyberabadi-chicken-biryani-gray-wooden-background-top-284386717.webp', '2026-08-21 00:01:36', '2026-08-21 00:01:36'),
('01a027aa-c97c-7036-abf0-5076e4c39109', 'images/1787371896_images__4_-removebg-preview.png', '2026-08-21 23:11:39', '2026-08-21 23:11:39'),
('01a027ab-5847-711c-9209-b1baee07dc67', 'images/1787371935_pngtree-world-sandwich-day-for-food-lover-banner-image_16520770.jpg', '2026-08-21 23:12:15', '2026-08-21 23:12:15'),
('01a027ac-5b39-71ad-9750-4198fba4c8c9', 'images/1787372002_pngtree-salad-vector-illustration-transparent-background-png-image_13638098-removebg-preview.png', '2026-08-21 23:13:22', '2026-08-21 23:13:22'),
('01a027ac-cc42-70fd-a6a8-09099ce22c73', 'images/1787372030_images (5).jpg', '2026-08-21 23:13:51', '2026-08-21 23:13:51'),
('01a027ae-1eba-72a7-b317-4f9d5c309fef', 'images/1787372117_pngtree-ice-cream-image-without-background-png-image_19907087-removebg-preview.png', '2026-08-21 23:15:17', '2026-08-21 23:15:17'),
('01a027ae-a4a8-737a-85b0-dbdc9d1ac906', 'images/1787372151_tasty-sweet-ice-cream-mixed-berry-pastel-colors-ice-cream-banner-background-template-copy-space-tasty-sweet-ice-cream-319934661.webp', '2026-08-21 23:15:51', '2026-08-21 23:15:51'),
('01a027af-ba60-71f6-8d80-222e695e051c', 'images/1787372223_creamy-tea-in-a-white-cup-with-spoon-beverage-break-time-drink-hot-morning-relax-tasty-refreshment-porcelain-on-transparent-background.png', '2026-08-21 23:17:03', '2026-08-21 23:17:03'),
('01a027b0-c4b4-73d8-9508-4e8be4e67d13', 'images/1787372291_360_F_194828624_llDpKzFNYmi6cfHVF8GOOoAe5KTJlc9N.jpg', '2026-08-21 23:18:11', '2026-08-21 23:18:11'),
('01a027b2-1cf1-714a-95e5-fce851ab3b9c', 'images/1787372379_images__6_-removebg-preview.png', '2026-08-21 23:19:39', '2026-08-21 23:19:39'),
('01a027b4-6502-720d-a7e4-4545aa4e2e70', 'images/1787372528_chicken-drumsticks-pork-ribs-sausage-bbq-panorama-banner-chicken-drumsticks-spicy-marinated-pork-ribs-sausage-178404213.webp', '2026-08-21 23:22:08', '2026-08-21 23:22:08'),
('01a027b8-e4cb-7209-9419-c19a05361531', 'images/1787372823_pngtree-pizza-chicken-food-png-vector-material-png-image_12896221.png', '2026-08-21 23:27:03', '2026-08-21 23:27:03'),
('01a027be-b61e-71d5-9fde-df567fb40f6d', 'images/1787373204_istockphoto-186295807-612x612-removebg-preview.png', '2026-08-21 23:33:25', '2026-08-21 23:33:25'),
('01a027c0-7c60-7356-8c25-66137f036e4c', 'images/1787373321_pngtree-yummy-stretchy-cheese-pepperoni-pizza-png-image_14798826.png', '2026-08-21 23:35:21', '2026-08-21 23:35:21'),
('01a027c2-c57f-7140-b125-530a5db68ca7', 'images/1787373471_pngtree-homemade-pizza-png-image_15601607-removebg-preview.png', '2026-08-21 23:37:51', '2026-08-21 23:37:51'),
('01a027c5-18b7-700f-ae42-390b8c2e1798', 'images/1787373623_crispy-chicken-burger-with-sesame-seed-bun-and-png.webp', '2026-08-21 23:40:23', '2026-08-21 23:40:23'),
('01a027c7-be23-72c5-8d81-8068bc0ccc42', 'images/1787373796_pngtree-crispy-cheesy-chicken-patty-burger-on-transparent-background-png-image_16578920-removebg-preview.png', '2026-08-21 23:43:16', '2026-08-21 23:43:16'),
('01a027c9-1a0c-7048-a8a7-11d6808c574f', 'images/1787373885_pngtree-classic-beef-burger-png-image_13862313.png', '2026-08-21 23:44:45', '2026-08-21 23:44:45'),
('01a027ca-b9a9-73cd-87d8-a27c350a1f0a', 'images/1787373992_delicious-double-fried-chicken-burger-transparent-background-364266341-removebg-preview.png', '2026-08-21 23:46:32', '2026-08-21 23:46:32'),
('01a027cc-8077-709d-a644-466c5de71468', 'images/1787374108_pngtree-crispy-fried-chicken-pieces-on-white-background-png-image_18664549-removebg-preview.png', '2026-08-21 23:48:28', '2026-08-21 23:48:28'),
('01a027ce-7302-72f7-ab01-68d69d2dac9e', 'images/1787374236_images__7_-removebg-preview.png', '2026-08-21 23:50:36', '2026-08-21 23:50:36'),
('01a027d0-0440-7087-b6a6-1005c7f865aa', 'images/1787374339_images__8_-removebg-preview.png', '2026-08-21 23:52:19', '2026-08-21 23:52:19'),
('01a027d1-c9d3-7081-a116-9ed27c03739c', 'images/1787374455_images__9_-removebg-preview.png', '2026-08-21 23:54:15', '2026-08-21 23:54:15'),
('01a027d5-dfb4-7079-acaa-268b01e710a8', 'images/1787374722_pngtree-side-view-shawarma-with-vegetables-isolated-on-transparent-background-png-image_15453539-removebg-preview.png', '2026-08-21 23:58:42', '2026-08-21 23:58:42'),
('01a027d7-206e-70bb-a7fe-2b39104962c8', 'images/1787374805_pngtree-chicken-wrap-isolated-on-white-background-png-image_21273361-removebg-preview.png', '2026-08-22 00:00:05', '2026-08-22 00:00:05'),
('01a027d8-b4aa-701b-83d8-6e07d03720e0', 'images/1787374908_pngtree-grilled-chicken-alfredo-pasta-isolated-on-transparent-background-is-a-delicious-png-image_17203541-removebg-preview.png', '2026-08-22 00:01:48', '2026-08-22 00:01:48'),
('01a027da-336b-70dc-9e30-d005b57e84c7', 'images/1787375006_images__10_-removebg-preview.png', '2026-08-22 00:03:26', '2026-08-22 00:03:26'),
('01a027dc-0309-7020-92f6-72dc6a0bac1c', 'images/1787375125_pngtree-chicken-biryani-front-view-png-image_9167532-removebg-preview.png', '2026-08-22 00:05:25', '2026-08-22 00:05:25'),
('01a027dd-a6ac-7010-aa56-850314baa187', 'images/1787375232_pngtree-tasty-chicken-pulao-png-image_19280592-removebg-preview.png', '2026-08-22 00:07:12', '2026-08-22 00:07:12'),
('01a027df-f596-73c5-ae0b-ae9805792927', 'images/1787375383_club-sandwich-isolated-white-background-top-view-club-sandwich-white-background-376921536-removebg-preview.png', '2026-08-22 00:09:43', '2026-08-22 00:09:43'),
('01a027e2-b3ae-7245-a346-a13bfe9c76fe', 'images/1787375561_grilled-chicken-sandwich-with-spinach-tomato-and-mozzarella-on-white-background-photo-removebg-preview.png', '2026-08-22 00:12:43', '2026-08-22 00:12:43'),
('01a027e5-d2af-71df-99c5-58fa14d89048', 'images/1787375768_images__11_-removebg-preview.png', '2026-08-22 00:16:08', '2026-08-22 00:16:08'),
('01a027e7-5809-7145-9bf1-3fa63c688fc6', 'images/1787375867_fresh-garden-salad-with-cherry-tomatoes-radishes-and-mixed-greens-isolated-on-transparent-background-png-removebg-preview.png', '2026-08-22 00:17:47', '2026-08-22 00:17:47'),
('01a027e8-ceef-73c2-bf2e-370ceacbeb87', 'images/1787375963_pngtree-delicious-vanilla-ice-cream-with-colorful-sprinkles-in-a-white-bowl-png-image_18466783-removebg-preview.png', '2026-08-22 00:19:23', '2026-08-22 00:19:23'),
('01a027ea-5bfc-727e-a7d0-ea7b817d7b0a', 'images/1787376065_pngtree-chocolate-ice-cream-white-background-image-png-image_15751110-removebg-preview.png', '2026-08-22 00:21:05', '2026-08-22 00:21:05'),
('01a027eb-dfa2-7055-931e-28c2505486df', 'images/1787376164_pngtree-cup-of-hot-cappuccino-coffee-on-white-background-png-image_11752259-removebg-preview.png', '2026-08-22 00:22:44', '2026-08-22 00:22:44'),
('01a027ec-fcf2-7397-bc21-b450577972d1', 'images/1787376237_pngtree-coffee-cup-with-latte-art-isolated-on-transparent-background-png-image_16561573-removebg-preview.png', '2026-08-22 00:23:57', '2026-08-22 00:23:57'),
('01a027ef-4b41-7200-9799-bd8365acac62', 'images/1787376388_pngtree-a-chicken-tikka-boti-skewers-on-plate-over-light-transparent-background-png-image_13678467-removebg-preview.png', '2026-08-22 00:26:28', '2026-08-22 00:26:28'),
('01a027f1-c38e-73a4-b70d-273826921cce', 'images/1787376550_pngtree-a-chicken-tikka-boti-skewers-on-plate-white-background-png-image_15846758-removebg-preview.png', '2026-08-22 00:29:10', '2026-08-22 00:29:10');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_05_24_200115_create_personal_access_tokens_table', 1),
(5, '2026_05_25_065315_create_media_table', 1),
(6, '2026_05_25_165018_create_restaurants_table', 1),
(7, '2026_05_25_174946_create_categories_table', 1),
(8, '2026_05_25_193029_create_food_items_table', 1),
(9, '2026_08_13_032320_create_wishlists_table', 1),
(10, '2026_08_13_083440_create_carts_table', 1),
(11, '2026_08_13_083529_create_cart_items_table', 1),
(12, '2026_08_14_035335_create_addresses_table', 1),
(13, '2026_08_14_113458_create_orders_table', 1),
(14, '2026_08_14_125137_create_order_items_table', 1),
(15, '2026_08_15_183343_add_is_admin_seen_to_orders_table', 1),
(16, '2026_08_15_190341_add_is_customer_seen_to_orders_table', 1),
(17, '2026_08_16_135410_create_settings_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `restaurant_id` char(36) NOT NULL,
  `order_number` varchar(255) NOT NULL,
  `status` enum('pending','confirmed','preparing','ready_for_pickup','out_for_delivery','completed','cancelled') NOT NULL DEFAULT 'pending',
  `is_admin_seen` tinyint(1) NOT NULL DEFAULT 0,
  `is_customer_seen` tinyint(1) NOT NULL DEFAULT 0,
  `delivery_method` enum('self_pickup','ship') NOT NULL,
  `payment_method` enum('cod','online') NOT NULL,
  `payment_status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `apartment` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `postcode` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `delivery_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `restaurant_id`, `order_number`, `status`, `is_admin_seen`, `is_customer_seen`, `delivery_method`, `payment_method`, `payment_status`, `first_name`, `last_name`, `address`, `apartment`, `city`, `postcode`, `phone`, `country`, `subtotal`, `delivery_fee`, `total`, `created_at`, `updated_at`, `deleted_at`) VALUES
('01a02879-f46c-7296-81ad-612622ede483', '01a02876-ccf5-71a5-98b9-1ff202878b78', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'ORD-43592576', 'completed', 1, 1, 'ship', 'cod', 'pending', 'Humair', 'Sarwar', 'Rawalpdin, Pakistan', NULL, 'Rawalpindi', 'H5353C7', '+92 3088340373', 'Pakistan', 2397.00, 0.00, 2397.00, '2026-08-22 02:57:56', '2026-08-22 03:08:10', NULL),
('01a02882-2a00-7015-8cbe-2f4d6f9559ed', '01a02876-ccf5-71a5-98b9-1ff202878b78', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'ORD-32056614', 'pending', 0, 1, 'ship', 'online', 'pending', 'Humair', 'Sarwar', 'Rawalpdin, Pakistan', NULL, 'Rawalpindi', 'H5353C7', '+92 3088340373', 'Pakistan', 299.00, 0.00, 299.00, '2026-08-22 03:06:54', '2026-08-22 03:06:58', NULL),
('01a0288d-cc4a-7320-8216-a0a4c40251ec', '01a0288a-6e0b-715c-b502-e7908b86e91f', '01a01edc-636b-7287-87e7-80bfe65b18f9', 'ORD-37285193', 'confirmed', 1, 1, 'ship', 'cod', 'pending', 'Virtual', 'University', 'Lahore, Pakistan', NULL, 'Lahore', '775459', '+92 300123456', 'Pakistan', 1246.00, 0.00, 1246.00, '2026-08-22 03:19:36', '2026-08-22 03:20:13', NULL),
('01a02893-0825-72fa-92e0-abbeda079e91', '01a0288a-6e0b-715c-b502-e7908b86e91f', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'ORD-72709188', 'pending', 0, 1, 'self_pickup', 'cod', 'pending', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 899.00, 0.00, 899.00, '2026-08-22 03:25:19', '2026-08-22 03:25:25', NULL),
('01a02893-dfd8-7262-8055-e935eda16874', '01a0288a-6e0b-715c-b502-e7908b86e91f', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'ORD-88736647', 'preparing', 1, 1, 'ship', 'cod', 'pending', 'Virtual', 'University', 'Lahore, Pakistan', NULL, 'Lahore', '775459', '+92 300123456', 'Pakistan', 999.00, 0.00, 999.00, '2026-08-22 03:26:14', '2026-08-22 03:31:05', NULL),
('01a0289b-bd09-735b-9ea1-fc8b6a1bd5d0', '01a02899-1487-7212-bbd6-545a442ec299', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'ORD-39518299', 'pending', 0, 1, 'self_pickup', 'cod', 'pending', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 599.00, 0.00, 599.00, '2026-08-22 03:34:50', '2026-08-22 03:34:54', NULL),
('01a0289c-c287-73d8-b219-8c98fc8f503c', '01a02899-1487-7212-bbd6-545a442ec299', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'ORD-48799203', 'pending', 0, 1, 'self_pickup', 'cod', 'pending', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 299.00, 0.00, 299.00, '2026-08-22 03:35:57', '2026-08-22 03:36:01', NULL),
('01a0289d-fb04-7034-8ca1-e8d2ea7e93fb', '01a02899-1487-7212-bbd6-545a442ec299', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'ORD-27454841', 'pending', 0, 1, 'ship', 'cod', 'pending', 'Asad', 'Majeed', 'Rawalpdin, Pakistan', NULL, 'Rawalpindi', '63554534', '+92 3088340373', 'Pakistan', 999.00, 0.00, 999.00, '2026-08-22 03:37:17', '2026-08-22 03:37:21', NULL),
('01a0289e-9de8-71d9-aaec-f0fa9e154cd5', '01a02899-1487-7212-bbd6-545a442ec299', '01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'ORD-78419123', 'cancelled', 1, 0, 'self_pickup', 'cod', 'pending', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 449.00, 0.00, 449.00, '2026-08-22 03:37:58', '2026-08-22 03:42:34', NULL),
('01a0289f-8a79-707f-9946-b3bcd5a9f920', '01a02899-1487-7212-bbd6-545a442ec299', '01a01edc-636b-7287-87e7-80bfe65b18f9', 'ORD-17365205', 'pending', 0, 1, 'ship', 'cod', 'pending', 'Asad', 'Majeed', 'Rawalpdin, Pakistan', 'eee', 'Rawalpindi', '63554534', '+92 3088340373', 'Pakistan', 399.00, 0.00, 399.00, '2026-08-22 03:38:59', '2026-08-22 03:39:04', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` char(36) NOT NULL,
  `order_id` char(36) NOT NULL,
  `food_item_id` char(36) NOT NULL,
  `food_item_name` varchar(255) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL,
  `item_total` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `food_item_id`, `food_item_name`, `unit_price`, `quantity`, `item_total`, `created_at`, `updated_at`) VALUES
('01a02879-f479-72ed-ab10-762b37d43e23', '01a02879-f46c-7296-81ad-612622ede483', '01a027b9-3a07-70f0-91e1-3019af59d285', 'Chicken Fajita Pizza', 899.00, 2, 1798.00, '2026-08-22 02:57:56', '2026-08-22 02:57:56'),
('01a02879-f47b-70e3-99f3-ac3ca7498e62', '01a02879-f46c-7296-81ad-612622ede483', '01a027c9-3db4-7056-932a-a609e632736a', 'Beef Classic Burger', 599.00, 1, 599.00, '2026-08-22 02:57:56', '2026-08-22 02:57:56'),
('01a02882-2a03-702e-9458-c768ef1384d0', '01a02882-2a00-7015-8cbe-2f4d6f9559ed', '01a027cc-9870-7193-bfbf-a17c5179b374', 'Crispy Chicken Piece', 299.00, 1, 299.00, '2026-08-22 03:06:54', '2026-08-22 03:06:54'),
('01a0288d-cc4e-7238-8964-da732b606112', '01a0288d-cc4a-7320-8216-a0a4c40251ec', '01a027dc-2532-72b7-9766-77daeacea09b', 'Chicken Biryani', 399.00, 1, 399.00, '2026-08-22 03:19:36', '2026-08-22 03:19:36'),
('01a0288d-cc52-706e-98b5-63d7e7777cb3', '01a0288d-cc4a-7320-8216-a0a4c40251ec', '01a027dd-c7aa-70be-ad47-f25bdfa5a3ec', 'Chicken Pulao', 249.00, 1, 249.00, '2026-08-22 03:19:36', '2026-08-22 03:19:36'),
('01a0288d-cc58-7146-b278-5324f9734cda', '01a0288d-cc4a-7320-8216-a0a4c40251ec', '01a027e7-6bdb-7123-acd2-3e33876ecb91', 'Fresh Garden Salad', 299.00, 2, 598.00, '2026-08-22 03:19:36', '2026-08-22 03:19:36'),
('01a02893-082b-7372-8440-4ec37590c353', '01a02893-0825-72fa-92e0-abbeda079e91', '01a027b9-3a07-70f0-91e1-3019af59d285', 'Chicken Fajita Pizza', 899.00, 1, 899.00, '2026-08-22 03:25:19', '2026-08-22 03:25:19'),
('01a02893-dfdd-72a7-b19d-3e1c3176ff64', '01a02893-dfd8-7262-8055-e935eda16874', '01a027c0-c903-71bf-9ef6-572fe58832c4', 'Pepperoni Pizza', 999.00, 1, 999.00, '2026-08-22 03:26:14', '2026-08-22 03:26:14'),
('01a0289b-bd11-7034-a3db-953a2ebca8a5', '01a0289b-bd09-735b-9ea1-fc8b6a1bd5d0', '01a027ca-d24d-7267-af81-048afdbe9cf0', 'Double Chicken Burger', 599.00, 1, 599.00, '2026-08-22 03:34:50', '2026-08-22 03:34:50'),
('01a0289c-c28d-7060-9088-b89b0fa966cc', '01a0289c-c287-73d8-b219-8c98fc8f503c', '01a027cc-9870-7193-bfbf-a17c5179b374', 'Crispy Chicken Piece', 299.00, 1, 299.00, '2026-08-22 03:35:57', '2026-08-22 03:35:57'),
('01a0289d-fb08-70fa-ab09-613ba0094d12', '01a0289d-fb04-7034-8ca1-e8d2ea7e93fb', '01a027c0-c903-71bf-9ef6-572fe58832c4', 'Pepperoni Pizza', 999.00, 1, 999.00, '2026-08-22 03:37:17', '2026-08-22 03:37:17'),
('01a0289e-9def-70ac-a00f-585081eb8a14', '01a0289e-9de8-71d9-aaec-f0fa9e154cd5', '01a027c7-d7d9-7350-8771-b62a219324ca', 'Chicken Cheese Burger', 449.00, 1, 449.00, '2026-08-22 03:37:58', '2026-08-22 03:37:58'),
('01a0289f-8a7d-7061-bcdb-e755292eb775', '01a0289f-8a79-707f-9946-b3bcd5a9f920', '01a027dc-2532-72b7-9766-77daeacea09b', 'Chicken Biryani', 399.00, 1, 399.00, '2026-08-22 03:38:59', '2026-08-22 03:38:59');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` char(36) NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', '01a01ed3-453e-71b6-8dc4-019e10c1fdcb', 'auth_token', '2f04322a8a0f15cc97161c3f5a1216b8e973960f934ad7f56a1c787dc3c289b5', '[\"*\"]', '2026-08-22 08:57:51', NULL, '2026-08-20 06:00:00', '2026-08-22 08:57:51'),
(4, 'App\\Models\\User', '01a02899-1487-7212-bbd6-545a442ec299', 'auth_token', 'db7947b284b2e210fdfeeda840f94e1683b267857cf324e008a50c0a7a46b1c8', '[\"*\"]', '2026-08-22 08:56:36', NULL, '2026-08-22 03:32:04', '2026-08-22 08:56:36');

-- --------------------------------------------------------

--
-- Table structure for table `restaurants`
--

CREATE TABLE `restaurants` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `city` varchar(255) NOT NULL,
  `logo_id` varchar(255) DEFAULT NULL,
  `banner_id` varchar(255) DEFAULT NULL,
  `delivery_fee` decimal(8,2) NOT NULL DEFAULT 0.00,
  `minimum_order_amount` decimal(8,2) NOT NULL DEFAULT 0.00,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `restaurants`
--

INSERT INTO `restaurants` (`id`, `name`, `slug`, `description`, `email`, `phone`, `address`, `city`, `logo_id`, `banner_id`, `delivery_fee`, `minimum_order_amount`, `status`, `deleted_at`, `created_at`, `updated_at`) VALUES
('01a01ed7-91dd-7101-9375-26ed7e7d1e80', 'Food Panda', 'food-panda', 'Enjoy delicious, freshly prepared meals made with quality ingredients and rich flavors. Order your favorite food and have it delivered hot and fresh to your doorstep.', 'foodpanda@gmail.com', '+92 123456789', 'H8, Islamabad, Pakistan', 'Islamabad', '01a01ed8-e513-7375-9d13-1c15ae75239f', '01a01eda-0bf1-72f9-a1c0-9622615e94fc', 0.00, 0.00, 'active', NULL, '2026-08-20 06:03:59', '2026-08-20 06:06:51'),
('01a01edc-636b-7287-87e7-80bfe65b18f9', 'Cheezious', 'cheezious', 'Cheezious offers delicious pizzas, burgers, pasta, sandwiches, and other fast-food favorites, freshly prepared with quality ingredients and packed with great taste. Perfect for a quick meal or a tasty treat!', 'cheezious@gmail.com', '+92 300674342', 'H9, Islamabad, Pakistan', 'Islamabad', '01a01edc-26b7-7315-81da-c99560e0e418', '01a01edd-804d-7126-97cd-7b5fb725e5ee', 0.00, 0.00, 'active', NULL, '2026-08-20 06:09:14', '2026-08-20 06:10:34'),
('01a01ee0-762d-7275-8a7e-0019f6182fbf', 'KFC', 'kfc', 'KFC offers delicious fried chicken, burgers, wraps, fries, and refreshing drinks, freshly prepared with its signature taste. Perfect for a quick and satisfying meal delivered straight to your doorstep.', 'kfc@gmail.com', '+92 3007343214', 'H10, Islamabad, Pakistan', 'Islamabad', '01a01edf-e855-71fe-bc4a-eb5b015d5c71', '01a01ee0-5e98-71bb-a974-cb23bf778505', 0.00, 0.00, 'active', NULL, '2026-08-20 06:13:41', '2026-08-20 06:15:56');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` char(36) NOT NULL,
  `site_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `whatsapp_number` varchar(255) DEFAULT NULL,
  `whatsapp_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `footer_description` text DEFAULT NULL,
  `logo_id` char(36) DEFAULT NULL,
  `cod_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `digital_payment_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `site_name`, `email`, `phone`, `whatsapp_number`, `whatsapp_enabled`, `footer_description`, `logo_id`, `cod_enabled`, `digital_payment_enabled`, `created_at`, `updated_at`) VALUES
('25280322-684d-40b2-8bee-95b10471231b', 'StackFood', NULL, NULL, NULL, 0, NULL, NULL, 1, 1, '2026-08-22 02:55:39', '2026-08-22 02:55:39');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `dob` date DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `dob`, `image`, `phone`, `role`, `created_at`, `updated_at`) VALUES
('01a01ed3-453e-71b6-8dc4-019e10c1fdcb', 'Admin', 'User', 'admin@gmail.com', '$2y$12$AdFiXTxj80gbWW..zc5/rusNWzga.DCuT0fGl/NHx4.QuJDKD.I76', NULL, NULL, NULL, 'admin', '2026-08-20 05:59:17', '2026-08-20 05:59:17'),
('01a02876-ccf5-71a5-98b9-1ff202878b78', 'Humair', 'Sarwar', 'humair@gmail.com', '$2y$12$UfI9z91ruemSJR6uOeFsGOOl.YXHgi7Nkzbs2n07FWzSsmwm6S81K', NULL, NULL, NULL, 'user', '2026-08-22 02:54:29', '2026-08-22 02:54:29'),
('01a0288a-6e0b-715c-b502-e7908b86e91f', 'V', 'U', 'bc230202935@vu.edu.pk', '$2y$12$L93znNs93wRMvSCk5X4O1eqb4t4jGK.V2XHURpLNUlKm23z.bzRze', NULL, NULL, NULL, 'user', '2026-08-22 03:15:55', '2026-08-22 03:15:55'),
('01a02899-1487-7212-bbd6-545a442ec299', 'Asad', 'Ali', 'asad@gmail.com', '$2y$12$eHF.Xld9oOPw/S8KQllSguPWHVv/PcZGiL9Uy6pSPAYtCJKmt21ee', NULL, NULL, NULL, 'user', '2026-08-22 03:31:56', '2026-08-22 03:31:56');

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `food_item_id` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wishlists`
--

INSERT INTO `wishlists` (`id`, `user_id`, `food_item_id`, `created_at`, `updated_at`) VALUES
('01a02888-b146-73bd-8c90-986bde1fd358', '01a02876-ccf5-71a5-98b9-1ff202878b78', '01a027ca-d24d-7267-af81-048afdbe9cf0', '2026-08-22 03:14:02', '2026-08-22 03:14:02'),
('01a02888-f80d-717e-a147-b5dfa8efc8df', '01a02876-ccf5-71a5-98b9-1ff202878b78', '01a027ea-6f25-710e-a842-c1035618f7e2', '2026-08-22 03:14:20', '2026-08-22 03:14:20'),
('01a02889-2738-725f-a5d8-cc9353896a39', '01a02876-ccf5-71a5-98b9-1ff202878b78', '01a027f1-d8f1-7229-8daa-1840aa19e6d1', '2026-08-22 03:14:32', '2026-08-22 03:14:32');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `addresses_user_id_foreign` (`user_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `carts_user_id_foreign` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cart_items_cart_id_food_item_id_unique` (`cart_id`,`food_item_id`),
  ADD KEY `cart_items_food_item_id_foreign` (`food_item_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categories_image_id_foreign` (`image_id`),
  ADD KEY `categories_cover_image_id_foreign` (`cover_image_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `food_items`
--
ALTER TABLE `food_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `food_items_slug_unique` (`slug`),
  ADD KEY `food_items_category_id_foreign` (`category_id`),
  ADD KEY `food_items_restaurant_id_foreign` (`restaurant_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_order_number_unique` (`order_number`),
  ADD KEY `orders_user_id_foreign` (`user_id`),
  ADD KEY `orders_restaurant_id_foreign` (`restaurant_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_order_id_foreign` (`order_id`),
  ADD KEY `order_items_food_item_id_foreign` (`food_item_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `restaurants`
--
ALTER TABLE `restaurants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `restaurants_logo_id_foreign` (`logo_id`),
  ADD KEY `restaurants_banner_id_foreign` (`banner_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `settings_logo_id_foreign` (`logo_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wishlists_user_id_food_item_id_unique` (`user_id`,`food_item_id`),
  ADD KEY `wishlists_food_item_id_foreign` (`food_item_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_cart_id_foreign` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_food_item_id_foreign` FOREIGN KEY (`food_item_id`) REFERENCES `food_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_cover_image_id_foreign` FOREIGN KEY (`cover_image_id`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `categories_image_id_foreign` FOREIGN KEY (`image_id`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `food_items`
--
ALTER TABLE `food_items`
  ADD CONSTRAINT `food_items_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `food_items_restaurant_id_foreign` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_restaurant_id_foreign` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`),
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_food_item_id_foreign` FOREIGN KEY (`food_item_id`) REFERENCES `food_items` (`id`),
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `restaurants`
--
ALTER TABLE `restaurants`
  ADD CONSTRAINT `restaurants_banner_id_foreign` FOREIGN KEY (`banner_id`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `restaurants_logo_id_foreign` FOREIGN KEY (`logo_id`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `settings_logo_id_foreign` FOREIGN KEY (`logo_id`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_food_item_id_foreign` FOREIGN KEY (`food_item_id`) REFERENCES `food_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlists_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
