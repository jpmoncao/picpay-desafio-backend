-- phpMyAdmin SQL Dump
-- version 5.2.1
-- Versão do servidor: 10.4.32-MariaDB
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40101 SET NAMES utf8mb4 */
;
--
-- Banco de dados: `banco`
--
CREATE DATABASE IF NOT EXISTS `banco` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `banco`;
-- --------------------------------------------------------
--
-- Estrutura para tabela `shopkeepers`
--
DROP TABLE IF EXISTS `shopkeepers`;
CREATE TABLE IF NOT EXISTS `shopkeepers` (
  `id_shopkeeper` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_user` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id_shopkeeper`),
  KEY `shopkeepers_id_user_foreign` (`id_user`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1 COLLATE = latin1_bin;
-- --------------------------------------------------------
--
-- Estrutura para tabela `transfers`
--
DROP TABLE IF EXISTS `transfers`;
CREATE TABLE IF NOT EXISTS `transfers` (
  `id_transfer` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_payer` int(10) UNSIGNED NOT NULL,
  `id_payee` int(10) UNSIGNED NOT NULL,
  `amount` decimal(15, 2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_transfer`),
  KEY `transfers_id_payer_foreign` (`id_payer`),
  KEY `transfers_id_payee_foreign` (`id_payee`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1 COLLATE = latin1_bin;
-- --------------------------------------------------------
--
-- Estrutura para tabela `users`
--
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id_user` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `cpf_cnpj` varchar(14) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `person_type` varchar(1) NOT NULL DEFAULT 'F',
  `token_2fa` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_user`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1 COLLATE = latin1_bin;
-- --------------------------------------------------------
--
-- Estrutura para tabela `wallets`
--
DROP TABLE IF EXISTS `wallets`;
CREATE TABLE IF NOT EXISTS `wallets` (
  `id_wallet` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_user` int(10) UNSIGNED NOT NULL,
  `balance` decimal(15, 2) NOT NULL DEFAULT 0.00,
  `shopkeeper` varchar(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`id_wallet`),
  KEY `wallets_id_user_foreign` (`id_user`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1 COLLATE = latin1_bin;
--
-- Restrições para tabelas despejadas
--
--
-- Restrições para tabelas `shopkeepers`
--
ALTER TABLE `shopkeepers`
ADD CONSTRAINT `shopkeepers_id_user_foreign` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;
--
-- Restrições para tabelas `transfers`
--
ALTER TABLE `transfers`
ADD CONSTRAINT `transfers_id_payee_foreign` FOREIGN KEY (`id_payee`) REFERENCES `users` (`id_user`) ON DELETE CASCADE,
  ADD CONSTRAINT `transfers_id_payer_foreign` FOREIGN KEY (`id_payer`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;
--
-- Restrições para tabelas `wallets`
--
ALTER TABLE `wallets`
ADD CONSTRAINT `wallets_id_user_foreign` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;
COMMIT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;