var map = null;
var currentInfoWindow = null;

var spot_array = new Array;
var num_spots = 0;
var display_spot_id = null;



$(function(){

	// map読み込み
	initialize();

	getSpots(map.center);

	// search
	$("#search").keypress(function(e){
		// pressed enter
		if(e.which && e.which==13) {
			var address = $(this).val();
			$(this).val("searching");
			searchPlaces(address);
			$(this).val("");
			$(this).attr({placeholder: "search"});
		}
	});


});





// map初期化
function initialize() {
	google.maps.visualRefresh = true;

	var latlng = new google.maps.LatLng(35.011636 , 135.768029);
	var myOptions = {
		zoom: 13,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		disableDefaultUI: true,
		zoomControl: true,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.SMALL
		}
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
	google.maps.event.addListener(map, "dragend", function() {
		getSpots(map.center);
	});
}

//---------------------------------------------------------
// CGI
//---------------------------------------------------------
function getSpots(location) {
	var lat = location.lat();
	var lng = location.lng();
	$.ajax({
		url: "/api/spot.pl?lat="+lat+"&lng="+lng,
		cache: false,
		dataType: "json",
		success: function(json) {
			loadData(json);
		}
	});
}

// 取得したjsonデータ読み込み
function loadData(result) {
	if (result.status != "OK"){
		alert("error!");
		return;
	}
	
	var data = result.results;
	var i = data.length;
	while(i-- > 0) {
		var spot = data[i];
		addSpot(spot);
	}
	console.log(num_spots);
}


function addSpot(spot) {
	var id = spot._id;

	// check loaded?
	if ( spot_array[id] ){
		return;
	}
	spot_array[id] = spot;
	num_spots++;
	
	var location = new google.maps.LatLng(spot.location.lat, spot.location.lng);

	//marker
	var marker = new google.maps.Marker({
		position: location,
		map: map,
		icon: markerImage(spot.wifi.class)
	});
	var infoWindow = new google.maps.InfoWindow({
		content: '<a href="javascript:openDetailWindow(\'' + id +'\');" class="info-a"><span class="info-span">' + spot.name + '</span>' + '<i class="uk-icon-circle-arrow-right info-detail"></i></a>'
	});

	google.maps.event.addListener(marker, "click", function() {
		if ( currentInfoWindow ){
			currentInfoWindow.close();
		}

		infoWindow.open(map, marker);
		currentInfoWindow = infoWindow;
	});

	//list
	$("#spot-list").prepend(
		'<div class="spot-panel" id="spot-' + id + '">' +
			'<img src="' + iconImage(spot.wifi.class) + '" class="spot-panel-icon">' +
			'<div class="spot-panel-main">' +
				'<h4>' + spot.name + '</h4>' +
				'<a href="javascript:openDetailWindow(\'' + id + '\');">詳細</a>' +
			'</div>' +
			'<div class="clear-both"></div>' +
		'</div>'
	);

	$("#spot-"+id).click(function() {
		if ( currentInfoWindow ){
			currentInfoWindow.close();
		}

		if ( $("#detail-window") ){
			closeDetailWindow();
		}

		map.setZoom(17);
		map.panTo(location);
		infoWindow.open(map, marker);
		currentInfoWindow = infoWindow;
	});

	
	$("#spot-"+id+" a").click(function() {
		if ( currentInfoWindow ){
			currentInfoWindow.close();
		}
		infoWindow.open(map, marker);
		currentInfoWindow = infoWindow;

	});

	
}



function openDetailWindow(id) {
	if ( display_spot_id == id ){
		return;
	}
	
	display_spot_id = id;
	var spot = spot_array[id];
	console.log(spot);

	// 中心合わせ
	map.setZoom(18);
	map.panTo(new google.maps.LatLng(spot.location.lat, spot.location.lng) );

	// 表示画面の真ん中に
	var bounds = map.getBounds();
	var lat_top = bounds.getNorthEast().lat();
	var lat_bottom = bounds.getSouthWest().lat();
	var new_center_lat = ( lat_top + 3*lat_bottom ) / 4;
	map.panTo( new google.maps.LatLng( new_center_lat, map.getCenter().lng() ) );


	// detail window表示
	var wifi_power = (spot.wifi.power == "false")? "なし" : spot.wifi.power;

	var foursquare = (spot.foursquare) ? 
		'href="https://ja.foursquare.com/v/' + spot.foursquare.id + '" target="_blank">' :
		'href="" onclick="return false;">';

	// tag
	var tag_list = "";
	spot.spot.category.forEach(function(tag) {
		tag_list += '<span class="tag">' + tag.string + '</span>';
	});

	var tips =	'<li>' +
					'<div class="uk-comment-header tip">' +
						'<img class="uk-comment-avatar" src="img/icon.jpg" alt="">' +
						'<div class="tip-main">' +
							'<h4>tattii<small>2013.10.08 03:42</small></h4>' +
							'<div class="tip-message">' +
								'京都市が運営する公衆無線LAN。3時間で自動切断される。' +
							'</div>' +
						'</div>' +
						'<div class="clear-both"></div>' +
					'</div>' +
				'</li>';


	$("#container").append(
		'<div id="detail-window">' +
			'<div class="detail-header">' +
				'<img src="' + wifiImage(spot.wifi.class) + '">' +
				'<div class="detail-title">' +
					'<h2>' + spot.name + '</h2>' +
					'<div class="detail-title-detail">' +
						'<i class="uk-icon-map-marker"></i><span>' + spot.spot.address + '</span><br>' +
						'<i class="uk-icon-globe"></i><span id="detail-title-url"><a href="' + spot.spot.url + '"target="_blank">' + spot.spot.url + '</a></span>' +
						'<i class="uk-icon-phone"></i><span>' + spot.spot.tel + '</span>' +
					'</div>' +
				'</div>' +
				'<div id="detail-close"><a href="javascript:closeDetailWindow();" class="uk-icon-remove uk-icon-medium"></a></div>' +
				'<div class="clear-both"></div>' +
			'</div>' +
			'<div class="detail-main">' +
				'<div class="detail-wifi">' +
					'<h3><i class="uk-icon-rss"></i> ' + spot.wifi.class + '</h3>' +
					'<table class="detail-wifi-table">' +
						'<tr><th><i class="uk-icon-time"></i></th><td>' + spot.spot.hours.string  + '</td></tr>' +
						'<tr><th><i class="uk-icon-power-off"></i></th><td>' + wifi_power + '</td></tr>' +
						'<tr><th><i class="uk-icon-tag"></i></th><td class="tag">' + tag_list  + '</td></tr>' +
						'<tr><th><i class="uk-icon-external-link"></i></th><td><a href="' + spot.wifi.url + '" target="_blank">' + spot.wifi.url + '</a></td></tr>' +
						'<tr><th><i class="uk-icon-check"></i></th><td>' + spot.wifi.use  + '</td></tr>' +
					'</table>' +
					'<div class="detail-wifi-footer">' +
						'<a class="uk-icon-button uk-icon-share" href="/spot/' + id + '"></a>' +
						'<a class="uk-icon-button uk-icon-foursquare" ' + foursquare + '</a>' +
						'<a class="uk-icon-button uk-icon-twitter" href=""></a>' +
						'<a class="uk-icon-button uk-icon-facebook" href=""></a>' +
					'</div>' +
				'</div>' +
				'<div class="detail-tips">' +
					'<h3>Tips</h3>' +
					'<ul class="uk-comment-list">' + tips + '</ul>' +
				'</div>' +
				'<div class="clear-both"></div>' +
			'</div>' +
		'</div>'
	);
}


function closeDetailWindow() {
	$("#detail-window").remove();
	display_spot_id = null;
}



//---------------------------------------------------------
// 検索
//---------------------------------------------------------

function search(address){
	var geocoder = new google.maps.Geocoder();
	console.log(address);
	geocoder.geocode(
		{'address': address}, 
		function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var location = results[0].geometry.location;
				var name = results[0].formatted_address;
				addMarker(location, name);

			}else{
				alert("error");
			}
		});
}

function searchPlaces(keyword) {
	var places = new google.maps.places.PlacesService(map);
	places.search({
		location: map.center,
		radius: 50000,
		keyword: keyword
	},
	function (results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK){
			map.setCenter(results[0].geometry.location);
			map.setZoom(17);
			getSpots(results[0].geometry.location);
		}else{
			alert("error");
		}
	});
}





/* 画像の管理 */
var created = {
	"kyoto_wifi_1": 1,
	"kyoto_wifi_2": 1,
	"freespot": 1,
	"starbucks": 1,
	"sevenspot": 1,
	"freemobile": 1,
	"famima": 1,
};

function iconImage(name) {
	if ( created[name] ){	
		return "img/" + name + "_icon.png";
	}
}

function markerImage(name) {
	if ( created[name] ){	
		return "img/" + name + "_marker.png";
	}
}

function wifiImage(name) {
	if ( created[name] ){	
		return "img/" + name + ".png";
	}
}



