var TBFCoreSettings = new function ()
{
    this.DatePickerFormat = null;
    this.TimePckerFormat = null;
    this.Is12HoursTimeFormat = null;
    this.SelectedOres4ServiceType = null;
    this.CurrencySymbol = "";
    this.CalculatedDistance = 0;
    this.CalculatedReturnDistance = 0;
    this.MaxStopCount = 23;
    this.RoutingType = 
    {
        PickUp: "Pickup",
        DropOff: "Dropoff",
        Stop: "Stop",
    };

	this.DistanceUnits = {
		Miles: "Miles",
		Kilometers: "Kilometers"
	}

};

var TBFEngine = new function ()
{
    this.OnReady = function ()
    {
	//init datetime picker on Step 1 http://eonasdan.github.io/bootstrap-datetimepicker/
	this.ApplyDatePicker(tbjQuery('#pickupDateHolderStep1'), 'pickupDateStep1');
	
	// For Daily Hire, Drop off date and time 24 hours after Pick up 
	var min_dropoff_date = new Date();
	min_dropoff_date.setTime(min_dropoff_date.getTime() + 60 * 60 * 24 * 1000);
	this.ApplyDatePicker(tbjQuery('#dropoffDateHolderStep1'), 'dropoffDateStep1', min_dropoff_date);
	
	this.ApplyDatePicker(tbjQuery('#shuttlePickupDateHolderStep1'), 'shuttlePickupDateStep1');
	
	this.ApplyHrMinPicker();
	this.ApplyDatePicker(tbjQuery('#returnDateHolder'), 'returnTripPickupDate');
	
	// preselect booking types
	var selected_type = tbjQuery('#booking_type').val();
	tbjQuery('.service-type-elems-wrapper').hide();
	tbjQuery('#tabs_'+selected_type).show();
	tbjQuery('#hourly_hr').removeClass('required');
	
	var hide_return = false;
	
	tbjQuery('.non-shared-rides').show();
	
	if(selected_type=="shuttle"){
	    tbjQuery('.non-shuttle').hide();
	    tbjQuery('.shuttle').show();
	    TBFEngine.clearStopPoints();
	    hide_return = true;
	}
	else {
	    if(selected_type=="hourly"){
		tbjQuery('#hourly_hr').addClass('required');
		hide_return = true;
	    }
	    else if(selected_type=="dailyhire"){
		hide_return = true;
		tbjQuery('.pickup-date-time-label').hide();
		tbjQuery('.pickup-date-time-label.dailyhire').show();
		
		TBFEngine.getExtras('dailyhire'); // daily Hire custom fields should be shown
	    }
	    tbjQuery('.non-shuttle').show();
	    tbjQuery('.shuttle').hide();
	    
	    if(selected_type=="tours"){
		hide_return = true;
		TBFEngine.getCompanyTours(1,url_tour_id); // show previous selection
	    }	    
	    if(selected_type=="address"){
		tbjQuery('#stops_modal_trigger').show();
	    }
	    else {
		TBFEngine.clearStopPoints();
	    }
	}
	if(hide_return){
	    if(tbjQuery('.add-return-trip-outer').length>0){
		tbjQuery('#returnjurney').val(0);
		tbjQuery('#returnTripYes').removeClass('custom-active');
		tbjQuery('#returnTripNo').addClass('custom-active');
		if(tbjQuery('#return_wait_hr').length>0){
		    tbjQuery('#return_wait_hr').styler('destroy');
		    tbjQuery('#return_wait_hr').val(0);
		    tbjQuery('#return_wait_hr').styler();
		}
		tbjQuery('.add-return-trip-outer').hide();
		tbjQuery('#returnTripWrapper').hide();
	    }
	}
	
	for (var i =0; i < selectedAreaVerticesArr.length; i++) {
	    triangleCoords.push(new google.maps.LatLng(selectedAreaVerticesArr[i][0],selectedAreaVerticesArr[i][1]));
	}
	// For Search URL booking, we should show pickup and dropoff from search URL
	// instead we should show the journey duration in Google Map
	if(url_booking_type=="") 
	{
	    setTimeout(function () {
		if( selected_type=='offers' && tbjQuery('#route_from').val()>0 && tbjQuery('#route_to').val()>0)
		 {
		     TBFEngine.getSpecialRouteDetails();
		 }
		 
		var address_search_enabled = false;
		if(tbjQuery('#address_from').length > 0 && tbjQuery('#address_to').length > 0){
		    address_search_enabled = true;
		}
		var special_route_enabled = false;
		if(tbjQuery('#route_from_fld').length > 0){
		    special_route_enabled = true;
		}
		var hourly_hire_enabled = false;
		if(tbjQuery('#hourly_hr').length > 0){
		    hourly_hire_enabled = true;
		}
		var shuttle_enabled = false;
		if(tbjQuery('#shuttle_pickup').length > 0 && tbjQuery('#shuttle_dropoff').length > 0){
		    shuttle_enabled = true;
		}
		if( ( (special_route_enabled && tbjQuery('#route_from').val()!=0 && tbjQuery('#route_to').val()!=0) ||
			(hourly_hire_enabled && tbjQuery('#hourly_hr').val()!=0 ) ||
			(address_search_enabled && tbjQuery('#address_from').val()!="" && tbjQuery('#address_to').val()!="") ||
			(shuttle_enabled && tbjQuery('#shuttle_pickup_poi').val()>0 && tbjQuery('#shuttle_dropoff_poi').val()>0 )
		    )
		   && (tbjQuery('#passengers').val()!=0)
		   && (tbjQuery('#pickupDateStep1').val()!="" && tbjQuery('#pickupTimeStep1').val()!="")
		)
		{
		    var booking_type = tbjQuery('#booking_type').val();
		    if(booking_type=='hourly'){
			TBFEngine.getCars(false);
		    }
		    else if(booking_type=='shuttle'){
			//GoogleGeoCore.RenderDirections();
			tbjQuery('div#loadingProgressContainer').show();
			if(TBFSettings.showPOICategoriesShuttle==1){
			    TBFEngine.getShuttleDropoffPOIs('pickup');
			    TBFEngine.getShuttleDropoffPOIs('dropoff_cat');
			    TBFEngine.getShuttleDropoffPOIs('dropoff');
			}
			else {
			    TBFEngine.getShuttleDropoffPOIs('dropoff');
			}
			TBFEngine.getShuttleTimeOptions(0); // clear_previous_selection = 0
			TBFEngine.getMaps(false);   // show_cars = TRUE will show 2nd step cars table, FALSE will show 3rd step
		    }
		    else {
			//GoogleGeoCore.RenderDirections();
			TBFEngine.getMaps(false);  // show_cars = TRUE will show 2nd step cars table, FALSE will show 3rd step
		    }
		}
	    }, 1000);
	}

		tbjQuery("#sidebarCollapse").on("click", function() {
			tbjQuery("#block-hommeonlinebooking").toggleClass("active");
			tbjQuery(this).toggleClass("active");
		});	
	
    };
    this.clearStopPoints = function(){
	tbjQuery('#stops_modal_trigger').hide();
	tbjQuery('#stops_data_wrapper').html("");
	tbjQuery('.stops-wrapper').hide();
    }
    this.clearAjaxLoading = function() {
        tbjQuery('.autocomplete-loading,.autocomplete-loading-list').remove();
    }
    this.unsetPoiAddress = function() {
        tbjQuery('input#address_from,input#address_from_lat,input#address_from_lng').val('');
        tbjQuery('input#address_to,input#address_to_lat,input#address_to_lng').val('');
	tbjQuery('input#pickup_poi,input#dropoff_poi').val(0);
	tbjQuery('div#pickup_extra_wrapper,div#stops_data_wrapper,div#dropoff_extra_wrapper').html('');
	
	// reset map to default city-country 
	tbjQuery("#estimatedDistance").text("");//clear calculated distance
	GoogleGeoCore.DirectionRenderer1.setMap(null);
	//clear pushpins
	GoogleGeoCore.ClearPushpins();
	//console.log(TBFSettings.defaultMapLat+' '+TBFSettings.defaultMapLng);
	if(TBFSettings.defaultMapLat!="" && TBFSettings.defaultMapLng!=""){
	    GoogleGeoCore.MapStep1.setCenter({lat: TBFSettings.defaultMapLat, lng: TBFSettings.defaultMapLng});
	}
    }
    this.unsetRoute = function() {
        var route_swapped = tbjQuery('#route_swapped').val();
        if(route_swapped==1){ // routes are already swapped, so normalize them
	    tbjQuery('#route_category_fld').attr('readonly', false);
	    tbjQuery('#route_category_dropoff_fld').attr('readonly', false);
            tbjQuery('#route_from_fld').attr('readonly', false);
            tbjQuery('#route_to_fld').attr('readonly', false);
            tbjQuery('#route_swapped').val(0);
        }
	tbjQuery('#route_category_fld,#route_from_fld,#route_to_fld,#route_category_dropoff_fld').val('');
	tbjQuery('#route_category,#route_from,#route_to,#route_category_dropoff').val(0);
	tbjQuery('div.route_pickup_wrap,div.dropoff_category_wrap,div.route_dropoff_wrap').hide();
        tbjQuery('div#routefrom_extra_wrapper').html('');   
        tbjQuery('div#routeto_extra_wrapper').html('');
	
	// reset map to default city-country 
	tbjQuery("#estimatedDistance").text("");//clear calculated distance
	GoogleGeoCore.DirectionRenderer1.setMap(null);
	//clear pushpins
	GoogleGeoCore.ClearPushpins();
	//console.log(TBFSettings.defaultMapLat+' '+TBFSettings.defaultMapLng);
	if(TBFSettings.defaultMapLat!="" && TBFSettings.defaultMapLng!=""){
	    GoogleGeoCore.MapStep1.setCenter({lat: TBFSettings.defaultMapLat, lng: TBFSettings.defaultMapLng});
	}
    }
    this.unsetHourlyHire = function() {
	tbjQuery('#hourly_hr').styler('destroy').val(0).styler();
	tbjQuery('#hourly_min').styler('destroy').val(0).styler();
	tbjQuery('div#hourly_extra_wrapper').html('');
    }
    this.unsetShuttle = function(){
	tbjQuery('#shuttle_pickup_category_fld,#shuttle_pickup,#shuttle_dropoff,#shuttle_dropoff_category_fld').val("");
	tbjQuery('#shuttle_pickup_catid,#shuttle_pickup_poi,#shuttle_dropoff_poi,#shuttle_dropoff_catid').val(0);
	if(TBFSettings.showPOICategoriesShuttle==1){
	    tbjQuery('div.shuttle_pickup_wrap,div.shuttle_dropoff_category_wrap,div.shuttle_dropoff_wrap').hide();
	}
	else {
	    tbjQuery('div.shuttle_dropoff_wrap').hide();
	}
	tbjQuery('.shuttletime').styler('destroy').val("").styler();
	tbjQuery("div#shuttle_pickuptime_wrap,div#shuttle_passengers_wrap").html('');
	tbjQuery("div#shuttlePickupTimeHolderStep1,div#shuttlePassengerHolderStep1").hide();
    }
    this.unsetDailyHire = function() {
	tbjQuery('#dailyhire_extra_summary_wrapper').html("");
	tbjQuery('#dailyhire_dropoff_time_info').html("").hide();
    }
    this.unsetPrivateTours = function(){
	tbjQuery('div.tours_wrap div.tours_list_wrap').html('').hide();
	tbjQuery('div#tabs_tours div.tours_pickup_pois_wrap div.tour_pois_list_wrap').html('');
	tbjQuery('div#tabs_tours div.tours_pickup_pois_wrap').hide();
	tbjQuery('div#private_tours_extra_wrapper').html('');
    }
    this.removeExtras = function(){
	tbjQuery('#pickup_extra_wrapper,#routefrom_extra_wrapper,#shuttle_pickup_extra_wrapper').html("");
	tbjQuery('#dropoff_extra_wrapper,#routeto_extra_wrapper,#shuttle_dropoff_extra_wrapper').html("");
	tbjQuery('#hourly_extra_summary_wrapper,#dailyhire_extra_summary_wrapper').html("");
    }
    this.makeFirstStepActive = function(){
	TBFEngine.removePopovers();
	TBFEngine.removeExtras();
	tbjQuery('#bottomFloatingBar').hide(); // price floating bar will not be first step
	tbjQuery('#limobooking-step3-wrapper').hide();
	tbjQuery('#limobooking-step2-wrapper').hide();
	tbjQuery('#limobooking-step1-wrapper').show();
	
	tbjQuery('#limobooking-steps-area .step-number-wrap.third').removeClass('active');
	tbjQuery('#limobooking-steps-area .step-number-wrap.second').removeClass('active');
	tbjQuery('#limobooking-steps-area .step-number-wrap.first').addClass('active');
	
	// change data source to component
	tbjQuery('#data_source').val('component');
	
	tbjQuery("body, html", window.document).animate({ 
	    scrollTop: tbjQuery('#limobooking-steps-area').offset().top 
	}, 'fast');
	
	// reset stripApiloaded so that API loads again for a new booking
	stripeAPIloaded = false;
	
	GoogleGeoCore.RenderDirections();
	
	if(TBFSettings.fixedFareBookingEnabled && TBFSettings.routeSwappingEnabled){
	    var route_swapped = tbjQuery('#route_swapped').val();
	    if(route_swapped==1){
		tbjQuery('#route_from_fld,#route_to_fld').attr('readonly', true);
		tbjQuery('div#tabs_offers div.list_trigger').hide();
		
		if(TBFSettings.showPOICategories==1 ) {
		    tbjQuery('#route_category_fld,#route_category_dropoff_fld').attr('readonly', true);
		}
		
	    }
	}
    }
    this.makeSecondStepActive = function(){
	TBFEngine.removePopovers();
	TBFEngine.removeExtras();
	tbjQuery('#bottomFloatingBar').hide(); // price floating bar will not be first step
	tbjQuery('#limobooking-step3-wrapper').hide();
	tbjQuery('#limobooking-step2-wrapper').show();
	tbjQuery('#limobooking-step1-wrapper').hide();

	tbjQuery('#limobooking-step2-wrapper div.tripSummary').show();

	tbjQuery('#limobooking-steps-area .step-number-wrap.third').removeClass('active');
	tbjQuery('#limobooking-steps-area .step-number-wrap.second').addClass('active');
	tbjQuery('#limobooking-steps-area .step-number-wrap.first').removeClass('active');
	
	tbjQuery("body, html", window.document).animate({ 
	    scrollTop: tbjQuery('#limobooking-steps-area').offset().top 
	}, 'fast');
	
	// reset stripApiloaded so that API loads again for a new booking
	stripeAPIloaded = false;
    }
    this.makeThirdStepActive = function(){
	TBFEngine.removePopovers();
	tbjQuery('#bottomFloatingBar').show(); // show price floating bar on third step
	tbjQuery('#limobooking-step3-wrapper').show();
	tbjQuery('#limobooking-step2-wrapper').hide();
	tbjQuery('#limobooking-step1-wrapper').hide();
	
	tbjQuery('#limobooking-steps-area .step-number-wrap.third').addClass('active');
	tbjQuery('#limobooking-steps-area .step-number-wrap.second').removeClass('active');
	tbjQuery('#limobooking-steps-area .step-number-wrap.first').removeClass('active');
	
	tbjQuery("body, html", window.document).animate({ 
	    scrollTop: tbjQuery('#limobooking-steps-area').offset().top 
	}, 'fast');
    }
    this.removePopovers = function(){
	if(tbjQuery(document).find(".custom-popover").length>0){
	    tbjQuery(document).find(".custom-popover").remove();
	}
    }
    this.showAreaOperationPopup = function(){
	TBFEngine.clearAjaxLoading();
	tbjQuery('#areaOperationiFrame').attr('src', TBF_BASE_URL+'index1.php?option=com_taxibooking&view=taxibooking&layout=areaoperation&tmpl=component');
	tbjQuery('#areaOperationModal').modal("show");
    }
    this.checkAreaOperation = function(target)
    {
	var pickup_lat = tbjQuery('#address_from_lat').val();
	var pickup_lng = tbjQuery('#address_from_lng').val();
	var dropoff_lat = tbjQuery('#address_to_lat').val();
	var dropoff_lng = tbjQuery('#address_to_lng').val();
	
	areaOfOperation = new google.maps.Polygon({
	    paths: triangleCoords
	});
	
	// Both Pick up and Drop off in Area = YES, both Pick up and Drop off have to be in Area of operation
	if(TBFSettings.checkPickupDropoffAreaOperation==1)
	{
	    if(target=='address_from'){
		if ( google.maps.geometry.poly.containsLocation(new google.maps.LatLng(pickup_lat,pickup_lng), areaOfOperation))
		{
		    return true;
		}
		else {
		    tbjQuery('#address_from').val('');
		    tbjQuery('#address_from_lat').val('');
		    tbjQuery('#address_from_lng').val('');
		    tbjQuery('input#pickup_poi').val(0);
		    TBFEngine.showAreaOperationPopup();
		    return false;
		}    
	    }
	    else if(target=='address_to'){
		if ( google.maps.geometry.poly.containsLocation(new google.maps.LatLng(dropoff_lat,dropoff_lng), areaOfOperation))
		{
		    return true;
		}
		else {
		    tbjQuery('#address_to').val('');
		    tbjQuery('#address_to_lat').val('');
		    tbjQuery('#address_to_lng').val('');
		    tbjQuery('input#dropoff_poi').val(0);
		    TBFEngine.showAreaOperationPopup();
		    return false;
		}    
	    }
	}
	else { // Both Pick up and Drop off in Area = NO
	    
	    // 1) When Pick up in Area: Yes
	    // and Drop off in Area: Yes
	    // but Both Pick up and Drop off in Area: No
	    // then only one, either Pick up or Drop off has to be in the Area of operation and they can both be in the area 
	    if(TBFSettings.checkPickupAreaOperation==1 && TBFSettings.checkDropoffAreaOperation==1){
		if(pickup_lat!="" && pickup_lng!="" && dropoff_lat!="" && dropoff_lng!="")
		{
		    if ( !google.maps.geometry.poly.containsLocation(new google.maps.LatLng(pickup_lat,pickup_lng), areaOfOperation)
			&& !google.maps.geometry.poly.containsLocation(new google.maps.LatLng(dropoff_lat,dropoff_lng), areaOfOperation)
			)
		    {
			if(target=='address_from'){
			    tbjQuery('#address_from').val('');
			    tbjQuery('#address_from_lat').val('');
			    tbjQuery('#address_from_lng').val('');
			    tbjQuery('input#pickup_poi').val(0);
			}
			else if(target=='address_to'){
			    tbjQuery('#address_to').val('');
			    tbjQuery('#address_to_lat').val('');
			    tbjQuery('#address_to_lng').val('');
			    tbjQuery('input#dropoff_poi').val(0);
			}
			TBFEngine.showAreaOperationPopup();
			return false;
		    }
		    else {
			return true;
		    }
		}
		else {
		    return true;
		}
	    }
	    else if(TBFSettings.checkPickupAreaOperation==1 && TBFSettings.checkDropoffAreaOperation==0) { // only Pick up has to be in the Area of operation
		if (target=='address_from' && !google.maps.geometry.poly.containsLocation(new google.maps.LatLng(pickup_lat,pickup_lng), areaOfOperation))
		{
		    tbjQuery('#address_from').val('');
		    tbjQuery('#address_from_lat').val('');
		    tbjQuery('#address_from_lng').val('');
		    tbjQuery('input#pickup_poi').val(0);
		    TBFEngine.showAreaOperationPopup();
		    return false;
		}
		else {
		    return true;
		}
	    }
	    else if(TBFSettings.checkPickupAreaOperation==0 && TBFSettings.checkDropoffAreaOperation==1) { // only DropOff has to be in the Area of operation
		if (target=='address_to' && !google.maps.geometry.poly.containsLocation(new google.maps.LatLng(dropoff_lat,dropoff_lng), areaOfOperation))
		{
		    tbjQuery('#address_to').val('');
		    tbjQuery('#address_to_lat').val('');
		    tbjQuery('#address_to_lng').val('');
		    tbjQuery('input#dropoff_poi').val(0);
		    TBFEngine.showAreaOperationPopup();
		    return false;
		}
		else {
		    return true;
		}
	    }
	    else { // none of Pick up or Drop off has to be in the Area of operation
		return true;
	    }
	}
	return true;
    }
    
    // WE will merge address and fixed fare booking, so if there is any fixed fare route exists for a pickup and dropoff
    // that booking will be considered as Fixed fare booking
    this.getSpecialRouteDetails = function() {
        tbjQuery.ajax({
			type: "POST",
			url: TBF_BASE_URL+'index2.php?option=com_taxibooking&controller=onepagethree&task=getRouteDetailsAjax&ajax=1',
			data: {
			pickup_poi: tbjQuery('#route_from').val(),
			dropoff_poi: tbjQuery('#route_to').val(),
			address_from_lat: tbjQuery('#route_from_lat').val(),
			address_from_lng: tbjQuery('#route_from_lng').val(),
			address_to_lat: tbjQuery('#route_to_lat').val(),
			address_to_lng: tbjQuery('#route_to_lng').val()
	    },
	    dataType: 'json',
	    async: false, // UPDATE Jan04.17 - This will define the Booking Type, so this should be triggered first and sync: false, after it completes, other will be triggered
	    beforeSend: function(){
		tbjQuery('div#loadingProgressContainer').show();
	    },
	    complete: function(){
	    },
	    success: function(response){
		// clear out the ajax loading image
		tbjQuery('div#loadingProgressContainer').hide();
		if(response.err==0)
		{
		    tbjQuery('#fixed_route_id').val(response.route.id);
		    tbjQuery('div#special_route_desc').html(response.route.text);
		}
		else {
		    tbjQuery('#fixed_route_id').val(0);
		    tbjQuery('div#special_route_desc').html('');
		}
	    }
        });
    }
    
    // collect extra list
    this.getExtras = function(type, poiid) {
	if (typeof poiid == 'undefined') {
	    poiid = 0;
	}
        var passingData = tbjQuery('#price_form').serialize()+'&type='+type+'&poiid='+poiid;
        tbjQuery.ajax({
	    type: "POST",
	    url: TBF_BASE_URL+'index3.php?option=com_taxibooking&controller=onepage&task=getExtraList&ajax=1',
	    data: passingData,
	    dataType: 'json',
	    //async: false,
	    beforeSend: function(){
	    },
	    complete: function(){
		// fill up the extras value from URL extras
		if (typeof url_extras != 'undefined') {
		    var url_extras_arr = url_extras;
		    if(url_booking_type=='address')
		    {
			if(pickup_poi==poiid)
			{
			    for (var key in url_extras_arr['pickup'])
			    {
				tbjQuery('[name="extras[pickup]['+key+']"]').val(url_extras_arr['pickup'][key]);
			    }
			}
			if(dropoff_poi==poiid)
			{
			    for (var key in url_extras_arr['dropoff'])
			    {
				tbjQuery('[name="extras[dropoff]['+key+']"]').val(url_extras_arr['dropoff'][key]);
			    }
			}
		    }
		    else if(url_booking_type=='offers')
		    {
			if(pickup_poi==poiid)
			{
			    for (var key in url_extras_arr['pickup'])
			    {
				tbjQuery('[name="extras[route_pickup]['+key+']"]').val(url_extras_arr['pickup'][key]);
			    }
			}
			if(dropoff_poi==poiid)
			{
			    for (var key in url_extras_arr['dropoff'])
			    {
				tbjQuery('[name="extras[route_dropoff]['+key+']"]').val(url_extras_arr['dropoff'][key]);
			    }
			}
		    }
		    else if(url_booking_type=='hourly')
		    {
			for (var key in url_extras_arr['hourly_hire'])
			{
			    tbjQuery('[name="extras[hourly_hire]['+key+']"]').val(url_extras_arr['hourly_hire'][key]);
			}
		    }
		    else if(url_booking_type=='shuttle')
		    {
			if(shuttle_pickup_poi==poiid)
			{
			    for (var key in url_extras_arr['pickup'])
			    {
				tbjQuery('[name="extras[shuttle_pickup]['+key+']"]').val(url_extras_arr['pickup'][key]);
			    }
			}
			if(shuttle_dropoff_poi==poiid)
			{
			    for (var key in url_extras_arr['dropoff'])
			    {
				tbjQuery('[name="extras[shuttle_dropoff]['+key+']"]').val(url_extras_arr['dropoff'][key]);
			    }
			}
		    }

		    else if(url_booking_type=='tours')
		    {
			if(url_tour_id==tbjQuery('#tour_id').val())
			{
			    for (var key in url_extras_arr['private_tours'])
			    {
				tbjQuery('[name="extras[private_tours]['+key+']"]').val(url_extras_arr['private_tours'][key]);
			    }
			}
		    }

		    // Prefill User details custom fields
		    for (var key in url_extras_arr['user_details'])
		    {
			tbjQuery('[name="extras[user_details]['+key+']"]').val(url_extras_arr['user_details'][key]);
		    }
		}
	    },
	    success: function(response){
		// clear out the ajax loading image
		TBFEngine.clearAjaxLoading();
		if(response.error==0)
		{
		    if(type=='pickup' || type=='address_pickup'){
			tbjQuery('div#pickup_extra_wrapper').html(response.msg);   
		    }
		    else if(type=='dropoff' || type=='address_dropoff'){
			tbjQuery('div#dropoff_extra_wrapper').html(response.msg);
		    }
		    else if(type=='route_pickup'){
			tbjQuery('div#routefrom_extra_wrapper').html(response.msg);   
		    }
		    else if(type=='route_dropoff'){
			tbjQuery('div#routeto_extra_wrapper').html(response.msg);
		    }
		    else if(type=='hourly_hire'){
			tbjQuery('div#hourly_extra_wrapper').html(response.msg);
		    }
		    else if(type=='dailyhire'){
			tbjQuery('div#dailyhire_extra_wrapper').html(response.msg);
		    }
		    else if(type=='user_details'){
			if(response.msg==""){
			    tbjQuery('div#user_details_extra_wrapper').html('');
			    tbjQuery('div#user_details_extra_wrapper').closest('div.additional-infoWrap').hide();
			}
			else {
			    tbjQuery('div#user_details_extra_wrapper').closest('div.additional-infoWrap').show();
			    tbjQuery('div#user_details_extra_wrapper').html(response.msg);
			}
		    }
		    else if(type=='shuttle_pickup'){
			tbjQuery('div#shuttle_pickup_extra_wrapper').html(response.msg);   
		    }
		    else if(type=='shuttle_dropoff'){
			tbjQuery('div#shuttle_dropoff_extra_wrapper').html(response.msg);
		    }
		    else if(type=='private_tours'){
			tbjQuery('div#private_tours_extra_wrapper').html(response.msg);
		    }		    
		    if(type=='hourly_hire' || type=='dailyhire'){
			tbjQuery('.extra.address-search').each(function(){
			    var fieldObj = tbjQuery(this);
			    if(TBFSettings.defaultCountry!=""){
				var options = {
				    componentRestrictions: {country: TBFSettings.defaultCountry}
				};
			    }
			    else {
				var options = {};
			    }
			    var waypoint_autocomplete = new google.maps.places.Autocomplete(this, options);
			    google.maps.event.addListener(waypoint_autocomplete, 'place_changed', function() {
				var place = waypoint_autocomplete.getPlace();
				if (place.geometry) {
				    
				    //clear pushpins
				    GoogleGeoCore.ClearPushpins();
				    
				    var puLocation =
				    {
					Latitude: place.geometry.location.lat(),
					Longitude: place.geometry.location.lng()
				    };
				    GoogleGeoCore.DisplayPushpinOnMap(puLocation, fieldObj);
				    
				    tbjQuery(fieldObj).siblings('#extra_lat').val(place.geometry.location.lat());
				    tbjQuery(fieldObj).siblings('#extra_lng').val(place.geometry.location.lng());
				}
			    });
			})
		    }
		    
		    tbjQuery('.field_desc').tooltip();
		}
		else {
		    if(response.company_id==0){
			window.location.reload();
		    }
		    else {
			return false;
		    }
		}
	    }
        });
    }
    this.getReturnExtras = function() {
	if(tbjQuery('#returnjurney').val()==1 && TBFSettings.showReturnExtras==1){
	    tbjQuery.ajax({
                type: "POST",
		url: TBF_BASE_URL+'index4.php?option=com_taxibooking&controller=onepagethree&task=getReturnExtraListAjax&ajax=1',
		data: tbjQuery('#price_form').serialize(),
		dataType: 'json',
		//async: false,
		beforeSend: function(){
		    tbjQuery('div#loadingProgressContainer').show();
		},
		complete: function(){
		    // fill up the extras value from URL extras
		    if (typeof url_extras != 'undefined') {
			//var url_extras_arr = JSON.parse(url_extras.toString());
			var url_extras_arr = url_extras;
			for (var key in url_extras_arr['return_pickup'])
			{
			    tbjQuery('[name="extras[return_pickup]['+key+']"]').val(url_extras_arr['return_pickup'][key]);
			}
			for (var key in url_extras_arr['return_dropoff'])
			{
			    tbjQuery('[name="extras[return_dropoff]['+key+']"]').val(url_extras_arr['return_dropoff'][key]);
			}
		    }
		},
		success: function(response){
		    tbjQuery('div#loadingProgressContainer').hide();
		    if(response.error==0)
		    {
			tbjQuery('div#return_pickup_extra_wrapper').html(response.return_pickup_extra_html);
			tbjQuery('div#return_dropoff_extra_wrapper').html(response.return_dropoff_extra_html);
			tbjQuery('.field_desc').tooltip();
		    }
		}
	    });
	}
	else {
	    return false;
	}
    }
    // collect pickup route for this selected category
    this.collectRouteFrom = function() {
	if(tbjQuery('#route_category').val() > 0)
	{
	    tbjQuery.ajax({
		type: "POST",
		url: TBF_BASE_URL+'index5.php?option=com_taxibooking&task=getRouteList&ajax=1',
		data: tbjQuery('#route_category').serialize()+'&'+tbjQuery('[name="active_lang"]').serialize(),
		dataType: 'json',
		//async: false,
		beforeSend: function(){
		    tbjQuery('#tabs_offers #route_from').after('<span class="autocomplete-loading-list"></span>');
		    tbjQuery('#route_category_dropoff_fld').val('');
		    tbjQuery('#route_category_dropoff').val(0);
		},
		complete: function(){
		},
		success: function(response){
		    TBFEngine.clearAjaxLoading();
		    tbjQuery('div.route_pickup_wrap div.poi_dropdown_wrapper').html(response.route_options_html);
		}
	    })
	}
    }
    this.collectDropoffRouteCategory = function() {
        if(tbjQuery('#route_from').val() > 0) {
	    var passingData = tbjQuery('#route_from').serialize()+'&'+tbjQuery('[name="active_lang"]').serialize();
	    if(tbjQuery('#route_category').length>0){
		passingData += '&'+tbjQuery('#route_category').serialize();
	    }
	    
            tbjQuery.ajax({
                type: "POST",
                url: TBF_BASE_URL+'index6.php?option=com_taxibooking&task=getRouteCategory&ajax=1',
                data: passingData,
                dataType: 'json',
                //async: false,
                beforeSend: function(){
                    tbjQuery('#tabs_offers #route_category_dropoff').after('<span class="autocomplete-loading-list"></span>');
                },
                complete: function(){
                },
                success: function(response){
		    TBFEngine.clearAjaxLoading();
                    tbjQuery('div.routecategory_dropoff_dropdown_wrapper').html(response.route_categories_html);
                }
            })
        }
    }
    this.collectRouteTo = function() {
        if(tbjQuery('#route_from').val() > 0) {
	    var passingData = tbjQuery('#route_from').serialize()+'&'+tbjQuery('[name="active_lang"]').serialize();
	    if(tbjQuery('#route_category').length>0){
		passingData += '&'+tbjQuery('#route_category').serialize();
	    }
	    if(tbjQuery('#route_category_dropoff').length>0){
		passingData += '&'+tbjQuery('#route_category_dropoff').serialize();
	    }
	    
            tbjQuery.ajax({
                type: "POST",
                url: TBF_BASE_URL+'index7.php?option=com_taxibooking&task=getRouteList&ajax=1',
                data: passingData,
                dataType: 'json',
                //async: false,
                beforeSend: function(){
		    tbjQuery('#tabs_offers #route_to').after('<span class="autocomplete-loading-list"></span>');
                },
                complete: function(){
                },
                success: function(response){
		    TBFEngine.clearAjaxLoading();
                    tbjQuery('div.route_dropoff_wrap div.poi_dropdown_wrapper').html(response.route_options_html);
                }
            })
        }
    }
    this.getShuttleDropoffPOIs = function(result_type) {
        var passingData = tbjQuery('[name="active_lang"]').serialize();
	if(result_type=='pickup'){
	    passingData += '&shuttle_pickup_catid='+tbjQuery('#shuttle_pickup_catid').val();
	}
	else if(result_type=='dropoff_cat'){
	    passingData += '&shuttle_pickup_catid='+tbjQuery('#shuttle_pickup_catid').val()+'&shuttle_pickup_poi='+tbjQuery('#shuttle_pickup_poi').val();
	}
	else if(result_type=='dropoff'){
	    passingData += '&shuttle_pickup_catid='+tbjQuery('#shuttle_pickup_catid').val()+'&shuttle_pickup_poi='+tbjQuery('#shuttle_pickup_poi').val()+'&shuttle_dropoff_catid='+tbjQuery('#shuttle_dropoff_catid').val();
	}
        tbjQuery.ajax({
                type: "POST",
                url: TBF_BASE_URL+'index8.php?option=com_taxibooking&controller=onepage&task=getShuttleDropoffPOIs&ajax=1',
                data: passingData,
                dataType: 'json',
                //async: false,
                beforeSend: function(){
                    // load the ajax loading image
		    if(result_type=='pickup'){
			tbjQuery('#shuttle_pickup_category_fld').after('<span class="autocomplete-loading-list"></span>');
		    }
		    else if(result_type=='dropoff_cat'){
			tbjQuery('#shuttle_pickup').after('<span class="autocomplete-loading-list"></span>');
		    }
		    else if(result_type=='dropoff'){
			if(TBFSettings.showPOICategoriesShuttle==1){
			    tbjQuery('#shuttle_dropoff_category_fld').after('<span class="autocomplete-loading-list"></span>');
			}
			else {
			    tbjQuery('#shuttle_pickup').after('<span class="autocomplete-loading-list"></span>');
			}
		    }
                },
                complete: function(){
                },
                success: function(response){
		    TBFEngine.clearAjaxLoading();
		    if(result_type=='pickup'){
			
			if(response.error==0)
			{
			    tbjQuery("div.shuttle_pickup_wrap").show();
			    tbjQuery("div.shuttle_pickup_wrap div.poi_dropdown_wrapper").html(response.msg);
			}
			else {
			    tbjQuery("div.shuttle_pickup_wrap div.poi_dropdown_wrapper").html('');
			    tbjQuery("div.shuttle_pickup_wrap").hide();
			}
		    }
		    else if(result_type=='dropoff_cat'){
			if(response.error==0)
			{
			    tbjQuery("div.shuttle_dropoff_category_wrap").show();
			    tbjQuery("div.shuttle_dropoff_category_wrap div.poi_dropdown_wrapper").html(response.msg);
			}
			else {
			    tbjQuery("div.shuttle_dropoff_category_wrap div.poi_dropdown_wrapper").html('');
			    tbjQuery("div.shuttle_dropoff_category_wrap").hide();
			}
		    }
		    else if(result_type=='dropoff'){
			if(response.error==0)
			{
			    tbjQuery("div.shuttle_dropoff_wrap").show();
			    tbjQuery("div.shuttle_dropoff_wrap div.poi_dropdown_wrapper").html(response.msg);
			}
			else {
			    tbjQuery("div.shuttle_dropoff_wrap div.poi_dropdown_wrapper").html('');
			    tbjQuery("div.shuttle_dropoff_wrap").hide();
			}
		    }
                }
        });
    }
    this.getShuttleTimeOptions = function(clear_previous_selection) {
		if (typeof clear_previous_selection == 'undefined') {
			clear_previous_selection = 1;
		}
		
        var passingData = tbjQuery('#price_form').serialize()+'&clear_previous_selection='+clear_previous_selection+'&html_format=select-list';
        tbjQuery.ajax({
                type: "POST",
                url: TBF_BASE_URL+'index9.php?option=com_taxibooking&controller=onepage&task=getShuttleTimeOptions&ajax=1',
                data: passingData,
                dataType: 'json',
                //async: false,
                beforeSend: function(){
		    tbjQuery('#shuttle_dropoff').after('<span class="autocomplete-loading-list"></span>');
		    
                },
                complete: function(){
                },
                success: function(response){
		    TBFEngine.clearAjaxLoading();
                    if(response.error==0)
                    {
			tbjQuery("div#shuttlePickupTimeHolderStep1").show();
			tbjQuery("div#shuttle_pickuptime_wrap").removeClass('custom-alert custom-alert-danger').html(response.msg);
			
			// prepare passenger list for selected route time if selected from module
			if(clear_previous_selection==0)
			{
			    tbjQuery('div#shuttlePassengerHolderStep1,div#shuttleChildHolderStep1').show();
			    if(tbjQuery('.shuttletime').val()!=""){
				var available_seats = tbjQuery('.shuttletime option:selected').attr('data-seats');
				var passenger_list = tbjQuery('<select id="shuttle_passengers" name="shuttle_passengers" class="styler_list">');
				for(var i = 1; i <= parseInt(available_seats); i++){
				    if(tbjQuery('#selected_shuttle_passengers').val()==i){
					passenger_list.append(tbjQuery("<option>").attr({'value':i,'selected':true}).text(i));
				    }
				    else {
					passenger_list.append(tbjQuery("<option>").attr({'value':i,'selected':false}).text(i));
				    }
				}
				tbjQuery('div#shuttle_passengers_wrap').html(passenger_list);
				tbjQuery('#shuttle_passengers').styler();
				
				var selected_passengers = tbjQuery('#selected_shuttle_passengers').val();
				var available_child_seats = parseInt(available_seats)-parseInt(selected_passengers);
				
				var child_list = tbjQuery('<select id="shuttle_childs" name="shuttle_childs" class="styler_list">');
				child_list.append(tbjQuery("<option>").attr('value',0).text(0));
				for(var i = 1; i <= available_child_seats; i++){
				    if(tbjQuery('#selected_shuttle_childs').val()==i){
					child_list.append(tbjQuery("<option>").attr({'value':i,'selected':true}).text(i));
				    }
				    else {
					child_list.append(tbjQuery("<option>").attr({'value':i,'selected':false}).text(i));
				    }
				}
				tbjQuery('div#shuttle_childs_wrap').html(child_list);
				tbjQuery('#shuttle_childs').styler();
			    }
			}
			else {
			    tbjQuery('.shuttletime').styler('destroy').val("").styler();
			    tbjQuery('#selected_shuttle_passengers,#selected_shuttle_childs').val(0);
			    tbjQuery('div#shuttle_passengers_wrap,div#shuttle_childs_wrap').html('');
			    tbjQuery('div#shuttlePassengerHolderStep1,div#shuttleChildHolderStep1').hide();
			}
			tbjQuery('.shuttletime').change(function (e) {
			    tbjQuery('div#shuttlePassengerHolderStep1,div#shuttleChildHolderStep1').show();
			    if(tbjQuery('.shuttletime option:selected').val()!=""){
				var available_seats = tbjQuery('.shuttletime option:selected').attr('data-seats');
				//console.log(available_seats);
				var shuttle_route_id = tbjQuery('.shuttletime option:selected').attr('data-routeid');
				//console.log(shuttle_route_id);
				tbjQuery('#shuttle_route_id').val(shuttle_route_id);
				var passenger_list = tbjQuery('<select id="shuttle_passengers" name="shuttle_passengers" class="styler_list">');
				for(var i = 1; i <= parseInt(available_seats); i++){
				    passenger_list.append(tbjQuery("<option>").attr('value',i).text(i));
				}
				tbjQuery('div#shuttle_passengers_wrap').html(passenger_list);
				tbjQuery('#shuttle_passengers').styler();
				
				var child_list = tbjQuery('<select id="shuttle_childs" name="shuttle_childs" class="styler_list">');
				child_list.append(tbjQuery("<option>").attr('value',0).text(0));
				tbjQuery('div#shuttle_childs_wrap').html(child_list);
				tbjQuery('#shuttle_childs').styler();
				
				TBFEngine.getShuttleRouteDetails(shuttle_route_id);
			    }
			    else {
				tbjQuery('#shuttle_route_id').val(0);
				tbjQuery('div#shuttle_route_desc').html('');
				tbjQuery('div#shuttlePassengerHolderStep1,div#shuttleChildHolderStep1').hide();
				tbjQuery('div#mapOff').css({'display':'block'});
			    }
			})
			tbjQuery('select.styler_list').styler({
				selectPlaceholder: 'Select Option....'
			});
			tbjQuery(document).on("change", '#shuttle_passengers', function (e) {
			    //console.log(tbjQuery(this).val());
			    if(tbjQuery('.shuttletime option:selected').val()!=""){
				var available_seats = tbjQuery('.shuttletime option:selected').attr('data-seats');
				var selected_passengers = tbjQuery(this).val();
				var available_child_seats = parseInt(available_seats)-parseInt(selected_passengers);
				
				var child_list = tbjQuery('<select id="shuttle_childs" name="shuttle_childs" class="styler_list">');
				child_list.append(tbjQuery("<option>").attr('value',0).text(0));
				for(var i = 1; i <= available_child_seats; i++){
				    child_list.append(tbjQuery("<option>").attr('value',i).text(i));
				}
				tbjQuery('div#shuttle_childs_wrap').html(child_list);
				tbjQuery('#shuttle_childs').styler();
			    }
			})
                    }
		    else {
			if(response.company_id==0){
			    window.location.reload();
			}
			else {
			    tbjQuery("div#shuttlePickupTimeHolderStep1").show();
			    tbjQuery("div#shuttle_pickuptime_wrap").html(response.msg).addClass('custom-alert custom-alert-danger');
			}
		    }
                }
        });
    }
    
    // collect map data
    this.getMaps = function(show_cars , use_case) {  // show_cars = TRUE will show 2nd step cars table, FALSE will show 3rd step
        // if there is a previous ajax search, then we abort it and then set tbxhr to null
        if( tbxhr != null ) {
            tbxhr.abort();
            tbxhr = null;
        }
        var booking_type = tbjQuery('#booking_type').val();
        var passingData = tbjQuery('#price_form').serialize();
		if(booking_type=='shuttle'){
			// UPDATE May24.2016: shuttle_route_id will be passed from default_three
			//passingData += '&shuttle_route_id='+tbjQuery('.shuttletime option:selected').attr('data-routeid');
		}
		tbjQuery('div#step1Info').hide();
		tbxhr = tbjQuery.ajax({
			type: "POST",
			url: TBF_BASE_URL+'vtc/skilling/dogs/'+use_case+'/60',
			data: passingData,
			dataType: 'json',
			timeout: 9000,
			tryCount : 0,
			retryLimit : 3,			
			beforeSend: function(){
				tbjQuery('div#loadingProgressContainer').show();
			},
			complete: function(){
			},
			error : function(xhr, textStatus, errorThrown ) {
				//console.log ("error is: "+textStatus+"with code:"+ xhr.status);
				if (textStatus == 'timeout') {
					//console.log ('timeout '+this.tryCount);
					this.tryCount++;
					tbjQuery('div#loadingProgressContainer').hide();
					
					if (this.tryCount <= this.retryLimit) {
						//try again
						tbjQuery.ajax(this);
						return;
					}				
					else{
						tbjQuery('div#loadingProgressContainer').hide();
						tbjQuery('div#step1Info').show().html("Afin de traiter cette réservation, nous vous prions de nous contacter au <a href=\"tel:0699884765\">06 99 88 47 65</a>");
						return;
					}
				}
				else{
					tbjQuery('div#loadingProgressContainer').hide();
					tbjQuery('div#step1Info').show().html("Afin de traiter cette réservation, nous vous prions de nous contacter au <a href=\"tel:0699884765\">06 99 88 47 65</a>");
					return;
					
				}
				//if (xhr.status == 503) {
				//	//handle error
				//	this.tryCount++;
				//	if (this.tryCount <= this.retryLimit) {
				//		//try again
				//		tbjQuery.ajax(this);
				//		return;
				//	}            
				//	return;					
				//} else {
				//	//handle error
				//}
			},
			success: function(response){
				tbjQuery('div#loadingProgressContainer').hide();
				if(response.error==1){
					if(response.company_id==0){
						window.location.reload();
					}
					else {
						tbjQuery('div#step1Error').show().html(response.msg);
						return false;
					}
				}
				else{
					console.log (response);
					//tbjQuery('div#step1Info').show().html(response.msg);
					//tbjQuery('div#step1Info').show().html("La course coûte 15€");
					if (use_case == 1){
						tbjQuery('div#step1Info').show().html("La course coûte "+response.tariff);
					}
					else if (use_case == 2){
						//tbjQuery('#booking_confirmation').modal("show");
						// Redirection to the payement page
						window.location.replace(TBF_BASE_URL+'checkout/'+response.order+'/order_information');
					}
					//TBFEngine.getCars(show_cars);
				}                    
			}
		})
	}
		// collect cars
	this.getCars = function(show_cars) {
			// if there is a previous ajax search, then we abort it and then set tbxhr to null
			if( tbxhr != null ) {
				tbxhr.abort();
				tbxhr = null;
			}
		tbjQuery('#selected_car').val(0);
		var booking_type = tbjQuery('#booking_type').val();
			var passingData = tbjQuery('#price_form').serialize();
		
		TBFEngine.removePopovers();
    }
    this.getNextAvailableCar = function() {
        var passingData = tbjQuery('#price_form').serialize();
	var booking_type = tbjQuery('#booking_type').val();
        tbjQuery.ajax({
                type: "POST"
                , url: TBF_BASE_URL+'index12.php?option=com_taxibooking&controller=onepage&task=getNextAvailableCar&ajax=1'
                , data: passingData
                , dataType: 'json'
                , beforeSend: function(){
		    tbjQuery('div#loadingProgressContainer').show();
		    tbjQuery('#limobooking-step2-wrapper #vehicle_wrapper').html('');
                }
                , complete: function(){
                }
                , success: function(response){
		    tbjQuery('div#loadingProgressContainer').hide();
                    if(response.error==1)
                    {
			if(response.company_id==0){
			    window.location.reload();
			}
			else {
			    tbjQuery('#limobooking-step2-wrapper #warning_msg').show().html(response.msg);
			}
                    }
                    else
                    {
			tbjQuery('#limobooking-step2-wrapper .date-time').html(response.pickup_datetime);
			tbjQuery('#limobooking-step3-wrapper .date-time').html(response.pickup_datetime);
			tbjQuery('#limobooking-step2-wrapper .list-address-point').show().html(response.stops_html);
			
			if(response.additional_seats_html==""){
			    tbjQuery('#limobooking-step2-wrapper .additional_seats_wrapper').hide();
			    tbjQuery('#limobooking-step2-wrapper #additional-seats').html('');
			}
			else{
			    tbjQuery('#limobooking-step2-wrapper .additional_seats_wrapper').show();
			    tbjQuery('#limobooking-step2-wrapper #additional-seats').html(response.additional_seats_html);
			}
			
			tbjQuery('#limobooking-step2-wrapper #warning_msg').show().html(response.next_available_msg);
			tbjQuery('#limobooking-step2-wrapper #vehicle_wrapper').html(response.msg);
			
			tbjQuery( '.car_desc' ).tooltip();
			
			// hide the cars table
			tbjQuery('#limobooking-step2-wrapper #vehicle_wrapper').hide();
			tbjQuery('#show_next_available_yes').click(function(){
			    tbjQuery('#limobooking-step2-wrapper #vehicle_wrapper').show();
			})
			tbjQuery('#show_next_available_no').click(function(){
			    TBFEngine.makeFirstStepActive();
			})
			
			if(tbjQuery('a.rate_details').length > 0){
			    tbjQuery('a.rate_details').popover({ 
				placement : 'bottom',
				container : 'body',
				html : true,
				title: function(){
				    return tbjQuery(this).data('title')+'&nbsp;<span class="close">&times;</span>';
				},
				content: function() {
				    var target_selector = tbjQuery(this).data('target-selector');
				    return tbjQuery('.'+target_selector).html();
				}
			    }).on('shown.bs.popover', function(e){
				var popover = tbjQuery(this);
				tbjQuery(document).on("click", ".custom-popover .close" , function(){
				    popover.popover('hide');
				});
			    });
			}
			
			// display type from config
			if(TBFSettings.carsDefaultDisplay=='list'){
			    tbjQuery('div.vehicles-list .grid').removeClass('active');
			    tbjQuery('div.vehicles-list .list').addClass('active');
			    tbjQuery('div.vehicles-list div.list-view').show();
			    tbjQuery('div.vehicles-list div.grid-view').hide();
			}
			else {
			    tbjQuery('div.vehicles-list .grid').addClass('active');
			    tbjQuery('div.vehicles-list .list').removeClass('active');
			    tbjQuery('div.vehicles-list div.list-view').hide();
			    tbjQuery('div.vehicles-list div.grid-view').show();
			}
                    }
                }
        });
    }
    this.isCarAlreadySelected = function() {
        var passingData = tbjQuery('#price_form').serialize();
	var booking_type = tbjQuery('#booking_type').val();
        tbjQuery.ajax({
                type: "POST"
                , url: TBF_BASE_URL+'index13.php?option=com_taxibooking&controller=onepagethree&task=getAlreadySelectedCar&ajax=1'
                , data: passingData
                , dataType: 'json'
                , beforeSend: function(){
                }
                , complete: function(){
                }
                , success: function(response){
		    if(response.car_is_set!=0){
			tbjQuery('#limobooking-step2-wrapper #vehicle_wrapper .vehicles-body.grid-view a.car_booking').each(function(){
			    var vehicle_id = tbjQuery(this).data('carid');
			    if(vehicle_id==response.car_is_set){
				tbjQuery(this).trigger('click');
			    }
			})
		    }
                }
        });
    }
    this.calculateGrandTotal = function() {
	
	// reset coupon and service charge as these should be added at last
	tbjQuery("#coupon_code").val('');
	tbjQuery('#bottomFloatingBar .coupon_discount').html('');
	tbjQuery('#bottomFloatingBar .coupon_discount_wrap').hide();
	tbjQuery('div.gratuities_btn').removeClass('active');
	tbjQuery('#flat_gratuity').val("");
	tbjQuery('#bottomFloatingBar .gratuity_charge').html('');
	tbjQuery('#bottomFloatingBar .gratuity_charge_wrap').hide();
	
	var booking_type = tbjQuery('#booking_type').val();
        tbjQuery.ajax({
	    type: "POST",
	    url: TBF_BASE_URL+'index14.php?option=com_taxibooking&controller=onepagethree&task=calculateTotalAjax&ajax=1',
	    data: tbjQuery('#price_form').serialize(),
	    dataType: 'json',
	    //async: false,
	    beforeSend: function(){
		tbjQuery('div#loadingProgressContainer').show();
	    },
	    complete: function(){
	    },
	    success: function(response){
		tbjQuery('div#loadingProgressContainer').hide();
		if(response.error==1){
		    if(response.company_id==0){
			window.location.reload();
		    }
		    else {
			alert(response.msg);
		    }
		}
		else {
		    // price display
		    if(response.msg.show_price==1){
			tbjQuery('.sub_total_wrap,.grand_total_wrap').show();
			tbjQuery('.sub_total').html(response.msg.sub_total);
			tbjQuery('#bottomFloatingBar .grand_total').html(response.msg.grand_total);
			if(response.msg.show_flat_cost==1){
			    tbjQuery('.flat_cost_wrap').show();
			    tbjQuery('.flat_cost').html(response.msg.flat_cost);
			}
			else {
			    tbjQuery('.flat_cost').html("");
			    tbjQuery('.flat_cost_wrap').hide();
			}
			if(response.msg.show_percentage_cost==1){
			    tbjQuery('.percentage_cost_wrap').show();
			    tbjQuery('.percentage_cost').html(response.msg.percentage_cost);
			}
			else {
			    tbjQuery('.percentage_cost').html("");
			    tbjQuery('.percentage_cost_wrap').hide();
			}
			if(response.msg.show_user_group_discount==1){
			    tbjQuery('.user_group_discount_wrap').show();
			    tbjQuery('.user_group_discount').html(response.msg.user_group_discount);
			}
			else {
			    tbjQuery('.user_group_discount').html("");
			    tbjQuery('.user_group_discount_wrap').hide();
			}
			
			if(response.msg.extra_html_for_total_section!=""){
			    tbjQuery('#bottomFloatingBar .extra_chrage_wrap').remove();
			    tbjQuery('#bottomFloatingBar .sub_total_wrap').after(response.msg.extra_html_for_total_section);
			}
			else {
			    tbjQuery('#bottomFloatingBar .extra_chrage_wrap').remove();
			}
			
			if(response.msg.payment_labels!=""){
			    tbjQuery('#bottomFloatingBar .payment_label_wrap').remove();
			    tbjQuery('#bottomFloatingBar .user_group_discount_wrap').after(response.msg.payment_labels);
			}
			else {
			    tbjQuery('#bottomFloatingBar .payment_label_wrap').remove();
			}
		    }
		    else {
			tbjQuery('.sub_total,#bottomFloatingBar .grand_total,.flat_cost,.percentage_cost').html("");
			tbjQuery('.sub_total_wrap,.flat_cost_wrap,.percentage_cost_wrap,.grand_total_wrap').hide();
		    }
		}
	    }
        });
    }
    this.validateOrderCopyFields = function(errorsCount)
    {
	tbjQuery('#ordercopy_wrap .required').each(function(){
	    if(tbjQuery(this).val().length == 0)
	    {
		errorsCount++;
		tbjQuery(this).addClass('incorrect');
		tbjQuery(this).next('span.error').remove();
		tbjQuery(this).after('<span class="error">'+TBTranslations.ERR_MESSAGE_FIELD_REQUIRED+'</span>');
	    }
	    else if(tbjQuery(this).hasClass('email') && !TBFEngine.ValidateEmail(tbjQuery(this).val()))
	    {
		errorsCount++;
		tbjQuery(this).addClass('incorrect');
		tbjQuery(this).next('span.error').remove();
		tbjQuery(this).after('<span class="error">'+TBTranslations.ERR_MESSAGE_VALID_EMAIL+'</span>');
	    }
	    else if(tbjQuery(this).hasClass('numeric') && !tbjQuery.isNumeric(tbjQuery(this).val()))
	    {
		errorsCount++;
		tbjQuery(this).addClass('incorrect');
		tbjQuery(this).next('span.error').remove();
		tbjQuery(this).after('<span class="error">'+TBTranslations.ERR_MESSAGE_FIELD_REQUIRED+'</span>');
	    }
	    else {
		tbjQuery(this).removeClass('incorrect');
		tbjQuery(this).next('span.error').remove();
	    }
	})
	return errorsCount;
    }

    //Validate PickUp Date
    this.ValidatePickUpDateTime = function (step)
    {
    	var dateIsValid = true;
    	var timeIsValid = true;
	    var disallowed = false;
	    var pickUpDateValue = $("#pickupDate" + step).val();
	    var pickupTimeValue = $("#pickupTime" + step).val();
	    var puDate = parseDate(pickUpDateValue, Ores4Settings.DatePickerFormat);
	    var puTime = tryParseTime(pickupTimeValue);

	    if (pickUpDateValue == "") {
		    $("#pickupDateErrorDiv" + step).text("Date is required");
		    dateIsValid = false;
	    }
	    else if(!isValidDate(puDate))
	    {
	    	$("#pickupDateErrorDiv" + step).text("Date is incorrect");
	    	dateIsValid = false;
	    }
 
	    if (pickupTimeValue == "")
        {
        	timeIsValid = false;
        	$("#pickupTimeErrorDiv" + step).text("Time is required");
	    }
	    else if (puTime == null)
	    {
	    	timeIsValid = false;
	    	$("#pickupTimeErrorDiv" + step).text("Time is incorrect");
	    }
        
	    if (dateIsValid && timeIsValid)
	    {
	        var errorDescription = Ores4Engine.ValidatePuDateTimeRestriction(pickUpDateValue, puTime);

	        if (errorDescription.length > 0)
	        {
	            if (errorDescription === "Date in past")
	            {
	                $("#pickupDateErrorDiv" + step).text("Date in past");
	                dateIsValid = false;
	            }
	            else if (errorDescription.length > 0)
	            {
	                $("#pickupDateTimeErrorDiv" + step).text(errorDescription);
	            }
	            disallowed = true;
            }
	    }

	    if (!dateIsValid) {
        	$("#pickupDateHolder" + step).addClass("has-error");
        	$("#pickupDateErrorDiv" + step).show();
        }
        else {
        	$("#pickupDateHolder" + step).removeClass("has-error");
        	$("#pickupDateErrorDiv" + step).hide();
        }

        if (!timeIsValid)
        {
            $("#pickupTimeHolder" + step).addClass("has-error");
            $("#pickupTimeErrorDiv" + step).show();
        }
        else
        {
            $("#pickupTimeHolder" + step).removeClass("has-error");
            $("#pickupTimeErrorDiv" + step).hide();
        }

        if (disallowed) {
        	$("#pickupTimeHolder" + step).addClass("has-error");
        	$("#pickupDateHolder" + step).addClass("has-error");
        	$("#pickupDateTimeErrorDiv" + step).show();
        }
        else {
	        if (timeIsValid) {
	        	$("#pickupTimeHolder" + step).removeClass("has-error");
	        }
	        if (dateIsValid) {
				$("#pickupDateHolder" + step).removeClass("has-error");
	        }

        	$("#pickupDateTimeErrorDiv" + step).hide();
        }

	    return dateIsValid && timeIsValid && (!disallowed);
    };

	//Validate PickUp Date
	this.ValidatePickUpDate = function(step)
	{
		var dateIsValid = true;
		var pickUpDateValue = $("#pickupDate" + step).val();
		var puDate = parseDate(pickUpDateValue, Ores4Settings.DatePickerFormat);

		if (pickUpDateValue === "")
		{
			$("#pickupDateErrorDiv" + step).text("Date is required");
			dateIsValid = false;
		}
		else if (!isValidDate(puDate))
		{
			$("#pickupDateErrorDiv" + step).text("Date is incorrect");
			dateIsValid = false;
		}

		if (!dateIsValid)
		{
			$("#pickupDateHolder" + step).addClass("has-error");
			$("#pickupDateErrorDiv" + step).show();
		}
		else
		{
			$("#pickupDateHolder" + step).removeClass("has-error");
			$("#pickupDateErrorDiv" + step).hide();
		}

		return dateIsValid;
	};

	//Validate PickUp time
	this.ValidatePickUpTime = function(step)
	{
		var timeIsValid = true;
		var pickupTimeValue = $("#pickupTime" + step).val();
		var puTime = tryParseTime(pickupTimeValue);

		if (pickupTimeValue === "")
		{
			timeIsValid = false;
			$("#pickupTimeErrorDiv" + step).text("Time is required");
		}
		else if (puTime == null)
		{
			timeIsValid = false;
			$("#pickupTimeErrorDiv" + step).text("Time is incorrect");
		}

		if (!timeIsValid)
		{
			$("#pickupTimeHolder" + step).addClass("has-error");
			$("#pickupTimeErrorDiv" + step).show();
		}
		else
		{
			$("#pickupTimeHolder" + step).removeClass("has-error");
			$("#pickupTimeErrorDiv" + step).hide();
		}

		return timeIsValid;
	};

    this.ValidatePuDateTimeRestriction = function ()
    {
        var errorDescription = "";

        var hourLimit = TBFSettings.orderCreationHoursLimit == null ? 0 : TBFSettings.orderCreationHoursLimit;
	
	if(TBFSettings.datePickerType=='jquery')
	{
	    var order_date = tbjQuery('#pickupDateStep1').val();
	
	    if(TBFSettings.DatePickerFormat=='DD-MM-YYYY'){
		var order_date_day = order_date.substring(0, 2);
		var order_date_month = order_date.substring(3, 5);
	    }
	    else {
		var order_date_month = order_date.substring(0, 2);
		var order_date_day = order_date.substring(3, 5);
	    }
	    var order_date_year = order_date.substring(6, 10);
	    
	    var pickup_hr = tbjQuery('input#selPtHr1').val();
	    var pickup_min = tbjQuery('input#selPtMn1').val();
	    
	    if(TBFSettings.Is12HoursTimeFormat){
		var pickup_ampm = tbjQuery('#seltimeformat1').val();
		
		var time12hr = pickup_hr+':'+pickup_min+' '+pickup_ampm;
		var resultArray = TBFEngine.ConvertTimeformat(time12hr);
		
		pickup_hr = resultArray[0];
		pickup_min = resultArray[1];
	    }
	}
	else if(TBFSettings.datePickerType=='inline')
	{
	    var order_date_day = tbjQuery('#pickup_day').val();
	    var order_date_month = tbjQuery('#pickup_month').val();
	    var order_date_year = tbjQuery('#pickup_year').val();
	    
	    var pickup_hr = tbjQuery('#selPtHr1').val();
	    var pickup_min = tbjQuery('#selPtMn1').val();
	    
	    if(TBFSettings.Is12HoursTimeFormat){
		var pickup_ampm = tbjQuery('#seltimeformat1').val();
		
		var time12hr = pickup_hr+':'+pickup_min+' '+pickup_ampm;
		var resultArray = TBFEngine.ConvertTimeformat(time12hr);
		
		pickup_hr = resultArray[0];
		pickup_min = resultArray[1];
	    }
	}
	
	var enteredDate = new Date(order_date_year, parseInt(order_date_month)-1, order_date_day, pickup_hr, pickup_min);
        //var enteredDateWithOffset = new Date(enteredDate.getTime() + (TBFSettings.TimeZoneUtcOffset * 60 + enteredDate.getTimezoneOffset()) * 60 * 1000);

        var minDateTime = new Date();
        var minDateTimeWithOffset = new Date(minDateTime.getTime() + (TBFSettings.TimeZoneUtcOffset * 60 + minDateTime.getTimezoneOffset()) * 60 * 1000);
	//console.log(enteredDate);
	//console.log(minDateTime);
	//console.log(minDateTimeWithOffset);

        var hourDifference = Math.abs(enteredDate - minDateTimeWithOffset) / 36e5;
	//var hourDifference = Math.abs(enteredDate.getTime() - minDateTime.getTime()) / 36e5;
	//console.log('hourDifference: '+hourDifference);
	//console.log('hourLimit: '+hourLimit);

        //if (hourDifference < hourLimit || enteredDateWithOffset < minDateTimeWithOffset)
	if (hourDifference < hourLimit || enteredDate < minDateTimeWithOffset)
        {
            if (hourLimit === 0)
            {
                errorDescription = TBTranslations.ERR_MESSAGE_DATETIME_IN_PAST;
            }
            else
            {
                errorDescription = TBTranslations.ERR_MESSAGE_INSUFFICIENT_BOOKING_TIME;
            }
        }
	//console.log(errorDescription);
        return errorDescription;
    };
    this.ConvertTimeformat = function(time) {
	var hours = Number(time.match(/^(\d+)/)[1]);
	var minutes = Number(time.match(/:(\d+)/)[1]);
	var AMPM = time.match(/\s(.*)$/)[1];
	if (AMPM == "PM" && hours < 12) hours = hours + 12;
	if (AMPM == "AM" && hours == 12) hours = hours - 12;
	var sHours = hours.toString();
	var sMinutes = minutes.toString();
	if (hours < 10) sHours = "0" + sHours;
	if (minutes < 10) sMinutes = "0" + sMinutes;
	
	var resultArray = new Array(2);
        resultArray[0] = sHours;
        resultArray[1] = sMinutes;
	return resultArray;
    }

    //validate email
    this.ValidateEmail = function (email) {
    	//var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	//return re.test(email);
	
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
    };
    this.ValidatePhone = function (value) {
	var regex=/^(NA|[0-9+-]+)$/;
	return regex.test(value);
    }

    this.ApplyDatePicker = function (holder, target, minDate) {
    	//dates for datetime pickers
    	var today = new Date();
    	var todayPlusTwoYears = new Date();
    	todayPlusTwoYears.setFullYear(today.getFullYear() + 2);

    	if (!minDate) {
		minDate = today;
	}

	holder.datetimepicker(
	{
	    pickTime: false,
	    format: TBFSettings.DatePickerFormat,
	    defaultDate: today,
	    minDate: minDate,
	    maxDate: todayPlusTwoYears, //two year future
	    viewMode: 'days, months',
	    minutesToAddForDefaultDateTime: (TBFSettings.orderCreationHoursLimit*60)+5,
	    icons:
	    {
		time: 'icon-clock',
		date: 'icon-calendar',
		up: 'fa fa-chevron-up',
		down: 'fa fa-chevron-down'
	    }
	}).on("dp.show", function (e) {
	    //tbjQuery('.datepickerbutton').each(function () {
		    //if (tbjQuery(this).parent().data("DateTimePicker")!=holder.data("DateTimePicker")) {
			    //tbjQuery(this).parent().data("DateTimePicker").hide();
		    //}
	    //});
	}).on("dp.change", function (e) {
	    if(target=="shuttlePickupDateStep1"){
		TBFEngine.getShuttleTimeOptions(1); // clear_previous_selection = 1
	    }
	    else if(target=="pickupDateStep1"){
		
		var booking_type = tbjQuery('#booking_type').val();
		//  Drop off date and time 24 hours after Pick up 
		if(booking_type=='dailyhire')
		{
		    var pickup_d = new Date(e.date);
		    //console.log(pickup_d);
		    pickup_d.setTime(pickup_d.getTime() + 60 * 60 * 24 * 1000);
		    //console.log(pickup_d);
		    tbjQuery('#dropoffDateHolderStep1').data("DateTimePicker").setMinDate(pickup_d);
		    tbjQuery('#dropoffDateHolderStep1').data("DateTimePicker").setDate(pickup_d);
		}
		
		
		if(TBFSettings.returntripEnabled==1){
		    tbjQuery('#returnDateHolder').data("DateTimePicker").setMinDate(e.date);
		    if(tbjQuery('#returnTripPickupDate').val()!="" && TBFEngine.comparePickupReturnDates()===true){ // return date is greater than pickup date
			
		    }
		    else { // return date is lower than pickup, so reset return date to pickup
			tbjQuery('#returnDateHolder').data("DateTimePicker").setDate(e.date);
		    }
		}
	    }
	});

	holder.find("input").focus(function(e) {
	    tbjQuery(this).parent().data("DateTimePicker").show(e);
	});

	holder.find("input").focusout(function() {
	    tbjQuery(this).parent().data("DateTimePicker").hide();
	});
    };
    
    this.ApplyHrMinPicker = function () {
	
	tbjQuery('input#selPtHr1').click(function(){
	    if(tbjQuery(this).next('.timepicker-hours').is(":visible") == true){
		tbjQuery(this).next('.timepicker-hours').hide();
	    }
	    else {
		tbjQuery(this).next('.timepicker-hours').show();
	    }
	})
	tbjQuery('.pickup-hours').on("click", 'td.hour', function (e) {
	    tbjQuery('input#selPtHr1').val(tbjQuery(this).html());
	    tbjQuery('.pickup-hours').hide();
	    
	    TBFEngine.regenerateDailyHireDropoffHrsMins();
	    TBFEngine.showDailyHireDropoffTimeWarning();
	})
	tbjQuery('input#selPtMn1').click(function(){
	    if(tbjQuery(this).next('.timepicker-minutes').is(":visible") == true){
		tbjQuery(this).next('.timepicker-minutes').hide();
	    }
	    else {
		tbjQuery(this).next('.timepicker-minutes').show();
	    }
	})
	tbjQuery('.pickup-minutes').on("click", 'td.minute', function (e) {
	    tbjQuery('input#selPtMn1').val(tbjQuery(this).html());
	    tbjQuery('.pickup-minutes').hide();
	    
	    TBFEngine.regenerateDailyHireDropoffHrsMins();
	    TBFEngine.showDailyHireDropoffTimeWarning();
	})
	
	// Dropoff Timepickers for Daily Hire booking
	tbjQuery('input#dropoff_selPtHr').click(function(){
	    if(tbjQuery(this).next('.timepicker-hours').is(":visible") == true){
		tbjQuery(this).next('.timepicker-hours').hide();
	    }
	    else {
		tbjQuery(this).next('.timepicker-hours').show();
	    }
	})
	tbjQuery('.dropoff-hours').on("click", 'td.hour', function (e) {
	    tbjQuery('input#dropoff_selPtHr').val(tbjQuery(this).html());
	    tbjQuery('.dropoff-hours').hide();
	    
	    TBFEngine.showDailyHireDropoffTimeWarning();
	})
	tbjQuery('input#dropoff_selPtMn').click(function(){
	    if(tbjQuery(this).next('.timepicker-minutes').is(":visible") == true){
		tbjQuery(this).next('.timepicker-minutes').hide();
	    }
	    else {
		tbjQuery(this).next('.timepicker-minutes').show();
	    }
	})
	tbjQuery('.dropoff-minutes').on("click", 'td.minute', function (e) {
	    tbjQuery('input#dropoff_selPtMn').val(tbjQuery(this).html());
	    tbjQuery('.dropoff-minutes').hide();
	    
	    TBFEngine.showDailyHireDropoffTimeWarning();
	})
	tbjQuery('#seltimeformat1,#dropoff_seltimeformat').change(function(){
	    TBFEngine.showDailyHireDropoffTimeWarning();
	})
	
	// return timepickers
	tbjQuery('input#return_selPtHr2').click(function(){
	    if(tbjQuery(this).next('.timepicker-hours').is(":visible") == true){
		tbjQuery(this).next('.timepicker-hours').hide();
	    }
	    else {
		// generate dynamic return hour options
		if(TBFSettings.Is12HoursTimeFormat){
		    if(tbjQuery('#returnTripPickupDate').val()!="" && TBFEngine.comparePickupReturnDates()===true){ // return date is greater than pickup date
			var min = 1;
		    }
		    else {
			// If pickup and return dates are the same, then if pickup meridian is AM and return meridian is PM
			// user should see full set of hours
			var pickup_meridian = tbjQuery('#seltimeformat1').val();
			var return_meridian = tbjQuery('#seltimeformat2').val();
			if(pickup_meridian=='AM' && return_meridian=='PM'){
			    var min = 1;
			}
			else {
			    var min = parseInt(tbjQuery('input#selPtHr1').val())+1;
			}
		    }
		    var max = 12;
		}
		else {
		    if(tbjQuery('#returnTripPickupDate').val()!="" && TBFEngine.comparePickupReturnDates()===true){ // return date is greater than pickup date
			var min = 0;
		    }
		    else {
			var min = parseInt(tbjQuery('input#selPtHr1').val())+1;
		    }
		    var max = 23;
		}
		
		var counter = 0;
		var table_html = '<table class="custom-table-condensed"><tbody><tr>';
		for(var i = min; i <= max; i++){
		    var value = (i.toString().length<2) ? "0"+i : i;
		    table_html += '<td class="hour">'+value+'</td>';
		    counter++;
		    if(counter%4===0){
			table_html += '</tr><tr>';
		    }
		}
		table_html += '</tr></tbody></table>';
		tbjQuery(this).next('.timepicker-hours').show().html(table_html);
	    }
	})
	tbjQuery('.return-hours').on("click", 'td.hour', function (e) {
	    tbjQuery('input#return_selPtHr2').val(tbjQuery(this).html());
	    tbjQuery('.return-hours').hide();
	})
	tbjQuery('input#return_selPtMn2').click(function(){
	    if(tbjQuery(this).next('.timepicker-minutes').is(":visible") == true){
		tbjQuery(this).next('.timepicker-minutes').hide();
	    }
	    else {
		// generate dynamic return hour options
		var min = 0,max = 59;
		var counter = 0;
		var table_html = '<table class="custom-table-condensed"><tbody><tr>';
		for(var i = min; i <= max; i=i+5){
		    var value = (i.toString().length<2) ? "0"+i : i;
		    table_html += '<td class="minute">'+value+'</td>';
		    counter++;
		    if(counter%4===0){
			table_html += '</tr><tr>';
		    }
		}
		table_html += '</tr></tbody></table>';
		tbjQuery(this).next('.timepicker-minutes').show().html(table_html);
	    }
	})
	tbjQuery('.return-minutes').on("click", 'td.minute', function (e) {
	    tbjQuery('input#return_selPtMn2').val(tbjQuery(this).html());
	    tbjQuery('.return-minutes').hide();
	})
    };

    this.ApplyTimePicker = function (holder) {
    	//dates for datetime pickers
    	var today = new Date();
    	var todayPlusTwoYears = new Date();
    	todayPlusTwoYears.setFullYear(today.getFullYear() + 2);

	holder.datetimepicker(
	{
	    format:TBFSettings.Is12HoursTimeFormat==true?null: TBFSettings.TimePickerFormat,
	    pickDate: false,
	    minutesToAddForDefaultDateTime: (TBFSettings.orderCreationHoursLimit*60)+5,
	    icons:
	    {
		time: 'icon-clock',
		date: 'icon-calendar',
		up: 'fa fa-chevron-up',
		down: 'fa fa-chevron-down'
	    },
	    minuteStepping: 5
	}).on("dp.show", function (e) {
	    //tbjQuery('.datepickerbutton').each(function () {
		    //if (tbjQuery(this).parent().data("DateTimePicker") != holder.data("DateTimePicker")) {
			    //tbjQuery(this).parent().data("DateTimePicker").hide();
		    //}
	    //});
	});
	holder.find("input").focus(function (e) {
	    tbjQuery(this).parent().data("DateTimePicker").show(e);
	});
	holder.find("input").focusout(function () {
	    tbjQuery(this).parent().data("DateTimePicker").hide();
	});
    };
    
    this.comparePickupReturnDates = function () {
	var order_date = tbjQuery('#pickupDateStep1').val();
	var order_return_date = tbjQuery('#returnTripPickupDate').val();
	
	if(TBFSettings.DatePickerFormat=='DD-MM-YYYY'){
	    var order_date_day = order_date.substring(0, 2);
	    var order_date_month = order_date.substring(3, 5);
	    
	    var order_return_date_day = order_return_date.substring(0, 2);
	    var order_return_date_month = order_return_date.substring(3, 5);
	}
	else {
	    var order_date_month = order_date.substring(0, 2);
	    var order_date_day = order_date.substring(3, 5);
	    
	    var order_return_date_month = order_return_date.substring(0, 2);
	    var order_return_date_day = order_return_date.substring(3, 5);
	}
	var order_date_year = order_date.substring(6, 10);
	var order_return_date_year = order_return_date.substring(6, 10);
	
	var pickup_d = new Date(order_date_year, parseInt(order_date_month)-1, order_date_day);
	var return_d = new Date(order_return_date_year, parseInt(order_return_date_month)-1, order_return_date_day);
	//console.log(pickup_d);
	//console.log(return_d);
        if(return_d>pickup_d) {
            return true;
        }
	else {
	    return false;
	}
    }
    
    this.getFilteredRoutePoints = function (keyword, type) {
	var passing_data = 'keyword='+keyword+'&type='+type+'&'+tbjQuery('[name="active_lang"]').serialize();
	if(type=='route_dropoff'){
	    passing_data += '&route_from='+tbjQuery('#route_from').val();
	}
	if(TBFSettings.showPOICategories==1)
	{
	    if(type=='route_pickup'){
		passing_data += '&'+tbjQuery('#route_category').serialize();
	    }
	    else if(type=='route_dropoff'){
		passing_data += '&'+tbjQuery('#route_category_dropoff').serialize();
	    }
	}
	tbjQuery.ajax({
	    type: "POST",
	    url: TBF_BASE_URL+'index15.php?option=com_taxibooking&task=getRouteList&ajax=1',
	    data: passing_data,
	    dataType: 'json',
	    //async: false,
	    beforeSend: function(){
		if(type=='route_pickup'){
		    tbjQuery('#tabs_offers #route_from_fld').after('<span class="autocomplete-loading"></span>');
		}
		else if(type=='route_dropoff'){
		    tbjQuery('#tabs_offers #route_to_fld').after('<span class="autocomplete-loading"></span>');
		}
	    },
	    complete: function(){
	    },
	    success: function(response){
		TBFEngine.clearAjaxLoading();
		if(type=='route_pickup'){
		    tbjQuery('div.route_pickup_wrap div.poi_dropdown_wrapper').html(response.route_options_html).show();
		}
		else if(type=='route_dropoff'){
		    tbjQuery('div.route_dropoff_wrap div.poi_dropdown_wrapper').html(response.route_options_html).show();
		}
	    }
	})
    };
    // Inline date functions
    this.setReturnYear = function() {
        var pickup_year = tbjQuery('#pickup_year').val();
	tbjQuery('#return_year').styler('destroy');
        tbjQuery("#return_year option").each(function()
        {
            if(tbjQuery(this).val()<parseInt(pickup_year)){
                tbjQuery(this).attr('disabled', true);
            }
            else {
                tbjQuery(this).attr('disabled', false);
            }
        })
        tbjQuery('#return_year').val(pickup_year).styler();
    }
    this.setReturnMonth = function() {
        var pickup_month = tbjQuery('#pickup_month').val();
	tbjQuery('#return_month').styler('destroy');
        tbjQuery("#return_month option").each(function()
        {
            if(tbjQuery(this).val()<parseInt(pickup_month)){
                tbjQuery(this).attr('disabled', true);
            }
            else {
                tbjQuery(this).attr('disabled', false);
            }
        })
        tbjQuery('#return_month').val(pickup_month).styler();
    }
    this.resetReturnMonth = function() {
	tbjQuery('#return_month').styler('destroy');
        tbjQuery("#return_month option").each(function()
        {
            tbjQuery(this).attr('disabled', false);
        })
        tbjQuery('#return_month').val(1).styler();
    }
    this.setReturnDay = function() {
        var pickup_day = tbjQuery('#pickup_day').val();
	tbjQuery('#return_day').styler('destroy');
        tbjQuery("#return_day option").each(function()
        {
            if(tbjQuery(this).val()<parseInt(pickup_day)){
                tbjQuery(this).attr('disabled', true);
            }
            else {
                tbjQuery(this).attr('disabled', false);
            }
        })
        tbjQuery('#return_day').val(pickup_day).styler();
    }
    this.resetReturnDay = function() {
	tbjQuery('#return_day').styler('destroy');
        tbjQuery("#return_day option").each(function()
        {
            tbjQuery(this).attr('disabled', false);
        })
        tbjQuery('#return_day').val(1).styler();
    }
    this.setPickupDate = function() {
	var pickup_year = tbjQuery('#pickup_year').val();
        var pickup_month = tbjQuery('#pickup_month').val();
	var pickup_day = tbjQuery('#pickup_day').val();
	var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth();
	var year = currentDate.getFullYear();
	
	tbjQuery('#pickup_month').styler('destroy');
	tbjQuery('#pickup_day').styler('destroy');
	if(pickup_year > year){
	    tbjQuery("#pickup_month option").each(function()
	    {
		tbjQuery(this).attr('disabled', false);
	    })
	    tbjQuery("#pickup_day option").each(function()
	    {
		tbjQuery(this).attr('disabled', false);
	    })
	}
	else {
	    tbjQuery("#pickup_month option").each(function()
	    {
		if(tbjQuery(this).val()<(parseInt(month)+1)){
		    tbjQuery(this).attr('disabled', true);
		}
		else {
		    tbjQuery(this).attr('disabled', false);
		}
	    })
	    if(pickup_month > (parseInt(month)+1)){
		tbjQuery("#pickup_day option").each(function()
		{
		    tbjQuery(this).attr('disabled', false);
		})
	    }
	    else {
		tbjQuery("#pickup_day option").each(function()
		{
		    if(tbjQuery(this).val()<day){
			tbjQuery(this).attr('disabled', true);
		    }
		    else {
			tbjQuery(this).attr('disabled', false);
		    }
		})
	    }
	}
	tbjQuery('#pickup_month').styler();
	tbjQuery('#pickup_day').styler();
    }
    this.setReturnDate = function() {
	var pickup_day = parseInt(tbjQuery('#pickup_day').val());
	var pickup_month = parseInt(tbjQuery('#pickup_month').val());
	var pickup_year = parseInt(tbjQuery('#pickup_year').val());
	var return_day = parseInt(tbjQuery('#return_day').val());
	var return_month = parseInt(tbjQuery('#return_month').val());
	var return_year = parseInt(tbjQuery('#return_year').val());
	tbjQuery('#return_year').styler('destroy');
	tbjQuery('#return_month').styler('destroy');
	tbjQuery('#return_day').styler('destroy');
	tbjQuery("#return_year option").each(function()
	{
	    if(tbjQuery(this).val()<pickup_year){
		tbjQuery(this).attr('disabled', true);
	    }
	    else {
		tbjQuery(this).attr('disabled', false);
	    }
	})
	if(return_year > pickup_year){
	    tbjQuery("#return_month option").each(function()
	    {
		tbjQuery(this).attr('disabled', false);
	    })
	    tbjQuery("#return_day option").each(function()
	    {
		tbjQuery(this).attr('disabled', false);
	    })
	}
	else {
	    tbjQuery("#return_month option").each(function()
	    {
		if(tbjQuery(this).val()<pickup_month){
		    tbjQuery(this).attr('disabled', true);
		}
		else {
		    tbjQuery(this).attr('disabled', false);
		}
	    })
	    if(return_month > pickup_month){
		tbjQuery("#return_day option").each(function()
		{
		    tbjQuery(this).attr('disabled', false);
		})
	    }
	    else {
		tbjQuery("#return_day option").each(function()
		{
		    if(tbjQuery(this).val()<pickup_day){
			tbjQuery(this).attr('disabled', true);
		    }
		    else {
			tbjQuery(this).attr('disabled', false);
		    }
		})
	    }
	}
	tbjQuery('#return_year').styler();
	tbjQuery('#return_month').styler();
	tbjQuery('#return_day').styler();
    }
    this.hidePastDates = function(){
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth();
	var pickup_day = parseInt(tbjQuery('#pickup_day').val());
	var pickup_month = parseInt(tbjQuery('#pickup_month').val());
	var pickup_year = parseInt(tbjQuery('#pickup_year').val());
	tbjQuery('#pickup_month').styler('destroy');
	tbjQuery('#pickup_day').styler('destroy');
        tbjQuery("#pickup_day option").each(function()
        {
            if(tbjQuery(this).val()<parseInt(day)){
                tbjQuery(this).attr('disabled', true);
            }
            else {
                tbjQuery(this).attr('disabled', false);
            }
        })
        tbjQuery("#pickup_month option").each(function()
        {
            if(tbjQuery(this).val()<(parseInt(month)+1)){
                tbjQuery(this).attr('disabled', true);
            }
            else {
                tbjQuery(this).attr('disabled', false);
            }
        })
	tbjQuery('#pickup_month').styler();
	tbjQuery('#pickup_day').styler();
	
        if(TBFSettings.returntripEnabled==1)
        {
	    var return_day = parseInt(tbjQuery('#return_day').val());
            var return_month = parseInt(tbjQuery('#return_month').val());
	    var return_year = parseInt(tbjQuery('#return_year').val());
	    tbjQuery('#return_year').styler('destroy');
	    tbjQuery('#return_month').styler('destroy');
	    tbjQuery('#return_day').styler('destroy');
	    tbjQuery("#return_year option").each(function()
	    {
		if(tbjQuery(this).val()<pickup_year){
		    tbjQuery(this).attr('disabled', true);
		}
		else {
		    tbjQuery(this).attr('disabled', false);
		}
	    })
	    if(return_year > pickup_year){
		
		tbjQuery("#return_month option").each(function()
		{
		    tbjQuery(this).attr('disabled', false);
		})
		tbjQuery("#return_day option").each(function()
		{
		    tbjQuery(this).attr('disabled', false);
		})
	    }
	    else {
		tbjQuery("#return_month option").each(function()
		{
		    if(tbjQuery(this).val()<pickup_month){
			tbjQuery(this).attr('disabled', true);
		    }
		    else {
			tbjQuery(this).attr('disabled', false);
		    }
		})
		if(return_month > pickup_month){
		    tbjQuery("#return_day option").each(function()
		    {
			tbjQuery(this).attr('disabled', false);
		    })
		}
		else {
		    tbjQuery("#return_day option").each(function()
		    {
			if(tbjQuery(this).val()<pickup_day){
			    tbjQuery(this).attr('disabled', true);
			}
			else {
			    tbjQuery(this).attr('disabled', false);
			}
		    })
		}
	    }
	    tbjQuery('#return_year').styler();
	    tbjQuery('#return_month').styler();
	    tbjQuery('#return_day').styler();
        }
    }
    this.getShuttleRouteDetails = function(shuttle_route_id) {
        tbjQuery.ajax({
	    type: "POST",
	    url: TBF_BASE_URL+'index17.php?option=com_taxibooking&controller=onepagethree&task=getShuttleRouteDetailsAjax&ajax=1',
	    data: {
		shuttle_route_id: shuttle_route_id
	    },
	    dataType: 'json',
	    //async: false,
	    beforeSend: function(){
	    	tbjQuery('div#mapOff').css({'display':'none'});
	    },
	    complete: function(){
	    },
	    success: function(response){
		if(response.err==0)
		{
		    tbjQuery('div#mapOff').css({'display':'none'});
		    tbjQuery('div#shuttle_route_desc').html(response.route.text);
		}
		else {
		    tbjQuery('div#mapOff').css({'display':'block'});
		    tbjQuery('div#shuttle_route_desc').html('');
		}
	    }
        });
    }
    this.getTourDetails = function(tour_id) {
        tbjQuery.ajax({
	    type: "POST",
	    url: TBF_BASE_URL+'index19.php?option=com_taxibooking&controller=onepagethree&task=getTourDetailsAjax&ajax=1',
	    data: {
		id: tour_id
	    },
	    dataType: 'json',
	    //async: false,
	    beforeSend: function(){
		tbjQuery('div#loadingProgressContainer').show();
		
		tbjQuery('div#mapOff').css({'display':'none'});
		//tbjQuery('.tourImagesInner.slick-initialized').slick('unslick');
		tbjQuery('div#tourImages .tourImagesInner').html('');
	    },
	    complete: function(){
	    },
	    success: function(response){
		tbjQuery('div#loadingProgressContainer').hide();
		var returnText = response.tour.text;	
		if(response.err==0)
		{
		    if (returnText.length > 0) {
			tbjQuery('div#tourDetails').html(returnText);
			tbjQuery('div#mapOff').css({'display':'none'});
		    }
		    else {
			tbjQuery('div#tourDetails').html('');
			tbjQuery('div#mapOff').css({'display':'block'});
		    }
		}
		else {
		    tbjQuery('div#tourDetails').html('');
		}
	    }
        });    	
    }
    this.getCompanyTours = function(show_previous_selection, selected_tour) {
	if (typeof show_previous_selection == 'undefined') {
	    show_previous_selection = 0;
	}
	if (typeof selected_tour == 'undefined') {
	    selected_tour = 0;
	}
	
        tbjQuery.ajax({
	    type: "POST",
	    url: TBF_BASE_URL+'index16.php?option=com_taxibooking&controller=onepagethree&task=getCompanyToursAjax&ajax=1',
	    data: {
		show_previous_selection: show_previous_selection,
		selected_tour_id: selected_tour
	    },
	    dataType: 'json',
	    //async: false,
	    beforeSend: function(){
		tbjQuery('div#loadingProgressContainer').show();
	    },
	    complete: function(){
		if(show_previous_selection==1){
		    tbjQuery('div#tabs_tours div.tours_pickup_pois_wrap').show();
		    TBFEngine.getTourDetails(tbjQuery('div.tours_list_wrap #tour_id').val());
		    TBFEngine.getTourPOIs(tbjQuery('div.tours_list_wrap #tour_id').val(),1);
		}
	    },
	    success: function(response){
		tbjQuery('div#loadingProgressContainer').hide();
		if(response.err==0)
		{
		    tbjQuery('div.tours_wrap div.tours_list_wrap').html(response.html).show();
		    tbjQuery('#tour_id').styler();
		}
		else {
		    tbjQuery('div.tours_wrap div.tours_list_wrap').html('').hide();
		}
	    }
        });
    }
    this.getTourPOIs = function(tour_id, show_previous_selection, selected_poi) {
	if (typeof show_previous_selection == 'undefined') {
	    show_previous_selection = 0;
	}
	if (typeof selected_poi == 'undefined') {
	    selected_poi = 0;
	}
	
        tbjQuery.ajax({
	    type: "POST",
	    url: TBF_BASE_URL+'index18.php?option=com_taxibooking&controller=onepagethree&task=getTourPOIsAjax&ajax=1',
	    data: {
		tour_id: tour_id,
		show_previous_selection: show_previous_selection,
		tour_pickup_poi: selected_poi
	    },
	    dataType: 'json',
	    //async: false,
	    beforeSend: function(){
		tbjQuery('div#loadingProgressContainer').show();
	    },
	    complete: function(){
	    },
	    success: function(response){
		tbjQuery('div#loadingProgressContainer').hide();
		if(response.err==0)
		{
		    tbjQuery('div.tours_pickup_pois_wrap div.tour_pois_list_wrap').html(response.html);
		    tbjQuery('#tour_pickup_poi').styler();
		}
		else {
		    tbjQuery('div.tours_pickup_pois_wrap div.tour_pois_list_wrap').html('');
		}
	    }
        });
    }
    this.showDailyHireDropoffTimeWarning = function() {
	// lets say pickup time is 11:00AM and if Dropoff time is past this 11:00, for example 10:00 PM on the same day
        // if changed time is before 11:00 AM eg. 10:00 AM then there will be no change in billing but if it is changed to time after 11:00 AM then another 24 hours will be billed
	// we can have a message in red below Drop off time and date if user selects time past Pick up time:
	var booking_type = tbjQuery('#booking_type').val();
	if(booking_type=='dailyhire')
	{
	    var order_date = tbjQuery('#pickupDateStep1').val();
	    
	    if(TBFSettings.DatePickerFormat=='DD-MM-YYYY'){
		var order_date_day = order_date.substring(0, 2);
		var order_date_month = order_date.substring(3, 5);
	    }
	    else {
		var order_date_month = order_date.substring(0, 2);
		var order_date_day = order_date.substring(3, 5);
	    }
	    var order_date_year = order_date.substring(6, 10);
	    
	    var pickup_hr = tbjQuery('input#selPtHr1').val();
	    var pickup_min = tbjQuery('input#selPtMn1').val();
	    
	    if(TBFSettings.Is12HoursTimeFormat){
		var pickup_ampm = tbjQuery('#seltimeformat1').val();
		
		var time12hr = pickup_hr+':'+pickup_min+' '+pickup_ampm;
		var resultArray = TBFEngine.ConvertTimeformat(time12hr);
		
		pickup_hr = resultArray[0];
		pickup_min = resultArray[1];
	    }
	    
	    var dropoff_hr = tbjQuery('input#dropoff_selPtHr').val();
	    var dropoff_min = tbjQuery('input#dropoff_selPtMn').val();
	    
	    if(TBFSettings.Is12HoursTimeFormat){
		var dropoff_ampm = tbjQuery('#dropoff_seltimeformat').val();
		
		var time12hr = dropoff_hr+':'+dropoff_min+' '+dropoff_ampm;
		var resultArray = TBFEngine.ConvertTimeformat(time12hr);
		
		dropoff_hr = resultArray[0];
		dropoff_min = resultArray[1];
	    }
	    
	    // we will compare pickup time and dropoff time for the same pickup date
	    var pickup_d = new Date(order_date_year, parseInt(order_date_month)-1, order_date_day, pickup_hr, pickup_min);
	    //console.log(pickup_d);
	    var dropoff_d = new Date(order_date_year, parseInt(order_date_month)-1, order_date_day, dropoff_hr, dropoff_min);
	    //console.log(dropoff_d);
	    
	    if(dropoff_d>pickup_d) {
		var str = TBTranslations.DAILY_HIRE_DROPOFF_TIME_INFO;
		var pickup_time_str = tbjQuery('input#selPtHr1').val()+':'+tbjQuery('input#selPtMn1').val();
		if(TBFSettings.Is12HoursTimeFormat){
		    pickup_time_str += ' '+tbjQuery('#seltimeformat1').val();
		}
		var result = str.replace("%s", '<strong>'+pickup_time_str+'</strong>');
		tbjQuery('div#dailyhire_dropoff_time_info').show().html(result);
	    }
	    else {
		tbjQuery('div#dailyhire_dropoff_time_info').html('').hide();
	    }
	}
    }
    this.regenerateDailyHireDropoffHrsMins = function() {
	var booking_type = tbjQuery('#booking_type').val();
	if(booking_type=='dailyhire')
	{
	    // generate dynamic return hour options
	    var min = tbjQuery('input#selPtHr1').val();
	    if(TBFSettings.Is12HoursTimeFormat){
		var max = 12;
	    }
	    else {
		var max = 23;
	    }
	    var counter = 0;
	    var table_html = '<table class="custom-table-condensed"><tbody><tr>';
	    for(var i = min; i <= max; i++){
		var value = (i.toString().length<2) ? "0"+i : i;
		table_html += '<td class="hour">'+value+'</td>';
		counter++;
		if(counter%4===0){
		    table_html += '</tr><tr>';
		}
	    }
	    table_html += '</tr></tbody></table>';
	    tbjQuery('input#dropoff_selPtHr').val(min).next('.timepicker-hours').html(table_html);
	    
	    // generate dynamic return hour options
	    var min = tbjQuery('input#selPtMn1').val();
	    var max = 59;
	    var counter = 0;
	    var table_html = '<table class="custom-table-condensed"><tbody><tr>';
	    for(var i = min; i <= parseInt(max); i=parseInt(i)+5){
		var value = (i.toString().length<2) ? "0"+i : i;
		table_html += '<td class="minute">'+value+'</td>';
		counter++;
		if(counter%4===0){
		    table_html += '</tr><tr>';
		}
	    }
	    table_html += '</tr></tbody></table>';
	    tbjQuery('input#dropoff_selPtMn').val(min).next('.timepicker-minutes').html(table_html);
	}
    }
};