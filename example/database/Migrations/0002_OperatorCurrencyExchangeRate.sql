USE ${MYSQL_DATABASE};

CREATE TABLE `OperatorCurrencyExchangeRate` (
    CONSTRAINT FK_OperatorCurrencyExchangeRate_UserId_UserId FOREIGN KEY (UserId) REFERENCES `User` (UserId),
    CONSTRAINT FK_OperatorCurrencyExchangeRate_CurrencyFromId_CurrencyId FOREIGN KEY (CurrencyFromId) REFERENCES `Currency` (CurrencyId),
    CONSTRAINT FK_OperatorCurrencyExchangeRate_CurrencyToId_CurrencyId FOREIGN KEY (CurrencyToId) REFERENCES `Currency` (CurrencyId),
    `OperatorCurrencyExchangeRateId` bigint unsigned auto_increment NOT NULL PRIMARY KEY,
    `ExchangeRate` decimal(10,4) NOT NULL,
    `UserId` bigint unsigned NOT NULL,
    `CurrencyFromId` bigint unsigned NOT NULL,
    `CurrencyToId` bigint unsigned NOT NULL
);


INSERT INTO Migration (Description) VALUES('${THIS_FILE_NAME}');