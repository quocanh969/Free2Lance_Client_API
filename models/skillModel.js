var db = require('../utils/db');

module.exports = {
    getSkills: () => {
        return db.query(`SELECT * FROM SKILLs WHERE status = ${true}`);
    }
}