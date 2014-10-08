var polcom = {
	
	ssnid: null,
	
	onInit : function(){
		//alert("initializing");
		$('#header').load('./header');
		$('#menu').load('./blankNav');
		$('#body').load('./polcomLogin');
		$('#footer').load('./footer');
	},
	
	setSessionId: function(id){
		ssnid = id;
	},
	
	getSessionId: function(){
		return ssnid;
	}	
};


function init(){
	polcom.onInit();
}

function login() {
	/*var userName = document.getElementById('userName').value;
	var password = document.getElementById('password').value;
	*/
	var userName = $("#userName").val();
	var password = $("#password").val();
	
	$.getJSON('./json/authenticate.json',
		function(jd) {
			param = jd["params"];
			res = jd["response"];
			stat = jd["status"];
			if (stat["code"] == 200) {
				if (res["sessionid"] && res["sessionid"].length > 0 ) {
					window.location = './login.do?userName=' + userName + '&password=' + password;
					polcom.setSessionId(res["sessionid"]);
					$('#search').load('./formsTracking');
					$('#body').load('./formSearchBar');
					//window.location = './login.do?userName=' + userName + '&password=' + password;
				}else{
					alert("error");
				}
			}else{
				
			}
			
		}
	);
	//window.location = './login.do?userName=' + userName + '&password=' + password;
}