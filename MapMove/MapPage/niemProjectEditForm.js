﻿$( document ).ready( function() {
	var $orgName = $("input[title='Last Name']"),
		$intlAddress = $("input[title='Is this an United States Address?']"),
		$state = $("input[title='State/Province']"),
		$country = $("input[title='Country/Region']"),
		$latitude = $("input[title='Latitude']"),
		$longitude = $("input[title='Longitude']"),
		$caseStudy = $("input[title='Do you have a case study for your project?']"),
		$caseStudyLink =  $("input[title='Case Study Link']"),
		$caseStudyId = $("input[title='CaseStudyId']"),
		$helpWithStudy = $("input[title='Can a NIEM PMO contact you to assist in developing a case study for your project?']"),
		$bestOfNiem = $("input[title='BestOfNIEM']"),
		$webServiceUpdate = $("input[title='WebServiceUpdate']"),
		validationStar = "<SPAN class=ms-formvalidation title='This is a required field.'> *</SPAN>"

	; //local vars

	$orgName.closest("td")
		.prev()
			.find("nobr")
			.html("<nobr>Organization Name" + validationStar + "</nobr>");
			
	//Not needed on new form
	$bestOfNiem
		.closest("tr")
			.hide()
		.end()[0].disabled = true;
		//.prop("disabled", true);
		
	$webServiceUpdate
		.closest("tr")
			.hide()
		.end()
		.attr("checked", false);
		
	$caseStudyLink
		.closest("tr")
		.hide();
		
	$caseStudyId
		.closest("tr")
		.hide();
		
	if ( $caseStudy.is(":checked") ) {
		$helpWithStudy
			.closest("tr")
				.hide();
		$caseStudy.after("<p id='UploadCaseStudy'>Please upload case study to the <a href='javascript:void(0);' onclick='openDisplayForm();'>drop off library</a>.</p>");
	}
	
	if ( $intlAddress.is(":checked") ) {
		showUSAddressForm({
			state: $state,
			country: $country,
			intlAddress: $intlAddress,
			latitude: $latitude,
			longitude: $longitude
		});
	}

	$intlAddress.change(function() {
		var $this = $(this)

		;//local vars

		if ( $this.is(":checked") ) {
			showUSAddressForm({
				state: $state,
				country: $country,
				intlAddress: $intlAddress,
				latitude: $latitude,
				longitude: $longitude
			});
		} else {
			showIntlAddressForm({
				state: $state,
				country: $country,
				intlAddress: $intlAddress,
				latitude: $latitude,
				longitude: $longitude
			});
		}
	});
	
	$caseStudy.change(function() {
		var $this = $(this)

		;//local vars

		if ( $this.is(":checked") ) {
			$helpWithStudy
				.closest("tr")
					.hide();
					
			$("#UploadCaseStudy").remove();
			$this.after("<p id='UploadCaseStudy'>Please upload case study to the <a href='javascript:void(0);' onclick='openDisplayForm();'>drop off library</a>.</p>");

			//$this.after("<p id='UploadCaseStudy'>Please upload case study to the drop off library.</p>");
		} else {
			$helpWithStudy
				.closest("tr")
					.show();
			
			$("#UploadCaseStudy").remove();
		}
	});
	
});

function showUSAddressForm( opt ) {
	var validationStar = "<SPAN class=ms-formvalidation title='This is a required field.'> *</SPAN>"

	; //local vars

	opt.latitude.closest("tr")
		.hide()
		.end()[0].disabled = true;
		//.prop("disabled", true);

	opt.longitude.closest("tr")
		.hide()
		.end()[0].disabled = true;
		//.prop("disabled", true);

	opt.state
		.closest("tr")
		.find("h3.ms-standardheader > nobr")
		.after( validationStar );

	opt.country
		.closest("tr")
		.hide()
		.end()
		.val("United States of America");

}

function showIntlAddressForm( opt ) {
	var validationStar = "<SPAN class=ms-formvalidation title='This is a required field.'> *</SPAN>"

	; //local vars

	opt.latitude.closest("tr")
		.show()
		.end()[0].disabled = false;
		//.prop("disabled", false);
		
	opt.longitude.closest("tr")
		.show()
		.end()[0].disabled = false;
		//.prop("disabled", false);

	opt.state
		.closest("tr")
		.find("span.ms-formvalidation")
		.remove();

		/*

					.end()

		.find("h3.ms-standardheader")
		.find("span.ms-formvalidation")
		.remove();
		*/

	opt.country
		.closest("tr")
		.show()
		.end()
		.val("");

	//opt.country[0].disabled = false;
}

function openDisplayForm() {
	OpenModalForm({
		staticListName: "UploadCase",
		url: "/_layouts/Upload.aspx?List={B24CFF67-34E2-4E44-AEBF-6D101E82FF58}&RootFolder=",
		autoSize: true,
		callback: function( dialogResult ) {
			var feedback = ( dialogResult ) ?
				"This item has been saved..." :
				"The modal window has been closed. Nothing has been modified..."
			;
			
			//alert( dialogResult );
			
			SP.UI.Notify.addNotification( feedback, false );
			if ( dialogResult ) {
				//ID may be able to be passed as an args via modal call for edit form ~ New form not so much...
				//var camlQuery = "<Query><Where><And><Eq><FieldRef Name='Created'/><Value Type='DateTime'><Today/></Value></Eq><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></And></Where><OrderBy><FieldRef Name='Created' Ascending='False' /></OrderBy></Query>";
				var camlQuery = "<Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where><OrderBy><FieldRef Name='Created' Ascending='False' /></OrderBy></Query>"
				;	
					
				$().SPServices({
					operation: "GetListItems",
					listName: "UploadCase",
					async: false,
					CAMLViewFields: "<ViewFields><FieldRef Name='FileRef' /><FieldRef Name='ID' /></ViewFields>",
					CAMLQuery: camlQuery,
					CAMLRowLimit: 1,
					completefunc: function( xData, Status ) {
						//console.log( Status );
						//console.log( xData.responseText );
						
						//debugger;
						
						$( xData.responseXML ).find("[nodeName='z:row']").each(function() {
							var $node = $(this),
								$caseStudyLink = $("input[title='Case Study Link']"),
								$caseStudyId = $("input[title='CaseStudyId']")
							; //local vars
							
							$caseStudyLink.val( "/" + $node.attr("ows_FileRef").split(";#")[1] );
							$caseStudyLink.closest("td").find("input[title='Description']").val("Case Study");
							
							$caseStudyId.val( $node.attr("ows_ID") );
						});
					}
				});	
			}
		}
	});
}

function OpenModalForm( options ) {
	/**************************************************************************************************************
	// Why so many options M$? /smh
	// http://msdn.microsoft.com/en-us/library/ff410259
	//
	// Valid options listed here: //http://blogs.msdn.com/b/sharepointdev/archive/2011/01/13/using-the-dialog-platform.aspx
	*************************
	// These options are the bare minimum needed to open a modal dialog.
	// staticListName
	// ID
	*************************
	// formType ~ Default: DispForm
	// title
	// url
	// html
	// x ~ Default to center of axis
	// y ~ Default to center of axis
	// width: 800 ~ Default
	// height: 600 ~ Default.
	// allowMaximize: true ~ Default.
	// showMaximized: false ~ Default.
	// showClose: true ~ Default.
	// autoSize: false ~ Default.
	// callback: onDialogClose ~ Default.

	********************************************************************
	Use args to pass data to the modal.  Access using: window.frameElement.dialogArgs
	*********************************************************************
	// args: {} ~ Default.
	***************************************************************************************************************/

	// Safeguard the options param
	options = options || {};
	//options.formType = options.formType || "display";
	//url will find current site for each scenario
	var url,
		formType
	; //local vars
	//L_Menu_BaseUrl --- //http://community.zevenseas.com/Blogs/Vardhaman/Lists/Posts/Post.aspx?ID=9

	if ( options.hasOwnProperty("url") ) {
		//Locates full path URL's or relative URL's
		if ( options.url.substring( 0,1 ) === "." || options.url.substring( 0,4 ) === "http" ) {
			url = options.url;
		} else {
			url = L_Menu_BaseUrl + options.url;
		}
		//deletes property to prevent overwriting when extending options
		delete options.url;
	} else {
		try {
			switch ( options.formType.toLowerCase() ) {
				case "display":
					formType = "DispForm";
					break;
				case "edit":
					formType = "EditForm";
					break;
				case "new":
					formType = "NewForm";
					break;
				default:
					formType = "DispForm";
					break;
			}		
		} catch( e ) {
			formType = "CustomDispForm";
		}

		//Default the base URL to the url variable
		if ( L_Menu_BaseUrl === "" ) {
			url = "/Lists/" + options.staticListName + "/" + formType + ".aspx?ID=" + options.ID;
		} else {
			url = L_Menu_BaseUrl + "/Lists/" + options.staticListName + "/" + formType + ".aspx?ID=" + options.ID;
		}
	}

	//Rid jQuery dependency on this method...
	var opt = {
		title: options.title || "",
		url: url,
		html: options.html || undefined,
		height: options.height || 600,
		width: options.width || 800,
		allowMaximize: options.allowMaximize || true,
		showMaximized: options.showMaximized || false,
		showClose: options.showClose || true,
		autoSize: options.autoSize || false,
		dialogReturnValueCallback: options.callback || function() {},
		//Use args to pass data to the modal.  Access using: window.frameElement.dialogArgs
		args: options.args || {}
	};

	//debugger;
	//Create modal
	ExecuteOrDelayUntilScriptLoaded(
		function() {
			SP.UI.ModalDialog.showModalDialog( opt );
		},
		'sp.js'
	);
}

function PreSaveAction() {
	//debugger;

	var latitude = $.trim( $("input[title='Latitude']").val() ),
		longitude = $.trim( $("input[title='Longitude']").val() ),
		$address = $("input[title='Address']"),
		$city = $("input[title='City']"),
		$state = $("input[title='State/Province']"),
		$zip = $("input[title='ZIP/Postal Code']"),
		$country = $("input[title='Country/Region']"),
		item = {
			address: $address.val(),
			city: $city.val(),
			state: $state.val(),
			zip: $zip.val(),
			country: $country.val()
		},
		intlAddress = $("input[title='Is this address within the United States of America?']").is(":checked"),
		validationError = "<br /><SPAN class=ms-formvalidation><SPAN role=alert>You must specify a value for this required field.</SPAN><BR></SPAN>"

	; //local vars

	//Used when querying Bing
	item.bingAddress = item.address + " " + item.city + " " + item.state + " " + item.zip;

	$country[0].disabled = false;
	$("input[title='Latitude']")[0].disabled = false;
	$("input[title='Longitude']")[0].disabled = false;
	
	if ( intlAddress ) {
		if ( $.trim( $state.val() ) === "" ) {
			$state.find(".ms-formvalidation").remove();
			$state.after( validationError );

			$state.on("keyup", function() {
				var $this = $(this)

				;//local vars

				if ( $.trim( $state.val() ) !== "" ) {
					$state
						.closest("td")
							.find("span.ms-formvalidation")
							.remove()
							.end()
						.end()
						.off("keyup");
				}
			});
			
			$country[0].disabled = true;
			$("input[title='Latitude']")[0].disabled = true;
			$("input[title='Longitude']")[0].disabled = true;
			
			return false;
		}
	}

	return true;
}