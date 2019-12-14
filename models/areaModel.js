var db = require('../utils/db');

module.exports = {
    getAll: () => {
        return db.query(`SELECT * FROM AREAS WHERE status = ${true}`);
    }
}