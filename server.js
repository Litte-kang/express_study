var express = require('express');
var mongoose = require('mongoose');
var server = express();
var fs = require('fs');

mongoose.connect("mongodb://localhost/innotek_database");

var midwareInfosSchema = mongoose.Schema({
	
	midid:String,
	mididCh:String,
	monitorType:Array
});
var midwareInfos = mongoose.model('midware_infos', midwareInfosSchema, 'midware_infos');

var tobaccoInfosSchema = mongoose.Schema({

	midid:String,
	address:String,
	infoType:Number,
	isBelow:Number,
	data:Array
});
var tobaccoInfos = mongoose.model('tobacco_infos', tobaccoInfosSchema, 'tobacco_infos');

var seedlingInfosSchema = mongoose.Schema({

	midid:String,
	address:String,
	data:Array
});
var seedlingInfos = mongoose.model('seedling_infos', seedlingInfosSchema, 'seedling_infos');

server.use(function(req, res, next){

	console.log(req.method + " " + "http://" + req.headers.host + req.url);
	next();
});

server.use(express.static(__dirname + '/'));

server.get('/', function(req, res, next){

	fs.readFile("./index.html", function(err, chunk){
	
		res.setHeader("Content-Type", "text/html");
		res.write(chunk);
		res.end();
		
		next();
	});
});

server.get('/midwareInfo', function(req, res, next){
	
	midwareInfos.find(function(err, chunk){
	
		var infos = "";
		
		infos = chunk.length + "&";
		
		console.log(JSON.stringify(chunk));
		
		for (var i = 0; i < chunk.length; ++i)
		{
			infos = infos + chunk[i].mididCh + ',' + chunk[i].midid + ',' + chunk[i].monitorType.length + ',' + chunk[i].monitorType + ',&';
		}
		
		infos = infos + "&";
		
		console.log("infos: " + infos);
		
		res.write(infos);
		res.end();
		
		next();
	});
	
});

server.get('/tobacco_monitor', function(req, res, next){

	console.log(req.query.midid);
	
	tobaccoInfos.find({midid:req.query.midid}, function(err, chunk){
	
		var infos = "";
		
		if (err)
		{
			infos = "null";
		}
		else
		{
			for (var i = 0; i < chunk.length; ++i)
			{
				infos = infos + chunk[i].address + "</br>" + chunk[i].data + "&";
			}
		}
		
		console.log("infos: " + infos);
		
		res.write(infos);
		res.end();
		
		next();
	});	
});

server.get('/seedling_monitor', function(req, res, next){

	console.log(req.query.midid);
	
	seedlingInfos.find({midid:req.query.midid}, function(err, chunk){
	
		var infos = "";
		
		if (err)
		{
			infos = "null";
		}
		else
		{
			for (var i = 0; i < chunk.length; ++i)
			{
				infos = infos + chunk[i].address + "</br>" + chunk[i].data + "&";
			}
		}
		
		console.log("infos: " + infos);
		
		res.write(infos);
		res.end();
		
		next();
	});	
});

var obj = server.listen(8080, function(){

	console.log("listen on port %d", obj.address().port);
});















