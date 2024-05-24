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
-- --------------------------------------------------------
--
-- Estrutura para tabela `carteiras`
--
CREATE TABLE `carteiras` (
  `id_carteira` int(10) UNSIGNED NOT NULL,
  `id_user` int(10) UNSIGNED NOT NULL,
  `saldo` decimal(15, 2) NOT NULL DEFAULT 0.00,
  `lojista` varchar(1) NOT NULL DEFAULT 'N'
) ENGINE = InnoDB DEFAULT CHARSET = latin1 COLLATE = latin1_bin;
-- --------------------------------------------------------
--
-- Estrutura para tabela `lojistas`
--
CREATE TABLE `lojistas` (
  `id_lojista` int(10) UNSIGNED NOT NULL,
  `id_user` int(10) UNSIGNED NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = latin1 COLLATE = latin1_bin;
-- --------------------------------------------------------
--
-- Estrutura para tabela `transferencia`
--
CREATE TABLE `transferencia` (
  `id_transferencia` int(10) UNSIGNED NOT NULL,
  `id_user` int(10) UNSIGNED NOT NULL,
  `id_destinatario` int(10) UNSIGNED NOT NULL,
  `valor` decimal(15, 2) NOT NULL,
  `entrada_saida` varchar(1) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = latin1 COLLATE = latin1_bin;
-- --------------------------------------------------------
--
-- Estrutura para tabela `users`
--
CREATE TABLE `users` (
  `id_user` int(10) UNSIGNED NOT NULL,
  `nome` varchar(255) NOT NULL,
  `cpf_cnpj` varchar(14) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `tipo_pessoa` varchar(1) NOT NULL DEFAULT 'F'
) ENGINE = InnoDB DEFAULT CHARSET = latin1 COLLATE = latin1_bin;
--
-- Índices para tabelas despejadas
--
--
-- Índices de tabela `carteiras`
--
ALTER TABLE `carteiras`
ADD PRIMARY KEY (`id_carteira`),
  ADD KEY `carteiras_id_user_foreign` (`id_user`);
--
-- Índices de tabela `lojistas`
--
ALTER TABLE `lojistas`
ADD PRIMARY KEY (`id_lojista`),
  ADD KEY `lojistas_id_user_foreign` (`id_user`);
--
-- Índices de tabela `transferencia`
--
ALTER TABLE `transferencia`
ADD PRIMARY KEY (`id_transferencia`),
  ADD KEY `transferencia_id_user_foreign` (`id_user`),
  ADD KEY `transferencia_id_destinatario_foreign` (`id_destinatario`);
--
-- Índices de tabela `users`
--
ALTER TABLE `users`
ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `users_cpf_cnpj_unique` (`cpf_cnpj`),
  ADD UNIQUE KEY `users_email_unique` (`email`);
--
-- AUTO_INCREMENT para tabelas despejadas
--
--
-- AUTO_INCREMENT de tabela `carteiras`
--
ALTER TABLE `carteiras`
MODIFY `id_carteira` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de tabela `lojistas`
--
ALTER TABLE `lojistas`
MODIFY `id_lojista` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de tabela `transferencia`
--
ALTER TABLE `transferencia`
MODIFY `id_transferencia` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
MODIFY `id_user` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Restrições para tabelas despejadas
--
--
-- Restrições para tabelas `carteiras`
--
ALTER TABLE `carteiras`
ADD CONSTRAINT `carteiras_id_user_foreign` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);
--
-- Restrições para tabelas `lojistas`
--
ALTER TABLE `lojistas`
ADD CONSTRAINT `lojistas_id_user_foreign` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);
--
-- Restrições para tabelas `transferencia`
--
ALTER TABLE `transferencia`
ADD CONSTRAINT `transferencia_id_destinatario_foreign` FOREIGN KEY (`id_destinatario`) REFERENCES `users` (`id_user`),
  ADD CONSTRAINT `transferencia_id_user_foreign` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);
COMMIT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;