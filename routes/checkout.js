var express = require('express');
var router = express.Router();
var braintree = require('braintree');

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    // Use your own credentials from the sandbox Control Panel here
    merchantId: '3xj4zw2pjhs26929',
    publicKey: '9vm3gb2272p4kcpb',
    privateKey: 'c3c33d8fb55cd194145efc975b8828a3'
  });

  //generate a client token -ssk
  gateway.clientToken.generate({
	  customerId: 887631396
	}, function (err, response) {
	  var clientToken = response.clientToken
	});
	
	//for get methods
	router.get('/', function(req, res, next) {
		gateway.clientToken.generate({}, function (err, response) {
			res.send(response.clientToken);
		}); 
	});


//post methods
router.post('/checkout', function(req, res, next) {
  // Use the payment method nonce here
 	 var nonceFromTheClient = req.body.paymentMethodNonce;
  // Create a new transaction for 10 Euros
  var newTransaction = gateway.transaction.sale({
    amount: '10.00',
    paymentMethodNonce: nonceFromTheClient,
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true
    }
  }, function(error, result) {
      if (result) {
        res.send(result);
      } else {
        res.status(500).send(error);
      }
  });
});

module.exports = router;
