var mysql = require('mysql');

var createConnection = () => {
    return mysql.createConnection({
        /*
        host: 'remotemysql.com',
        port: '3306',
        user: 'NgdWTXVp3P',
        password: 'rqBTpHH08l',
        database: 'NgdWTXVp3P',
        dateStrings: true,
        timezone: 'Z',
        */
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '30111998',
        database: 'uber_tutor_admin',
        dateStrings: true,        
        timezone: 'Z',
        
        typeCast: function castField(field, useDefaultTypeCasting) {

            if ((field.type === "BIT") && (field.length === 1)) {

                var bytes = field.buffer();

                return (bytes[0] === 1);

            }

            return (useDefaultTypeCasting());

        }
    });
}

module.exports = {
    query: sql => {
        return new Promise((resolve, reject) => {
            var connection = createConnection();
            connection.connect();
            connection.query(sql, (error, results, fields) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
                connection.end();
            });
        });
    },
    add: user => {
        return new Promise((resolve, reject) => {
            var sql = `INSERT INTO USERs(username, password, name, address, email, phone, yob, gender, role, avatarLink, status, accType, id_social)
             VALUES('${user.username}', '${user.password}', '${user.name}', '${user.address}', '${user.email}', '${user.phone}',${user.yob},${user.gender},${user.role}, '', ${false}, ${0}, '')`;            
            var connection = createConnection();
            connection.connect();
            connection.query(sql, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
                connection.end();
            });
        });
    },
    addTutor: (user,id)=>{
        return new Promise((resolve, reject) => {
            var sql = `INSERT INTO TUTORs(id, price, major, subjectTeaching, levelTeaching, evaluation, successRate, areaCode, area, introduction)
             VALUES('${id}', ${0}, '${user.major}', '',${user.levelTeaching}, ${0}, ${0},${0},'','')`;            
            var connection = createConnection();
            connection.connect();
            connection.query(sql, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
                connection.end();
            });
        });
    }
}
