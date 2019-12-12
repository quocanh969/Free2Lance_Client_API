var db = require('../utils/db');

module.exports = {
    getAll:(key, value) => {
        if (key)
            return db.query(`SELECT * FROM USERs WHERE ${key} LIKE ${value}`);
        return db.query(`SELECT * FROM USERs`);
    },
    getByUsername:username => {
        return db.query(`SELECT * FROM USERs WHERE username = '${username}'`);
    },
    register:user=>{
        return db.add(user);
    },
    addTutor: (user,id)=>{
        return db.addTutor(user,id);
    },

}