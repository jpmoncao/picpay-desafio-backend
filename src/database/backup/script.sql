SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `banco`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `shopkeepers`
--

CREATE TABLE `shopkeepers` (
  `id_shopkeeper` int(10) UNSIGNED NOT NULL,
  `id_user` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

-- --------------------------------------------------------

--
-- Estrutura para tabela `transfers`
--

CREATE TABLE `transfers` (
  `id_transfer` int(10) UNSIGNED NOT NULL,
  `id_payer` int(10) UNSIGNED NOT NULL,
  `id_payee` int(10) UNSIGNED NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE `users` (
  `id_user` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `cpf_cnpj` varchar(14) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `person_type` varchar(1) NOT NULL DEFAULT 'F',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

-- --------------------------------------------------------

--
-- Estrutura para tabela `wallets`
--

CREATE TABLE `wallets` (
  `id_wallet` int(10) UNSIGNED NOT NULL,
  `id_user` int(10) UNSIGNED NOT NULL,
  `balance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `shopkeeper` varchar(1) NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `shopkeepers`
--
ALTER TABLE `shopkeepers`
  ADD PRIMARY KEY (`id_shopkeeper`),
  ADD KEY `shopkeepers_id_user_foreign` (`id_user`);

--
-- Índices de tabela `transfers`
--
ALTER TABLE `transfers`
  ADD PRIMARY KEY (`id_transfer`),
  ADD KEY `transfers_id_payer_foreign` (`id_payer`),
  ADD KEY `transfers_id_payee_foreign` (`id_payee`);

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- Índices de tabela `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`id_wallet`),
  ADD KEY `wallets_id_user_foreign` (`id_user`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `transfers`
--
ALTER TABLE `transfers`
  MODIFY `id_transfer` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `shopkeepers`
--
ALTER TABLE `shopkeepers`
  ADD CONSTRAINT `shopkeepers_id_user_foreign` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

--
-- Restrições para tabelas `transfers`
--
ALTER TABLE `transfers`
  ADD CONSTRAINT `transfers_id_payee_foreign` FOREIGN KEY (`id_payee`) REFERENCES `users` (`id_user`),
  ADD CONSTRAINT `transfers_id_payer_foreign` FOREIGN KEY (`id_payer`) REFERENCES `users` (`id_user`);

--
-- Restrições para tabelas `wallets`
--
ALTER TABLE `wallets`
  ADD CONSTRAINT `wallets_id_user_foreign` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
