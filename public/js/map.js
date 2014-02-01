var map = null;
var currentInfoWindow = null;

var num_spot = 0;
var display_spot_id = null;
var display_detail_main = null;

var marker_list = new Object;

var breakpoint = 480;
var mobile_device = false;

var currentRequest;


$(document).ready(function(){
	// 処理の振り分け mobile first
	if ( $(document).width() <= breakpoint ){
		mobile_device = true;
	}

	$("#container").append("<div id='message'>loading map...</div>");

	var query = getURLQuery();

	if ( query.lat && query.lng ){
		var position = new google.maps.LatLng(query.lat, query.lng);
		initializeMap(position);

	// 現在地
	}else if ( navigator.geolocation ){
		navigator.geolocation.getCurrentPosition(
			function (position){
				var position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				initializeMap(position);
			},
			function (error){
				initializeMap();
			},
			{ timeOut: 1000 }
		);
	}else{
		initializeMap();
	}



	if (! mobile_device ){
		$("#search").show();
	}
	// search
	$("#search-input").click(function(){
		if ( currentInfoWindow ){
			currentInfoWindow.close();
		}
		closeDetailWindow();
	});
	$("#search-input").keypress(function(e){
		// pressed enter
		if(e.which && e.which==13) {
			var address = $(this).val();
			search(address);
			$(this).val("");
			$(this).attr({placeholder: "find"});
		}
	});
	$("#search-reset").click(function(){
		$("#search-input").val("");
	});

	// search-mini
	$("#search-mini-input").click(function(){
		currentInfoWindow.close();
		closeDetailWindow();
	});
	$("#search-mini-input").keypress(function(e){
		// pressed enter
		if(e.which && e.which==13) {
			var address = $(this).val();
			search(address);
			$(this).val("");
			$(this).attr({placeholder: "find"});
		}
	});
	$("#search-mini-reset").click(function(){
		$("#search-mini-input").val("").focus();
	});

	$("#container").click(function(){
		$("#search-mini-input").blur();
		$("#search-mini-reset").hide();
		$("#search-mini i").animate({ right: "12px" }, "normal");
		$("#search-mini-input").animate({ width: "hide" }, "normal").focus();
		$("#nav-brand-center").show();
	});
});


function onSearchMini(){
	if ( currentInfoWindow ){
		currentInfoWindow.close();
	}
	closeDetailWindow();
	$("#nav-brand-center").hide();
	$("#search-mini i").animate({ right: "250px" }, "normal");
	$("#search-mini-input").animate({ width: "show" }, "normal").focus();
	$("#search-mini-reset").show();
}


/**
* map初期化
*/
function initializeMap(position) {
	google.maps.visualRefresh = true;

	if (! position ){ 
		position = new google.maps.LatLng(35.011636 , 135.768029); // kyoto
	}
	var mapOptions = {
		zoom: 15,
		center: position,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		disableDefaultUI: true,
	};

	if (! mobile_device ){
		mapOptions.zoomControl = true;
		mapOptions.zoomControlOptions = {
			position: google.maps.ControlPosition.RIGHT_BOTTOM,
			style: google.maps.ZoomControlStyle.SMALL
		};
	}
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	google.maps.event.addListener(map, "dragend", function() {
		markerWithin();
		reduceDetailWindow();
		getSpotBounds();
	});
	google.maps.event.addListener(map, "zoom_changed", function() {
		console.log("zoom:"+map.zoom);
		markerWithin();
		reduceDetailWindow();
		getSpotBounds();
		thinOut();
	});

	google.maps.event.addListener(map, "projection_changed", function() {
		reduceDetailWindow();
		getSpotBounds();
		thinOut();
	});

	// auto complete
	if ( mobile_device ){	
		var search = document.getElementById('search-mini-input');
	}else{
		var search = document.getElementById('search-input');
	}
	var autoComplete = new google.maps.places.Autocomplete(search);
	google.maps.event.addListener(autoComplete, "place_changed", function() {
		var place = autoComplete.getPlace();
		if (place.geometry) {
			map.setZoom(17);
			map.panTo(place.geometry.location);
			getSpotBounds();
		}
	});
}


//---------------------------------------------------------
// API
//---------------------------------------------------------
function getSpotCenter() {
	var lat = map.center.lat();
	var lng = map.center.lng();
	var zoom = map.zoom;
	var limit = 100;
	
	$.ajax({
		url: "/api/find?lat=" + lat + "&lng=" + lng + "&zoom=" + zoom + "&limit=" + limit,
		cache: false,
		dataType: "json",
		success: function(json) {
			loadWifindAPI(json);
		}
	});
}

function getSpotBounds() {
	var bounds = map.getBounds();
	var zoom = map.zoom;
	var limit = 300;
	
	$("#message").html("loading wifi spot...");
	if ( currentRequest ){
		currentRequest.abort();
	}
	currentRequest = $.ajax({
		url: "/api/find?" +
			"bounds=" + bounds.toUrlValue() + 
			"&zoom=" + zoom +
			"&limit=" + limit,
		cache: false,
		dataType: "json",
		success: function(json) {
			loadWifindAPI(json);
		}
	});

}


// 取得したjsonデータ読み込み
function loadWifindAPI(result) {
	if (result.status != "OK"){
		alert("error!");
		return;
	}
	
	var data = result.results;
	var i = data.length;
	console.log("get:"+ data.length);
	while(i-- > 0) {
		var spot = data[i];
		addSpot(spot);
	}
	console.log("spot:"+num_spot);
	$("#message").html("");
}


function addSpot(spot) {
	var id = spot._id;

	// check loaded?
	if ( marker_list[id] ){
		return;
	}
	num_spot++;
	
	var location = new google.maps.LatLng(spot.location.lat, spot.location.lng);

	//marker
	var marker = new google.maps.Marker({
		position: location,
		map: map,
		icon: markerImage(spot.wifi.service)
	});
	var infoWindow = new google.maps.InfoWindow({
		content: '<a href="/spot/' + id + '" class="info-a" target="_blank"><span class="info-span">' + spot.name + '</span></a>'
	});


	marker_list[id] = {
		marker: marker,
		spot: spot,
		intensity: spot.intensity
	};

	google.maps.event.addListener(marker, "click", function() {

		if ( id == display_spot_id ){
			map.setZoom(17);
			map.panTo(location);
		}

		if ( currentInfoWindow ){
			currentInfoWindow.close();
		}
		infoWindow.open(map, marker);
		currentInfoWindow = infoWindow;

		openDetailWindow(id);
	});


}


// 間引き
function thinOut() {
	var intensity = 17-map.zoom;
	if ( intensity > 13 ){
		intensity = 13;
	}
	for (var id in marker_list) {
		var marker = marker_list[id];
		if ( marker.intensity < intensity ){
			marker.marker.setMap(null);
		}else if ( marker.intensity >= intensity ){
			marker.marker.setMap(map);
		}
	}
}


// 範囲外になったときの処理
function markerWithin() {	
	if ( display_spot_id ){
		var point = marker_list[display_spot_id].spot.location;
		var point_obj = new google.maps.LatLng(point.lat, point.lng);
		if (! map.getBounds().contains( point_obj ) ){
			closeDetailWindow();
			currentInfoWindow.close();
		}
	}
}






//---------------------------------------------------------
// Detail Window
//---------------------------------------------------------
function openDetailWindow(id) {
	if ( display_spot_id == id ){
		expandDetailWindow();
		return;
	}else if ( display_spot_id ){
		$("#detail-window").remove();
		display_detail_main = null;
	}
	display_spot_id = id;
	var spot = marker_list[id].spot;
	console.log(spot);

	// detail window表示
	var wifi_power = (spot.wifi.power == "false")? "なし" : spot.wifi.power;

	var spot_url = (spot.spot.url)?
		'<tr><th><i class="uk-icon-globe"></i></th><td><span id="detail-title-url"><a href="' + spot.spot.url + '"target="_blank">' + shortenURL(spot.spot.url) + '</a></span></td></tr>' :
		'';

	var spot_wifi_url = (spot.wifi.url)?
		'<tr><th><i class="uk-icon-external-link"></i></th><td><a href="' + spot.wifi.url + '" target="_blank">' + shortenURL(spot.wifi.url) + '</a></td></tr>' :
		'';
	
	// tag
	var tag_list = "";
	spot.spot.category.forEach(function(tag) {
		tag_list += '<span class="tag">' + tag.string + '</span>';
	});


	$("#container").append(
		'<div id="detail-window" style="display: none;">' +
			'<div class="detail-header">' +
				'<div class="detail-header-img"><img src="' + iconImage(spot.wifi.service) + '" width="50" height="50"></div>' +
				'<div class="detail-title">' +
					'<span>' + spot.name + '</span>' +
				'</div>' +
				'<a class="uk-icon-button uk-icon-share" target="_blank" href="/spot/' + id + '"></a>' +
				'<div class="clear-both"></div>' +
			'</div>' +
		'</div>' 
	);

	var detail_main = 
		'<div id="detail-main" style="display: none;">' +
			'<div class="detail-wifi">' +
				'<h3><i class="uk-icon-rss"></i> ' + spot.wifi.service + '</h3>' +
				'<table class="detail-wifi-table">' +
					spot_url +
					'<tr><th><i class="uk-icon-time"></i></th><td>' + spot.spot.hours.string  + '</td></tr>' +
					'<tr><th><i class="uk-icon-power-off"></i></th><td>' + wifi_power + '</td></tr>' +
					'<tr><th><i class="uk-icon-tag"></i></th><td class="tag">' + tag_list  + '</td></tr>' +
					spot_wifi_url +
				'</table>' +
			'</div>';

	if ( mobile_device ){
		$("#detail-window").animate({ height: "show" }, "fast");
		display_detail_main = null;
		$("#detail-window").click(function(){
			if ( display_detail_main == null ){
				$("#detail-window").append(detail_main);
				openDetailMain(spot);
				display_detail_main = true;

			}else if ( display_detail_main == true ){
				$("#detail-main").hide("normal");
				display_detail_main = false;

			}else{
				openDetailMain(spot);
				display_detail_main = true;
			}
		});
	}else{
		$("#detail-window").append(detail_main);
		$("#detail-main").show();
		$("#detail-window").animate({ height: "show" }, "fast");
		display_detail_main = true;
	}
}


function openDetailMain(spot) {
	$("#detail-main").animate({ height: "show" }, "normal");
	var bounds = map.getBounds();
	var length_lat = bounds.getNorthEast().lat() - bounds.getSouthWest().lat();
	map.panTo( new google.maps.LatLng( spot.location.lat - length_lat/8, spot.location.lng ));
}



function closeDetailWindow() {
	$("#detail-window").animate({ height: "hide" }, "normal", function(){ $("#detail-window").remove(); });
	display_spot_id = null;
	display_detail_main = null;
	if ( currentInfoWindow ){
		currentInfoWindow.close();
	}
}

function reduceDetailWindow() {
	$("#detail-main").hide("normal");
	$("#detail-window").click(function(){
		expandDetailWindow();
	});
}

function expandDetailWindow() {
	$("#detail-main").show("normal");
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
				map.setZoom(17);
				map.panTo(location);
				getSpotBounds();

			}else{
				console.log("error");
			}
		});
}




function getURLQuery()
{
	var vars = new Object, params;
	var temp_params = window.location.search.substring(1).split('&');
	for(var i = 0; i <temp_params.length; i++) {
		params = temp_params[i].split('=');
		vars[params[0]] = params[1];
	}
	return vars;
}




/* urlの短縮表示 */
function shortenURL(url) {
	if (url) {
		url.match(/(?:http|https)\:\/\/(?:www\.|)(.{0,20})(.*)/);
		if ( RegExp.$2 ) {	
			return RegExp.$1 + "...";
		}else{
			return RegExp.$1;
		}
	}
	return '';
}



/* 画像の管理 */
var created = {
	"kyoto_wifi01": 1,
	"kyoto_wifi02": 1,
	"freespot": 1,
	"starbucks": 1,
	"sevenspot": 1,
	"freemobile": 1,
	"famima_wifi": 1,
	"c-nexco": 1,
	"e-nexco": 1,
	"fukuoka_city_wifi": 1,
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


