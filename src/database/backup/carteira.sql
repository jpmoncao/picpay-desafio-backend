CREATE TABLE `carteira` (
    `id_carteira` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `id_user` int(11) NOT NULL,
    `saldo` decimal(15, 2) NOT NULL DEFAULT 0.00,
    `lojista` char(1) NOT NULL DEFAULT 'N' COMMENT 'Deve ser alterado ao criar um lojista',
    PRIMARY KEY (`id_carteira`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1 COLLATE = latin1_bin