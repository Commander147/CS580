var connection;
var session;
module.exports = function(con,sess){
	connection = con;
	session = sess;
	return exports;
}

exports.check_login = function(req, res){
	
	//console.log(req.body);	

	var query = 'select * from Users where Email="' + req.body.username + '" AND Password = "' + req.body.password +'"'; 
	connection.query(query , function(err, data) {	
		//console.log(err);
		//console.log(data);
		var response;
		if(data.length == 1){
			response = true;
			res.cookie('login', 'true');
			res.cookie('id', data[0]['UserID']);
			connection.query('select * from Admin where UserID = ?', data[0]['UserID'] , function(err, data) {	
				if(data.length == 0){
					res.cookie('admin','false');
				}
				else{
					res.cookie('admin','true');
				}

				res.contentType('application/json');
		  		var json = JSON.stringify(response);
		  		res.send(json);
			});	
		}
		else{
			response = false;
			res.clearCookie('login');
			res.clearCookie('id');
			res.clearCookie('admin');

			res.contentType('application/json');
  			var json = JSON.stringify(response);
  			res.send(json);
		}

	});
}