USE ${MYSQL_DATABASE};

CREATE TABLE `Currency` (
    `CurrencyId` bigint auto_increment NOT NULL PRIMARY KEY,
    `Name` varchar(10) NOT NULL UNIQUE
);

INSERT INTO `Currency` (`Name`) VALUES('RUB');
INSERT INTO `Currency` (`Name`) VALUES('CNY');
INSERT INTO `Currency` (`Name`) VALUES('USD');
INSERT INTO `Currency` (`Name`) VALUES('EUR');

INSERT INTO Migration (Description) VALUES('${THIS_FILE_NAME}');