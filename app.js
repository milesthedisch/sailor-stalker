var arDrone = require('ar-drone');
var http    = require('http');
var client = arDrone.createClient()
var pngStream = arDrone.createClient().getPngStream();

client.takeoff();

client.on('navdata', function(data){
	if ( data.demo.altitudeMeters > 0.600 ) {
		console.log( data.demo.altitudeMeters )
		client.after(1000, function(){
			this.up(0.5)
		}).after(1000, function(){
			this.stop()
			this.land()
		})
	}
})	

var lastPng;
pngStream
  .on('error', console.log)
  .on('data', function(pngBuffer) {
    lastPng = pngBuffer;
  });

var server = http.createServer(function(req, res) {
  if (!lastPng) {
    res.writeHead(503);
    res.end('Did not receive any png data yet.');
    return;
  }

  res.writeHead(200, {'Content-Type': 'image/png'});
  res.end(lastPng);
});

server.listen(8080, function() {
  console.log('Serving latest png on port 8080 ...');
});