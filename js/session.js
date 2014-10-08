//function loadSessionList(type, ssnid, sortColumn, sortAsc){
function loadSessionList(sortColumn, sortAsc){
	//progressBar(10);
	//var type = $("#type").text().trim();
	setNavigation("Active Sessions");
	$("#title").text("Active Sessions");
	
	//sortColumn = (sortColumn == null ? "userId" : sortColumn);
	sortColumn = typeof sortColumn !== 'undefined' ? sortColumn : "timeStarted";
	sortAsc = (sortAsc == null ? false : sortAsc);
	
	var param = new Array();
	param.push(setPars("sortColumn", sortColumn));
	param.push(setPars("sortAsc", sortAsc));
	param.push(setPars("ssnid", readCookie("ssnid")));
	
	$.getJSON(  './pctracking/session/listUserSessions.do',
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
								columnHeader.setAttribute("class","col-xs-3");
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
									loadSessionList(sortColumn, sortAsc);
								};
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-3");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								columnHeaderText.appendChild(document.createTextNode("USERNAME"));
								columnHeader.appendChild(columnHeaderText);
								if(sortColumn == "username"){
									columnHeaderText2 = document.createElement("span");
									columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down"));
									columnHeaderText.appendChild(columnHeaderText2);
								}
								columnHeader.onclick = function(){
									sortAsc = (sortColumn == "username") ? !sortAsc : true;
									sortColumn = "username";
									loadSessionList(sortColumn, sortAsc);
								};
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-3");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								columnHeaderText.appendChild(document.createTextNode("SESSION"));
								columnHeader.appendChild(columnHeaderText);
								if(sortColumn == "sessionId"){
									columnHeaderText2 = document.createElement("span");
									columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down"));
									columnHeaderText.appendChild(columnHeaderText2);
								}
								columnHeader.onclick = function(){
									sortAsc = (sortColumn == "sessionId") ? !sortAsc : true;
									sortColumn = "sessionId";
									loadSessionList(sortColumn, sortAsc);
								};
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-3");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								columnHeaderText.appendChild(document.createTextNode("TIME STARTED"));
								columnHeader.appendChild(columnHeaderText);
								if(sortColumn == "timeStarted"){
									columnHeaderText2 = document.createElement("span");
									columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down"));
									columnHeaderText.appendChild(columnHeaderText2);
								}
								columnHeader.onclick = function(){
									sortAsc = (sortColumn == "timeStarted") ? !sortAsc : true;
									sortColumn = "timeStarted";
									loadSessionList(sortColumn, sortAsc);
								};
								
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
									addButton.setAttribute("class","btn btn-default-addNew btn-sm glyphicon glyphicon-refresh");
									addButton.setAttribute("title","Refresh List");
									//addButton.appendChild(document.createTextNode("Add New"));
									addButton.onclick = function(){
										//window.location = './add' + toCamelCase(type,true)+ '.do';
										loadSessionList(sortColumn, sortAsc);
									};
									columnHeader.appendChild(addButton);

				//if (res[type.toLowerCase()].length > 0) {
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
						if(i==(res["forms"].length-1))
									colDiv.setAttribute("style","border-right: 1px solid #0076EB; border-left: 1px solid #0076EB;border-bottom: 1px solid #0076EB; border-bottom-left-radius:6px; border-bottom-right-radius:6px;");
						colDiv.ondblclick = function(){
							//window.location = '/statuses/' + obj["status_id"] + '/edit';
							//window.location = './edit' + toCamelCase(type, true)+ '.do?id='+ obj[type.toLowerCase() + "_id"];
						};
						rowDiv.appendChild(colDiv);
						
							rowDiv2 = document.createElement("div");
							rowDiv2.setAttribute("class","row");
							rowDiv2.style.minHeight = "25px";
							colDiv.appendChild(rowDiv2);
					
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-3");
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(obj["user"]["userId"]));
								columnData.appendChild(columnData2);
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-3");
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(obj["user"]["userName"]));
								//getUsernameOnList(columnData2, obj["userId"]);
								columnData.appendChild(columnData2);
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-3");
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(obj["sessionId"]));
								columnData.appendChild(columnData2);
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-3");
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								var date = format_oracle_date(obj["timeStarted"], true);
								columnData2.appendChild(document.createTextNode(date));
								columnData.appendChild(columnData2);
								
						colDiv = document.createElement("div");
						colDiv.setAttribute("class","col-lg-1");
						rowDiv.appendChild(colDiv);
							
							rowDiv2 = document.createElement("div");
							rowDiv2.setAttribute("class","row");
							colDiv.appendChild(rowDiv2);
							
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-12");
								rowDiv2.appendChild(columnData);
								
									addButton = document.createElement("a");
					 				addButton.setAttribute("class","btn btn-default-addNew btn-sm glyphicon glyphicon-eject");
					 				addButton.setAttribute("title","Kill Session");
					 				if(obj["user"]["userId"] == readCookie("user_id")){
					 					addButton.setAttribute("disabled","disabled");
					 				}
					 				/*addButton.setAttribute("data-confirm","Are you sure you want to delete this Status?");
					 				addButton.setAttribute("data-method","delete");
					 				addButton.href = '/statuses/' + obj["status_id"];
					 				addButton.rel = 'nofollow';*/
					 				addButton.onclick = function (){
					 					var answer = confirm("Are you sure want to end this session?");
					 					if(answer){
					 						var param = new Array();
						 					param.push(setPars("delete_session", obj["sessionId"]));
						 					param.push(setPars("ssnid", readCookie("ssnid")));
						 					$.getJSON(  './pctracking/session/deleteUserSession.do', 
						 						param.join("&"),
						 						function(json) {
						 							var s = json["status"];
						 							if (s["code"] == 200) {
						 								createAlert("success","Session Successfully Deleted.");
						 								//window.location = './edit' + toCamelCase( type, true) + '.do?id=' + res["form"][type + "_id"] + '&jsAction=' + jsAction;
						 								loadSessionList(sortColumn, sortAsc);
						 								
						 							}else{
						 								createAlert("danger", "Error, Session unsuccessfully deleted.");
						 							}
						 						}
						 					);
					 					}
					 				};
									/*addButton.appendChild(document.createTextNode("Delete"));*/
		 							columnData.appendChild(addButton);
						});
				
			}else{
				removeChildElements(div);
				
				rowDiv = document.createElement("div");
				rowDiv.appendChild(document.createTextNode("No Data Available"));
				div.appendChild(rowDiv);
			}
  			
  		}else if(stat["code"] == 401){
			//window.location = getDomain() + '/mainforms/code401';
  			JSONerror(stat["code"]);
		}
		//progressBar(100);
		//prompt("",div.innerHTML); //getHTML generated code
 	});
}


function getUsernameOnList(element, user_id){
	if(user_id != null){
		$.getJSON('./pctracking/user/getUserInfo.do',
			{userid : user_id, ssnid : readCookie("ssnid")},
			function (jd){
				stat = jd["status"];
				if (stat["code"] == 200) {
					$.each(jd["response"]["form"], function(key, val){
						if(key == "userName"){
							$(element).text(nullToString(val));
						}
					});
				}else{
					$(element).text("");
				}
			}
		);
	}
}
