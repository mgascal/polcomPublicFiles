function doAjaxPost() {
	// get the form values
	var userName = $('#userName').val();
	var password = $('#password').val();

	$.ajax({type: "POST",
			url: "/NewsTool/AddUser.ajax",
			data: "userName=" + userName + "&password=" + password,
			success: function(returnText) {
				alert(returnText);
				// we have the response
				$('#info').html(returnText);
				$('#userName').val('');
				$('#password').val('');
			},
			error: function(e) {
				alert('Error: ' + e);
			}
	});
}

function doAjaxJson() {
	alert('doAjaxJson');
	$.get("/NewsTool/ShowUsers.ajax", { dte: new Date() },
    function(data) {
		var usersInfoHtml = '';
		$.each(data.Users,
		function(i) {
	        var dataUser = data.Users[i];
	        usersInfoHtml += '<tr>';
	        	usersInfoHtml += '<td class=\'txt12\'>UserName: ' + dataUser.userName + ' Password: ' + dataUser.password + '</td>';
	        usersInfoHtml += '</tr>';
		});
		if ($('#usersInfoTable')) {
			$('#usersInfoTable').empty();
	        $('#usersInfoTable').append(usersInfoHtml);
		}
	});
}

function doLoadPage() {
	alert('doLoadPage');
	$('#pageInfo').load('/NewsTool/homeView.do');
}