var db = require('../utils/db');

module.exports = {
    getContracts: (id, key) => {
        if (key === 0) {
            key = "u1.id";
        } else {
            key = "t.id_user";
        }
        return db.query(`select c.*, u1.name as learner, u1.avatarLink, u2.name as tutor, m.name as major_name
        from contracts as c, tutors as t, users as u1, users as u2, majors as m
        where c.id_learner = u1.id and c.id_tutor = t.id_user and c.id_tutor = u2.id and c.major = m.id and ${key} = ${id} and c.status = ${2}`);
    },
    getRating: (id) => {
        return db.query(`select sum(rating)/count(id) as avg from contracts as c, tutors as t where c.id_tutor = t.id_user and c.status = ${2} and c.id_tutor = ${id}`);
    },
    getContractDetail: (id) => {
        return db.query(`select c.*, u1.email as learner_email, u2.email as tutor_email, u1.name as learner_name, u2.name as tutor_name from contracts as c, users as u1, users as u2
                        where c.id_learner = u1.id and c.id_tutor = u2.id and c.id = ${id}`);
    },
    CreateContract: (id, body, currentPrice) => {
        return db.query(`insert into contracts (id_learner, id_tutor, StartDate, EndDate, EstimatedEndDate, totalPrice, status, complain, feedback, rating, major, description)
        values(${body.id}, ${body.id_tutor}, ${null}, ${null}, ${body.estimatedEndDate}, ${currentPrice}, ${0}, '', '', ${0}, ${body.major}, '${body.description}');`)
    },
    agreeToContract: (id_contract) => {
        let today = new Date();
        var year, month, date;
        year = String(today.getFullYear());
        month = String(today.getMonth() + 1);
        date = String(today.getDate());
        if (month.length === 1) month = "0" + month;
        if (date.length === 1) date = "0" + date;
        var fullDate = year + "-" + month + "-" + date;
        return db.query(`update contracts set StartDate = '${fullDate}', status = ${1} where id = ${id_contract}`)
    },
    rejectContract: (id_contract) => {
        return db.query(`delete from contracts where id = ${id_contract}`);
    },
    endContract: (id_contract, rating, complain, feedback) => {
        let today = new Date();
        var year, month, date;
        year = String(today.getFullYear());
        month = String(today.getMonth() + 1);
        date = String(today.getDate());
        if (month.length === 1) month = "0" + month;
        if (date.length === 1) date = "0" + date;
        var fullDate = year + "-" + month + "-" + date;
        return db.query(`update contracts set EndDate = '${fullDate}', status = ${2}, rating = ${rating}, complain = '${complain}', feedback = '${feedback}', totalPrice = ceiling((datediff(curdate(), StartDate))/3) * totalPrice * 2 where id = ${id_contract} and status != ${2}`)
    },
    payContract: (id_contract, rating, complain, feedback) => {
        let today = new Date();
        var year, month, date;
        year = String(today.getFullYear());
        month = String(today.getMonth() + 1);
        date = String(today.getDate());
        if (month.length === 1) month = "0" + month;
        if (date.length === 1) date = "0" + date;
        var fullDate = year + "-" + month + "-" + date;
        return db.query(`update contracts set EndDate = '${fullDate}', status = ${2}, rating = ${rating}, complain = '${complain}', feedback = '${feedback}' where id = ${id_contract} and status = ${3}`)
    },
    complainContract: (id_contract, complain) => {
        return db.query(`update contracts set complain='${complain}' where id = ${id_contract}`);
    },
    getActiveContracts: (id, key) => {
        if (key === 0) {
            key = "c.id_learner";
        } else {
            key = "c.id_tutor";
        }
        return db.query(`select c.*, u1.name as learner, u1.avatarLink, u2.name as tutor, m.name as major_name
        from contracts as c, tutors as t, users as u1, users as u2, majors as m
        where c.id_learner = u1.id and c.id_tutor = t.id_user and c.id_tutor = u2.id and c.major = m.id and ${key} = ${id} and c.status = ${1}`);
    },
    getExpiredContracts: (id, key) => {
        if (key === 0) {
            key = "c.id_learner";
        } else {
            key = "c.id_tutor";
        }
        return db.query(`select c.*, u1.name as learner, u1.avatarLink, u2.name as tutor, m.name as major_name
        from contracts as c, tutors as t, users as u1, users as u2, majors as m
        where c.id_learner = u1.id and c.id_tutor = t.id_user and c.id_tutor = u2.id and c.major = m.id and ${key} = ${id} and c.status = ${3}`);
    },
    getPendingContracts: (id, key) => {
        if (key === 0) {
            key = "c.id_learner";
        } else {
            key = "c.id_tutor";
        }
        return db.query(`select c.*, u1.name as learner, u1.avatarLink, u2.name as tutor, m.name as major_name
        from contracts as c, tutors as t, users as u1, users as u2, majors as m
        where c.id_learner = u1.id and c.id_tutor = t.id_user and c.id_tutor = u2.id and c.major = m.id and ${key} = ${id} and c.status = ${0}`);
    },
    getIncomeReport: (id) => {
        return db.query(`select * from contracts where id_tutor = ${id} and status = 2`);
    },
    getIncomeFromLastNDays: (id, days) => {
        return db.query(`select * from contracts where status = ${2} and EndDate between curdate() - interval ${days} day and curdate() and id_tutor = ${id}`)
    },
    getYearlyIncome: (id_tutor, year) => {
        return db.query(`
        SELECT
        idMonth,
        MONTHNAME(STR_TO_DATE(idMonth, '%m')) as m,
        IFNULL(sum(contracts.totalPrice), 0) as total
      FROM contracts
      RIGHT JOIN (
        SELECT 1 as idMonth
        UNION SELECT 2 as idMonth
        UNION SELECT 3 as idMonth
        UNION SELECT 4 as idMonth
        UNION SELECT 5 as idMonth
        UNION SELECT 6 as idMonth
        UNION SELECT 7 as idMonth
        UNION SELECT 8 as idMonth
        UNION SELECT 9 as idMonth
        UNION SELECT 10 as idMonth
        UNION SELECT 11 as idMonth
        UNION SELECT 12 as idMonth
      ) as Month
      ON Month.idMonth = month(EndDate) and year(contracts.EndDate) = ${year} and status = 2 and id_tutor = ${id_tutor}
      GROUP BY Month.idMonth order by idMonth
        `);
    },
    getIncomeByMonth: (id_tutor, year, month) => {
        return db.query(`select c.totalPrice, c.EndDate  from contracts as c where year(c.EndDate) = ${year} and month(c.EndDate) = ${month} and c.id_tutor = ${id_tutor} and status = 2`);
    },
    dueContracts: () => {
        return db.query(`update contracts set status = ${3}, totalPrice = ceiling((datediff(estimatedEndDate, StartDate))/3) * totalPrice * 2 where status = ${1} and datediff(curdate(), estimatedEndDate) >= 0`);
    },
}