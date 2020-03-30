const express = require('express')
const app = express()
const port = 8082
const request = require('request');
	const usersource = process.env.QUOTES_USER_URL || "http://userservice:8080";
	const ordersource = process.env.QUOTES_ORDER_URL || "http://orderservice:8081";

app.get('/orderdetails/:id', (req, res) => {
	
	request(usersource+'/user/'+req.params.id, { json: true }, (usererr, userresp, userbody) => {
	  if (usererr || userresp.statusCode != 200) {
	  	 	res.status(500)
	  	  	res.send("Error while getting users from "+usersource) 
	  } else{
	  	request(ordersource+'/order/'+req.params.id, { json: true }, (ordererr, orderresp, orderbody) => {
	  		if (ordererr || orderresp.statusCode != 200) {
	  			res.status(500)
	  	  		res.send("Error while getting orders from "+ordersource) 
	  		} else{
	  			res.status(200)
	  		  	res.send({
		  			"userDetails":userbody,
		  			"orderDetails":orderbody
		  		});
	  		}
	  	});
	  }
	});
})


app.use(express.static('public'))

app.listen(port, () => console.log(`Aggregator-Service app listening on port ${port}!`))