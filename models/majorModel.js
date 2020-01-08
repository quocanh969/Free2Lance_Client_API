var db = require('../utils/db');

module.exports = {
    getAll:() => {
        return db.query('SELECT * FROM majors');
    },
    getTop:() => {
        return db.query('SELECT * FROM majors WHERE id != 1 LIMIT 6');
    }
}