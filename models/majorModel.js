var db = require('../utils/db');

module.exports = {
    getAll:() => {
        return db.query('SELECT * FROM MAJORs');
    },
    getTop:() => {
        return db.query('SELECT * FROM MAJORs LIMIT 6');
    }
}