function loadLookupFields(){
	var page = getUrlVars()["page"];
	var type = $("#type").text().trim();
	
	//CHANGE POLICY_TYPE TO COVERAGE_TYPE
	//THIS IS LABEL ONLY
	if(type == "policy_type"){
		type = "coverage_type";
	}
	
	$("title").text(toCamelCase(page, true) + " " + getLabel(type));
	$(".pageHeader").text(toCamelCase(page, true) + " " + getLabel(type) + " Page");
	$("#lookupLabel").text(getLabel(type));
	setNavigation(type);
	//progressBar(10);
	if(page == "add"){
		loadAddLookup();
	}else if(page == "view"){
		lookupJSAction();
		createToolbar();
		processLookupData(true);
		
		$(".pageButtons").hide();
	}else if(page == "edit"){
		processLookupData();
	}
}

function createToolbar(){
	var type = $("#type").text().trim();
	var toolbar = $(".formToolbar");
	
	var newType = type;
	
	//CHANGE POLICY_TYPE TO COVERAGE_TYPE
	//THIS IS LABEL ONLY
	if(type == "policy_type"){
		newType = "coverage_type";
	}
	
	var span = $("<span class='pull-right'></span>");
	toolbar.append(span);
	
	var button = $("<button></button>");
	button.attr("type","button");
	button.attr("title", "Go To List");
	button.attr("class","btn btn-default-addNew btn glyphicon glyphicon-hand-left");
	button.click(function(){
		window.location = './load' + toCamelCase(type, true) + '.do';
	});
	span.append(button);
	
	var button = $("<button></button>");
	button.attr("type","button");
	button.attr("title", "Add " + getLabel(newType));
	button.attr("class","btn btn-default-addNew btn glyphicon glyphicon-plus-sign");
	button.click(function(){
		window.location = './' + toCamelCase(type) + 'Fields.do?page=add';
	});
	span.append(button);
	
	var button = $("<button></button>");
	button.attr("type","button");
	button.attr("title", "Edit " + getLabel(newType));
	button.attr("class","btn btn-default-addNew btn glyphicon glyphicon-pencil");
	button.click(function(){
		var id = getUrlVars()["id"];
		window.location = './' + toCamelCase(type) + 'Fields.do?page=edit&id=' + id;
	});
	span.append(button);
	
	var button = $("<button></button>");
	button.attr("type","button");
	button.attr("title", "Delete " + getLabel(newType));
	button.attr("class","btn btn-default-addNew btn glyphicon glyphicon-trash");
	button.click(function(){
		var id = getUrlVars()["id"];
		var answer = confirm("Are you sure want to delete this " + getLabel(newType) + "?");
		if(answer){
			var param = new Array();
			param.push(setPars(type + "_id", id));
			param.push(setPars("ssnid", readCookie("ssnid")));
			$.getJSON(  './pctracking/' + type + '/deleteForm' + toCamelCase( type, true) + '.do', 
				param.join("&"),
				function(json) {
					var s = json["status"];
					if (s["code"] == 200) {
						//createAlert("success", getLabel(type) + " Successfully Deleted.");
						window.location = './load' + toCamelCase( type, true) + '.do?jsAction=delete';
						
					}else if(s["code"] == 406){
						createAlert("danger", s["message"]);
					}else{
						createAlert("danger", "Error, " + getLabel(type) + " unsuccessfully deleted.");
					}
				}
			);
		}
	});
	span.append(button);
}

function loadLookupList(sortColumn, sortAsc){
	//progressBar(10);
	var type = $("#type").text().trim();
	var isPolicyType = (type == "policy_type") ? true : false;
	var newType = type;
	
	//CHANGE POLICY_TYPE TO COVERAGE_TYPE
	//THIS IS LABEL ONLY
	if(type == "policy_type"){
		newType = "coverage_type";
	}
	
	setNavigation(newType);
	$("title").text(getLabel(newType) + " List");
	
	var searchVal = $("#searchVal").val();
	
	sortColumn = typeof sortColumn !== 'undefined' ? sortColumn : "updated_date";
	//sortColumn = (sortColumn == null ? type.toLowerCase() + "_id" : sortColumn);
	//sortAsc = (sortAsc == null ? false : sortAsc);
	if(sortAsc == null){
		sortAsc = false;
		lookupJSAction();
	}
	
	var param = new Array();
	param.push(setPars("searchVal", searchVal));
	param.push(setPars("sortColumn", sortColumn));
	param.push(setPars("sortAsc", sortAsc));
	param.push(setPars("ssnid", readCookie("ssnid")));
	
	$.getJSON(  './pctracking/' + type + '/listForm' + toCamelCase(type, true) + '.do',
		param.join("&"),
  		function(jd) {
  			param = jd["params"];
			res = jd["response"];
			stat = jd["status"];
			
			div = document.getElementById("lookUpResults");
			removeChildElements(div);
			
			if (stat["code"] == 200) {	
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
					
								if(!isPolicyType){
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnHeader);
								}
								/*columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								columnHeaderText.appendChild(document.createTextNode(getLabel(type).toUpperCase()+" ID"));
								columnHeader.appendChild(columnHeaderText);
								if(sortColumn == type+"_id"){
									columnHeaderText2 = document.createElement("span");
									columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down"));
									columnHeaderText.appendChild(columnHeaderText2);
								}
								columnHeader.onclick = function(){
									sortAsc = (sortColumn == type+"_id") ? !sortAsc : true;
									sortColumn = type+"_id";
									loadLookupList(sortColumn, sortAsc);
								};*/
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-2 " + ((isPolicyType)? "" : "col-xs-offset-half"));
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm left-align");
								columnHeaderText.appendChild(document.createTextNode(getLabel(newType).toUpperCase()));
								columnHeader.appendChild(columnHeaderText);
								if(sortColumn == type){
									columnHeaderText2 = document.createElement("span");
									columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down"));
									columnHeaderText.appendChild(columnHeaderText2);
								}
								columnHeader.onclick = function(){
									sortAsc = (sortColumn == type) ? !sortAsc : true;
									sortColumn = type;
									loadLookupList(sortColumn, sortAsc);
								};
								
								if(isPolicyType){
									columnHeader = document.createElement("div");
									columnHeader.setAttribute("class","col-xs-2 ");
									rowDiv2.appendChild(columnHeader);
									columnHeaderText = document.createElement("p");
									columnHeaderText.setAttribute("class","well-sm");
									columnHeaderText.appendChild(document.createTextNode("LOB"));
									columnHeader.appendChild(columnHeaderText);
									if(sortColumn == "lob"){
										columnHeaderText2 = document.createElement("span");
										columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down"));
										columnHeaderText.appendChild(columnHeaderText2);
									}
									/*columnHeader.onclick = function(){
										sortAsc = (sortColumn == type) ? !sortAsc : true;
										sortColumn = type;
										loadLookupList(sortColumn, sortAsc);
									};*/
								}
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-2 " + ((isPolicyType)? "" : "col-xs-offset-quarter"));
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								columnHeaderText.appendChild(document.createTextNode("CREATED DATE"));
								columnHeader.appendChild(columnHeaderText);
								if(sortColumn == "create_date"){
									columnHeaderText2 = document.createElement("span");
									columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down"));
									columnHeaderText.appendChild(columnHeaderText2);
								}
								columnHeader.onclick = function(){
									sortAsc = (sortColumn == "create_date") ? !sortAsc : true;
									sortColumn = "create_date";
									loadLookupList(sortColumn, sortAsc);
								};
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-2");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								columnHeaderText.appendChild(document.createTextNode("CREATED BY"));
								columnHeader.appendChild(columnHeaderText);
								if(sortColumn == "create_by"){
									columnHeaderText2 = document.createElement("span");
									columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down"));
									columnHeaderText.appendChild(columnHeaderText2);
								}
								columnHeader.onclick = function(){
									sortAsc = (sortColumn == "create_by") ? !sortAsc : true;
									sortColumn = "create_by";
									loadLookupList(sortColumn, sortAsc);
								};
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-2 " + ((isPolicyType)? "" : "col-xs-push-quarter"));
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
									loadLookupList(sortColumn, sortAsc);
								};
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-2 " + ((isPolicyType)? "" : "col-xs-push-quarter"));
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
									loadLookupList(sortColumn, sortAsc);
								};
								
								if(!isPolicyType){
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnHeader);
								}
								
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
									//addButton.appendChild(document.createTextNode("Add New"));
									addButton.setAttribute("title","Add " + getLabel(newType));
									addButton.style.width = "63%";
									addButton.onclick = function(){
										//window.location = './add' + toCamelCase(type,true)+ '.do';
										window.location = './' + toCamelCase(type)+ 'Fields.do?page=add';
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
							window.location = './' + toCamelCase(type) + 'Fields.do?page=view&id=' + obj[type.toLowerCase() + "_id"];
						};
						rowDiv.appendChild(colDiv);
						
							rowDiv2 = document.createElement("div");
							rowDiv2.setAttribute("class","row");
							rowDiv2.style.minHeight = "25px";
							colDiv.appendChild(rowDiv2);
								
								if(!isPolicyType){
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnData);
								}
								/*columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(obj[type.toLowerCase()+"_id"]));
								columnData.appendChild(columnData2);*/
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-2 " + ((isPolicyType)? "" : "col-xs-offset-half"));
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm left-align");
								columnData2.appendChild(document.createTextNode(obj[type.toLowerCase()]));
								columnData.appendChild(columnData2);
								
								if(isPolicyType){
									var lobs = new Array();
									$.each(obj["lobs"], function(j, lob){
										lobs.push(lob["lob_id"]);
									});
									
									columnData = document.createElement("div");
									columnData.setAttribute("class","col-xs-2 " + ((isPolicyType)? "" : "col-xs-offset-half"));
									rowDiv2.appendChild(columnData);
									columnData2 = document.createElement("p");
									columnData2.setAttribute("class","well-sm");
									columnData2.appendChild(document.createTextNode((lobs && lobs.length > 0) ? lobs.join(", "): ""));
									columnData.appendChild(columnData2);
								}
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-2 " + ((isPolicyType)? "" : "col-xs-offset-quarter"));
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(format_oracle_date(obj["create_date"])));
								columnData.appendChild(columnData2);
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-2");
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(obj["create_by"]));
								columnData.appendChild(columnData2);
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-2 " + ((isPolicyType)? "" : "col-xs-push-quarter"));
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(format_oracle_date(obj["updated_date"])));
								columnData.appendChild(columnData2);
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-2 " + ((isPolicyType)? "" : "col-xs-push-quarter"));
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(obj["updated_by"]));
								columnData.appendChild(columnData2);
								
								if(!isPolicyType){
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnData);
								}
								
						colDiv = document.createElement("div");
						colDiv.setAttribute("class","col-lg-1");
						rowDiv.appendChild(colDiv);
							
							rowDiv2 = document.createElement("div");
							rowDiv2.setAttribute("class","row");
							colDiv.appendChild(rowDiv2);
							
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-12 btn-group btn-group-justified");
								rowDiv2.appendChild(columnData);
									
									addButton = document.createElement("button");
									addButton.setAttribute("type","button");
									addButton.setAttribute("class","btn btn-default-addNew btn-sm glyphicon glyphicon-pencil");
									addButton.setAttribute("title","Edit " + getLabel(newType));
					 				addButton.onclick = function (){
					 					window.location = './' + toCamelCase(type) + 'Fields.do?page=edit&id=' + obj[type.toLowerCase()+"_id"];
					 				};
		 							columnData.appendChild(addButton);
		 							
		 							addButton = document.createElement("button");
									addButton.setAttribute("type","button");
									addButton.setAttribute("class","btn btn-default-addNew btn-sm glyphicon glyphicon-trash");
									addButton.setAttribute("title","Delete " + getLabel(newType));
					 				addButton.onclick = function (){
					 					var answer = confirm("Are you sure want to delete this " + getLabel(newType) +"?");
										
										if(answer){
						 					var param = new Array();
						 					param.push(setPars(type + "_id", obj[type.toLowerCase()+"_id"]));
						 					param.push(setPars("ssnid", readCookie("ssnid")));
						 					$.getJSON(  './pctracking/' + type + '/deleteForm' + toCamelCase( type, true) + '.do', 
						 						param.join("&"),
						 						function(json) {
						 							var s = json["status"];
						 							if (s["code"] == 200) {
						 								createAlert("success", getLabel(newType) + " successfully deleted.");
						 								//window.location = './edit' + toCamelCase( type, true) + '.do?id=' + res["form"][type + "_id"] + '&jsAction=' + jsAction;
						 								loadLookupList(sortColumn, sortAsc);
						 								
						 							}else if(s["code"] == 406){
						 								createAlert("danger", s["message"]);
						 							}else{
						 								createAlert("danger", "Error, " + getLabel(newType) + " unsuccessfully deleted.");
						 							}
						 						}
						 					);
										}
					 				};
						 			
					 				columnData.appendChild(addButton);
						});
				
			}else{
				removeChildElements(div);
				
				rowDiv = document.createElement("div");
				rowDiv.appendChild(document.createTextNode("No Data Available"));
				div.appendChild(rowDiv);
			}
  			
  		}else if(stat["code"] == 204){
  			createAlert("info", "No Data Available");
		}else{
			createAlert("danger", "Error fetching data.");
		}
		//progressBar(100);
		//prompt("",div.innerHTML); //getHTML generated code
 	});
}

function loadAddLookup(){
	var type = $("#type").text().trim();
	var newType = type;
	
	//CHANGE POLICY_TYPE TO COVERAGE_TYPE
	//THIS IS LABEL ONLY
	if(type == "policy_type"){
		newType = "coverage_type";
	}
	
	if(type == "policy_type"){
		$("#hidden_LOB").show();
		$( ".selectpicker" ).selectpicker();

		createDropDownOptions("lookup_LOB");
	}
	
	$("#lookupCancel").click(function(){
		window.location = './load' + toCamelCase(type, true)+ '.do';
	});
	
	$("#lookupSave").click(function(){
		var proceed = true;
		var errorMessage = "";
		var description = $("#lookupDescription").val();
		var param = new Array();
		param.push(setPars(type,description));
		param.push(setPars("ssnid", readCookie("ssnid")));
		if(description.length < 1){
			proceed = false;
			errorMessage  = "Please enter " + getLabel(newType) + ".";
		}else if(type == "policy_type"){
			var lob = $("#lookup_LOB").val();
			if(lob && lob.length > 0){
				param.push(setPars("lob", lob));
			}else{
				proceed = false;
				errorMessage  = "Please select LOB.";
			}
		}
		if(proceed){
			$.getJSON(  './pctracking/' + type + '/createForm' + toCamelCase( type, true) + '.do', 
				param.join("&"),
				function(jd) {
					var res = jd["response"];
					var stat = jd["status"];
					var jsAction = "create";
					if (stat["code"] == 200) {
						//createAlert("success", getLabel(type) + " Successfully Created.");
						//window.location = './view' + toCamelCase( type, true) + '.do?id=' + res["form"][type + "_id"] + '&jsAction=' + jsAction;
						window.location = './' + toCamelCase(type) + 'Fields.do?page=view&id=' + res["form"][type + "_id"] + '&jsAction=' + jsAction;
					}else if (stat["code"] == 406) {
						createAlert("danger", stat["message"]);
					}else{
						createAlert("danger", "Error, " + getLabel(newType) + " unsuccessfully created.");
					}
				}
			);
		}else{
			createAlert("danger", errorMessage);
		}
	});
}

function loadSeachbar(){
	var type = $("#type").text().trim();
	
	//CHANGE POLICY_TYPE TO COVERAGE_TYPE
	//THIS IS LABEL ONLY STILL
	if(type == "policy_type"){
		type = "coverage_type";
	}
	$("#searchLabel").text("Search " + getLabel(type));
}

function processLookupData(disable){
	var type = $("#type").text().trim();
	var newType = type;
	
	//CHANGE POLICY_TYPE TO COVERAGE_TYPE
	//THIS IS LABEL ONLY
	if(type == "policy_type"){
		newType = "coverage_type";
	}
	$("title").text("Edit " + getLabel(newType));
	$("#lookupHeader").text("Edit " + getLabel(newType) + " Page");
	$("#lookupLabel").text(getLabel(newType));
	var id = getUrlVars()["id"];
	
	if(type == "policy_type"){
		$("#hidden_LOB").show();
		$( ".selectpicker" ).selectpicker();
		createDropDownOptions("lookup_LOB");
		if(disable){
			$("#lookup_LOB").attr("disabled","disabled");
			//alert("disable");
			/*btn = $("button[data-id='lookup_LOB']");
			
			btn.unbind("click");
			/*btn.click(function(){
				alert("test1");
				//tooltip.ajax(this, this.val());
				//return true;
			});*/
		}
		//progressBar(50);
	}else{
		//progressBar(100);
	}
	
	var param = new Array();
	param.push(setPars(type + "_id", id));
	param.push(setPars("ssnid", readCookie("ssnid")));
	$.getJSON(  './pctracking/' + type + '/getForm' + toCamelCase( type, true) + '.do', 
		param.join("&"),
  		function(jd) {
  			param = jd["params"];
			res = jd["response"];
			stat = jd["status"];
			if (stat["code"] == 200) {
				$.each(res["form"], function(key, val){
					if(key == type){
						$("#lookupDescription").val(val);
						if(disable){
							$("#lookupDescription").attr("disabled","disabled");
						}
					}
				});
			}
		}
	);
	
	$("#lookupCancel").click(function(){
		//window.location = './load' + toCamelCase(type, true)+ '.do';
		window.location = './' + toCamelCase(type) + 'Fields.do?page=view&id=' + id;
	});
	
	var save = $("#lookupSave");
	save.text("Update");
	save.click(function(){
		var proceed = true;
		var errorMessage = "";
		var description = $("#lookupDescription").val();
		var param = new Array();
		param.push(setPars(type + "_id", id));
		param.push(setPars(type,description));
		param.push(setPars("ssnid", readCookie("ssnid")));
		if(description.length < 1){
			proceed = false;
			errorMessage  = "Please enter " + getLabel(newType) + ".";
		}else if(type == "policy_type"){
			var lob = $("#lookup_LOB").val();
			if(lob && lob.length > 0){
				param.push(setPars("lob", lob));
			}else{
				proceed = false;
			}
		}
		if(proceed){
			$.getJSON(  './pctracking/' + type + '/updateForm' + toCamelCase( type, true) + '.do', 
				param.join("&"),
				function(jd) {
		  			param = jd["params"];
					res = jd["response"];
					stat = jd["status"];
					if (stat["code"] == 200) {
						window.location = './' + toCamelCase(type) + 'Fields.do?page=view&jsAction=edit&id=' + id;
					}else if (stat["code"] == 406) {
						createAlert("danger", stat["message"]);
					}else{
						createAlert("danger", "Error, " + getLabel(newType) + " unsuccessfully updated.");
					}
				}
			);
		}else{
			createAlert("danger", errorMessage);
		}
	});
	
}

function getPolicyLOB(id){
	var param = new Array();
	param.push(setPars("policy_type_id", id));
	param.push(setPars("ssnid", readCookie("ssnid")));
	$.getJSON(  './pctracking/policy_type/getPolicyLOB.do', 
			param.join("&"),
  		function(jd) {
  			param = jd["params"];
			res = jd["response"];
			stat = jd["status"];
			if (stat["code"] == 200) {
				
				dropDown = $("#lookup_LOB");
				$(dropDown).selectpicker('val',res["forms"]);
				$(dropDown).selectpicker('refresh');
				
				btn = $("button[data-id='lookup_LOB']");
				btn.attr("title", btn.attr("title").replace(/&nbsp;/g,''));
				btn.attr("title", btn.attr("title").replace(/&amp;/g,'&'));
			}
		}
	);
}


function lookupJSAction(){
	var jsAction = getUrlVars()["jsAction"];
	var type = $("#type").text().trim();
	
	//CHANGE POLICY_TYPE TO COVERAGE_TYPE
	//THIS IS LABEL ONLY
	if(type == "policy_type"){
		type = "coverage_type";
	}
	if(jsAction == "create"){
		createAlert("success", getLabel(type) + " successfully created.");
	}else if(jsAction == "delete"){
		createAlert("success", getLabel(type) + " successfully deleted.");
	}else if(jsAction == "edit"){
		createAlert("success", getLabel(type) + " successfully updated.");
	}
}

//for type of policy only (LOB)
function createDropDownOptions(id){
	var dropDown = $("#" + id);
	var policy_type_id = getUrlVars()["id"];
	if(dropDown){
		var param = new Array();
		param.push(setPars("ssnid", readCookie("ssnid")));
		if(policy_type_id){
			param.push(setPars("policy_type_id", policy_type_id));
		}
		$.getJSON(  './pctracking/policy_type/getLOBList.do',
			param.join("&"),
		  	function(jd) {
				res = jd["response"];
				if (res["forms"].length > 0) {
					
					var opt = $("<option></option>");
					opt.attr('value', 0);
					opt.append("None");
					dropDown.append(opt);
					
					$.each(res["forms"], function(i, obj){
						var opt = $("<option></option>");
						opt.attr('value', obj["lob_id"]);
						opt.append(insertNBSP(obj["lob_id"], 3) + obj["lob_id"] + " : " + obj["lob"]);
						dropDown.append(opt);
					});
					$(dropDown).selectpicker('refresh');
				}

				if(policy_type_id){
					getPolicyLOB(policy_type_id);
				}
				//progressBar(100);
			}
		);
	}
	
	//reset selection
	$(dropDown).change(function(){
		var selected = $("#" + id + " option:selected").val();
		if(selected == 0){
			$(dropDown).selectpicker('val',[]);
			$(dropDown).selectpicker('refresh');
		}
		
		btn = $("button[data-id='"+id+"']");
		btn.attr("title", btn.attr("title").replace(/&nbsp;/g,''));
		btn.attr("title", btn.attr("title").replace(/&amp;/g,'&'));
	});
}
