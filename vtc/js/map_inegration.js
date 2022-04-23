var zoom = 12;
var map, select;
function init(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			
			/*document.getElementById("ajaxdemo").innerHTML = this.responseText;*/
			var responseText = JSON.parse(this.responseText);
			var parcours_statique = responseText.parcours_statique;
			var parcours_actuel = responseText.parcours_actuel;
			var monuments = responseText.monuments;
			var here_i_am = responseText.here_i_am;
			
			
			var options = {
				singleTile: true,
				ratio: 1,
				isBaseLayer: true,
				wrapDateLine: true,
				getURL: function() {
					var center = this.map.getCenter().transform("EPSG:3857", "EPSG:4326"),
						size = this.map.getSize();
					return [
						this.url, "&center=", center.lat, ",", center.lon,
						"&zoom=", this.map.getZoom(), "&size=", size.w, "x", size.h,"&key=AIzaSyB5l6dDmEE7a4UupJ1v3kAGOE3ZvRn6PGA"
						
					].join("");
				}
			};
			/*Removing Mapping Content*/
			var map_node = document.getElementById("map");
			while (map_node.firstChild) {
				map_node.removeChild(map_node.firstChild);
			}

			if (here_i_am.long !=0){
				my_center = new OpenLayers.LonLat( here_i_am.long, here_i_am.lat ).transform("EPSG:4326", "EPSG:3857");
				console.log ("Je suis à Tunis1");
			}
			else{
				my_center = new OpenLayers.LonLat( 10.89, 33.80 ).transform("EPSG:4326", "EPSG:3857");
				console.log ("Je suis à Djerba1");
			}
			map = new OpenLayers.Map({
				div: "map",
				projection: "EPSG:3857",
				numZoomLevels: 22,
				center: my_center,
				zoom: 5
			});	
			
			map.addLayer(
				new OpenLayers.Layer.Grid(
					"Google Streets",
					"https://maps.googleapis.com/maps/api/staticmap?sensor=false&maptype=roadmap", 
					null, 
					options
				)
			);
			
			var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
			renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
		
			var sundials = new OpenLayers.Layer.Vector(
				"Simple Geometry",
				{
					styleMap: new OpenLayers.StyleMap({'default':{
						strokeColor: "#00FF00",
						strokeOpacity: 1,
						strokeWidth: 3,
						fillColor: "#FF5500",
						fillOpacity: 0.5,
						pointRadius: 6,
						pointerEvents: "visiblePainted",
						// label with \n linebreaks
						label : "Step: ${step}\n\nActivity: ${activity}",
						title: 'bmarker',	
						fontColor: "${favColor}",
						fontSize: "12px",
						fontFamily: "Courier New, monospace",
						fontWeight: "bold",
						labelAlign: "${align}",
						labelXOffset: "${xOffset}",
						labelYOffset: "${yOffset}",
						labelOutlineColor: "white",
						externalGraphic: 'my_marker.png', 
						graphicHeight: 20, 
						graphicWidth: 20,
						labelOutlineWidth: 3
					}}),
					renderers: renderer
				}
			);
			/////////////////Tracé du parcours//////////////////////////
			var lineLayer = new OpenLayers.Layer.Vector("Line Layer"); 
			
			map.addLayer(lineLayer);                    
			map.addControl(new OpenLayers.Control.DrawFeature(lineLayer, OpenLayers.Handler.Path));                                     
			
			var points = new Array();			
			for (var key in parcours_statique) {				
				points.push (new OpenLayers.Geometry.Point(parcours_statique[key].long , parcours_statique[key].lat ).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()));
			}

			var line = new OpenLayers.Geometry.LineString(points);
			var style = { 
				strokeColor: '#ffff00', 
				strokeOpacity: 0.5,
				strokeWidth: 5
			};
			
			var lineFeature = new OpenLayers.Feature.Vector(line, null, style);
			sundials.addFeatures([lineFeature]);
			/////////////////Tracé du parcours (fin)//////////////////////////
			var lineLayer2 = new OpenLayers.Layer.Vector("Line Layer2"); 
			
			map.addLayer(lineLayer2);                    
			map.addControl(new OpenLayers.Control.DrawFeature(lineLayer2, OpenLayers.Handler.Path));
			var points2 = new Array();			
			console.log ("Tracage des points dynamiques");
			for (var key in parcours_actuel) {				
				//Deactivated tempoarirly and replaceds with semi random coords.
				points2.push (new OpenLayers.Geometry.Point(parcours_actuel[key].long , parcours_actuel[key].lat ).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()));
				console.log (parcours_actuel[key].long+":"+ parcours_actuel[key].lat);
				//lat_dynamic = parcours_actuel[key].lat ;
				//long_dynamic = parcours_actuel[key].long;
				////my_random = Math.random()/10 ;
				//my_random = 0 ;
				//
				//lat_dynamic = +lat_dynamic +  +my_random;
				//long_dynamic = +long_dynamic +  +my_random;
				//
				//points2.push (new OpenLayers.Geometry.Point(long_dynamic , lat_dynamic).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()));
				
				
				//console.log (long_dynamic );
				//console.log (lat_dynamic);
			}
			
			//var points2 = new Array(
			//	new OpenLayers.Geometry.Point(10.927223 , 33.790856 ).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()),
			//	new OpenLayers.Geometry.Point(10.957928 , 33.797531 ).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()),
			//	new OpenLayers.Geometry.Point(10.983974 , 33.801636 ).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()),
			//	new OpenLayers.Geometry.Point(10.990765 , 33.809469 ).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()),
			//	new OpenLayers.Geometry.Point(10.982715 , 33.815163 ).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()),
			//	new OpenLayers.Geometry.Point(10.904788 , 33.853694 ).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()),
			//	new OpenLayers.Geometry.Point(10.874977 , 33.861899 ).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()),
			//	new OpenLayers.Geometry.Point(10.868623 , 33.868497 ).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()),	
			//);
			var line2 = new OpenLayers.Geometry.LineString(points2);
			var style2 = { 
				strokeColor: '#00ff00', 
				strokeOpacity: 0.5,
				strokeWidth: 3
			};
			
			var lineFeature2 = new OpenLayers.Feature.Vector(line2, null, style2);
			sundials.addFeatures([lineFeature2]);				
			/////////////////Tracé d'un point d'étape//////////////////////////
			var marker5 = new Array();	
			var i = 0;
			for (var key in monuments) {				
				marker5.push (new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(monuments[key].long , monuments[key].lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject())));
				marker5[i].attributes = {
					step: monuments[key].step,
					activity: monuments[key].activity,
					favColor: monuments[key].favColor,
					align: monuments[key].align,
					comment: monuments[key].comment
				};
				i++;
			}
			//console.log (marker5);
			
			//var marker5 = new Array( 
			//	new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(10.959647 , 33.825169).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject())),
			//	new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(10.961695 , 33.797228).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject())),
			//	new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(10.883396 , 33.801291).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject())),
			//);
			//marker5[0].attributes = {
			//	step: "1",
			//	activity: "Visit Fadhloun Ancestral Mosque",
			//	favColor: 'red',
			//	align: "cm"
			//};
			//
			//marker5[1].attributes = {
			//	step: "2",
			//	activity: "Mahboubine Bio Farm",
			//	favColor: 'red',
			//	align: "cm"
			//};
			//
			//marker5[2].attributes = {
			//	step: "3",
			//	activity: "Dardoura: Djerba Tradtional \nEnergy Drink",
			//	favColor: 'red',
			//	align: "cm"
			//};
			/////////////////Fin Tracé d'un point d'étape//////////////////////////
			//////////////////////Ajout du point courant/////////////////////
			var currentpoint = new OpenLayers.Layer.Vector(
				"Simple Geometry",
				{
					styleMap: new OpenLayers.StyleMap({'default':{
						strokeColor: "#FF0000",
						strokeOpacity: 1,
						strokeWidth: 3,
						fillColor: "#FF5500",
						fillOpacity: 0.5,
						pointRadius: 6,
						pointerEvents: "visiblePainted",
						// label with \n linebreaks
						label : "Ena Houni: \n\n${status}",
						fontColor: "${favColor}",
						fontSize: "12px",
						fontFamily: "Courier New, monospace",
						fontWeight: "bold",
						labelAlign: "${align}",
						labelXOffset: "${xOffset}",
						labelYOffset: "${yOffset}",
						labelOutlineColor: "white",
					}}),
					renderers: renderer
				}
			);
			map.addLayer(currentpoint);
			console.log ("Got long "+here_i_am.long +" and lat "+here_i_am.lat);
			
			var marker6 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(here_i_am.long , here_i_am.lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()));
			
			marker6.attributes = {
				status: here_i_am.timestamp,
				favColor: 'blue',
				align: "cm",
				yOffset: -30,
			};
			currentpoint.addFeatures(marker6);
			/////////////////////Fin Ajout du point courant/////////////////////
			/////////////////////Info Bulle/////////////////////
			select = new OpenLayers.Control.SelectFeature(sundials);				
			sundials.events.on({
				"featureselected": onFeatureSelect,
				"featureunselected": onFeatureUnselect
			});	
			map.addControl(select);
			select.activate();   
			/////////////////////Fin Info Bulle/////////////////////
			
			map.addLayer(sundials);
			if (here_i_am.long !=0){
				var lonLat = new OpenLayers.LonLat( here_i_am.long, here_i_am.lat )
					.transform(
						new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
						map.getProjectionObject() // to Spherical Mercator Projection
					);
				console.log ("Je suis à Tunis2");
					
			}
			else{
				var lonLat = new OpenLayers.LonLat( 10.89, 33.80 )
					.transform(
						new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
						map.getProjectionObject() // to Spherical Mercator Projection
					);
				console.log ("Je suis à Djerba2");
	
			}			
			
			map.setCenter (lonLat, zoom);
			sundials.addFeatures(marker5)
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		}
	};
	xhttp.open("GET", "skilling/dogs/0/0", true);
	xhttp.send();
	//Start from here
	getLocation();
	if (typeof coords == 'undefined') {
		xhttp.open("GET", "skilling/dogs/0/0", true);
		xhttp.send();
//	console.log ("lllll");
	}
	else{
//		console.log (coords [0]);
		xhttp.open("GET", "skilling/dogs/"+coords [0]+"/"+coords [1], true);
		xhttp.send();
	}
	
	

	/*loadDoc();*/
	
}
function onPopupClose(evt) {
	select.unselectAll();
}
function onFeatureSelect(event) {
	console.log ("My Event");
	console.log (event);
	var feature = event.feature;
	// Since KML is user-generated, do naive protection against
	// Javascript.
	var content = "<h2>"+feature.attributes.title + "</h2>" + feature.attributes.description;
	popup = new OpenLayers.Popup.FramedCloud(
		"chicken", 
		feature.geometry.getBounds().getCenterLonLat(),
		new OpenLayers.Size(100,100),
		feature.attributes.comment,
		null, 
		true, 
		onPopupClose
	);
	feature.popup = popup;
	map.addPopup(popup);
}
function onFeatureUnselect(event) {
	var feature = event.feature;
	if(feature.popup) {
		map.removePopup(feature.popup);
		feature.popup.destroy();
		delete feature.popup;
	}
}
function loadDoc() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("ajaxdemo").innerHTML = this.responseText;
		}
	};
	xhttp.open("GET", "skilling/dogs", true);
	xhttp.send();
}

function dump(obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }
	
	console.log (out);
}

function launch_map(){
	init();
	setInterval(init, 30000)
}
window.onload = launch_map ();

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);		
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    //x.innerHTML = "Latitude: " + position.coords.latitude +  "<br>Longitude: " + position.coords.longitude;
	coords = new Array(position.coords.latitude, position.coords.longitude);
	//console.log ("jjjjj"+coords [0]);
}