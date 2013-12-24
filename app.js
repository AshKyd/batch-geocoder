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
				text[task.i] = text[task.i] + '\t' + result.lat() + '\t'+result.lng();
				callback();
			});
		}, 2);

		text.forEach(function(addr,i){
			q.push({i: i,addr:addr}, function (err) {
			    if(q.length() == 0){
			    	document.querySelector('textarea').value = text.join("\n");
			    }
			});
		});
	}
}

function codeAddress(address,callback) {
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location
			});
			callback(results[0].geometry.location);
		} else {
			console.log("Geocode was not successful for the following reason: " + status);
			callback(false);
		}
	});
}

window.onload = initialize;