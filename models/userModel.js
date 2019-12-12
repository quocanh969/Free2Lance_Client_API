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
    getByFacebookId:id=>{
        return db.query(`SELECT * FROM USERs WHERE accType = 1 AND id_social = '${id}'`);
    },
    getByGoogleId:id=>{
        return db.query(`SELECT * FROM USERs WHERE accType = 2 AND id_social = '${id}'`);
    },
    register:user=>{
        return db.add(user);
    },
    addFacebookUser:(user,role)=>{
        return db.addFacebookUser(user,role);
    },
    addGoogleUser:(user,role)=>{
        return db.addGoogleUser(user,role);
    },
    addTutor: (user,id)=>{
        return db.addTutor(user,id);
    },    
}