var mysql = require('mysql');
var crypto = require('crypto');

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
            var sql = `INSERT INTO USERs( password, name, address, email, phone, yob, gender, role, avatarLink, status, accType, id_social)
             VALUES('${user.password}', '${user.name}', '${user.address}', '${user.email}', '${user.phone}',${user.yob},${user.gender},${user.role}, '', ${false}, ${0}, '')`;
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
    addFacebookUser: (user, role) => {
        const password = crypto.randomBytes(4).toString('hex');
        return new Promise((resolve, reject) => {
            var sql = `INSERT INTO USERs(password, name, address, email, phone, yob, gender, role, avatarLink, status, accType, id_social)
             VALUES('${password}', '${user.name}', '', '${user.email}', '',${1980},${0},${role}, '${user.avatarLink}', ${true}, ${1}, '${user.id_social}')`;
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
    addGoogleUser: (user, role) => {
        const password = crypto.randomBytes(4).toString('hex');
        return new Promise((resolve, reject) => {
            var sql = `INSERT INTO USERs( password, name, address, email, phone, yob, gender, role, avatarLink, status, accType, id_social)
             VALUES('${password}', '${user.name}', '', '${user.email}', '${user.address}',${1980},${0},${role}, '${user.avatarLink}', ${true}, ${2}, '${user.id_social}')`;
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
    addTutor: (user, id) => {
        return new Promise((resolve, reject) => {
            console.log("This is id: " + id);
            var sql = `INSERT INTO TUTORs(id_user, price, major, levelTeaching, evaluation, areaCode, introduction)
             VALUES('${id}', ${0}, '${user.major}',${user.levelTeaching}, ${0},${0},'')`;
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
    getLearnerDetail: (id) => {
        return new Promise((resolve, reject) => {
            var sql = `select * from users as U where id = ${id} and status=${true}`;
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
        })
    },
    getTutorDetail: (id) => {
        return new Promise((resolve, reject) => {
            var sql = `select U.id, U.name, U.role, U.address, U.email, U.phone, U.gender, U.yob, U.avatarLink, 
            T.price, T.levelTeaching, T.major, M.name as major_name , T.evaluation, T.areaCode, A.area, T.introduction
            from users as U, tutors as T, majors as M, areas as A  
            where U.id = T.id_user and T.major = M.id and A.id_area = T.areaCode and 
            U.id = ${id} and U.role = ${1}`;
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
        })
    },
    updateBasicInfo: (id, info) => {
        return new Promise((resolve, reject) => {
            var sql = `update users set name = '${info.name}', address = '${info.address}', phone = '${info.phone}', yob = ${info.yob}, avatarLink = '${info.avatarLink}', gender = ${info.gender}, isEditting = ${false}
                    where id = ${id}`;
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
        })
    },
    updateProfessionalInfo: (id, info) => {
        return new Promise((resolve, reject) => {
            var sql = `update tutors set price = ${info.price}, major = ${info.major}, levelTeaching = ${info.levelTeaching}, introduction = '${info.introduction}', areaCode = ${info.areaCode}, isEditting = ${false}
                    where id_user = ${id}`;
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
        })
    },
    updatePassword: (id, password) => {
        return new Promise((resolve, reject) => {
            var sql = `update users set password = '${password.newPassword}', isEditting = ${false} where id = ${id}`;
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
}
