var db = require('../utils/db');

module.exports = {
    getAll:() => {
        return db.query('SELECT * FROM USERs');
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