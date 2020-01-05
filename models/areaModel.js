var db = require('../utils/db');

module.exports = {
    getAll: () => {
        return db.query(`SELECT * FROM areas WHERE status = ${true}`);
    }
}