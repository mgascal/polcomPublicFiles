//---------------------------------------------------
//Modify News
//---------------------------------------------------

//increase the default animation speed to exaggerate the effect
$.fx.speeds._default = 1200;
var $view = $('<div></div>').dialog({
		autoOpen: 	false,
		height: 	850,
		width:		760,
		modal: 		true,
		show: 		"scale",
		hide: 		"fold",
		draggable: 	false,
		resizable: 	false,
		position: 	"center",
		open: 		function (){
			
						$("body").css("overflow", "hidden");
						$(this).load('./newsQAToolDetails.do');
	    },
		close: 		function (){
			
						$("body").css("overflow", "auto");
	    }
});

function viewNews(resourceId){
	
	alert(resourceId);
	$view.dialog( "open" );
	
	return false;
}

$(function() {
	
//---------------------------------------------------
//Error Message
//---------------------------------------------------
	var msg = $( "#error" ).dialog({
		autoOpen: false,
		height: 200,
		width: 300,
		modal: true,
		show: "puff",
		hide: "fold",
		draggable: false,
		resizable: false,	
		buttons: {
			Ok: function(){
				
				closeDialog();						
			}
		},
		open: function (){
			
			$("body").css("overflow", "hidden");
        },
		close: function (){
			
			$("body").css("overflow", "auto");
        }
	});
	function closeDialog(){
		
		msg.dialog( "close" );
		return false;
	};
	$( "#opener" ).click(function() {
		
		var message = document.getElementById('message').value;
		if( message.substring(0, message.indexOf("!")) == 'Error'){
			
			var dialog = document.getElementById("error");
			dialog.innerHTML = "<img src='./img/error_icon.jpg'>";
			dialog.innerHTML +=  "<p>" + message.substring(message.indexOf("!")+2) + "</p>";
			msg.dialog( "open" );
			
			return false;
		}else{
			
			return true;
		}
			
	});
	
	
//---------------------------------------------------
//Input Message
//---------------------------------------------------
	var msgInput = $( "#input" ).dialog({
		autoOpen: 	false,
		height: 	200,
		width: 		300,
		modal: 		true,
		show: 		"puff",
		hide: 		"fold",
		draggable: 	false,
		resizable: 	false,	
		buttons: 	{
						Ok: function(){
							alert(document.getElementById("inputted").value);
							closeInput();						
						},
						Cancel: function(){
							closeInput();						
						}
		},
		open: 		function (){
						$("body").css("overflow", "hidden");
		},
		close: 		function (){
						$("body").css("overflow", "auto");
		}
	});
	
	function closeInput(){
		msgInput.dialog( "close" );
		return false;
	};
	
	$( "#openInput" ).click(function() {
		var dialog = document.getElementById("input");
		dialog.innerHTML = "<br /> Enter value: <input type='text' id='inputted'/>";
		msgInput.dialog( "open" );
		return false;					
	});
});