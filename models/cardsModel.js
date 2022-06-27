pool = require('./connection.js')

module.exports.getCards = async function () {
    try {
        let sql = `select * from card`;
        let res = await pool.query(sql);
        return { status: 200, result: res.rows };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}