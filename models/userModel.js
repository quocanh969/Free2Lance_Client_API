var db = require('../utils/db');

module.exports = {
    getAll: (key, value) => {
        if (key)
            return db.query(`SELECT * FROM USERs WHERE ${key} LIKE ${value} and status= ${true}`);
        return db.query(`SELECT * FROM USERs WHERE status=${true}`);
    },
    getByEmail: email => {
        return db.query(`SELECT * FROM USERs WHERE email = '${email}' and status= ${true}`);
    },
    getByFacebookId: id => {
        return db.query(`SELECT * FROM USERs WHERE accType = 1 AND id_social = '${id}' and status=${true}`);
    },
    getByGoogleId: id => {
        return db.query(`SELECT * FROM USERs WHERE accType = 2 AND id_social = '${id}' and status=${true}`);
    },
    register: user => {
        return db.add(user);
    },
    addFacebookUser: (user, role) => {
        return db.addFacebookUser(user, role);
    },
    addGoogleUser: (user, role) => {
        return db.addGoogleUser(user, role);
    },
    addTutor: (user, id) => {
        return db.addTutor(user, id);
    },
    getLearnerDetail: (id) => {
        return db.getLearnerDetail(id);
    },
    getTutorDetail: (id) => {
        return db.getTutorDetail(id);
    },
    getTutorSkills: (id) => {
        return db.query(`select ST.skill_code, S.skill_tag, S.skill from skill_table as ST, skills as S 
                        where ST.id_teacher = ${id} and ST.skill_code = S.id_skill and S.status = ${1}`);
    },
    getByID: (id) => {
        return db.query(`select * from users where id = ${id} and status=${true}`);
    },
    updateBasicInfo: (id, info) => {
        return db.updateBasicInfo(id, info);
    },
    updateProfessionalInfo: (id, info) => {
        return db.updateProfessionalInfo(id, info);
    },
    updatePassword: (id, password) => {
        return db.updatePassword(id, password);
    },
    recoverPassword: (id, newPassword) => {
        return db.query(`update users set password = '${newPassword}' where id = ${id}`);
    }
}