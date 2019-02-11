

////////////////////////////////////////////////////
////////  			HTTP SERVER     		 ///////
///////            version 0.5.0            ///////
//////////////////////////////////////////////////

var express     = require('express');
var http        = require('http');
var path        = require('path');

var app = express();
var httpServer = new http.Server(app);
var port = 3000;
var htmlFile = path.resolve(__dirname, './index.html');

var io = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 });


function tryit() {
    "use strict";

    function Product(id, name, price, quantity) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    Product.prototype = {
        add : function (count) {
            this.quantity += count === 0 || count ? count : 1;
        },

        remove : function (count) {
            this.quantity -= count === 0 || count ? count : 1;
        },

        setPrice : function (value) {
            this.price = value;
        },

        toString : function () {
            return this.name;
        }
    };

    function Inventory() {
        this.items = Array.prototype.slice.call(arguments);
    }

    Inventory.prototype = {
        add : function (item) {
            this.items.push(item);
        },

        remove : function (item) {
            var index = this.items.indexOf(item);

            if (index > -1) {
                this.items.splice(index, 1);
            }
        },

        getTotalPrice : function () {
            var sum = this.items.reduce(function (previousValue, currentValue, index, array) {
				console.log('prev ' + previousValue)
				console.log('cur ' + currentValue)
				console.log('index ' + index)
				console.log('array ' + array)
                return previousValue + currentValue.price * currentValue.quantity;
            }, 0);

            return sum;
        }
    };

    var peaches = new Product(0, "peaches", 5, 5000),
        carrots = new Product(1, "carrots", 2, 10000),
        bananas = new Product(2, "bananas", 6, 3000),
        inventory = new Inventory(peaches, carrots, bananas);

    return inventory.getTotalPrice();
	
	
};
let obj = {}
let obj2 = {
		message: "hi",
		test: []
		}
obj = JSON.parse(JSON.stringify(obj2))
obj.test.push("hi")
console.log("-----------------------test----------------")
console.log(obj2)

setInterval(function(){
  io.emit('time', new Date);
  console.log("emitting date " + new Date)
	}, 25000);

app.get('/*', function(req, res) {
		console.log(tryit());
		res.sendFile(htmlFile)
		});

httpServer.listen(port);    

console.log("running on port " + port);
