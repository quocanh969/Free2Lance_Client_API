var db = require('../utils/db');

module.exports = {
    getSkills: () => {
        return db.query(`SELECT * FROM skills WHERE status = ${true}`);
    }
}