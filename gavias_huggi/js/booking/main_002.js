// detect mobile devices that support touch screen feature
// including windows mobile devices
var isTouchSupported = 'ontouchstart' in window,
    isTouchSupportedIE10 = navigator.userAgent.match(/Touch/i) != null;

jQuery.fn.extend({
    see_price_check: function (use_case) {


	var booking_type = tbjQuery('#booking_type').val();
	// first validate the required field
	var errorsCount = 0;

	if(booking_type=='address'||booking_type=='offers'||booking_type=='dailyhire'){
		if(TBFSettings.datePickerType=='jquery'){
			var pickupDateStep1 = tbjQuery('#pickupDateStep1').val();
			if(pickupDateStep1==""){
				errorsCount++;
				tbjQuery("#pickupDateStep1").closest('div.step1-sm-inputWrap').addClass('custom-has-error');
				//console.log('pickup date error');
			}
			else {
				tbjQuery("#pickupDateStep1").closest('div.step1-sm-inputWrap').removeClass('custom-has-error');
			}
			var selPtHr1 = tbjQuery('#selPtHr1').val();
			if(selPtHr1==""){
				errorsCount++;
				tbjQuery("#selPtHr1").closest('div.step1-sm-inputWrap').addClass('custom-has-error');
			}
			else {
				tbjQuery("#selPtHr1").closest('div.step1-sm-inputWrap').removeClass('custom-has-error');
			}
			var selPtMn1 = tbjQuery('#selPtMn1').val();
			if(selPtMn1==""){
				errorsCount++;
				tbjQuery("#selPtMn1").closest('div.step1-sm-inputWrap').addClass('custom-has-error');
			}
			else {
				tbjQuery("#selPtMn1").closest('div.step1-sm-inputWrap').removeClass('custom-has-error');
			}
		}
		else if(TBFSettings.datePickerType=='inline'){
			var selPtHr1 = tbjQuery('#selPtHr1').val();
			if(selPtHr1==""){
				errorsCount++;
				tbjQuery('div#selPtHr1-styler').addClass('custom-has-error');
			}
			else {
				tbjQuery('div#selPtHr1-styler').removeClass('custom-has-error');
			}
			var selPtMn1 = tbjQuery('#selPtMn1').val();
			if(selPtMn1==""){
				errorsCount++;
				tbjQuery('div#selPtMn1-styler').addClass('custom-has-error');
			}
			else {
				tbjQuery('div#selPtMn1-styler').removeClass('custom-has-error');
			}
		}
		// pickup time validation
		if(selPtHr1!=""&&selPtMn1!=""){
			var errorDescription = TBFEngine.ValidatePuDateTimeRestriction();
			if(TBFSettings.datePickerType=='jquery'){
				if(errorDescription!=""){
					errorsCount++;
					tbjQuery(".pickupTime .time-date-wrapper").find('span.error').remove();
					tbjQuery("#selPtHr1").closest('div.step1-sm-inputWrap').addClass('custom-has-error');
					tbjQuery(".pickupTime .time-date-wrapper").append('<span class="error custom-text-danger">'+errorDescription+'</span>');
				}
				else {
					tbjQuery(".pickupTime .time-date-wrapper").find('span.error').remove();
					tbjQuery("#selPtHr1").closest('div.step1-sm-inputWrap').removeClass('custom-has-error');
				}
			}
			else if(TBFSettings.datePickerType=='inline')
			{
				if(errorDescription!=""){
					errorsCount++;
					tbjQuery("#pickup_day").closest("div.pickupDate").find('span.error').remove();
					tbjQuery("#pickup_day").closest("div.pickupDate").addClass('custom-has-error');
					tbjQuery("#pickup_day").closest("div.pickupDate").append('<span class="error custom-text-danger">'+errorDescription+'</span>');
				}
				else {
					tbjQuery("#pickup_day").closest("div.pickupDate").find('span.error').remove();
					tbjQuery("#pickup_day").closest("div.pickupDate").removeClass('custom-has-error');
				}
			}
		}
	}
	if(booking_type=='offers'){
		if(tbjQuery('#route_category').length>0){
			var route_pickup_category = tbjQuery('#route_category').val();
			if(route_pickup_category==0){
				errorsCount++;
				tbjQuery("#route_category").closest('div.step1-inputWrap').addClass('custom-has-error');
				//console.log('route pickup category error');
			}
		}
		if(tbjQuery('#route_category_dropoff').length>0){
			var route_dropoff_category = tbjQuery('#route_category_dropoff').val();
			if(route_dropoff_category==0){
				errorsCount++;
				tbjQuery("#route_category_dropoff").closest('div.step1-inputWrap').addClass('custom-has-error');
				//console.log('route dropoff category error');
			}
		}
		var route_from_lat = tbjQuery('#route_from_lat').val();
		var route_from_lng = tbjQuery('#route_from_lng').val();
		if(route_from_lat=="" || route_from_lng==""){
			errorsCount++;
			tbjQuery("#route_from").closest('div.step1-inputWrap').addClass('custom-has-error');
			//console.log('address form error');
		}
		var route_to_lat = tbjQuery('#route_to_lat').val();
		var route_to_lng = tbjQuery('#route_to_lng').val();
		if(route_to_lat=="" || route_to_lng==""){
			errorsCount++;
			tbjQuery("#route_to").closest('div.step1-inputWrap').addClass('custom-has-error');
			//console.log('address form error');
		}
	}
	// address field validation if user choose address radio
	tbjQuery("#address_from").closest('div.step1-inputWrap').removeClass('custom-has-error');
	tbjQuery("#address_to").closest('div.step1-inputWrap').removeClass('custom-has-error');
	if(booking_type=='address')
	{
		if(tbjQuery('#telephones').val()==""){
			errorsCount++;
			tbjQuery('#telephones').closest('div.step1-inputWrap-sm').addClass('custom-has-error');
		}
		else {
			tbjQuery('#telephones').closest('div.step1-inputWrap-sm').removeClass('custom-has-error');
		}
		
		
		var address_from_lat = tbjQuery('#address_from_lat').val();console.log ("main_002.js: 885");
		var address_from_lng = tbjQuery('#address_from_lng').val();
		if(address_from_lat=="" || address_from_lng==""){
			errorsCount++;
			tbjQuery("#address_from").closest('div.step1-inputWrap').addClass('custom-has-error');
			//console.log('address form error');
		}
		var address_to_lat = tbjQuery('#address_to_lat').val();
		var address_to_lng = tbjQuery('#address_to_lng').val();
		if(address_to_lat=="" || address_to_lng==""){
			errorsCount++;
			tbjQuery("#address_to").closest('div.step1-inputWrap').addClass('custom-has-error');
			//console.log('address to error');
		}
	}
	// other required field validation
	if(booking_type!='shuttle')
	{
		if(tbjQuery('#passengers').val()==0){
			errorsCount++;
			tbjQuery('#passengers').closest('div.step1-inputWrap-sm').addClass('custom-has-error');
			//console.log('passenger error');
		}
		else {
			tbjQuery('#passengers').closest('div.step1-inputWrap-sm').removeClass('custom-has-error');
		}
	}
	if(booking_type=='hourly'){
		if(tbjQuery('#hourly_hr').hasClass('required')){
			if(tbjQuery('#hourly_hr').val()=="0"){
				errorsCount++;
				tbjQuery('#hourly_hr').closest('div.step1-inputWrap').addClass('required custom-has-error');
				//console.log('hourly hour error');
			}
			else {
				tbjQuery('#hourly_hr').closest('div.step1-inputWrap').removeClass('required custom-has-error');
			}
		}
	}
	if(booking_type=='shuttle'){
		if(tbjQuery('div.shuttle_pickup_category_wrap').length>0 && (tbjQuery('#shuttle_pickup_catid').val()==""||tbjQuery('#shuttle_pickup_catid').val()==0)){
			errorsCount++;
			tbjQuery("#shuttle_pickup_category_fld").closest('div.step1-inputWrap').addClass('custom-has-error');
			//console.log('shuttle pickup error');
		}
		if(tbjQuery('#shuttle_pickup').val()=="" || tbjQuery('#shuttle_pickup_poi').val()==0){
			errorsCount++;
			tbjQuery("#shuttle_pickup").closest('div.step1-inputWrap').addClass('custom-has-error');
			//console.log('shuttle pickup error');
		}
		if(tbjQuery('div.shuttle_dropoff_category_wrap').length>0 && (tbjQuery('#shuttle_dropoff_catid').val()==""||tbjQuery('#shuttle_dropoff_catid').val()==0)){
			errorsCount++;
			tbjQuery("#shuttle_dropoff_category_fld").closest('div.step1-inputWrap').addClass('custom-has-error');
			//console.log('shuttle pickup error');
		}
		if(tbjQuery('#shuttle_dropoff').val()=="" || tbjQuery('#shuttle_dropoff_poi').val()==0){
			errorsCount++;
			tbjQuery("#shuttle_dropoff").closest('div.step1-inputWrap').addClass('custom-has-error');
			//console.log('shuttle dropoff error');
		}
		if(tbjQuery('[name="shuttletime"]').val()==""){
			errorsCount++;
			tbjQuery('#shuttle_pickuptime_wrap').addClass('custom-has-error');
		}
	}

	if(booking_type=='tours'){
		if(tbjQuery('#tour_id').val()=="" || tbjQuery('#tour_id').val()==0){
			errorsCount++;
			tbjQuery("#tour_id").closest('div.step1-inputWrap').addClass('has-error');
			//console.log('shuttle pickup error');
		}
		else {
			var tour_pickup_type = tbjQuery('div.tours_list_wrap #tour_id option:selected').data('pickuptype');
		
			if(tour_pickup_type=='poi'){
				if(tbjQuery('#tour_pickup_poi').val()==0){
					errorsCount++;
					tbjQuery("div.tours_pickup_pois_wrap").addClass('has-error');
					tbjQuery("div.tours_pickup_address_wrap").removeClass('has-error');
					//console.log('Tour pickup POI error');
				}
			}
			else {
				var tour_pickup_address_lat = tbjQuery('#tour_pickup_address_lat').val();
				var tour_pickup_address_lng = tbjQuery('#tour_pickup_address_lng').val();
				if(tour_pickup_address_lat=="" || tour_pickup_address_lng==""){
					errorsCount++;
					tbjQuery("div.tours_pickup_address_wrap").addClass('has-error');
					tbjQuery("div.tours_pickup_pois_wrap").removeClass('has-error');
					//console.log('Tour pickup address error');
				}
			}
		}
	}
	if(booking_type=='dailyhire'){
		if(TBFSettings.datePickerType=='jquery'){
			var pickupDateStep1 = tbjQuery('#dropoffDateStep1').val();
			if(pickupDateStep1==""){
				errorsCount++;
				tbjQuery("#dropoffDateStep1").closest('div.step1-sm-inputWrap').addClass('custom-has-error');
				//console.log('pickup date error');
			}
			else {
				tbjQuery("#dropoffDateStep1").closest('div.step1-sm-inputWrap').removeClass('custom-has-error');
			}
			var dropoff_selPtHr = tbjQuery('#dropoff_selPtHr').val();
			if(dropoff_selPtHr==""){
				errorsCount++;
				tbjQuery("#dropoff_selPtHr").closest('div.step1-sm-inputWrap').addClass('custom-has-error');
			}
			else {
				tbjQuery("#dropoff_selPtHr").closest('div.step1-sm-inputWrap').removeClass('custom-has-error');
			}
			var dropoff_selPtMn = tbjQuery('#dropoff_selPtMn').val();
			if(dropoff_selPtMn==""){
				errorsCount++;
				tbjQuery("#dropoff_selPtMn").closest('div.step1-sm-inputWrap').addClass('custom-has-error');
			}
			else {
				tbjQuery("#dropoff_selPtMn").closest('div.step1-sm-inputWrap').removeClass('custom-has-error');
			}
		}
		else if(TBFSettings.datePickerType=='inline')
		{
			var dropoff_selPtHr = tbjQuery('#dropoff_selPtHr').val();
			if(dropoff_selPtHr==""){
				errorsCount++;
				tbjQuery('div#dropoff_selPtHr-styler').addClass('custom-has-error');
			}
			else {
				tbjQuery('div#dropoff_selPtHr-styler').removeClass('custom-has-error');
			}
			var dropoff_selPtMn = tbjQuery('#dropoff_selPtMn').val();
			if(dropoff_selPtMn==""){
				errorsCount++;
				tbjQuery('div#dropoff_selPtMn-styler').addClass('custom-has-error');
			}
			else {
				tbjQuery('div#dropoff_selPtMn-styler').removeClass('custom-has-error');
			}
		}
	}
	//console.log(err);
	if(errorsCount>0){
		tbjQuery('div#step1Error').show().html(TBTranslations.BOOKING_FORM_FIRST_STEP_ERROR_MESSAGE);
	}
	else {
		tbjQuery('div#step1Error').hide();
		// reset page to 1 to get the first 8 cars
		tbjQuery('#page').val(1);
		if(booking_type=='hourly' || booking_type=='tours' || booking_type=='dailyhire' ){
				TBFEngine.getCars(true);  // show_cars = TRUE will show 2nd step cars table, FALSE will show 3rd step
			}
			else {
				TBFEngine.getMaps(true , use_case);  // show_cars = TRUE will show 2nd step cars table, FALSE will show 3rd step
			}
		}
		
	
	return 1;
    }
});
	

tbjQuery(document).ready(function(){
    tbjQuery(function() {
	tbjQuery('select.styler_list').styler({
		selectSearch: true
	});
	tbjQuery("#childSeatsModal label").css({
		display: "block"
	});	
	tbjQuery("#childSeatsModal .jq-selectbox").css({
		width: "100%"
	});
	tbjQuery("#stopsModal label").css({
		display: "block"
	});		
    });
    
    GoogleGeoCore.Init();
    
    TBFEngine.OnReady();
    
    // show/hide list on clicking Arrow
    tbjQuery('.list_trigger').click(function(){
	if (tbjQuery(this).prev('.list_wrapper').is(":visible") == true){
	    tbjQuery(this).prev('.list_wrapper').hide();
	}
	else {
	    tbjQuery(this).prev('.list_wrapper').show();
	}        
    })
    
    // hide all the dropdown if clicked outside of the arrow
    var mouseOverList = mouseOverPickupHr = mouseOverPickupMin = mouseOverDropoffHr = mouseOverDropoffMin = mouseOverReturnHr = mouseOverReturnMin = false;
    tbjQuery('.list_trigger').mouseenter(function(){
        mouseOverList = true; 
    }).mouseleave(function(){ 
        mouseOverList = false; 
    })
    tbjQuery('input#selPtHr1').mouseenter(function(){
	mouseOverPickupHr = true; 
    }).mouseleave(function(){ 
	mouseOverPickupHr = false; 
    })
    tbjQuery('input#selPtMn1').mouseenter(function(){
	mouseOverPickupMin = true; 
    }).mouseleave(function(){ 
	mouseOverPickupMin = false; 
    })
    tbjQuery('input#dropoff_selPtHr').mouseenter(function(){
	mouseOverDropoffHr = true; 
    }).mouseleave(function(){ 
	mouseOverDropoffHr = false; 
    })
    tbjQuery('input#dropoff_selPtMn').mouseenter(function(){
	mouseOverDropoffMin = true; 
    }).mouseleave(function(){ 
	mouseOverDropoffMin = false; 
    })
    tbjQuery('input#return_selPtHr2').mouseenter(function(){
	mouseOverReturnHr = true; 
    }).mouseleave(function(){ 
	mouseOverReturnHr = false; 
    })
    tbjQuery('input#return_selPtMn2').mouseenter(function(){
	mouseOverReturnMin = true; 
    }).mouseleave(function(){ 
	mouseOverReturnMin = false; 
    })
    tbjQuery("html").click(function(){
        if (!mouseOverList) {
            tbjQuery('.list_trigger').prev('.list_wrapper').hide();
        }
	if (!mouseOverPickupHr) {
            tbjQuery('input#selPtHr1').next('.timepicker-hours').hide();
        }
	if (!mouseOverPickupMin) {
            tbjQuery('input#selPtMn1').next('.timepicker-minutes').hide();
        }
	if (!mouseOverDropoffHr) {
            tbjQuery('input#dropoff_selPtHr').next('.timepicker-hours').hide();
        }
	if (!mouseOverDropoffMin) {
            tbjQuery('input#dropoff_selPtMn').next('.timepicker-minutes').hide();
        }
	if (!mouseOverReturnHr) {
            tbjQuery('input#return_selPtHr2').next('.timepicker-hours').hide();
        }
	if (!mouseOverReturnMin) {
            tbjQuery('input#return_selPtMn2').next('.timepicker-minutes').hide();
        }
    });
    tbjQuery('#limobooking-steps-area .step-number-wrap.second').click(function(){
	if(tbjQuery('#limobooking-steps-area .step-number-wrap.third').hasClass('active')){
	    TBFEngine.makeSecondStepActive();
	}
    })
    tbjQuery('#limobooking-steps-area .step-number-wrap.first').click(function(){
	if(tbjQuery('#limobooking-steps-area .step-number-wrap.third').hasClass('active')
	   || tbjQuery('#limobooking-steps-area .step-number-wrap.second').hasClass('active')
	){
	    TBFEngine.makeFirstStepActive();
	}
    })
    var changeCount = 0;
    tbjQuery('.service_type').change(function(){
	var selected_type = tbjQuery(this).val();
	tbjQuery('.service-type-elems-wrapper').hide();
	tbjQuery('#tabs_'+selected_type).show();
	tbjQuery('#hourly_hr').removeClass('required');
	tbjQuery('div#step1Error').hide();
	tbjQuery('div#step1Info').hide();
	tbjQuery('.pickup-date-time-label').show();
	tbjQuery('.pickup-date-time-label.dailyhire').hide();
	tbjQuery('div#tourDetails').hide();
	tbjQuery('div#shuttle_route_desc').hide();	
		
	var hide_return = false;
	tbjQuery('.non-shared-rides').show();
	
	if(selected_type=="shuttle"){

		if (changeCount != 0) {
			tbjQuery('div#mapOff').hide();
		}
		changeCount++;		
		
		tbjQuery('div#shuttle_route_desc').show();
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
		
		else if(selected_type=="tours"){
			
			if (changeCount != 0) {
				tbjQuery('div#mapOff').hide();
			}
			changeCount++;

		    hide_return = true;
		    tbjQuery('div#tourDetails').show();
		    TBFEngine.unsetHourlyHire();
		    TBFEngine.unsetShuttle();
		    TBFEngine.unsetPoiAddress();
		    TBFEngine.getCompanyTours();
		}

	    tbjQuery('.non-shuttle').show();
	    tbjQuery('.shuttle').hide();
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
	else {
	    if(tbjQuery('.add-return-trip-outer').length>0){
		tbjQuery('.add-return-trip-outer').show();
		tbjQuery('#returnjurney').val(0);
		tbjQuery('#returnTripYes').removeClass('custom-active');
		tbjQuery('#returnTripNo').addClass('custom-active');
		tbjQuery('#returnTripWrapper').hide();
		if(tbjQuery('#return_wait_hr').length>0){
		    tbjQuery('#return_wait_hr').styler('destroy');
		    tbjQuery('#return_wait_hr').val(0);
		    tbjQuery('#return_wait_hr').styler();
		    tbjQuery('.return-datetime-wrapper').hide();
		}
	    }
	}
    })
    tbjQuery("#address_from").change(function(){
	tbjQuery('#address_from_lat,#address_from_lng').val("");console.log ("main_002.js: 204");
    });
    tbjQuery("#address_to").change(function(){
	tbjQuery('#address_to_lat,#address_to_lng').val("");
    });
    tbjQuery(document).on("click", 'div.pickup_wrap div.poi_dropdown_wrapper div.poi_link', function (e) {
	var poiObj = this;console.log ("main_002.js: 210");
	
	tbjQuery("#address_from").closest('div.step1-inputWrap').removeClass('custom-has-error');console.log ("main_002.js: 212");
	tbjQuery('#address_from').val(tbjQuery(this).children('span').html());
        tbjQuery('#address_from_lat').val(tbjQuery(this).data('poilat'));
	tbjQuery('#address_from_lng').val(tbjQuery(this).data('poilng'));
	tbjQuery('input#pickup_poi').val(tbjQuery(this).data('poiid'));
	tbjQuery('div.pickup_wrap div.poi_dropdown_wrapper').hide();
	
	TBFEngine.unsetRoute();
	TBFEngine.unsetShuttle();
	TBFEngine.unsetHourlyHire();
	TBFEngine.unsetDailyHire();
	
	if(TBFEngine.checkAreaOperation('address_from')){
	    GoogleGeoCore.RenderDirections();console.log ("main_002.js: 225");
	}
    })
    tbjQuery(document).on("click", 'div.dropoff_wrap div.poi_dropdown_wrapper div.poi_link', function (e) {
	var poiObj = this;
	
	tbjQuery("#address_to").closest('div.step1-inputWrap').removeClass('custom-has-error');
	tbjQuery('#address_to').val(tbjQuery(this).children('span').html());
        tbjQuery('#address_to_lat').val(tbjQuery(this).data('poilat'));
	tbjQuery('#address_to_lng').val(tbjQuery(this).data('poilng'));
	tbjQuery('input#dropoff_poi').val(tbjQuery(this).data('poiid'));
	tbjQuery("div.dropoff_wrap div.poi_dropdown_wrapper").hide();
	    
	if(TBFEngine.checkAreaOperation('address_to')){
	    GoogleGeoCore.RenderDirections();
	}
    })
    tbjQuery('a.pickup_direction').click(function(){
	GoogleGeoCore.getUserLocation('address_from');console.log ("main_002.js: 243");
    })
    tbjQuery('a.dropoff_direction').click(function(){
	GoogleGeoCore.getUserLocation('address_to');
    })
    // show dropdown div of route category if show_poi_category is enabled
    tbjQuery("div.pickup_category_wrap div.routecategory_dropdown_wrapper div.poi_link").click(function(){
	tbjQuery('#route_from_fld,#route_category_dropoff_fld,#route_to_fld').val('');
	tbjQuery('#route_from,#route_category_dropoff,#route_to').val(0);
	tbjQuery('#fixed_route_id,#route_swapped').val(0);
	tbjQuery('div#special_route_desc').html('');
	
	tbjQuery('#route_category_fld').val(tbjQuery(this).children('span').html());
	tbjQuery('#route_category').val(tbjQuery(this).attr('id'));
	tbjQuery('div.pickup_category_wrap div.routecategory_dropdown_wrapper').hide();
	
	TBFEngine.unsetPoiAddress();
	TBFEngine.unsetShuttle();
	TBFEngine.unsetHourlyHire();
	TBFEngine.unsetDailyHire();
	
	tbjQuery('div.route_pickup_wrap').show();
	tbjQuery('div.dropoff_category_wrap,div.route_dropoff_wrap').hide();
	TBFEngine.collectRouteFrom();
    })
    tbjQuery(document).on("click", 'div.route_pickup_wrap div.poi_dropdown_wrapper div.poi_link', function (e) {
	tbjQuery('#route_category_dropoff_fld,#route_to_fld,#route_to_lat,#route_to_lng').val('');
	tbjQuery('#route_category_dropoff,#route_to').val(0);
	tbjQuery('#fixed_route_id,#route_swapped').val(0);
	tbjQuery('div#special_route_desc').html('');
	
	tbjQuery('#route_from').val(tbjQuery(this).attr('id'));
	tbjQuery('#route_from_fld').val(tbjQuery(this).children('span').html());
	tbjQuery('#route_from_lat').val(tbjQuery(this).data('poilat'));
	tbjQuery('#route_from_lng').val(tbjQuery(this).data('poilng'));
	tbjQuery('div.route_pickup_wrap div.poi_dropdown_wrapper').hide();
	
	TBFEngine.unsetPoiAddress();
	TBFEngine.unsetHourlyHire();
	TBFEngine.unsetShuttle();
	TBFEngine.unsetDailyHire();
	
	// if show_route_category enabled, collect dropoff route category
	if(TBFSettings.showPOICategories==1 ) {
	    tbjQuery('div.route_dropoff_wrap').hide();
	    tbjQuery('div.dropoff_category_wrap').show();
	    TBFEngine.collectDropoffRouteCategory();
	}
	else { // if show_route_category disabled, collect dropoff routes list
	    tbjQuery('div.route_dropoff_wrap').show();
	    TBFEngine.collectRouteTo();
	}
	GoogleGeoCore.RenderDirections();
    })
    tbjQuery(document).on("click", 'div.dropoff_category_wrap div.routecategory_dropoff_dropdown_wrapper div.poi_link', function (e) {
	tbjQuery('#route_to').val(0);
	tbjQuery('#route_to_fld').val('');
	tbjQuery('#fixed_route_id,#route_swapped').val(0);
	tbjQuery('div#special_route_desc').html('');
	tbjQuery('#route_category_dropoff').val(tbjQuery(this).attr('id'));
	tbjQuery('#route_category_dropoff_fld').val(tbjQuery(this).children('span').html());
	
	tbjQuery('div.route_dropoff_wrap').show();
	TBFEngine.collectRouteTo();
    })
    tbjQuery(document).on("click", 'div.route_dropoff_wrap div.poi_dropdown_wrapper div.poi_link', function (e) {
	tbjQuery('#route_to').val(tbjQuery(this).attr('id'));
	tbjQuery('#route_to_fld').val(tbjQuery(this).children('span').html());
	tbjQuery('#route_to_lat').val(tbjQuery(this).data('poilat'));
	tbjQuery('#route_to_lng').val(tbjQuery(this).data('poilng'));
	tbjQuery('div.route_dropoff_wrap div.poi_dropdown_wrapper').hide();
	TBFEngine.getSpecialRouteDetails();
	GoogleGeoCore.RenderDirections();
    })
    tbjQuery("div.add_stop_wrapper div.poi_link").click(function(){
	var poiObj = this;
	
	tbjQuery('#tmp_waypoint').val(tbjQuery(this).children('span').html());
        tbjQuery('#tmp_waypoint_lat').val(tbjQuery(this).data('poilat'));
	tbjQuery('#tmp_waypoint_lng').val(tbjQuery(this).data('poilng'));
	
	//if(!checkAreaOperation('dropoff')){
	    //tbjQuery("div.dropoff_wrap div.nonstop_wrap div.poi_dropdown_wrapper").hide();
	    //tbjQuery('div.dropoff_wrap div.nonstop_wrap .poi_options_trigger').removeClass('Open');
	    //return false;
	//}
	
        tbjQuery("div.add_stop_wrapper.poi_dropdown_wrapper").hide();
    })
    tbjQuery("#add_child_seats_btn").click(function(){
	var boosterseats = tbjQuery('#boosterseats').val();
	var chseats = tbjQuery('#chseats').val();
	var infantseats = tbjQuery('#infantseats').val();
	if(boosterseats>0 || chseats>0 || infantseats>0){
	   tbjQuery('.childSeatsButtons-list').show();
	}
	//console.log('boosterseats: '+boosterseats);
	//console.log('chseats: '+chseats);
	//console.log('infantseats: '+infantseats);
	if(boosterseats>0){
	    tbjQuery('#ChildSeatsLabel #boosterSeatsLabel').show();
	    tbjQuery('#ChildSeatsLabel #boosterSeatsCount').html(boosterseats);
	}
	else {
	    tbjQuery('#ChildSeatsLabel #boosterSeatsCount').html(0);
	    tbjQuery('#ChildSeatsLabel #boosterSeatsLabel').hide();
	}
	if(chseats>0){
	    tbjQuery('#ChildSeatsLabel #chSeatsLabel').show();
	    tbjQuery('#ChildSeatsLabel #chSeatsCount').html(chseats);
	}
	else {
	    tbjQuery('#ChildSeatsLabel #chSeatsCount').html(0);
	    tbjQuery('#ChildSeatsLabel #chSeatsLabel').hide();
	}
	if(infantseats>0){
	    tbjQuery('#ChildSeatsLabel #infantSeatsLabel').show();
	    tbjQuery('#ChildSeatsLabel #infantSeatsCount').html(infantseats);
	}
	else {
	    tbjQuery('#ChildSeatsLabel #infantSeatsCount').html(0);
	    tbjQuery('#ChildSeatsLabel #infantSeatsLabel').hide();
	}
	tbjQuery('#childSeatsModal').modal("hide");
    });
    tbjQuery('#edit_child_seats_btn').click(function(){
	tbjQuery('#childSeatsModal').modal("show");
    })
    tbjQuery("#stops_modal_trigger").click(function(){
	tbjQuery('.stoprow').removeClass('active');
	tbjQuery('#tmp_waypoint,#tmp_waypoint_lat,#tmp_waypoint_lng').val("");
	
	tbjQuery('[name="tmp_waypoint_stop_duration"]').styler('destroy');
	tbjQuery('[name="tmp_waypoint_stop_duration"]').val(tbjQuery('[name="tmp_waypoint_stop_duration"] option:first').val());
	tbjQuery('[name="tmp_waypoint_stop_duration"]').styler();
	
	tbjQuery("#stopsModal .custom-modal-title").html('Add Stop');
	tbjQuery('#add_stop_btn').show();
	tbjQuery('#update_stop_btn').hide();
	tbjQuery('#stop_action').val('add');
        tbjQuery("#stopsModal").modal();
    });
    tbjQuery("#add_stop_btn").click(function(){
	if(tbjQuery('#tmp_waypoint').val()=="" || tbjQuery('#tmp_waypoint_lat').val()=="" || tbjQuery('#tmp_waypoint_lng').val()==""){
	    alert('Please choose a Stop Location');
	    return false;
	}
	else {
	    var existing_stops = tbjQuery('div#stops_data_wrapper').children('.stoprow').length;
	    
	    var stop_row_html = '<div class="address-point-stop stoprow stoprow_'+existing_stops+'">';
	    stop_row_html += '<div class="stop"><i class="fa fa-stop-circle-o"></i>&nbsp;'+tbjQuery('#tmp_waypoint').val()+'</div>';
	    stop_row_html += '<div class="overlay-icon"><span>';
	    stop_row_html += '<a href="javascript:void(0);" class="btn-icon stop_edit_btn" title="Click to edit"><i class="fa fa-edit"></i></a>';
	    stop_row_html += '&nbsp;<a href="javascript:void(0);" class="btn-icon stop_delete_btn" title="Click to delete"><i class="fa fa-trash"></i></a>'
	    stop_row_html += '</span></div>';
	    stop_row_html += '<input type="hidden" name="waypoints['+existing_stops+']" class="waypoints_title" value="'+tbjQuery('#tmp_waypoint').val()+'" />';
	    stop_row_html += '<input type="hidden" name="waypoints_lat['+existing_stops+']" class="waypoints_lat" value="'+tbjQuery('#tmp_waypoint_lat').val()+'" />';
	    stop_row_html += '<input type="hidden" name="waypoints_lng['+existing_stops+']" class="waypoints_lng" value="'+tbjQuery('#tmp_waypoint_lng').val()+'" />';
	    stop_row_html += '<input type="hidden" name="waypoints_stop_duration['+existing_stops+']" class="waypoints_stop_duration" value="'+tbjQuery('[name="tmp_waypoint_stop_duration"]').val()+'" />';
	    stop_row_html += '</div>';
	    
	    tbjQuery('.stops-wrapper').show();
	    tbjQuery('div#stops_data_wrapper').append(stop_row_html);
	    
	    tbjQuery('#tmp_waypoint,#tmp_waypoint_lat,#tmp_waypoint_lng').val("");
	    tbjQuery('[name="tmp_waypoint_stop_duration"]').val("15");
	    tbjQuery('#stopsModal').modal("hide");
	    
	    // if customer selects Stop then use Address search
	    tbjQuery('#booking_type').val('address');
	    tbjQuery('#fixed_route_id').val(0);
	    tbjQuery('div#special_route_desc').html('');
	    
	    GoogleGeoCore.RenderDirections();
	}
    })
    tbjQuery(document).on("click", '.stop_edit_btn', function (e) {
	var stop_parent = tbjQuery(this).closest('.stoprow');
	tbjQuery('div#stops_data_wrapper .stoprow').removeClass('active');
	tbjQuery(this).closest('.stoprow').addClass('active');
	tbjQuery('#tmp_waypoint').val(tbjQuery(stop_parent).find('.waypoints_title').val());
	tbjQuery('#tmp_waypoint_lat').val(tbjQuery(stop_parent).find('.waypoints_lat').val());
	tbjQuery('#tmp_waypoint_lng').val(tbjQuery(stop_parent).find('.waypoints_lng').val());
	
	//console.log(tbjQuery(stop_parent).find('.waypoints_stop_duration').val());
	tbjQuery('[name="tmp_waypoint_stop_duration"]').styler('destroy');
	tbjQuery('[name="tmp_waypoint_stop_duration"]').val(tbjQuery(stop_parent).find('.waypoints_stop_duration').val());
	tbjQuery('[name="tmp_waypoint_stop_duration"]').styler();
	
	tbjQuery("#stopsModal .custom-modal-title").html('Update Stop');
	tbjQuery('#add_stop_btn').hide();
	tbjQuery('#update_stop_btn').show();
	tbjQuery('#stop_action').val('update');
	tbjQuery('#stopsModal').modal("show");
    })
    tbjQuery("#update_stop_btn").click(function(){
	if(tbjQuery('#tmp_waypoint').val()=="" || tbjQuery('#tmp_waypoint_lat').val()=="" || tbjQuery('#tmp_waypoint_lng').val()==""){
	    alert('Please choose a Stop Location');
	    return false;
	}
	else {
	    var editing_parent = tbjQuery('div#stops_data_wrapper .stoprow.active');
	    
	    tbjQuery('div#stops_data_wrapper .stoprow.active .stop').html('<i class="fa fa-stop-circle-o"></i>&nbsp;'+tbjQuery('#tmp_waypoint').val());
	    tbjQuery('div#stops_data_wrapper .stoprow.active .waypoints_title').val(tbjQuery('#tmp_waypoint').val());
	    tbjQuery('div#stops_data_wrapper .stoprow.active .waypoints_lat').val(tbjQuery('#tmp_waypoint_lat').val());
	    tbjQuery('div#stops_data_wrapper .stoprow.active .waypoints_lng').val(tbjQuery('#tmp_waypoint_lng').val());
	    tbjQuery('div#stops_data_wrapper .stoprow.active .waypoints_stop_duration').val(tbjQuery('[name="tmp_waypoint_stop_duration"]').val());
	    
	    tbjQuery('div#stops_data_wrapper .stoprow').removeClass('active');
	    tbjQuery('#stopsModal').modal("hide");
	    
	    GoogleGeoCore.RenderDirections();
	}
    })
    tbjQuery(document).on("click", '.stop_delete_btn', function (e) {
	var r = confirm("Are you sure you want to remove this stop?");
	if (r == true) {
	    tbjQuery(this).closest('.stoprow').remove();
	    
	    GoogleGeoCore.RenderDirections();
	}
	if(tbjQuery('div#stops_data_wrapper .stoprow').length==0){
	    tbjQuery('.stops-wrapper').hide();
	}
    })
    // If Fixed fare is enabled, then typing on Pickups will show list of route POIs
    if(TBFSettings.fixedFareBookingEnabled){
	tbjQuery('#route_from_fld').on('keyup', function(event) {
	    // if route swapping is enabled and route is swapped already, restrict search on typing
	    if(TBFSettings.routeSwappingEnabled && tbjQuery('#route_swapped').val()==1){
		return false;
	    }
	    //if (event.keyCode == 13) {//un-comment this to only check the value when the enter key is pressed
		if (tbjQuery(this).val()!=""){
		    TBFEngine.getFilteredRoutePoints(tbjQuery(this).val(), 'route_pickup');
		}
		else{
		    tbjQuery('input#route_from_fld,input#route_from_lat,input#route_from_lng').val('');
		    tbjQuery('input#route_from').val(0);
		    tbjQuery('div.route_pickup_wrap div.poi_dropdown_wrapper').hide();
		}
	    //}//un-comment this to only check the value when the enter key is pressed
	});
	tbjQuery('#route_to_fld').on('keyup', function(event) {
	    // if route swapping is enabled and route is swapped already, restrict search on typing
	    if(TBFSettings.routeSwappingEnabled && tbjQuery('#route_swapped').val()==1){
		return false;
	    }
	    //if (event.keyCode == 13) {//un-comment this to only check the value when the enter key is pressed
		if (tbjQuery(this).val()!=""){
		    TBFEngine.getFilteredRoutePoints(tbjQuery(this).val(), 'route_dropoff');
		}
		else{
		    tbjQuery('input#route_to_fld,input#route_to_lat,input#route_to_lng').val('');
		    tbjQuery('input#route_to').val(0);
		    tbjQuery('div.route_dropoff_wrap div.poi_dropdown_wrapper').hide();
		}
	    //}//un-comment this to only check the value when the enter key is pressed
	});
    }
    tbjQuery('div.swap-route-wrapper #swapRouteYes').click(function(){
	var pickup_route_selected = tbjQuery('#route_from').val();
        var dropoff_route_selected = tbjQuery('#route_to').val();
	var route_swapped = tbjQuery('#route_swapped').val();
	if(pickup_route_selected>0 && dropoff_route_selected>0 && route_swapped==0)
	{
	    tbjQuery('#swapRouteNo').removeClass('custom-active');
	    tbjQuery('#swapRouteYes').addClass('custom-active');
	    tbjQuery('#route_swapped').val(1);
	    
            var pickup_route = tbjQuery('#route_from_fld').val();
	    var pickup_route_lat = tbjQuery('#route_from_lat').val();
	    var pickup_route_lng = tbjQuery('#route_from_lng').val();
	    
	    var dropoff_route = tbjQuery('#route_to_fld').val();
	    var dropoff_route_lat = tbjQuery('#route_to_lat').val();
	    var dropoff_route_lng = tbjQuery('#route_to_lng').val();
	    
	    tbjQuery('#route_from').val(dropoff_route_selected);
	    tbjQuery('#route_from_fld').val(dropoff_route);
	    tbjQuery('#route_from_lat').val(dropoff_route_lat);
	    tbjQuery('#route_from_lng').val(dropoff_route_lng);
	    
	    tbjQuery('#route_to').val(pickup_route_selected);
	    tbjQuery('#route_to_fld').val(pickup_route);
	    tbjQuery('#route_to_lat').val(pickup_route_lat);
	    tbjQuery('#route_to_lng').val(pickup_route_lng);
	    
	    tbjQuery('#route_from_fld,#route_to_fld').attr('readonly', true);
	    tbjQuery('div#tabs_offers div.list_trigger').hide();
	    
	    if(TBFSettings.showPOICategories==1 ) {
		
		var pickup_route_category = tbjQuery('#route_category_fld').val();
		var pickup_route_catid = tbjQuery('#route_category').val();
		var dropoff_route_category = tbjQuery('#route_category_dropoff_fld').val();
		var dropoff_route_catid = tbjQuery('#route_category_dropoff').val();
		
		tbjQuery('#route_category_fld').val(dropoff_route_category);
		tbjQuery('#route_category').val(dropoff_route_catid);
		tbjQuery('#route_category_dropoff_fld').val(pickup_route_category);
		tbjQuery('#route_category_dropoff').val(pickup_route_catid);
		
		tbjQuery('#route_category_fld,#route_category_dropoff_fld').attr('readonly', true);
	    }
	    GoogleGeoCore.RenderDirections();
        }
    })
    tbjQuery('div.swap-route-wrapper #swapRouteNo').click(function(){
	var route_swapped = tbjQuery('#route_swapped').val();
	if(route_swapped==1)
	{
	    tbjQuery('#swapRouteNo').addClass('custom-active');
	    tbjQuery('#swapRouteYes').removeClass('custom-active');
	    tbjQuery('#route_swapped').val(0);
	    
	    var dropoff_route_selected = tbjQuery('#route_from').val();
            var dropoff_route = tbjQuery('#route_from_fld').val();
	    var dropoff_route_lat = tbjQuery('#route_from_lat').val();
	    var dropoff_route_lng = tbjQuery('#route_from_lng').val();
	    
	    var pickup_route_selected = tbjQuery('#route_to').val();
	    var pickup_route = tbjQuery('#route_to_fld').val();
	    var pickup_route_lat = tbjQuery('#route_to_lat').val();
	    var pickup_route_lng = tbjQuery('#route_to_lng').val();
	    
	    tbjQuery('#route_from').val(pickup_route_selected);
	    tbjQuery('#route_from_fld').val(pickup_route);
	    tbjQuery('#route_from_lat').val(pickup_route_lat);
	    tbjQuery('#route_from_lng').val(pickup_route_lng);
	    
	    tbjQuery('#route_to').val(dropoff_route_selected);
	    tbjQuery('#route_to_fld').val(dropoff_route);
	    tbjQuery('#route_to_lat').val(dropoff_route_lat);
	    tbjQuery('#route_to_lng').val(dropoff_route_lng);
	    
	    tbjQuery('#route_category_fld,#route_category_dropoff_fld,#route_from_fld,#route_to_fld').attr('readonly', false);
	    tbjQuery('div#tabs_offers div.list_trigger').show();
	    
	    if(TBFSettings.showPOICategories==1 ) {
		var dropoff_route_category = tbjQuery('#route_category_fld').val();
		var dropoff_route_catid = tbjQuery('#route_category').val();
		var pickup_route_category = tbjQuery('#route_category_dropoff_fld').val();
		var pickup_route_catid = tbjQuery('#route_category_dropoff').val();
		
		tbjQuery('#route_category_fld').val(pickup_route_category);
		tbjQuery('#route_category').val(pickup_route_catid);
		tbjQuery('#route_category_dropoff_fld').val(dropoff_route_category);
		tbjQuery('#route_category_dropoff').val(dropoff_route_catid);
		
		tbjQuery('#route_category_fld,#route_category_dropoff_fld').attr('readonly', false);
	    }
	    GoogleGeoCore.RenderDirections();
        }
    })
    tbjQuery("div.shuttle_pickup_category_wrap div.poi_dropdown_wrapper div.poi_link").click(function(){
	tbjQuery('#shuttle_pickup_category_fld').val(tbjQuery(this).children('span').html());
        tbjQuery('#shuttle_pickup_catid').val(tbjQuery(this).data('catid'));
        tbjQuery('div.shuttle_pickup_category_wrap div.poi_dropdown_wrapper').hide();
	TBFEngine.unsetPoiAddress();
        TBFEngine.unsetHourlyHire();
	TBFEngine.unsetDailyHire();
        tbjQuery('#booking_type').val('shuttle');
	tbjQuery('#shuttle_pickup,#shuttle_dropoff_category_fld,#shuttle_dropoff').val("");
	tbjQuery('#shuttle_pickup_poi,#shuttle_dropoff_catid,#shuttle_dropoff_poi').val(0);
	tbjQuery("div.shuttle_pickup_wrap,div.shuttle_dropoff_category_wrap,div.shuttle_dropoff_wrap").hide();
	TBFEngine.getShuttleDropoffPOIs('pickup');
    })
    tbjQuery(document).on("click", 'div.shuttle_pickup_wrap div.poi_dropdown_wrapper div.poi_link', function (e) {
	tbjQuery('#shuttle_pickup').val(tbjQuery(this).children('span').html());
        tbjQuery('#shuttle_pickup_poi').val(tbjQuery(this).data('poiid'));
        tbjQuery('div.shuttle_pickup_wrap div.poi_dropdown_wrapper').hide();
	TBFEngine.unsetPoiAddress();
        TBFEngine.unsetHourlyHire();
	TBFEngine.unsetDailyHire();
	tbjQuery('#shuttle_dropoff_category_fld,#shuttle_dropoff').val("");
	tbjQuery('#shuttle_dropoff_catid,#shuttle_dropoff_poi').val(0);
	tbjQuery('div#shuttle_route_desc').html('');
	if(TBFSettings.showPOICategoriesShuttle==1){
	    TBFEngine.getShuttleDropoffPOIs('dropoff_cat');
	}
	else {
	    TBFEngine.getShuttleDropoffPOIs('dropoff');
	}
    })
    tbjQuery(document).on("click", 'div.shuttle_dropoff_category_wrap div.poi_dropdown_wrapper div.poi_link', function (e) {
	tbjQuery('#shuttle_dropoff_category_fld').val(tbjQuery(this).children('span').html());
        tbjQuery('#shuttle_dropoff_catid').val(tbjQuery(this).data('catid'));
        tbjQuery('div.shuttle_dropoff_category_wrap div.poi_dropdown_wrapper').hide();
	TBFEngine.unsetPoiAddress();
        TBFEngine.unsetHourlyHire();
	TBFEngine.unsetDailyHire();
	tbjQuery('#shuttle_dropoff').val("");
	tbjQuery('#shuttle_dropoff_poi').val(0);
	tbjQuery("div.shuttle_dropoff_wrap").hide();
	TBFEngine.getShuttleDropoffPOIs('dropoff');
    })
    tbjQuery(document).on("click", 'div.shuttle_dropoff_wrap div.poi_dropdown_wrapper div.poi_link', function (e) {
	tbjQuery('#shuttle_dropoff').val(tbjQuery(this).children('span').html());
        tbjQuery('#shuttle_dropoff_poi').val(tbjQuery(this).data('poiid'));
        tbjQuery('div.shuttle_dropoff_wrap div.poi_dropdown_wrapper').hide();
	tbjQuery('div#shuttle_route_desc').html('');
	//tbjQuery('#shuttle_dropoff').after('<span class="autocomplete-loading-list"></span>');
	//TBFEngine.getExtras('shuttle_dropoff', tbjQuery(this).data('poiid'));
	TBFEngine.getShuttleTimeOptions(1); // clear_previous_selection = 1
    })

    tbjQuery(document).on("change", 'div.tours_list_wrap #tour_id', function (e) {
	if(tbjQuery(this).val()==0){
	    tbjQuery(this).closest('div.step1-inputWrap').addClass('has-error');
	    tbjQuery('div#tabs_tours div.tours_pickup_pois_wrap, div#tabs_tours div.tours_pickup_address_wrap').hide();
	}
	else {
	    tbjQuery(this).closest('div.step1-inputWrap').removeClass('has-error');
	    
	    var tour_pickup_type = tbjQuery('div.tours_list_wrap #tour_id option:selected').data('pickuptype');
	    var tour_pickup_pois = tbjQuery('div.tours_list_wrap #tour_id option:selected').data('pickuppois');
	    
	    TBFEngine.getExtras('first_private_tours');
	    
	    if(tour_pickup_type=='poi'){
		tbjQuery('div#tabs_tours div.tours_pickup_pois_wrap').show();
		tbjQuery('div#tabs_tours div.tours_pickup_address_wrap').hide();
		
		TBFEngine.getTourPOIs(tbjQuery(this).val());
	    }
	};

	TBFEngine.getTourDetails(tbjQuery(this).val());
    })
    tbjQuery(document).on("change", 'div.tour_pois_list_wrap #tour_pickup_poi', function (e) {
	if(tbjQuery(this).val()==0){
	    tbjQuery(this).closest('div.step1-inputWrap').addClass('has-error');
	}
	else {
	    //clear pushpins
	    GoogleGeoCore.ClearPushpins();
	}
    })    
    //*** UPDATE on May24.2016 - shuttle time change event has been moved to tbfcore.js
    
    tbjQuery('#returnTripYes').click(function(){
	tbjQuery('.add-return-trip-outer').show();
	tbjQuery('#returnTripWrapper').show();
	tbjQuery(this).addClass('custom-active');
	tbjQuery('#returnTripNo').removeClass('custom-active');
	tbjQuery('#returnjurney').val(1);
	if(tbjQuery('#return_wait_hr').length>0){
	    tbjQuery('#return_wait_hr').styler('destroy');
	    tbjQuery('#return_wait_hr').val(0);
	    tbjQuery('#return_wait_hr').styler();
	    tbjQuery('.return-datetime-wrapper').hide();
	}
	else {
	    tbjQuery('.return-datetime-wrapper').show();
	}
    })
    tbjQuery('#returnTripNo').click(function(){
	tbjQuery('#returnTripWrapper').hide();
	tbjQuery(this).addClass('custom-active');
	tbjQuery('#returnTripYes').removeClass('custom-active');
	tbjQuery('#returnjurney').val(0);
	if(tbjQuery('#return_wait_hr').length>0){
	    tbjQuery('#return_wait_hr').styler('destroy');
	    tbjQuery('#return_wait_hr').val(0);
	    tbjQuery('#return_wait_hr').styler();
	}
	tbjQuery('.return-datetime-wrapper').hide();
    })
    tbjQuery('#return_wait_hr').change(function(){
	if(tbjQuery(this).val()=="-1"){
	    tbjQuery('.return-datetime-wrapper').show();
	}
	else {
	    tbjQuery('.return-datetime-wrapper').hide();
	}
    })
    if(tbjQuery('.cancel_booking_btn').length>0){
	tbjQuery('.cancel_booking_tooltip').tooltip();
	tbjQuery('.cancel_booking_btn').click(function(){
	    var btnObj = this;
	    var order_number = tbjQuery('#cancel_cid').val();
	    if(order_number!=""){
			var r = confirm("Are you sure you want to Cancel this Order?");
			if (r == true) {
				tbjQuery.ajax({
					type: "POST",
					url: TBF_BASE_URL+'index.php?option=com_taxibooking&task=cancelOrderAjax&ajax=1',
					data: 'code='+order_number,
					dataType: 'json',
					//async: false,
					beforeSend: function(){
						tbjQuery(btnObj).after('<img src="'+TBF_BASE_URL+'components/com_taxibooking/assets/images/ajax-loader.gif" alt="Loading" id="ajax_loader" title="Loader" />');
					},
					complete: function(){
					},
					success: function(response){
						tbjQuery('#ajax_loader').remove();
						
						if(response.error==1){
							tbjQuery('.cancelOrderError').html(response.msg).show().removeClass('custom-alert-success').addClass('custom-alert-danger');
						}
						else {
							tbjQuery('.cancelOrderError').html(response.msg).show().removeClass('custom-alert-danger').addClass('custom-alert-success');
							tbjQuery('#cancel_cid').val("");
						}
					}
				})
			}
	    }
	    else {
			tbjQuery('.cancelOrderError').html(TBTranslations.ERR_MESSAGE_CANCEL_ORDER_REFERENCE_NUMBER_EMPTY).show().removeClass('custom-alert-success').addClass('custom-alert-danger');
	    }
	})
    }
    
    tbjQuery(".see_price").click(function(){	
		jQuery.fn.see_price_check(1);
		//jQuery.fn.extend
	})	
    tbjQuery('.book_trip').click(function(){	
		jQuery.fn.see_price_check(2);
		//tbjQuery('#booking_confirmation').modal("show");
    })	

    tbjQuery('#close_booking_confirmation ').click(function(){	
		tbjQuery('#booking_confirmation').modal("hide");
    })	
	
	tbjQuery(document).on("click", '#show_all_cars', function (e) {
	tbjQuery('#cartype').styler('destroy').val(0).styler();
	TBFEngine.getMaps(true);
    })
    tbjQuery('div.vehicles-list').on("click", '.list', function (e) {
	tbjQuery('.grid').removeClass('custom-active');
	tbjQuery('.list').addClass('custom-active');
	tbjQuery('div.list-view').show();
	tbjQuery('div.grid-view').hide();
	TBFEngine.removePopovers();
    })
    tbjQuery('div.vehicles-list').on("click", '.grid', function (e) {
	tbjQuery('.grid').addClass('custom-active');
	tbjQuery('.list').removeClass('custom-active');
	tbjQuery('div.list-view').hide();
	tbjQuery('div.grid-view').show();
	TBFEngine.removePopovers();
    })
    tbjQuery('div#vehicle_wrapper').on("click", 'a#load_more_trigger', function (e) {
	var page = tbjQuery('#page').val();
	tbjQuery('#page').val(parseInt(page)+1);
	TBFEngine.getCars();
    })
     // on clicking book now, book a car
    tbjQuery(document).on("click", 'a.car_booking', function (e) {
	TBFEngine.removePopovers();
	var vehicle_id = tbjQuery(this).data('carid');
	var booking_btn = tbjQuery(this);
	// if there is a previous ajax search, then we abort it and then set tbxhr to null
        if( tbxhr != null ) {
            tbxhr.abort();
            tbxhr = null;
        }
	tbjQuery('#selected_car').val(vehicle_id);
	tbjQuery('div#loadingProgressContainer').show();
	var passingData = 'vehicle_id='+vehicle_id+'&formlayout=new&'+tbjQuery('[name="active_lang"]').serialize();
	tbxhr = tbjQuery.ajax({
	    type: "POST", 
		crossDomain: true,
		url: TBF_BASE_URL+'index.php?option=com_taxibooking&controller=onepagethree&task=bookNow&ajax=1',
		data: passingData, 
		dataType: 'json'
	    //, async: false
	    , beforeSend: function(){
	    }
	    , complete: function(){
		// show stripe credit card form if stripe is the only payment method
		setTimeout(function () {
		    if(tbjQuery('div#payment_selectors').find('input.tb_paymentmethods').length==1
			&& tbjQuery('div#payment_selectors').find('input.tb_paymentmethods').hasClass('stripe')
		     ){
			tbjQuery('input.tb_paymentmethods.stripe').trigger('click');
		    }
		    else if(tbjQuery('div#payment_selectors').find('input.tb_paymentmethods').length==1
			&& tbjQuery('div#payment_selectors').find('input.tb_paymentmethods').hasClass('authorizecim')
		     ){
			    tbjQuery('input.tb_paymentmethods.authorizecim').trigger('click');
		    }
		    
		    // UPDATE on Jan03.17 - We will make a delay to POST calculate Total as getExtras AJAX are triggered to collect Custom Fields HTML
		    TBFEngine.calculateGrandTotal();
		}, 500);
		
		// apply coupon automatically if coupon id is present in URL, only for URL booking
		if(url_booking_type!='' && url_coupon_id > 0)
		{
		    tbjQuery('div.gratuities_btn').removeClass('custom-active');
		    tbjQuery('#flat_gratuity').val("");
		    tbjQuery.ajax({
			type: "POST",
			url: TBF_BASE_URL+'index.php?option=com_taxibooking&task=coupon_is_valid&ajax=1',
			data: 'coupon_id='+url_coupon_id,
			dataType: 'json',
			//async: false,
			beforeSend: function(){
			    tbjQuery('div#loadingProgressContainer').show();
			},
			complete: function(){
			},
			success: function(response){
			    tbjQuery('div#loadingProgressContainer').hide();
			    tbjQuery("#coupon_code").next('.error').html('');
			    tbjQuery('#bottomFloatingBar .grand_total').html(response.new_total);
			    if(response.error==1){
				tbjQuery("#coupon_code").next('.error').html(response.msg);
			    }
			    else {
				tbjQuery('#coupon_code').val(response.code);
			    }
			    if(response.show_coupon_discount==1){
				tbjQuery('#bottomFloatingBar .coupon_discount_wrap').show();
				tbjQuery('#bottomFloatingBar .coupon_discount').html(response.coupon_discount_amt);
			    }
			    else {
				tbjQuery('#bottomFloatingBar .coupon_discount').html('');
				tbjQuery('#bottomFloatingBar .coupon_discount_wrap').hide();
			    }
			    // reset service charge as service charge will added at last, after applying coupon
			    tbjQuery('#bottomFloatingBar .gratuity_charge').html('');
			    tbjQuery('#bottomFloatingBar .gratuity_charge_wrap').hide();
			    
			    if(response.prepayment > 0 && response.prepayment < 100 && tbjQuery('div#payment_labels').find('div.check_box_wrap').length > 0){
				tbjQuery('div#payment_labels').children().eq(0).find('div.check_desc').html(response.due_now);
				tbjQuery('div#payment_labels').children().eq(1).find('div.check_desc').html(response.due_later);
			    }
			}
		    });
		}
	    }
	    , success: function(response){
		
		if(response.error==1)
		{
		    if(response.company_id==0){
			window.location.reload();
		    }
		    else {
			alert(response.msg);
			return false;
		    }
		}
		else
		{
		    TBFEngine.makeThirdStepActive();
		    
		    tbjQuery('#limobooking-step3-wrapper .date-time').html(response.msg.pickup_datetime);
		    
		    tbjQuery('#limobooking-step3-wrapper .car-details .vehicle-type-label').html(response.msg.car.title);
		    tbjQuery('#limobooking-step3-wrapper .car-details .vehicle-type-pass-capacity').html(response.msg.car.passenger_no);
		    tbjQuery('#limobooking-step3-wrapper .car-details .vehicle-type-luggage-capacity').html(response.msg.car.suitcase_no);
		    tbjQuery('#limobooking-step3-wrapper .car-details .vehicle-type-img').prop('src', TBF_BASE_URL+response.msg.car.image);
		    
		    tbjQuery('#limobooking-step3-wrapper .pass-number').html(response.msg.adultseats_html);
		    
		    if(response.msg.show_additional_seats==1){
			tbjQuery('#limobooking-step3-wrapper .child-seats').closest('li').show();
			tbjQuery('#limobooking-step3-wrapper .total-passenger').closest('li').show();
			tbjQuery('#limobooking-step3-wrapper .child-seats').html(response.msg.childseats);
			tbjQuery('#limobooking-step3-wrapper .total-passenger').html(response.msg.totalpassengers);
		    }
		    else {
			tbjQuery('#limobooking-step3-wrapper .child-seats').closest('li').hide();
			tbjQuery('#limobooking-step3-wrapper .total-passenger').closest('li').hide();
		    }
		    
		    if(response.msg.suitcases>0){
			tbjQuery('#limobooking-step3-wrapper .suitcases').closest('li').show();
			tbjQuery('#limobooking-step3-wrapper .suitcases').html(response.msg.suitcases);
		    }
		    else {
			tbjQuery('#limobooking-step3-wrapper .suitcases').closest('li').hide();
			tbjQuery('#limobooking-step3-wrapper .suitcases').html(0);
		    }
		    
		    if(response.msg.booking_type=='hourly' || response.msg.booking_type=='tours' || response.msg.booking_type=='dailyhire'){
			tbjQuery('#limobooking-step3-wrapper .pickup, #limobooking-step3-wrapper .dropoff').html('');
			tbjQuery('#limobooking-step3-wrapper div#pickup_poi_additional, #limobooking-step3-wrapper div#dropoff_poi_additional').html('');
			
			tbjQuery('#limobooking-step3-wrapper .trip-details.dailyhire,#limobooking-step3-wrapper .trip-details.hourly,#limobooking-step3-wrapper .trip-details.address,#limobooking-step3-wrapper .trip-details.tours').hide();
			
			if(response.msg.booking_type=='hourly'){
			    tbjQuery('#limobooking-step3-wrapper .trip-details.hourly').show();
			    
			    tbjQuery('#limobooking-step3-wrapper #hourly_hired_text').html(response.msg.hourly_hired_text);
			    tbjQuery('#limobooking-step3-wrapper #hourly_hire_pickup').html(response.msg.hourly_hire_pickup);
			    tbjQuery('#limobooking-step3-wrapper div#hourly_extra_summary_wrapper').html(response.msg.hourly_extra_html).show();
			}
			else if(response.msg.booking_type=='tours'){
			    tbjQuery('#limobooking-step3-wrapper .trip-details.tours').show();
			    
			    tbjQuery('#limobooking-step3-wrapper .tour-title').html(response.msg.tour_title);
			    tbjQuery('#limobooking-step3-wrapper .tour-pickup').html(response.msg.tour_pickup_location);
			}			
			else if(response.msg.booking_type=='dailyhire'){
			    tbjQuery('#limobooking-step3-wrapper .trip-details.dailyhire').show();
			    
			    tbjQuery('#limobooking-step3-wrapper .trip-details.dailyhire .dropoff-date-time').html(response.msg.daily_hire_dropoff_datetime);
			    tbjQuery('#limobooking-step3-wrapper div#dailyhire_extra_summary_wrapper').html(response.msg.dailyhire_extra_html).show();
			}
		    }
		    else {
			tbjQuery('#limobooking-step3-wrapper #hourly_hired_text, #limobooking-step3-wrapper #hourly_hire_pickup').html('');
			tbjQuery('#limobooking-step3-wrapper div#hourly_extra_summary_wrapper').html('').hide();
			tbjQuery('#limobooking-step3-wrapper div#dailyhire_extra_summary_wrapper').html('').hide();
			
			tbjQuery('#limobooking-step3-wrapper .trip-details.dailyhire,#limobooking-step3-wrapper .trip-details.hourly,#limobooking-step3-wrapper .trip-details.tours').hide();
			tbjQuery('#limobooking-step3-wrapper .trip-details.address').show();
			
			tbjQuery('#limobooking-step3-wrapper .pickup').html(response.msg.begin);
			tbjQuery('#limobooking-step3-wrapper .dropoff').html(response.msg.end);
			tbjQuery('#limobooking-step3-wrapper div#pickup_poi_additional').html(response.msg.pickup_poi_additional_html);
			tbjQuery('#limobooking-step3-wrapper div#dropoff_poi_additional').html(response.msg.dropoff_poi_additional_html);
		    }
		    
		    // Only show Add stops when booking is Address to Address
		    if(TBFSettings.stopsEnabled)
		    {
			if(response.msg.booking_type=='address'){
			    tbjQuery('#limobooking-step3-wrapper .address-points-list .stops-wrapper-step3').parent('.address-points-list').show();
			    if(response.msg.show_stops==1){
				tbjQuery('#limobooking-step3-wrapper .address-points-list .stops-wrapper-step3').html(response.msg.stop_text).removeClass('text-muted');
			    }
			    else {
				tbjQuery('#limobooking-step3-wrapper .address-points-list .stops-wrapper-step3').html(response.msg.stop_text).addClass('text-muted');
			    }
			}
			else {
			    tbjQuery('#limobooking-step3-wrapper .address-points-list .stops-wrapper-step3').parent('.address-points-list').hide();
			}
		    }
		    
		    if(response.msg.poi_additional_html_for_total_section!=""){
			tbjQuery('#bottomFloatingBar .poi_additional_wrap').remove();
			tbjQuery('#bottomFloatingBar .sub_total_wrap').after(response.msg.poi_additional_html_for_total_section);
		    }
		    else {
			tbjQuery('#bottomFloatingBar .poi_additional_wrap').remove();
		    }
		    
		    if(response.msg.enable_captcha==1){
			tbjQuery('div#captcha_wrap').show();
			tbjQuery('span#captcha_image').html(response.msg.captcha_image);
		    }
		    else {
			tbjQuery('div#captcha_wrap').hide();
			tbjQuery('span#captcha_image').html("");
		    }
		    if(response.msg.enable_gratuity==1){
			tbjQuery('div#gratuities_wrap').html(response.msg.gratuity_html);
			tbjQuery('.gratuity_lbl').tooltip();
		    }
		    if(response.msg.show_user_group_discount==1){
			tbjQuery('.user_group_discount_wrap').show();
			tbjQuery('.user_group_discount').html(response.msg.user_group_discount);
		    }
		    else {
			tbjQuery('.user_group_discount').html('');
			tbjQuery('.user_group_discount_wrap').hide();
		    }
		    
		    tbjQuery('.label_tooltip').tooltip();
		    if(response.msg.found_payment_method > 0){
			tbjQuery('div#payment_selectors').html(response.msg.payment_html);
			if(tbjQuery('div#payment_selectors').find('input.tb_paymentmethods').length==1){ // if only payment method available, mark it
			    tbjQuery('div#payment_selectors').find('input.tb_paymentmethods').attr('checked', true);
			}
			tbjQuery('.payment_desc').tooltip();
		    }
		    else {
			tbjQuery('div#payment_selectors').html('');
		    }
		    // fetch custom fields
		    TBFEngine.getExtras('user_details');
		    if(response.msg.booking_type=='address')
		    {
			if(tbjQuery('#address_from').val()!="" && tbjQuery('#address_from_lat').val()!="" && tbjQuery('#address_from_lng').val()!=""){
			    if(tbjQuery('input#pickup_poi').val()!=0){
				TBFEngine.getExtras('pickup', tbjQuery('input#pickup_poi').val());
			    }
			    else {
				TBFEngine.getExtras('address_pickup');
			    }
			}
			if(tbjQuery('#address_to').val()!="" && tbjQuery('#address_to_lat').val()!="" && tbjQuery('#address_to_lng').val()!=""){
			    if(tbjQuery('input#dropoff_poi').val()!=0){
				TBFEngine.getExtras('dropoff', tbjQuery('input#dropoff_poi').val());
			    }
			    else {
				TBFEngine.getExtras('address_dropoff');
			    }
			}
		    }
		    else if(response.msg.booking_type=='offers')
		    {
			if(tbjQuery('input#route_from').val()!=0){
			    TBFEngine.getExtras('route_pickup', tbjQuery('input#route_from').val());
			}
			if(tbjQuery('input#route_to').val()!=0){
			    TBFEngine.getExtras('route_dropoff', tbjQuery('input#route_to').val());
			}
		    }
		    else if(response.msg.booking_type=='hourly')
		    {
			TBFEngine.getExtras('hourly_hire');
		    }
		    else if(response.msg.booking_type=='shuttle')
		    {
			if(tbjQuery('input#shuttle_pickup_poi').val()!=0){
			    TBFEngine.getExtras('shuttle_pickup', tbjQuery('input#shuttle_pickup_poi').val());
			}
			if(tbjQuery('input#shuttle_dropoff_poi').val()!=0){
			    TBFEngine.getExtras('shuttle_dropoff', tbjQuery('input#shuttle_dropoff_poi').val());
			}
		    }
		    else if(response.msg.booking_type=='dailyhire')
		    {
			TBFEngine.getExtras('dailyhire');
		    }
		    else if(response.msg.booking_type=='tours')
		    {
			TBFEngine.getExtras('private_tours');
		    }		    
		    
		    // execute javascript in response
		    // for now, js will come from Stripe payment plugin only
		    tbjQuery("div#payment_selectors").find("script").each(function(i) {
			eval(tbjQuery(this).text());
		    });
		    if(response.msg.returnjurney==1){
			tbjQuery('#limobooking-step3-wrapper #returnTripSummary').show();
			tbjQuery('#limobooking-step3-wrapper .return-date-time').html(response.msg.return_date);
			tbjQuery('#limobooking-step3-wrapper .return-pickup').html(response.msg.return_pickup);
			tbjQuery('#limobooking-step3-wrapper .return-dropoff').html(response.msg.return_dropoff);
			tbjQuery('#limobooking-step3-wrapper .return-car-details .vehicle-type-label').html(response.msg.car.title);
			tbjQuery('#limobooking-step3-wrapper .return-car-details .vehicle-type-pass-capacity').html(response.msg.car.passenger_no);
			tbjQuery('#limobooking-step3-wrapper .return-car-details .vehicle-type-luggage-capacity').html(response.msg.car.suitcase_no);
			tbjQuery('#limobooking-step3-wrapper .return-car-details .vehicle-type-img').prop('src', TBF_BASE_URL+response.msg.car.image);
			tbjQuery('#limobooking-step3-wrapper .pass-number').html(response.msg.adultseats_html);
			TBFEngine.getReturnExtras();
		    }
		    else {
			tbjQuery('div#return_pickup_extra_wrapper').html('');
			tbjQuery('div#return_dropoff_extra_wrapper').html('');
			tbjQuery('#limobooking-step3-wrapper #returnTripSummary').hide();
		    }
		    
		    tbjQuery('div#loadingProgressContainer').hide();
		}
	    }
        });
    })
    tbjQuery('a#addordercopy').click(function(){
	var i = tbjQuery('div#ordercopy_wrap div.order-copy-row').length;
	var html = '<div class="custom-form-group order-copy-row clearfix">';
	html += '<label class="custom-col-md-4 custom-col-sm-4 custom-control-label" for="">&nbsp;</label>';
	html += '<div class="custom-col-md-8 custom-col-sm-8">';
	html += '<input class="custom-form-control required" name="order_copy['+i+'][name]" type="text" value="" placeholder="'+TBTranslations.BOOKING_FORM_SEND_ORDER_COPY_NAME+'" />';
	html += '<input class="custom-form-control required email" name="order_copy['+i+'][email]" type="text" value="" placeholder="'+TBTranslations.BOOKING_FORM_SEND_ORDER_COPY_EMAIL+'" />';
	html += '<a href="javascript:void(0);" class="remove_order_copy">'+TBTranslations.BOOKING_FORM_REMOVE_ORDER_COPY_LABEL+'</a></div>';
	html += '</div>';
	tbjQuery('div#ordercopy_wrap').append(html);
    })
    tbjQuery('div#ordercopy_wrap').on('click', 'a.remove_order_copy', function() { // code
	tbjQuery(this).closest('div.order-copy-row').remove();
    });
    
    tbjQuery('.add-return-trip-btn').click(function(){
	// if there is a previous ajax search, then we abort it and then set tbxhr to null
        if( tbxhr != null ) {
            tbxhr.abort();
            tbxhr = null;
        }
        tbxhr = tbjQuery.ajax({
	    type: "POST",
	    url: TBF_BASE_URL+'index.php?option=com_taxibooking&controller=onepagethree&task=addReturnTripAjax&ajax=1',
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
		tbjQuery('div#returnTripSummary').show();
		
		tbjQuery('#limobooking-step3-wrapper .return-date-time').html(response.msg.return_date);
		tbjQuery('#limobooking-step3-wrapper .return-pickup').html(response.msg.end);
		tbjQuery('#limobooking-step3-wrapper .return-dropoff').html(response.msg.begin);
		
		tbjQuery('#limobooking-step3-wrapper .return-car-details .vehicle-type-label').html(response.msg.car.title);
		tbjQuery('#limobooking-step3-wrapper .return-car-details .vehicle-type-pass-capacity').html(response.msg.car.passenger_no);
		tbjQuery('#limobooking-step3-wrapper .return-car-details .vehicle-type-luggage-capacity').html(response.msg.car.suitcase_no);
		tbjQuery('#limobooking-step3-wrapper .return-car-details .vehicle-type-img').prop('src', TBF_BASE_URL+response.msg.car.image);
		
		tbjQuery('#limobooking-step3-wrapper .pass-number').html(tbjQuery('#passengers').val()+' Passenger');
		
		TBFEngine.getReturnExtras();
	    }
        });
    })
    tbjQuery("#coupon_code").change(function(){
	// if there is a previous ajax search, then we abort it and then set tbxhr to null
        if( tbxhr != null ) {
            tbxhr.abort();
            tbxhr = null;
        }
	var btnObj = this;
	tbjQuery('div.gratuities_btn').removeClass('custom-active');
	tbjQuery('#flat_gratuity').val("");
	tbjQuery('.service-charge').find('.error').html('').hide();
	
        var passingData = tbjQuery(this).serialize();
        tbxhr = tbjQuery.ajax({
	    type: "POST",
	    url: TBF_BASE_URL+'index.php?option=com_taxibooking&task=coupon_is_valid&ajax=1',
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
		tbjQuery(btnObj).next('.error').html('');
		tbjQuery('#bottomFloatingBar .grand_total').html(response.new_total);
		if(response.error==1){
		    tbjQuery(btnObj).next('.error').html(response.msg);
		}
		if(response.show_coupon_discount==1){
		    tbjQuery('#bottomFloatingBar .coupon_discount_wrap').show();
		    tbjQuery('#bottomFloatingBar .coupon_discount').html(response.coupon_discount_amt);
		}
		else {
		    tbjQuery('#bottomFloatingBar .coupon_discount').html('');
		    tbjQuery('#bottomFloatingBar .coupon_discount_wrap').hide();
		}
		// reset service charge as service charge will added at last, after applying coupon
		tbjQuery('#bottomFloatingBar .gratuity_charge').html('');
		tbjQuery('#bottomFloatingBar .gratuity_charge_wrap').hide();
		
		if(response.prepayment > 0 && response.prepayment < 100 && tbjQuery('div#payment_labels').find('div.check_box_wrap').length > 0){
		    tbjQuery('div#payment_labels').children().eq(0).find('div.check_desc').html(response.due_now);
		    tbjQuery('div#payment_labels').children().eq(1).find('div.check_desc').html(response.due_later);
		}
	    }
        });
    });
    tbjQuery(document).on("click", 'div.gratuities_btn', function (e) {
	var btnObj = this;
	var amt = tbjQuery(btnObj).data('amt');
	var amttype = tbjQuery(btnObj).data('amttype');
	if(tbjQuery(btnObj).hasClass('custom-active')){
	    var action = 'deduce';
	}
	else {
	    var action = 'add';
	}
	tbjQuery('div.gratuities_btn').removeClass('custom-active');
	tbjQuery('#flat_gratuity').val("");
	tbjQuery('.service-charge').find('.error').html('').hide();
	
	// if there is a previous ajax search, then we abort it and then set tbxhr to null
        if( tbxhr != null ) {
            tbxhr.abort();
            tbxhr = null;
        }
        tbxhr = tbjQuery.ajax({
	    type: "POST",
	    url: TBF_BASE_URL+'index.php?option=com_taxibooking&task=applyGratuityAjax&ajax=1',
	    data: 'amt='+amt+'&amttype='+amttype+'&action='+action+'&'+tbjQuery('#price_form').serialize(),
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
		    alert(response.msg);
		}
		else {
		    tbjQuery('#bottomFloatingBar .grand_total').html(response.new_total);
		    if(response.show_gratuity_amt==1){
			tbjQuery('#bottomFloatingBar .gratuity_charge_wrap').show();
			tbjQuery('#bottomFloatingBar .gratuity_charge').html(response.gratuity_amt);
		    }
		    else {
			tbjQuery('#bottomFloatingBar .gratuity_charge').html('');
			tbjQuery('#bottomFloatingBar .gratuity_charge_wrap').hide();
		    }
		    if(response.prepayment > 0 && response.prepayment < 100 && tbjQuery('div#payment_labels').find('div.check_box_wrap').length > 0){
			tbjQuery('div#payment_labels').children().eq(0).find('div.check_desc').html(response.due_now);
			tbjQuery('div#payment_labels').children().eq(1).find('div.check_desc').html(response.due_later);
		    }
		    if(action=='add'){
			tbjQuery(btnObj).addClass('custom-active');
		    }
		}
	    }
        });
    })
    tbjQuery(document).on("change", '#flat_gratuity', function (e) {
	var btnObj = this;
	var amt = tbjQuery(this).val();
	tbjQuery('.service-charge').find('.error').html('').hide();
	
	var amttype = 'flat';
	tbjQuery('div.gratuities_btn').removeClass('custom-active');
	if(amt!=""){
	    var action = 'add';
	    
	    var pattern = /^\d+$/;
	    if(!pattern.test(amt)){
		amt = 0;
		tbjQuery('.service-charge').find('.error').html(TBTranslations.BOOKING_FORM_SERVICE_CHARGE_POSITIVE_NUMBER_MUST).show();
	    }
	}
	else {
	    var action = 'deduce';
	}
	// if there is a previous ajax search, then we abort it and then set tbxhr to null
        if( tbxhr != null ) {
            tbxhr.abort();
            tbxhr = null;
        }
        tbxhr = tbjQuery.ajax({
	    type: "POST",
	    url: TBF_BASE_URL+'index.php?option=com_taxibooking&task=applyGratuityAjax&ajax=1',
	    data: 'amt='+amt+'&amttype='+amttype+'&action='+action+'&'+tbjQuery('#price_form').serialize(),
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
		    alert(response.msg);
		}
		else {
		    tbjQuery('#bottomFloatingBar .grand_total').html(response.new_total);
		    if(response.show_gratuity_amt==1){
			tbjQuery('#bottomFloatingBar .gratuity_charge_wrap').show();
			tbjQuery('#bottomFloatingBar .gratuity_charge').html(response.gratuity_amt);
		    }
		    else {
			tbjQuery('#bottomFloatingBar .gratuity_charge').html('');
			tbjQuery('#bottomFloatingBar .gratuity_charge_wrap').hide();
		    }
		    if(response.prepayment > 0 && response.prepayment < 100 && tbjQuery('div#payment_labels').find('div.check_box_wrap').length > 0){
			tbjQuery('div#payment_labels').children().eq(0).find('div.check_desc').html(response.due_now);
			tbjQuery('div#payment_labels').children().eq(1).find('div.check_desc').html(response.due_later);
		    }
		}
	    }
        });
    })
    // we should not trigger total calculation on changes of Extra in first step
    tbjQuery(document).on("change", '#limobooking-step3-wrapper .extra', function (e) {
	TBFEngine.calculateGrandTotal();
    })
    tbjQuery(document).on("click", 'input.tb_paymentmethods', function (e) {
	if(tbjQuery('input.tb_paymentmethods:checked').hasClass('stripe')){
	    
	}
	else {
	    // if user switches between payment methods, reset tokens if selected payment is not Stripe
	    tbjQuery('.stripe_tokens').val('');
	}
	TBFEngine.calculateGrandTotal();
    })
    tbjQuery('#make_booking').click(function(){
	var errorsCount = 0;
	// If Terms and Conditions check box is not clicked and customer clicks on Make a booking button display error message
	if(tbjQuery('[name="cbox"]').length > 0){
	    if(tbjQuery('[name="cbox"]').is(':checked')){
		tbjQuery('#termsError').hide();
	    }
	    else {
		errorsCount++;
		tbjQuery('#termsError').show();
	    }
	}
	
	tbjQuery('#limobooking-step3-container-area .required').each(function(){
	    tbjQuery(this).next('span.error').remove();
            if(tbjQuery(this).val().length == 0)
	    {
                errorsCount++;
                tbjQuery(this).parent().addClass('custom-has-error');
		tbjQuery(this).after('<span class="error custom-text-danger">'+TBTranslations.ERR_MESSAGE_FIELD_REQUIRED+'</span>');
            }
	    else if(tbjQuery(this).val()=="/")
	    {
		errorsCount++;
		tbjQuery(this).parent().addClass('custom-has-error');
		tbjQuery(this).after('<span class="error custom-text-danger">'+TBTranslations.ERR_MESSAGE_FIELD_SLASH_NOT_ALLOWED+'</span>');
	    }
	    else if(tbjQuery(this).hasClass('email') && !TBFEngine.ValidateEmail(tbjQuery(this).val()))
	    {
		errorsCount++;
		tbjQuery(this).parent().addClass('custom-has-error');
		tbjQuery(this).after('<span class="error custom-text-danger">'+TBTranslations.ERR_MESSAGE_VALID_EMAIL+'</span>');
	    }
	    else if(tbjQuery(this).hasClass('phone') && !TBFEngine.ValidatePhone(tbjQuery(this).val()))
	    {
		errorsCount++;
		tbjQuery(this).parent().addClass('custom-has-error');
		tbjQuery(this).after('<span class="error custom-text-danger">'+TBTranslations.ERR_MESSAGE_VALID_PHONE+'</span>');
	    }
	    else if(tbjQuery(this).hasClass('numeric') && !tbjQuery.isNumeric(tbjQuery(this).val()))
	    {
		errorsCount++;
		tbjQuery(this).parent().addClass('custom-has-error');
		tbjQuery(this).after('<span class="error custom-text-danger">'+TBTranslations.ERR_MESSAGE_VALID_NUMERIC+'</span>');
	    }
	    else {
                tbjQuery(this).parent().removeClass('custom-has-error');
		tbjQuery(this).next('span.error').remove();
	    }
        })
	
	// check payment selection
	if(tbjQuery('div#payment_selectors').find('input[type="radio"][name="tb_paymentmethod_id"]').is(':checked')){
	    tbjQuery('div#payment_selectors').next('span.error').hide();
	}
	else {
	    errorsCount++;
	    tbjQuery('div#payment_selectors').next('span.error').show();
	}
	
	// validate strip payment form if stripe is selected
	if(tbjQuery('div#payment_selectors').find('input.tb_paymentmethods:checked').hasClass('stripe')){
	    if(tbjQuery('div#payment_selectors').find('input.tb_paymentmethods.stripe').parent('div').next('.stripe_tokens').val()==''){
		errorsCount++;
		tbjQuery('input.tb_paymentmethods.stripe').trigger('click');
		return false;
	    }
	}
	else if(tbjQuery('div#payment_selectors').find('input.tb_paymentmethods:checked').hasClass('authorizecim')){
	    var authorizeFormWrapper = tbjQuery('div#payment_selectors').find('input.tb_paymentmethods.authorizecim').parent('div').siblings('div#authorizeCIMModal');
	    if( (authorizeFormWrapper.find('#authorizecim-payment-profile').length==0)
	       || (authorizeFormWrapper.find('#authorizecim-payment-profile').length>0 && authorizeFormWrapper.find('#authorizecim-payment-profile').val()=='new')
	       )
	    {
		if(authorizeFormWrapper.find('#authorizecim-card-number').val()==''
		   || authorizeFormWrapper.find('#authorizecim-card-expiry-year').val()==0
		   || authorizeFormWrapper.find('#authorizecim-card-expiry-month').val()==0
		   || authorizeFormWrapper.find('#authorizecim-card-cvc').val()==''
		)
		{
		    errorsCount++;
		    tbjQuery('input.tb_paymentmethods.authorizecim').trigger('click');
		    return false;
		}
	    }
	    else if(authorizeFormWrapper.find('#authorizecim-payment-profile').length>0 && authorizeFormWrapper.find('#authorizecim-payment-profile').val()==''){
		errorsCount++;
		tbjQuery('input.tb_paymentmethods.authorizecim').trigger('click');
		return false;
	    }
	}
	
	if(errorsCount>0){
	    tbjQuery('#step3Error').show();
	}
	else {
	    tbjQuery('#step3Error').hide();
	    // if there is a previous ajax search, then we abort it and then set tbxhr to null
	    if( tbxhr != null ) {
		tbxhr.abort();
		tbxhr = null;
	    }
	    
	    // first check captcha if enabled
	    if(TBFSettings.captchaEnabled)
	    {
		if(tbjQuery('#security_code').val()==""){
		    tbjQuery('#securityCodeError').html(TBTranslations.ERR_ENTER_SECURITY_CODE).show();
		    return false;
		}
		else {
		    tbjQuery('#securityCodeError').html('').hide();
		    
		    tbxhr = tbjQuery.ajax({
			type: "POST"
			, url: TBF_BASE_URL+'index.php?option=com_taxibooking&controller=onepage&task=checkCaptcha&ajax=1'
			, data: {
			    security_code: tbjQuery('#security_code').val()
			}
			, dataType: 'json'
			, beforeSend: function(){
			}
			, complete: function(){
			}
			, success: function(response){
			    if(response.error==1)
			    {
				if(response.company_id==0){
				    window.location.reload();
				}
				else {
				    tbjQuery('#securityCodeError').html(response.msg).show();
				    return false;
				}
			    }
			    else {
				tbjQuery('#securityCodeError').html('').hide();
				tbjQuery('#make_booking').attr('disabled', true);
				tbjQuery('div#loadingProgressContainer').show();
				tbjQuery.ajax({
				    type: "POST"
				    , url: TBF_BASE_URL+'index.php?option=com_taxibooking&controller=onepagethree&task=submitOrder&ajax=1'
				    , data: tbjQuery('#price_form').serialize()
				    , dataType: 'json'
				    , beforeSend: function(){
				    }
				    , complete: function(){
				    }
				    , success: function(response){
					tbjQuery('div#loadingProgressContainer').hide();
					if(response.error==0)
					{
					    window.location = response.redirect_url;
					}
				    }
				})
			    }
			}
		    })
		}
	    }
	    else
	    {
		tbjQuery('#make_booking').attr('disabled', true);
		tbjQuery('div#loadingProgressContainer').show();
		
		tbjQuery.ajax({
		    type: "POST"
		    , url: TBF_BASE_URL+'index.php?option=com_taxibooking&controller=onepagethree&task=submitOrder&ajax=1'
		    , data: tbjQuery('#price_form').serialize()
		    , dataType: 'json'
		    , beforeSend: function(){
		    }
		    , complete: function(){
		    }
		    , success: function(response){
			tbjQuery('div#loadingProgressContainer').hide();
			if(response.error==0)
			{
			    window.location = response.redirect_url;
			}
		    }
		})
	    }
	}
    })
    tbjQuery(document).on("click", '.back_first', function (e) {
	TBFEngine.makeFirstStepActive();
    })
    tbjQuery(document).on("click", '.back_second', function (e) {
	TBFEngine.makeSecondStepActive();
    })
    tbjQuery('a.reset-booking-form').click(function(){
	// if there is a previous ajax search, then we abort it and then set tbxhr to null
        if( tbxhr != null ) {
            tbxhr.abort();
            tbxhr = null;
        }
	
	tbjQuery('div#loadingProgressContainer').show();
	
        tbxhr = tbjQuery.ajax({
	    type: "POST"
	    , url: TBF_BASE_URL+'index.php?option=com_taxibooking&controller=onepagethree&task=resetBookingFormAjax&ajax=1'
	    , data: ''
	    , dataType: 'json'
	    //, async: false
	    , beforeSend: function(){
	    }
	    , complete: function(){
	    }
	    , success: function(response){
		tbjQuery('div#loadingProgressContainer').hide();
		window.location.reload();
	    }
        });
    })
    tbjQuery('.tborders_login').click(function(){
	if(tbjQuery('input#tborders_username').val()==""){
	    tbjQuery('input#tborders_username').closest('div.topinnerWrap').addClass('custom-has-error');
	}
	else if(tbjQuery('input#tborders_password').val()==""){
	    tbjQuery('input#tborders_password').closest('div.topinnerWrap').addClass('custom-has-error');
	}
	else {
	    tbjQuery('input#tborders_username,input#tborders_password').closest('div.topinnerWrap').removeClass('custom-has-error');
	    tbjQuery.ajax({
		type: "POST",
		url: TBF_BASE_URL+'index.php?option=com_taxibooking&task=loginAjax&ajax=1',
		data: tbjQuery('input#tborders_username').serialize()+'&'+tbjQuery('input#tborders_password').serialize(),
		dataType: 'json',
		//async: false,
		beforeSend: function(){
		    tbjQuery('.tborders_login').after('<img src="'+TBF_BASE_URL+'components/com_taxibooking/assets/images/ajax-loader2.gif" alt="Loading" id="ajax_loader" title="Loader" />');
		},
		complete: function(){
		},
		success: function(response){
		    tbjQuery('#ajax_loader').remove();
		    if(response.error==0){
			window.location.reload();
		    }
		    else {
			if(response.company_id==0){
			    window.location.reload();
			}
			else {
			    alert(response.msg);
			}
		    }					    
		}
	    })
	}
    })
    tbjQuery(document).on("click", 'a#invoice_later_login', function (e) {
	tbjQuery('#loginModal').modal("show");
    })
    tbjQuery('div#tabs_address').on( 'click', 'a.select_addressbook', function(){
	if(tbjQuery(this).hasClass('pickup')){
	    var section = 'pickup';
	}
	else if(tbjQuery(this).hasClass('dropoff')){
	    var section = 'dropoff';
	}
	else if(tbjQuery(this).hasClass('stops')){
	    tbjQuery(this).closest('div.stops_wrap').addClass('addressbook-active');
	    var section = 'stops';
	}
	
	tbjQuery('#addressBookiFrame').attr('src', TBF_BASE_URL+'index.php?option=com_taxibooking&view=addresses&layout=modal&tmpl=component&section='+section);
	tbjQuery('#addressBookModal').modal("show");
    })
    tbjQuery('div#loginModal').on( 'click', 'a#forgot_pass_trigger', function(){
	tbjQuery('#forgotPassiFrame').attr('src', TBF_BASE_URL+'components/com_taxibooking/assets/images/ajax-loader-bar.gif');
	tbjQuery('#forgotPassiFrame').attr('src', TBF_BASE_URL+'index.php?option=com_taxibooking&view=account&layout=reset_start&tmpl=component&modal=1');
        tbjQuery('#forgotPassModal').modal('show');
	tbjQuery('#loginModal').modal("hide");
    })
    if(TBFSettings.datePickerType=='inline')
    {
	// pickup section
	tbjQuery("#pickup_year").change(function(){
	    TBFEngine.setPickupDate();
	    TBFEngine.setReturnYear();
	    var pickup_year = parseInt(tbjQuery('#pickup_year').val());
	    var currentDate = new Date();
	    var day = currentDate.getDate();
	    var month = currentDate.getMonth();
	    var year = currentDate.getFullYear();
	    tbjQuery('#pickup_month').styler('destroy');
	    tbjQuery('#pickup_day').styler('destroy');
	    if(pickup_year > year){
		tbjQuery('#pickup_day').val(1);
		tbjQuery('#pickup_month').val(1);
	    }
	    else {
		tbjQuery('#pickup_day').val(day);
		tbjQuery('#pickup_month').val(month+1);
	    }
	    tbjQuery('#pickup_month').styler();
	    tbjQuery('#pickup_day').styler();
	})
	tbjQuery("#pickup_month").change(function(){
	    var return_year = parseInt(tbjQuery('#return_year').val());
	    var order_date_year = parseInt(tbjQuery('#pickup_year').val());
	    TBFEngine.setPickupDate();
	    if(return_year > order_date_year){
		TBFEngine.resetReturnMonth();
		TBFEngine.resetReturnDay();
	    }
	    else {
		TBFEngine.setReturnMonth();
		TBFEngine.setReturnDay();
	    }
	})
	tbjQuery("#pickup_day").change(function(){
	    var order_date_month = parseInt(tbjQuery('#pickup_month').val());
	    var return_month = parseInt(tbjQuery('#return_month').val());
	    TBFEngine.setPickupDate();
	    if(return_month > order_date_month){
		TBFEngine.resetReturnDay();
	    }
	    else {
		TBFEngine.setReturnDay();
	    }
	})
	// return section
	tbjQuery("#return_year").change(function(){
	    var return_year = parseInt(tbjQuery("#return_year").val());
	    var order_date_year = parseInt(tbjQuery('#pickup_year').val());
	    TBFEngine.setReturnDate();
	})
	tbjQuery("#return_month").change(function(){
	    TBFEngine.setReturnDate();
	})
	// hide all past dates
	TBFEngine.hidePastDates();
    }
})

function selectAddress(address_id, address_title, address_lat, address_lng, section){
    if(section=='pickup'){
	tbjQuery('#address_from').val(address_title);console.log ("main_002.js: 1950");
	tbjQuery('#address_from_lat').val(address_lat);
	tbjQuery('#address_from_lng').val(address_lng);
    }
    else if(section=='dropoff'){
	tbjQuery('#address_to').val(address_title);
	tbjQuery('#address_to_lat').val(address_lat);
	tbjQuery('#address_to_lng').val(address_lng);
    }
    else if(section=='stops'){
	tbjQuery('div.stops_wrap.addressbook-active .waypoints').val(address_title);
	tbjQuery('div.stops_wrap.addressbook-active #waypoint_lat').val(address_lat);
	tbjQuery('div.stops_wrap.addressbook-active #waypoint_lng').val(address_lng);
	tbjQuery('div.stops_wrap').removeClass('addressbook-active');
    }
    tbjQuery('#addressBookModal').modal("hide");
    GoogleGeoCore.RenderDirections();
}