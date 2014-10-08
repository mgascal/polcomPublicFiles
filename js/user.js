
function login() {
	/*var userName = document.getElementById('userName').value;
	var password = document.getElementById('password').value;
	*/
	var userName = $("#userName").val();
	var password = $("#password").val();
	
	$.getJSON('./pctracking/user/authenticate.do',
		{ userid: userName, pwd : password},
		function(jd) {
			
			param = jd["params"];
			res = jd["response"];
			stat = jd["status"];
			if (stat["code"] == 200) {
				if (res["sessionid"] && res["sessionid"].length > 0 ) {
					createCookie("ssnid", res["sessionid"], 1);
					userCookie(userName);
				}else{
					$("#errorMsg").attr('class', 'col-xs-4 alert alert-danger');
					$("#errorMsg").text('Incorrect Username / Password');
				}
			}else{
				$("#errorMsg").attr('class', 'col-xs-4 alert alert-danger');
				$("#errorMsg").text('Incorrect Username / Password');
			}
		}
	);
}

function userCookie(userName){
	$.getJSON('./pctracking/user/getUserInfo.do',
		{ username: userName, ssnid : readCookie("ssnid")},
		function(jd) {
			param = jd["params"];
			res = jd["response"];
			stat = jd["status"];
			if (stat["code"] == 200) {
				if (res["form"]) {
					/*
					 * {"userId":500300,"userName":"mgascal","firstName":"Melgar","lastName":"Gascal","middleName":"Estrellante","address":null,"pwd":"mgascal","email":null,"userType":null,"status":null,"department":null,"active":null,"create_date":1401428003000,"create_by":null,"updated_date":1401428003000,"updated_by":null}
					 */
					createCookie("username", res["form"]["userName"]);
					createCookie("user_id", res["form"]["userId"]);
					createCookie("firstName", res["form"]["firstName"]);
					createCookie("lastName", res["form"]["lastName"]);
					createCookie("userType", res["form"]["userType"]);
					window.location = './loadFormsTracking.do';
				}
			}
		}
	);
	
}

function loginOnEnter(e){
	//alert(e.which);
	if(e.keyCode == 13){
		login();
		return false;
	}
}

function logout(){
	
	var param = new Array();
	param.push(setPars("delete_session", readCookie("ssnid")));
	param.push(setPars("ssnid", readCookie("ssnid")));
	$.getJSON(  './pctracking/session/deleteUserSession.do', 
		param.join("&"),
		function(json) {
			var s = json["status"];
			if (s["code"] == 200) {
			}else{
				//createAlert("danger", "Error, Session unsuccessfully deleted.");
			}

			eraseCookie("ssnid");
			eraseCookie("username");
			eraseCookie("user_id");
			eraseCookie("firstName");
			eraseCookie("lastName");
			
			window.location='./logout.do';
		}
	);	
}

function createUser(){
	if(parsleyValidation()){
		if($("#user_password_hash").val().length > 0 && $("#user_password_hash").val() == $("#user_password_salt").val()){
			$.getJSON('./pctracking/user/createUser.do',
				{ 
					username	: nullToString($("#user_username").val()),
					fname		: nullToString($("#user_firstname").val()),
					lname		: nullToString($("#user_lastname").val()),
					mname		: nullToString($("#user_middlename").val()),
					email		: nullToString($("#user_email").val()),
					dept		: nullToString($("#user_department").val()),
					type		: nullToString($("#user_usertype").val()),
					pwd			: nullToString($("#user_password_hash").val()),
					ssnid 		: readCookie("ssnid")
				},
				function(jd){
					stat = jd["status"];
					resp = jd["response"];
					if (stat["code"] == 200) {
						//createAlert("success", "User Successfully Created.");
						window.location = './userFields.do?page=view&id=' + resp["form"]["userId"]+"&jsAction=create";
					}else if(stat["code"] == 406){
						createAlert("danger", stat["message"]);
					}else{
						createAlert("danger", "Error, user unsuccessfully created.");
					}
				}
			);
		}else{
			if($("#user_password_hash").val().length == 0){
				createAlert("danger", "Please input password");
			}else{
				createAlert("danger", "Password not match.");
			}
		}
	}
}

function loadUserList(sortColumn, sortAsc){
	//progressBar(10);
	setNavigation("Manage Users");
	$("#title").text("Manage Users");
	
	//sortColumn = (sortColumn == null ? "userId" : sortColumn);
	sortColumn = typeof sortColumn !== 'undefined' ? sortColumn : "updated_date";
	sortAsc = (sortAsc == null ? false : sortAsc);

	isJsAction();
	
	var param = new Array();
	param.push(setPars("sortColumn", sortColumn));
	param.push(setPars("sortAsc", sortAsc));
	param.push(setPars("ssnid", readCookie("ssnid")));
	
	$.getJSON(  './pctracking/user/listUsers.do',
		param.join("&"),
  		function(jd) {
			param = jd["params"];
			res = jd["response"];
			stat = jd["status"];
			if (stat["code"] == 200) {
				div = document.getElementById("listResults");
				removeChildElements(div);
				
				rowDiv = document.createElement("div");
				rowDiv.setAttribute("class","row");
				div.appendChild(rowDiv);
				
					colDiv = document.createElement("div");
					colDiv.setAttribute("class","col-lg-11 tableHeader");
					colDiv.setAttribute("style","border-top: 1px solid #0076EB; border-right: 1px solid #0076EB; border-left: 1px solid #0076EB; border-top-left-radius:6px; border-top-right-radius:6px;");
					rowDiv.appendChild(colDiv);
					
						rowDiv2 = document.createElement("div");
						rowDiv2.setAttribute("class","row");
						rowDiv2.style.minHeight = "25px";
						colDiv.appendChild(rowDiv2);
				
							columnHeader = document.createElement("div");
							columnHeader.setAttribute("class","col-xs-1");
							rowDiv2.appendChild(columnHeader);
							
							/*columnHeader = document.createElement("div");
							columnHeader.setAttribute("class","col-xs-2 col-xs-offset-half");
							rowDiv2.appendChild(columnHeader);
							columnHeaderText = document.createElement("p");
							columnHeaderText.setAttribute("class","well-sm");
							columnHeaderText.appendChild(document.createTextNode("USER ID"));
							columnHeader.appendChild(columnHeaderText);
							if(sortColumn == "userId"){
								columnHeaderText2 = document.createElement("span");
								columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down"));
								columnHeaderText.appendChild(columnHeaderText2);
							}
							columnHeader.onclick = function(){
								sortAsc = (sortColumn == "userId") ? !sortAsc : true;
								sortColumn = "userId";
								loadUserList(sortColumn, sortAsc);
							};*/
							
							columnHeader = document.createElement("div");
							columnHeader.setAttribute("class","col-xs-2 col-xs-offset-half");
							rowDiv2.appendChild(columnHeader);
							columnHeaderText = document.createElement("p");
							columnHeaderText.setAttribute("class","well-sm left-align");
							columnHeaderText.appendChild(document.createTextNode("USERNAME"));
							columnHeader.appendChild(columnHeaderText);
							if(sortColumn == "userName"){
								columnHeaderText2 = document.createElement("span");
								columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down"));
								columnHeaderText.appendChild(columnHeaderText2);
							}
							columnHeader.onclick = function(){
								sortAsc = (sortColumn == "userName") ? !sortAsc : true;
								sortColumn = "userName";
								loadUserList(sortColumn, sortAsc);
							};
							
							columnHeader = document.createElement("div");
							columnHeader.setAttribute("class","col-xs-2 col-xs-offset-quarter");
							rowDiv2.appendChild(columnHeader);
							columnHeaderText = document.createElement("p");
							columnHeaderText.setAttribute("class","well-sm");
							columnHeaderText.appendChild(document.createTextNode("EMAIL"));
							columnHeader.appendChild(columnHeaderText);
							if(sortColumn == "email"){
								columnHeaderText2 = document.createElement("span");
								columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down"));
								columnHeaderText.appendChild(columnHeaderText2);
							}
							columnHeader.onclick = function(){
								sortAsc = (sortColumn == "email") ? !sortAsc : true;
								sortColumn = "email";
								loadUserList(sortColumn, sortAsc);
							};
							
							columnHeader = document.createElement("div");
							columnHeader.setAttribute("class","col-xs-2");
							rowDiv2.appendChild(columnHeader);
							columnHeaderText = document.createElement("p");
							columnHeaderText.setAttribute("class","well-sm");
							columnHeaderText.appendChild(document.createTextNode("USER TYPE"));
							columnHeader.appendChild(columnHeaderText);
							if(sortColumn == "userType"){
								columnHeaderText2 = document.createElement("span");
								columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down"));
								columnHeaderText.appendChild(columnHeaderText2);
							}
							columnHeader.onclick = function(){
								sortAsc = (sortColumn == "userType") ? !sortAsc : true;
								sortColumn = "userType";
								loadUserList(sortColumn, sortAsc);
							};
							
							columnHeader = document.createElement("div");
							columnHeader.setAttribute("class","col-xs-2 col-xs-push-quarter");
							rowDiv2.appendChild(columnHeader);
							columnHeaderText = document.createElement("p");
							columnHeaderText.setAttribute("class","well-sm");
							columnHeaderText.appendChild(document.createTextNode("UPDATED DATE"));
							columnHeader.appendChild(columnHeaderText);
							if(sortColumn == "updated_date"){
								columnHeaderText2 = document.createElement("span");
								columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down"));
								columnHeaderText.appendChild(columnHeaderText2);
							}
							columnHeader.onclick = function(){
								sortAsc = (sortColumn == "updated_date") ? !sortAsc : true;
								sortColumn = "updated_date";
								loadUserList(sortColumn, sortAsc);
							};
							
							columnHeader = document.createElement("div");
							columnHeader.setAttribute("class","col-xs-2 col-xs-push-quarter");
							rowDiv2.appendChild(columnHeader);
							columnHeaderText = document.createElement("p");
							columnHeaderText.setAttribute("class","well-sm");
							columnHeaderText.appendChild(document.createTextNode("UPDATED BY"));
							columnHeader.appendChild(columnHeaderText);
							if(sortColumn == "updated_by"){
								columnHeaderText2 = document.createElement("span");
								columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down"));
								columnHeaderText.appendChild(columnHeaderText2);
							}
							columnHeader.onclick = function(){
								sortAsc = (sortColumn == "updated_by") ? !sortAsc : true;
								sortColumn = "updated_by";
								loadUserList(sortColumn, sortAsc);
							};
							
							columnHeader = document.createElement("div");
							columnHeader.setAttribute("class","col-xs-1");
							rowDiv2.appendChild(columnHeader);
							
					colDiv = document.createElement("div");
					colDiv.setAttribute("class","col-lg-1");
					rowDiv.appendChild(colDiv);
						
						rowDiv2 = document.createElement("div");
						rowDiv2.setAttribute("class","row");
						colDiv.appendChild(rowDiv2);
							
							columnHeader = document.createElement("div");
							columnHeader.setAttribute("class","col-xs-12");
							rowDiv2.appendChild(columnHeader);
							
								addButton = document.createElement("button");
								addButton.setAttribute("type","button");
								addButton.setAttribute("class","btn btn-default-addNew btn-sm glyphicon glyphicon-plus-sign");
								addButton.setAttribute("title", "Add User");
								addButton.style.width = "100%";
								//addButton.appendChild(document.createTextNode("Add New"));
								addButton.onclick = function(){
									window.location = './userFields.do?page=add';
								};
								columnHeader.appendChild(addButton);
				if (res["forms"].length > 0) {
					gray = true;
					
					//$.each(res[type.toLowerCase()], function(i, obj){
					$.each(res["forms"], function(i, obj){
						
					rowDiv = document.createElement("div");
					rowDiv.setAttribute("class","row");
					div.appendChild(rowDiv);
					
						colDiv = document.createElement("div");
						gray = !gray;
						colDiv.setAttribute("class","col-lg-11 tableRow" + ((gray) ? " rowGray" : " rowWhite"));
						colDiv.setAttribute("style","border-right: 1px solid #0076EB; border-left: 1px solid #0076EB;");
						//if(i==(res[type.toLowerCase()].length-1))
						if(i==(res["forms"].length-1)){
							colDiv.setAttribute("style","border-right: 1px solid #0076EB; border-left: 1px solid #0076EB;border-bottom: 1px solid #0076EB; border-bottom-left-radius:6px; border-bottom-right-radius:6px;");
						}
						colDiv.ondblclick = function(){
							//window.location = '/statuses/' + obj["status_id"] + '/edit';
							//window.location = './updateUser.do?id='+ obj["userId"];
							window.location = './userFields.do?page=view&id=' + obj["userId"];
						};
						rowDiv.appendChild(colDiv);
						
							rowDiv2 = document.createElement("div");
							rowDiv2.setAttribute("class","row");
							rowDiv2.style.minHeight = "25px";
							colDiv.appendChild(rowDiv2);
					
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnData);
								/*columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(nullToString(obj["userId"])));
								columnData.appendChild(columnData2);*/
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-2 col-xs-offset-half");
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm left-align");
								columnData2.appendChild(document.createTextNode(nullToString(obj["userName"])));
								columnData.appendChild(columnData2);
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-2 col-xs-offset-quarter");
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(nullToString(obj["email"])));
								columnData.appendChild(columnData2);
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-2");
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(nullToString(obj["userType"])));
								columnData.appendChild(columnData2);
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-2 col-xs-push-quarter");
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(nullToString(obj["updated_date"])));
								columnData.appendChild(columnData2);
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-2 col-xs-push-quarter");
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(nullToString(obj["updated_by"])));
								columnData.appendChild(columnData2);
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnData);
								
						colDiv = document.createElement("div");
						colDiv.setAttribute("class","col-lg-1");
						rowDiv.appendChild(colDiv);
							
							rowDiv2 = document.createElement("div");
							rowDiv2.setAttribute("class","row");
							colDiv.appendChild(rowDiv2);
							
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-12 btn-group btn-group-justified");
								rowDiv2.appendChild(columnData);
								
								addButton = document.createElement("a");
				 				addButton.setAttribute("class","btn btn-default-addNew btn-sm glyphicon glyphicon-pencil");
				 				addButton.setAttribute("title", "Edit User");
				 				addButton.onclick = function (){
				 					window.location = './userFields.do?page=edit&id=' + obj["userId"];
				 				};
				 				columnData.appendChild(addButton);
	 							
									addButton = document.createElement("a");
					 				addButton.setAttribute("class","btn btn-default-addNew btn-sm glyphicon glyphicon-trash");
					 				addButton.setAttribute("title", "Delete User");
					 				if(obj["userId"] == readCookie("user_id")){
					 					addButton.setAttribute("disabled","disabled");
					 				}
					 				addButton.onclick = function (){
					 					
					 					var answer = confirm("Are you sure want to delete this user?");
										
										if(answer){
						 					var param = new Array();
						 					param.push(setPars("user_id", obj["userId"]));
						 					param.push(setPars("ssnid", readCookie("ssnid")));
						 					$.getJSON(  './pctracking/user/deleteUser.do', 
						 						param.join("&"),
						 						function(json) {
						 							var s = json["status"];
						 							if (s["code"] == 200) {
						 								createAlert("success", "User successfully deleted.");
						 								loadUserList(sortColumn, sortAsc);
						 								
						 							}else{
						 								createAlert("danger", "Error, User unsuccessfully deleted.");
						 							}
						 						}
						 					);
										}
					 				};
									columnData.appendChild(addButton);
						});
				}
							
			}else{
				
			}
			//progressBar(100);
		}
	);
}

function processData(disable){
	var id = getUrlVars()["id"];
	//alert(id);
	$.getJSON('./pctracking/user/getUserInfo.do',
			{userid : id, ssnid : readCookie("ssnid")},
			function (jd){
				stat = jd["status"];
				/*
				 * username	: nullToString($("#user_username").val()),
				fname		: nullToString($("#user_firstname").val()),
				lname		: nullToString($("#user_lastname").val()),
				mname		: nullToString($("#user_middlename").val()),
				email		: nullToString($("#user_email").val()),
				dept		: nullToString($("#user_department").val()),
				type		: nullToString($("#user_usertype").val()),
				pwd			: nullToString($("#user_password_hash").val()),
				 */
				if (stat["code"] == 200) {
					$.each(jd["response"]["form"], function(key, val){
						if(key=="pwd"){
							$("#user_password_hash").val(val);
							$("#user_password_salt").val(val);
							if(disable){
								$("#user_password_hash").attr("disabled","disabled");
								$("#user_password_salt").attr("disabled","disabled");
							}
						}else if(key.toLowerCase() == "usertype"){
							//alert(key +" " + val);
							$("#user_usertype").val(val);
							$("#user_usertype").selectpicker('render');
							if(disable){
								$("#user_usertype").attr("disabled","disabled");
							}
						}else{
							$("#user_" + key.toLowerCase()).val(val);
							if(disable){
								$("#user_" + key.toLowerCase()).attr("disabled","disabled");
							}
						}
					});
				}else if(stat["code"] == 401){
					//window.location = getDomain() + '/mainforms/code401';	
				}
		}
	);
}

function updateUser(){
	var id = getUrlVars()["id"];
	if(parsleyValidation()){
		if($("#user_password_hash").val().length > 0 && $("#user_password_hash").val() == $("#user_password_salt").val()){
			$.getJSON('./pctracking/user/updateUser.do',
				{ 
					user_id		: id,
					username	: nullToString($("#user_username").val()),
					fname		: nullToString($("#user_firstname").val()),
					lname		: nullToString($("#user_lastname").val()),
					mname		: nullToString($("#user_middlename").val()),
					email		: nullToString($("#user_email").val()),
					dept		: nullToString($("#user_department").val()),
					type		: nullToString($("#user_usertype").val()),
					pwd			: nullToString($("#user_password_hash").val()),
					ssnid 		: readCookie("ssnid")
				},
				function(jd){
					stat = jd["status"];
					if (stat["code"] == 200) {
						//createAlert("success", "User Successfully Updated.");
						window.location = './userFields.do?page=view&jsAction=edit&id=' + id;
					}else if(stat["code"] == 406){
						createAlert("danger", stat["message"]);
					}else{
						createAlert("danger", "Error, user unsuccessfully updated.");
					}
				}
			);
		}else{
			if($("#user_password_hash").val().length == 0){
				createAlert("danger", "Please input password");
			}else{
				createAlert("danger", "Password not match.");
			}
		}
	}
}

function createToolbar(){
	var toolbar = $(".formToolbar");
	
	var span = $("<span class='pull-right'></span>");
	toolbar.append(span);
	
	var button = $("<button></button>");
	button.attr("type","button");
	button.attr("title", "Go To List");
	button.attr("class","btn btn-default-addNew btn glyphicon glyphicon-hand-left");
	button.click(function(){
		window.location = './loadUser.do';
	});
	span.append(button);
	
	var button = $("<button></button>");
	button.attr("type","button");
	button.attr("title", "Add User");
	button.attr("class","btn btn-default-addNew btn glyphicon glyphicon-plus-sign");
	button.click(function(){
		window.location = './userFields.do?page=add';
	});
	span.append(button);
	
	var button = $("<button></button>");
	button.attr("type","button");
	button.attr("title", "Edit User");
	button.attr("class","btn btn-default-addNew btn glyphicon glyphicon-pencil");
	button.click(function(){
		var id = getUrlVars()["id"];
		window.location = './userFields.do?page=edit&id=' + id;
	});
	span.append(button);
	
	var button = $("<button></button>");
	var id = getUrlVars()["id"];
	button.attr("type","button");
	button.attr("title", "Delete User");
	button.attr("class","btn btn-default-addNew btn glyphicon glyphicon-trash");
	if(id == readCookie("user_id")){
		button.attr("disabled","disabled");
	}
	button.click(function(){
		var answer = confirm("Are you sure want to delete this user?");
		if(answer){
			var param = new Array();
			param.push(setPars("user_id", id));
			param.push(setPars("ssnid", readCookie("ssnid")));
			$.getJSON(  './pctracking/user/deleteUser.do', 
				param.join("&"),
				function(json) {
					var s = json["status"];
					if (s["code"] == 200) {
						//createAlert("success", getLabel(type) + " Successfully Deleted.");
						window.location = './loadUser.do?jsAction=delete';
						
					}else if(s["code"] == 406){
						createAlert("danger", s["message"]);
					}else{
						createAlert("danger", "Error, user unsuccessfully deleted.");
					}
				}
			);
		}
	});
	span.append(button);
}

function loadUserFields(){
	//progressBar(10);
	setNavigation("Manage Users");
	$( ".selectpicker" ).selectpicker();
	
	var page = getUrlVars()["page"];
	$("title").text(toCamelCase(page, true) + " User");
	$(".pageHeader").text(toCamelCase(page, true) + " User Page");
	
	if(page == "add"){

		$("#btnCancel").click(function(){
			window.location = './loadUser.do';
		});
		
		$("#btnSubmit").click(function(){
			createUser();
		});
	}else if(page == "view"){
		$(".pageButtons").hide();
		isJsAction();
		createToolbar();
		processData(true);
		
		$(".pageButtons").hide();
	}else if(page == "edit"){
		processData();
		
		$("#btnCancel").click(function(){
			var id = getUrlVars()["id"];
			window.location = './userFields.do?page=view&id=' + id;
		});
		
		var submit = $("#btnSubmit");
		submit.text("Update");
		submit.click(function(){
			updateUser();
		});
	}
	//progressBar(100);
}
function isJsAction(){
	var jsAction = getUrlVars()["jsAction"];
	if(jsAction == "create"){
		createAlert("success", "User successfully created.");
	}else if(jsAction == "delete"){
		createAlert("success", "User successfully deleted.");
	}else if(jsAction == "edit"){
		createAlert("success", "User successfully updated.");
	}
}

function loadlogin(){
	var code = getUrlVars()["code"];
	if(code && code == 401){
		$("#errorMsg").attr('class', 'col-xs-4 alert alert-danger');
		$("#errorMsg").text('Your session has expired or someone might have logged on with your ID. Please log in again.');
	}
}

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
		function(m,key,value) {
			vars[key] = value;
    	}
	);
    return vars;
}

function parsleyValidation(){
	var username = $("#user_username").parsley( 'validate' );
	var password = $("#user_password_hash").parsley( 'validate' );
	var confirmation = $("#user_password_hash").parsley( 'validate' );
	var firstName = $("#user_firstname").parsley( 'validate' );
	var lastName = $("#user_lastname").parsley( 'validate' );
	var email = $("#user_email").parsley( 'validate' );

	return (username && password && confirmation && firstName && lastName && email);
}