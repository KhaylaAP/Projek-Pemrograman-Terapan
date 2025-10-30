module.exports = {
    db: {
        host: process.env.MYSQL_HOST || "mysql",
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "1234567890",
        database: process.env.MYSQL_DATABASE || "ProgTer",
        port: process.env.MYSQL_PORT || 3306
    }
};