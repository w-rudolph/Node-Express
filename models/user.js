const db = require('./config');
const User = {};

User.getUsers = (cb) => {
    let sql = 'select * from `user`';
    db.query(sql,(err, rows, fields) => {
       cb(err, rows, fields);
    });
}
User.authUser = ((name, pwd, cb) =>{
    let sql = "select * from `user` where user.name = ? and user.password = ? ";
    db.query(sql,[name, pwd],(err, rows, fields) => {
       cb(err, rows, fields);
    });
});
User.getUserByName = (name, cb) => {
	let sql = "select * from `user` where user.name = ?";
	db.query(sql,[name],(err, rows, fields) => {
       cb(err, rows, fields);
    });
}
User.register =((name, pwd, cb) =>{
    let sql = "insert into `user`(id, name, password) values(?,?,?)";
	//console.log(sql);
	User.getUserByName(name, (err, rows, fields)=>{
		if(!err && rows.length === 1){
			cb('USER_EXIST');
		}
		if(!err && rows.length === 0){
			db.query(sql,[null, name, pwd],(err, rows, fields) => {
			   cb(null, {
				   id: rows.insertId,
				   name: name,
				   pwd: pwd
			   });
			});
		}
	})
    
})
module.exports = User;