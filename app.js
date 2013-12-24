var geocoder;
var map;
function initialize() {
	geocoder = new google.maps.Geocoder();
	var mapOptions = {
		zoom: 8,
		center: google.maps.LatLng(-34.397, 150.644)
	}
	map = new google.maps.Map(document.getElementById("map"), mapOptions);


	document.querySelector('button').onclick = function(){
		var text = document.querySelector('textarea').value;
		text = text.split("\n");

		var q = async.queue(function (task, callback) {
			console.log('geocoding',task.addr);
			codeAddress(task.addr,function(result){
				if(result){
					text[task.i] = text[task.i] + '\t' + result.lat() + '\t'+result.lng();
				}
				document.querySelector('textarea').value = text.join("\n");
				callback();
			},true);
		}, 2);

		text.forEach(function(addr,i){
			q.push({i: i,addr:addr}, function (err) {
			    if(q.length() == 0){
			    	console.log('Completed all')
			    }
			});
		});
	}
}

function codeAddress(address,callback,retry) {
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location
			});
			window.setTimeout(function(){
				callback(results[0].geometry.location);
			},Math.random()*1000);
		} else {
			console.log("Geocode was not successful for the following reason: " + status);
			if(retry){
				console.log('Retrying '+address);
				window.setTimeout(function(){
					codeAddress(address,callback,false);
				},5000);
			} else {
				console.log('Not retrying'+address);
				window.setTimeout(function(){
					callback(false);
				},5000);
			}
		}
	});
}

window.onload = initialize;