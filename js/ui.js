$(document).ready(function(){
	// For Zebra Stripe Rows
	$("div.rdata:even").addClass("even");
	$("div.rdata:odd").addClass("odd");

	// For getting last div row data
	$('div#sessiondata > div').last().attr('style', 'width:100%;height:25px;float:left;border-bottom:1px solid #75AAFA;');

	// Add New User
	$('#btnAddNewUser').click(function(event){
		window.location = "/users/new";
		event.stopImmediatePropagation();
	});
	
});