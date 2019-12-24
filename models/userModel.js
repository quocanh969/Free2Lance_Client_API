var db = require('../utils/db');

module.exports = {
    getAll: (key, value) => {
        if (key)
            return db.query(`SELECT * FROM USERs WHERE ${key} LIKE ${value} and status= ${true}`);
        return db.query(`SELECT * FROM USERs WHERE status=${true}`);
    },
    getByEmail: (email, status) => {
        if (status === null)
            return db.query(`SELECT * FROM USERs WHERE email = '${email}' and isActivated = ${true}`);
        else
            return db.query(`SELECT * FROM USERs WHERE email = '${email}' and status= ${status} and isActivated = ${true}`);
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
    activateAcc: (id) => {
        return db.query(`update users set status = ${true}, isActivated  = ${true} where id = ${id}`);
    },
    getTopTutor: () => {
        return db.query(`select u.id, u.name, u.email, u.yob, u.gender, u.phone, u.address, t.price,
        m.id as id_major, m.name as major_name, s.id_skill ,s.skill, s.skill_tag, u.avatarLink, t.evaluation, t.introduction, a.id_area, a.area
        from users as u, (select * from tutors order by evaluation limit 5) as t, areas as a, skills as s, skill_table as sc, majors as m
        where u.id = t.id_user and u.role = 1 and t.areaCode = a.id_area and m.id = t.major and sc.id_teacher = u.id and sc.skill_code = s.id_skill
        and u.status = 1;`);
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
    },
    getTutorCount:() => {
        return db.query(`select COUNT(*) as count from tutors`);
    },
    getTutorList: (area, price, major, name, skip) => {
        console.log(major);
        if (price > 0)
            return db.query(`select u.id, u.name, u.email, u.yob, u.gender, u.phone, u.address, t.price,
            m.id as id_major, m.name as major_name, s.id_skill ,s.skill, s.skill_tag, u.avatarLink, t.evaluation, t.introduction, a.id_area, a.area
            from users as u, tutors as t, areas as a, skills as s, skill_table as sc, majors as m
            where u.id = t.id_user and u.role = 1 and t.areaCode = a.id_area and m.id = t.major and sc.id_teacher = u.id and sc.skill_code = s.id_skill
            and u.status = 1 and a.area like '%${area}%' and t.price <= ${price} and m.name like '%${major}%' and u.name like '%${name}%';`);
        else
            return db.query(`select u.id, u.name, u.email, u.yob, u.gender, u.phone, u.address, t.evaluation, t.price,
            m.id as id_major, m.name as major_name, s.id_skill ,s.skill, s.skill_tag, u.avatarLink, t.evaluation, t.introduction, a.id_area, a.area
            from users as u, tutors as t, areas as a, skills as s, skill_table as sc, majors as m
            where u.id = t.id_user and u.role = 1 and t.areaCode = a.id_area and m.id = t.major and sc.id_teacher = u.id and sc.skill_code = s.id_skill
            and u.status = 1 and a.area like '%${area}%' and m.name like '%${major}%' and u.name like '%${name}%';`);
    },
    editSkill: (id, skill, type) => {
        if (type === 0) {
            return db.query(`delete from skill_table where id_teacher = ${id} and skill_code = ${skill}`);
        }
        else {
            return db.query(`insert into skill_table (id_teacher, skill_code) values (${id}, ${skill})`);
        }
    },
    calculateEvaluation: (id, avgRating) => {
        return db.query(`update tutors set evaluation = ${avgRating} where id_user = ${id}`)
    },
    getTutorCurrentPrice: (id) => {
        return db.query(`select price from tutors where id_user = ${id}`);
    }
}