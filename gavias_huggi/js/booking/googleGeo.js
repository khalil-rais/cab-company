var GoogleGeoCore = new function ()
{
	this.MapStep1 = null;
	this.DirectionsServiceStep1 = null;
	this.DirectionRendererStep1 = null;
	this.AddressService = null;
	this.PlacesService = null;
	this.MapZoomSize = 14;
	this.GeocodeRadius = 32000;
	this.LocationString = "";
	this.Geogoder = null;
	this.Pushpins = [];
	this.UserLocationLat = 0;
	this.UserLocationLng = 0;
	this.ClientIP = null;
	this.LatestDirtectionMarkers = null;
	// Each marker is labeled with a single alphabetical character.
	this.markerLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	this.Init = function ()
	{	
		GoogleGeoCore.InitMapWithCurrentPosition(function(lat, lng) { GoogleGeoCore.InitMap(lat, lng); });
		
	};
	this.InitMapWithCurrentPosition = function (initMapFunction) {

		/***DESCRIPTION OF GEOCODING ALGORITHM:

			- Attempt to define location via HTML5 geolocation
				if user shared location (share now OR always), call "successCallback", init Map and set location defined flag as "true"
				if user NOT share location (disallow now OR alays), call "errorCallback"  define location by IP address, init Map and set location defined flag as "true"
				if user do nothing (ignore suggestion of share location) - call "errorCallback" after timeout 5 seconds. 
				!!! This case with timeout also works if user press "Not Now" in firefox, because firefox have next bug: https://bugzilla.mozilla.org/show_bug.cgi?id=675533 
		***/

		var locationDefined = false;
		
		//locationDefined = true;
		initMapFunction(48.862711,2.3419126000000006); // center to Paris by default
		
		
		//190711Khalil: ce bout de code a été désactivé pour ne pas avoir à indiquer la localisation du Client
		//if (navigator.geolocation) {
		//	navigator.geolocation.getCurrentPosition(successCallback,
		//						 errorCallback,
		//						 { enableHighAccuracy: false, timeout: 1000, maximumAge: 2592000000 } // cache for 30 days
		//						 );
		//	setTimeout(errorCallback, 3000);
		//} else {
		//	errorCallback();
		//}
		//function successCallback(position) {
		//	locationDefined = true;
		//	initMapFunction(position.coords.latitude, position.coords.longitude);
		//}
		//function errorCallback() {
		//	if (!locationDefined) {
		//		//getLocationByIp();
		//		getLocationByCity();
		//	}
		//}
		//190711Khalil: appel à cette fonction à la place du code désactivé.
		getLocationByCity();
		
		function getLocationByIp() {
			//determine geolocation by "freegeoip.net"
			tbjQuery.get("https://freegeoip.net/json/", function (data) {
				locationDefined = true;
				initMapFunction(data.latitude, data.longitude);
				
			}).fail(function() {
				//determine geolocation by "ipinfo.io"
				tbjQuery.getJSON('http://ipinfo.io/' + clientIP  + '/json', function(data){
					//console.log(data);
					var locArray = data.loc.split(",");
					var lat = locArray[0];
					var lng = locArray[1];
					locationDefined = true;
					initMapFunction(lat, lng);
				})
				.error(function(){
					//determine geolocation by "ip-api.com"
					tbjQuery.getJSON('http://ip-api.com/json', function(data){
						//console.log(data);
						locationDefined = true;
						initMapFunction(data.lat, data.lon);
					})
					.error(function(){
						//determine geolocation by "ip.pycox.com"
						tbjQuery.getJSON('http://ip.pycox.com/json/', function(data){
							//console.log(data);
							locationDefined = true;
							initMapFunction(data.latitude, data.longitude);
						})
						.error(function(){
						})
					})
				})
			}); 
		}
		// center the map to the default city set in backend settings
		function getLocationByCity() {
			var address = TBFSettings.defaultCity+', '+TBFSettings.defaultCountry;
			//console.log(address);
			GoogleGeoCore.Geocoder.geocode({'address': address}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					locationDefined = true;
					//console.log(results[0].geometry.location);
					//GoogleGeoCore.MapStep1.setCenter(results[0].geometry.location);
					TBFSettings.defaultMapLat = results[0].geometry.location.lat();
					TBFSettings.defaultMapLng = results[0].geometry.location.lng();
					//console.log(TBFSettings.defaultMapLat+' '+TBFSettings.defaultMapLng);
					initMapFunction(results[0].geometry.location.lat(), results[0].geometry.location.lng());
				} else {
					//alert('Geocoder failed due to: ' + status);
				}
			})
		}
	};

	this.InitMap = function (lat, lng)
	{
		console.log ("Got it: "+lat);	
		//save geolocation coordinates
		GoogleGeoCore.LocationString = lat + "," + lng;
		console.log(GoogleGeoCore.LocationString);
		GoogleGeoCore.UserLocationLat = lat;
		GoogleGeoCore.UserLocationLng = lng;

		GoogleGeoCore.Geolocation = new google.maps.LatLng(lat, lng);

		//init Map for Step1
		// disable map dragging on mobile
		if(tbjQuery(window).width() < 768) {
			var mapOptions = { center: new google.maps.LatLng(lat, lng),
				zoom: GoogleGeoCore.MapZoomSize,
				disableDefaultUI: false,
				scrollwheel: true,
				draggable: false,
				disableDoubleClickZoom: false};
		}
		else {
			var mapOptions = { center: new google.maps.LatLng(lat, lng),
				zoom: GoogleGeoCore.MapZoomSize,
				disableDefaultUI: false,
				scrollwheel: true,
				draggable: true,
				disableDoubleClickZoom: false};
		}
				
		if(TBFSettings.defaultCountry!=""){
			mapOptions.componentRestrictions = {
				country: TBFSettings.defaultCountry
			};
		}
		
		this.MapStep1 = new google.maps.Map(document.getElementById("map-canvas-step1"), mapOptions);
		GoogleGeoCore.DirectionsService1 = new google.maps.DirectionsService();
		GoogleGeoCore.DirectionRenderer1 = new google.maps.DirectionsRenderer();
		GoogleGeoCore.DirectionRenderer1.setMap(GoogleGeoCore.MapStep1);
     
		GoogleGeoCore.AddressService = new google.maps.places.AutocompleteService();
		GoogleGeoCore.PlacesService = new google.maps.places.PlacesService(GoogleGeoCore.MapStep1);
		    
		GoogleGeoCore.Geocoder = new google.maps.Geocoder();
		
		// generate pickup autocomplete place list
		if(TBFSettings.addressBookingEnabled)
		{
			if(TBFSettings.combinePickupPointPlace){
				this.getPointPlaceCombinedList('address_from', 'pickup');
			}
			else {
				this.getGooglePlaceAutocompleteList('address_from', mapOptions);
			}
			
			if(TBFSettings.combineDropoffPointPlace){
				this.getPointPlaceCombinedList('address_to', 'dropoff');
			}
			else {
				this.getGooglePlaceAutocompleteList('address_to', mapOptions);
			}
			
			if(TBFSettings.stopsEnabled){
				this.getGooglePlaceAutocompleteList('tmp_waypoint', mapOptions);
			}
		}
		
		if(TBFSettings.hourlyBookingEnabled && TBFSettings.numberOfOwnBaseCars>0){
			this.getGooglePlaceAutocompleteList('hourly_pickup', mapOptions, false);
		}
		// For Search URL booking, we should show pickup and dropoff from search URL
		// instead we should show the journey duration in Google Map
		if(url_booking_type=="address" || url_booking_type=="offers") {
			GoogleGeoCore.RenderDirections();
		}
	};
	
	//clear pushpins from map
	this.ClearPushpins = function ()
	{
		for (var i = 0; i < GoogleGeoCore.Pushpins.length; i++)
		{
		    GoogleGeoCore.Pushpins[i].setMap(null);
		}
	}
	
	//render pushpin on map
	this.DisplayPushpinOnMap = function (location, fieldObj)
	{console.log ("Geo.js: 202");
		if (location != undefined && location.Latitude != null && location.Longitude != null)
		{console.log ("Geo.js: 204 latitude: "+location.Latitude+"longitude"+location.Longitude);
			var myLatLng = new google.maps.LatLng(location.Latitude, location.Longitude);
			
			var pushpin = new google.maps.Marker({
			    position: myLatLng,
			    map: GoogleGeoCore.MapStep1,
			    draggable:true
			});
			
			GoogleGeoCore.Pushpins.push(pushpin);
			
			//center map to pushpin
			GoogleGeoCore.MapStep1.panTo(pushpin.getPosition());
			
			google.maps.event.addListener(pushpin, 'dragend', function (event) {
				console.log ("Geo.js: 219");
				if(tbjQuery(fieldObj).attr('id')=='address_from') {
					tbjQuery('#address_from_lat').val(this.getPosition().lat());
					tbjQuery('#address_from_lng').val(this.getPosition().lng());
					tbjQuery('#pickup_poi').val(0);
					console.log ("Geo.js: 224");
					var latlng = new google.maps.LatLng(this.getPosition().lat(), this.getPosition().lng());
					GoogleGeoCore.Geocoder.geocode({'latLng': latlng}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							if (results[0]) {
								tbjQuery('#address_from').val(results[0].formatted_address);
								console.log ("Geo.js: 230");
							}
						}
					})
				}
				else if(tbjQuery(fieldObj).attr('id')=='hourly_pickup') {
					tbjQuery('#hourly_pickup_lat').val(this.getPosition().lat());
					tbjQuery('#hourly_pickup_lng').val(this.getPosition().lng());
					
					var latlng = new google.maps.LatLng(this.getPosition().lat(), this.getPosition().lng());
					GoogleGeoCore.Geocoder.geocode({'latLng': latlng}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							if (results[0]) {
								tbjQuery('#hourly_pickup').val(results[0].formatted_address);
							}
						}
					})
				}
			});
		}
	};
	
	//this mehtod could be used not only to display routing but to calculate distance
	this.RenderDirections = function ()
	{
		this.labelIndex = 0;
		tbjQuery("#estimatedDistance,#estimatedDuration").text("");//clear calculated distance
		GoogleGeoCore.DirectionRenderer1.setMap(GoogleGeoCore.MapStep1);
		
		//clear pushpins
		GoogleGeoCore.ClearPushpins();
		
		var stops = [];
		
		if(tbjQuery('#booking_type').val()=='address'){
			if(tbjQuery('#address_from_lat').val()!="" && tbjQuery('#address_from_lng').val()!=""){
				var puLocation =
				{
					Latitude: tbjQuery('#address_from_lat').val(),
					Longitude: tbjQuery('#address_from_lng').val()
				};
			}
			if(tbjQuery('#address_to_lat').val()!="" && tbjQuery('#address_to_lng').val()!=""){
				var doLocation =
				{
					Latitude: tbjQuery('#address_to_lat').val(),
					Longitude: tbjQuery('#address_to_lng').val()
				};
			}
			
			var tmpStops = tbjQuery('div#stops_data_wrapper').children('.stoprow');
			tbjQuery('div#stops_data_wrapper').children('.stoprow').each(function(){
				stops.push({
					Latitude: tbjQuery(this).find('.waypoints_lat').val(),
					Longitude: tbjQuery(this).find('.waypoints_lng').val()
				});
			})
		}
		else if(tbjQuery('#booking_type').val()=='offers') {
			if(tbjQuery('#route_from_lat').val()!="" && tbjQuery('#route_from_lng').val()!=""){
				var puLocation =
				{
					Latitude: tbjQuery('#route_from_lat').val(),
					Longitude: tbjQuery('#route_from_lng').val()
				};
			}
			if(tbjQuery('#route_to_lat').val()!="" && tbjQuery('#route_to_lng').val()!=""){
				var doLocation =
				{
					Latitude: tbjQuery('#route_to_lat').val(),
					Longitude: tbjQuery('#route_to_lng').val()
				};
			}
		}
		
		//According to requirment we need to display PU pushpin when DO not filled yet
		if (puLocation != undefined && doLocation == undefined)
		{
			GoogleGeoCore.DisplayPushpinOnMap(puLocation, tbjQuery('#address_from'));
		}
		
		if (puLocation != undefined && doLocation != undefined
			&& puLocation.Latitude != null && puLocation.Longitude != null && doLocation.Latitude != null && doLocation.Longitude != null)
		{

			var waypoints = [];
			var i;
			
			for (i = 0; i < stops.length; i++) {
				waypoints.push({
		        	location: new google.maps.LatLng(stops[i].Latitude, stops[i].Longitude),
		        	stopover: true
				});
			}

			var origin = new google.maps.LatLng(puLocation.Latitude, puLocation.Longitude);
			var destination = new google.maps.LatLng(doLocation.Latitude, doLocation.Longitude);
			
			var distance_unit = google.maps.UnitSystem.IMPERIAL;
			if(TBFSettings.distanceUnit == "kM") {
			    distance_unit = google.maps.UnitSystem.METRIC;  
			}

			var request =
			{
				origin: origin,
				destination: destination,
				waypoints: waypoints,
				optimizeWaypoints: TBFSettings.optimizeStops,
				travelMode: google.maps.TravelMode.DRIVING,
				unitSystem: distance_unit,
				avoidFerries: TBFSettings.GAPIavoidFerries,
				avoidHighways: TBFSettings.GAPIavoidHighways,
				avoidTolls: TBFSettings.GAPIavoidTolls
			};

			var originalRoute = [puLocation];	//create original route
			for (i = 0; i < stops.length; i++) {
				originalRoute.push(stops[i]);
			}
			originalRoute.push(doLocation);

			var originalLegs = [];	//create original Legs
			var pointsCount = originalRoute.length;
			for (i = 0; i < pointsCount - 1; i++) {
				originalLegs.push({ from: originalRoute[i], to: originalRoute[i+1] });
			}

			GoogleGeoCore.DirectionsService1.route(request, function (result, status)
			{
				if (status == google.maps.DirectionsStatus.OK)
				{
					GoogleGeoCore.DirectionRenderer1.setDirections(result);

					var legs = result.routes[0].legs;
					var stopIndex = 0, distanceMeters = 0, durationSeconds = 0;
					GoogleGeoCore.LatestDirtectionMarkers = [];

					var legsThatNeedRecalc = [];	

					// display original route, and calculate distance
					for (var j = 0; j < legs.length; j++) {

						distanceMeters += legs[j].distance.value;
						durationSeconds += legs[j].duration.value;
						//console.log(legs[j]);
						//pu icon
						if (j == 0) {
							GoogleGeoCore.ApplyMarkerIcon(legs[j].start_location, 'address_from', legs[j].start_address);
							GoogleGeoCore.LatestDirtectionMarkers.push(legs[j].start_location);
						}	//stop icon
						if (legs.length > 1 && j > 0) {   //get start location of leg that is not PU leg

							GoogleGeoCore.LatestDirtectionMarkers.push(legs[j].start_location);
							//stop icon
							GoogleGeoCore.ApplyMarkerIcon(legs[j].start_location, 'waypoint', legs[j].start_address);
							stopIndex++;
						}
						if (j == legs.length - 1) {		//do icon
							GoogleGeoCore.LatestDirtectionMarkers.push(legs[j].end_location);
							GoogleGeoCore.ApplyMarkerIcon(legs[j].end_location, 'address_to', legs[j].end_address);
						}
					}

					GoogleGeoCore.ApplyDistance(distanceMeters, 'outbound');
					GoogleGeoCore.ApplyDuration(durationSeconds, 'outbound');
					
				} else if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {
					tbjQuery("#estimatedDistance").text(TBTranslations.ERR_MESSAGE_ESTIMATED_DISTANCE_CALCULATE);
					tbjQuery("#estimatedDuration").text("");
					GoogleGeoCore.DirectionRenderer1.setMap(null);	// clear route on the map
					//if (callback && typeof (callback) === "function") {
						//callback();
					//}
				}
			});
		}
		else
		{
			GoogleGeoCore.DirectionRenderer1.setMap();
		}
	};
	
	this.ApplyDistance = function (distanceMeters, tripMode)
	{
		if (distanceMeters > 0)
		{
			var coefficient = (TBFSettings.distanceUnit == 'mile') ? 0.000621371192 : 0.001; //coefficient to convert meters to miles or kilometers.
			var distance = Math.round(distanceMeters * coefficient * 100) / 100;

			if (tripMode == 'outbound') {
				var distanceUnitLabel = (TBFSettings.distanceUnit == 'mile') ? TBTranslations.BOOKING_FORM_DISTANCE_UNIT_MILES_LABEL : TBTranslations.BOOKING_FORM_DISTANCE_UNIT_KM_LABEL;
				tbjQuery("#estimatedDistance").text(TBTranslations.BOOKING_FORM_ESTIMATED_DISTANCE_LBL+": "+distance+" "+distanceUnitLabel);
				tbjQuery("#ride_distance").val(distance+" "+distanceUnitLabel);

			}
			else {
			}
		}
		else{
			tbjQuery("#estimatedDistance").text(TBTranslations.BOOKING_FORM_ESTIMATED_DISTANCE_LBL+": 0");
		}
	}
	
	this.ApplyDuration = function (durationSeconds, tripMode)
	{
		if (durationSeconds > 0)
		{
			d = Number(durationSeconds);
			var h = Math.floor(d / 3600);
			var m = Math.floor(d % 3600 / 60);
			var s = Math.floor(d % 3600 % 60);
		    
			var hDisplay = h > 0 ? h + TBTranslations.CAR_LIST_ESTIMATED_TIME_HR.replace("%s",""): "";
			var mDisplay = m > 0 ? m + TBTranslations.CAR_LIST_ESTIMATED_TIME_MIN.replace("%s","") : "";
			var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

			if (tripMode == 'outbound') {
				tbjQuery("#estimatedDuration").text(TBTranslations.BOOKING_FORM_ESTIMATED_DURATION_LBL+": " + hDisplay + mDisplay);
				tbjQuery('#ride_duration_hour').val(hDisplay);
				tbjQuery('#ride_duration_minute').val(mDisplay);
			}
			else {
			}
		}
		else {
			tbjQuery("#estimatedDuration").text(TBTranslations.BOOKING_FORM_ESTIMATED_DURATION_LBL+": 0");
		}
	}

	this.ApplyMarkerIcon = function (position, target, title)
	{
		if(target=='waypoint'){ // for now, stop is not draggable
			var marker = new google.maps.Marker({
				position: position,
				map: GoogleGeoCore.MapStep1,
				title: title,
				label: this.markerLabels[this.labelIndex++ % this.markerLabels.length],
				draggable:false
			});
		}
		else {
			// marker icon will be draggable only in Address booking
			if(tbjQuery('#booking_type').val()=='address'){
				var marker = new google.maps.Marker({
					position: position,
					map: GoogleGeoCore.MapStep1,
					title: title,
					label: this.markerLabels[this.labelIndex++ % this.markerLabels.length],
					draggable: true
				});
			}
			else {
				var marker = new google.maps.Marker({
					position: position,
					map: GoogleGeoCore.MapStep1,
					title: title,
					label: this.markerLabels[this.labelIndex++ % this.markerLabels.length],
					draggable: false
				});
			}
		}
		
		GoogleGeoCore.Pushpins.push(marker);
		
		if(target!='waypoint'){
			google.maps.event.addListener(marker, 'dragend', function (event) {
				tbjQuery('#'+target+'_lat').val(this.getPosition().lat());
				tbjQuery('#'+target+'_lng').val(this.getPosition().lng());
				tbjQuery('#booking_type').val('address');
				
				if(target=='address_from'){
					tbjQuery('#pickup_poi').val(0);console.log ("Geo.js: 498");
				}
				else if(target=='address_to'){
					tbjQuery('#dropoff_poi').val(0);
				}
				
				GoogleGeoCore.RenderDirections();
				
				var latlng = new google.maps.LatLng(this.getPosition().lat(), this.getPosition().lng());
				GoogleGeoCore.Geocoder.geocode({'latLng': latlng}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						if (results[0]) {
							tbjQuery('#'+target).val(results[0].formatted_address);
						} else {
							//alert('We could not detect your location');
						}
					} else {
						//alert('Geocoder failed due to: ' + status);
					}
				})
			});
		}
	};

	this.ResizeMap = function()
	{
		google.maps.event.trigger(GoogleGeoCore.MapStep1, "resize");
	}
	
	this.getGooglePlaceAutocompleteList = function(target, mapOptions, checkArea){
		
		if (typeof checkArea == 'undefined') {
			checkArea = true;
		}
		    
		var input = document.getElementById(target);
		var autocompleteObj = new google.maps.places.Autocomplete(input, mapOptions);
		
		google.maps.event.addListener(autocompleteObj, 'place_changed', function() {
			var place = autocompleteObj.getPlace();
			if (place.geometry) {
				tbjQuery('#'+target+'_lat').val(place.geometry.location.lat());
				tbjQuery('#'+target+'_lng').val(place.geometry.location.lng());console.log ("googleGeos.js: 540");
				tbjQuery("#"+target).closest('div.step1-inputWrap').removeClass('has-error');

				// Get each component of the address from the place details
				// and fill the corresponding field on the form.
				var componentForm = {
					street_number: 'short_name',
					route: 'long_name',
					locality: 'long_name',
					administrative_area_level_1: 'short_name',
					country: 'long_name',
					postal_code: 'short_name'
				};
				
				for (var i = 0; i < place.address_components.length; i++) {
					var addressType = place.address_components[i].types[0];
					if (componentForm[addressType]) {
						var val = place.address_components[i][componentForm[addressType]];
						console.log ("Place info:"+'#'+target+'_'+addressType+":"+val);
						tbjQuery('#'+target+'_'+addressType).val(val);
					}
				}

		
				if(target=='hourly_pickup'){
					GoogleGeoCore.ClearPushpins();
				    
					var puLocation =
					{
					    Latitude: place.geometry.location.lat(),
					    Longitude: place.geometry.location.lng()
					};
					GoogleGeoCore.DisplayPushpinOnMap(puLocation, tbjQuery('#'+target));
				}
				else {
					if(checkArea && TBFEngine.checkAreaOperation(target))
					{
						tbjQuery('#booking_type').val('address');
						if(target=='address_from'){
							tbjQuery('#pickup_poi').val(0);console.log ("Geo.js: 558");
						}
						else if(target=='address_to'){
							tbjQuery('#dropoff_poi').val(0);
						}
						if(target!='waypoint'){
							GoogleGeoCore.RenderDirections();
						}
					}
				}
			}
		});
	};
	this.getUserLocation = function(target)
	{
		if(navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition(function(position) {
				tbjQuery('#'+target+'_lat').val(position.coords.latitude);
				tbjQuery('#'+target+'_lng').val(position.coords.longitude);
				//console.log(position.coords.latitude+','+position.coords.longitude);
				tbjQuery("#"+target).closest('div.step1-inputWrap').removeClass('has-error');
				
				if(TBFEngine.checkAreaOperation(target))
				{
					tbjQuery('#booking_type').val('address');
					TBFEngine.unsetShuttle();
					TBFEngine.unsetHourlyHire();
					
					if(target=='address_from'){console.log ("Geo.js: 587");
						//TBFEngine.getExtras('address_pickup');
					}
					else if(target=='address_to') {
						//TBFEngine.getExtras('address_dropoff');
					}
					GoogleGeoCore.RenderDirections();
					
					var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					GoogleGeoCore.Geocoder.geocode({'latLng': latlng}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							if (results[0]) {
								tbjQuery('#'+target).val(results[0].formatted_address);
							} else {
								alert('We could not detect your location');
							}
						} else {
							alert('Geocoder failed due to: ' + status);
						}
					});
				}
			}, function() {
			});
		}
	};
	this.getPointPlaceCombinedList = function(target, type)
	{
		var timeout;
		var input = document.getElementById(target);
		google.maps.event.addDomListener(input, 'input', function () {
			if (input.value!=='') {
				window.clearTimeout(timeout);
				timeout = window.setTimeout(function(){
					GoogleGeoCore.getGooglePlacePredictions(input.value, type, type+'_autocomplete');
				},1000);
			}
			else {
			    document.getElementById(type+'_autocomplete').style.display = 'none';
			}
		});
		// Show results when address field is focused (if not empty)
		google.maps.event.addDomListener(input, 'focus', function () {
			if (input.value !== '') {
			    GoogleGeoCore.getGooglePlacePredictions(input.value, type, type+'_autocomplete');
			}
		});
		// Hide results when click occurs out of the results and inputs
		google.maps.event.addDomListener(document, 'click', function (e) {
			if ((e.target) && (e.target.parentElement.className !== 'pac-container') && (e.target.parentElement.className !== 'pac-item') && (e.target.tagName !== 'INPUT')) {
			    document.getElementById(type+'_autocomplete').style.display = 'none';
			}
		});
	};
	
	this.getGooglePlacePredictions = function (keyword, type, listWrapper) {
		var filtered_poi = [];
		document.getElementById(listWrapper).innerHTML = '';
		document.getElementById(listWrapper).style.display = 'none';
		// if there is a previous ajax search, then we abort it and then set tbxhr to null
		if( tbxhr != null ) {
		    tbxhr.abort();
		    tbxhr = null;
		}
		tbxhr = tbjQuery.ajax({
			type: "POST",
			url: TBF_BASE_URL+'index.php?option=com_taxibooking&task=getFilteredPointsAjax&ajax=1',
			data: 'keyword='+keyword+'&type='+type+'&'+tbjQuery('[name="active_lang"]').serialize(),
			dataType: 'json',
			beforeSend: function(){
				if(type=='pickup'){
					tbjQuery('#tabs_address #address_from').after('<span class="autocomplete-loading"></span>');
				}
				if(type=='dropoff'){
					tbjQuery('#tabs_address #address_to').after('<span class="autocomplete-loading"></span>');
				}
			},
			complete: function(){
			},
			success: function(response){
				TBFEngine.clearAjaxLoading();
				
				//if(response.err==0){
				    filtered_poi = response.pois;
				//}
				
				if(TBFSettings.defaultCountry==""){
					var request = {
						input: keyword
					};
				}
				else {
					var filter_country = TBFSettings.defaultCountry;
					// RARE CARES:
					// 1. PlacePredictions can't get result for Canary Islands (IC), instead we have to set Spain (ES) here
					if(filter_country=='IC'){ 
						filter_country = 'ES';
					}
					var request = {
						input: keyword,
						componentRestrictions: {
						    country: filter_country
						}
					};
				}
				// Empty results container
				var autocomplete_wrapper = document.getElementById(listWrapper);
				autocomplete_wrapper.innerHTML = '';
				// append filtered POIs at the top of autocomplete list
				if(filtered_poi.length > 0){
				    autocomplete_wrapper.style.display = 'block';
				}
				for (var i = 0; i < filtered_poi.length; i++) {
				    var poiObj = filtered_poi[i];
				    autocomplete_wrapper.innerHTML += '<div class="pac-item" data-placeid="'+poiObj['id']+'" data-placetype="poi" data-name="' + poiObj['label'] + '" data-placelat="'+poiObj['lat']+'" data-placelng="'+poiObj['lng']+'"><span class="pac-icon-custom pac-icon-marker-custom" style="background-image: url(' + poiObj['cat_image'] + ');"></span>'+poiObj['label']+'</div>';
				}
				GoogleGeoCore.AddressService.getPlacePredictions(request, function (predictions, status) {
					if (status == google.maps.places.PlacesServiceStatus.OK)
					{
						// Place service status error
						if(predictions.length > 0){
						    autocomplete_wrapper.style.display = 'block';
						}
						// Build output for each prediction
						for (var i = 0, prediction; prediction = predictions[i]; i++) {
						    // Build output with higlighted search strings
						    //var output = highlightSearchStrings(prediction.description, prediction.matched_substrings);
						    var output = prediction.description;
						    // Insert output in results container
						    autocomplete_wrapper.innerHTML += '<div class="pac-item" data-placeid="' + prediction.place_id + '" data-placetype="gapiplace" data-placelat="" data-placelng="" data-name="' + output + '"><span class="pac-icon pac-icon-marker"></span>' + output + '</div>';
						}
						
					}
					else {
						console.log('Error on AddressService.getPlacePredictions: '+status);
						//document.getElementById(listWrapper).style.display = 'none';
					}
					
					tbjQuery('#'+listWrapper+' div.pac-item').each(function(i){
						tbjQuery(this).click(function(){
							GoogleGeoCore.getGooglePlaceDetails(this.dataset.placeid, this.dataset.placetype, this.dataset.name, this.dataset.placelat, this.dataset.placelng, type);
						})
					})
				});
			}
		})
	};
	
	this.getGooglePlaceDetails = function (placeId, placeType, placeName, placeLat, placeLng, type) {
		
		if(type=='pickup'){
			tbjQuery("#address_from").closest('div.step1-inputWrap').removeClass('has-error');
			tbjQuery('#address_from').val(placeName);
		}
		else {
			tbjQuery("#address_to").closest('div.step1-inputWrap').removeClass('has-error');
			tbjQuery('#address_to').val(placeName);
		}
		var renderDirction = false;
		if(placeType=='poi')
		{
			if(type=='pickup'){
				tbjQuery('#pickup_poi').val(placeId);
				tbjQuery('#address_from_lat').val(placeLat);console.log ("Geo.js: 749");
				tbjQuery('#address_from_lng').val(placeLng);
				
				if(TBFEngine.checkAreaOperation('address_from')){
					GoogleGeoCore.RenderDirections();
					//console.log('pickup POI - combined');
				}
			}
			else {
				tbjQuery('#dropoff_poi').val(placeId);
				tbjQuery('#address_to_lat').val(placeLat);
				tbjQuery('#address_to_lng').val(placeLng);
				
				if(TBFEngine.checkAreaOperation('address_to')){
					GoogleGeoCore.RenderDirections();
				}
			}
		}
		else {
			var request = {
			    placeId: placeId
			};
			GoogleGeoCore.PlacesService.getDetails(request, function (place, status) {
				if (status === google.maps.places.PlacesServiceStatus.OK) {
					if (place.geometry) {
						if(type=='pickup'){
							tbjQuery('#pickup_poi').val(0);
							tbjQuery('#address_from_lat').val(place.geometry.location.lat());console.log ("Geo.js: 776");
							tbjQuery('#address_from_lng').val(place.geometry.location.lng());
							
							if(TBFEngine.checkAreaOperation('address_from')){
								//console.log('pickup Place - combined');
								GoogleGeoCore.RenderDirections();
							}
						}
						else {
							tbjQuery('#dropoff_poi').val(0);
							tbjQuery('#address_to_lat').val(place.geometry.location.lat());
							tbjQuery('#address_to_lng').val(place.geometry.location.lng());
							
							if(TBFEngine.checkAreaOperation('address_to')){
								GoogleGeoCore.RenderDirections();
							}
						}
					}
				}
				else {
					console.log('Error on PlacesService.getDetails: '+status);
				}
			});
		}
		document.getElementById(type+"_autocomplete").style.display = 'none';
	}
}