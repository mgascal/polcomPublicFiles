var flag = new Array();
function loadFormFields(){

	var body = $("#body");
	var loading = $("#loading");
	
	body.hide();
	loading.show();
	
	
	var page = getUrlVars()["page"];
	
	$(".pageHeader").text(toCamelCase(page, true) + " Form Page");
	$("#title").text(toCamelCase(page, true) + " Form");
	setNavigation('forms_tracking');
	
	if(page == "add"){
		$(".forEndorsement").hide();
		
		flag = new Array(false, false, false, false, false);
		processFormsDropdowns(flag);
		
		var submit = $("#form_submit");
		submit.text("Save");
		submit.click(function(){
			createForm();
		});
		
		var cancel = $("#form_cancel");
		cancel.click(function(){
			window.location = './loadFormsTracking.do';
		});
		
	}else if(page == "view"){
		
		flag = new Array(false, false, false, false, false);
		flag.push(false); //forms fields values
		flag.push(false); //proprietary values;
		
		//isJsAction();
		createToolbar();
		processFormsDropdowns(flag);
		//processData(true);
		$(".pageButtons").hide();
		
	}else if(page == "edit"){
		flag = new Array(false, false, false, false, false);
		flag.push(false); //forms fields values
		flag.push(false); //proprietary values
		flag.push(false); //lock form
		
		processFormsDropdowns(flag);
		/*processData();
		lockForm();*/
		//isJsAction();

		var id = getUrlVars()["id"];
		
		var submit = $("#form_submit");
		submit.text("Update");
		submit.click(function(){
			updateForm();
			//window.location = './formFields.do?page=view&jsAction=edit&id=' + id;
		});
		
		var cancel = $("#form_cancel");
		cancel.click(function(){
			window.location = './loadFormsTracking.do';
			window.location = './formFields.do?page=view&id=' + id;
		});
		
	}else if(page == "clone"){
		flag = new Array(false, false, false, false, false);
		flag.push(false); //forms fields values
		flag.push(false); //proprietary values
		processFormsDropdowns(flag);
		//processData();
		
		var submit = $("#form_submit");
		submit.text("Save");
		submit.click(function(){
			createForm(true);
		});
		
		var id = getUrlVars()["id"];
		var cancel = $("#form_cancel");
		cancel.click(function(){
			window.location = './formFields.do?page=view&id=' + id;
		});
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
		window.location = './loadFormsTracking.do';
	});
	span.append(button);
	
	var button = $("<button></button>");
	button.attr("type","button");
	button.attr("title", "Add Form");
	button.attr("class","btn btn-default-addNew btn glyphicon glyphicon-plus-sign");
	button.click(function(){
		window.location = './formFields.do?page=add';
	});
	span.append(button);
	
	var button = $("<button></button>");
	button.attr("type","button");
	button.attr("title", "Edit Form");
	button.attr("class","btn btn-default-addNew btn glyphicon glyphicon-pencil");
	button.click(function(){
		var id = getUrlVars()["id"];
		gotoEditForm(id, true);
	});
	span.append(button);
	
	var button = $("<button></button>");
	button.attr("type","button");
	button.attr("title", "Clone Form");
	button.attr("class","btn btn-default-addNew btn glyphicon glyphicon-import");
	button.click(function(){
		var id = getUrlVars()["id"];
		
		$.getJSON( './pctracking/form/isLockedForm.do',
			{
				ssnid 		: readCookie("ssnid"),
				user_id		: readCookie("user_id"), 
				ksq_seq_no	: id
			},
			function(data) {
				locked = true;
				user = "";
				s = data["status"];
				r = data["response"];
				if (s["code"] == 200) {
					if(r["forms"].length < 1){
						locked = false;
					}else{
						user = r["forms"][0].firstName + " " + r["forms"][0].lastName;
					}
				}else{
					locked = false;
				}
				//alert(locked + "\n" + user);
				if(locked){
					createAlert("danger", "Form is currently locked by " + user + ".");
				}else{
					var answer = confirm("Are you sure want to clone this form?");
					if(answer){
						window.location = './formFields.do?page=clone&id='+id;
					}
					
					
				}
			}
		);
		
		
	});
	span.append(button);
	
	var button = $("<button></button>");
	button.attr("type","button");
	button.attr("title", "Delete Form");
	button.attr("class","btn btn-default-addNew btn glyphicon glyphicon-trash");
	button.click(function(){
		var id = getUrlVars()["id"];
		
		$.getJSON( './pctracking/form/isLockedForm.do',
			{
				ssnid 		: readCookie("ssnid"),
				user_id		: readCookie("user_id"), 
				ksq_seq_no	: id
			},
			function(data) {
				locked = true;
				user = "";
				s = data["status"];
				r = data["response"];
				if (s["code"] == 200) {
					if(r["forms"].length < 1){
						locked = false;
					}else{
						user = r["forms"][0].firstName + " " + r["forms"][0].lastName;
					}
				}else{
					locked = false;
				}
				//alert(locked + "\n" + user);
				if(locked){
					createAlert("danger", "Form is currently locked by " + user + ".");
				}else{
					var answer = confirm("Are you sure want to delete this form?");
					if(answer){
						$.getJSON( './pctracking/form/deleteForm.do',
							{
								ssnid 		: readCookie("ssnid"), 
								ksq_seq_no	: id
							},
						  	function(json) {
								var st = json["status"];
								if (st["code"] == 200) {
									/*createAlert("success", "Form Successfully deleted.");
									loadSearchForms(sortColumn, sortAsc);*/
									window.location = './loadFormsTracking.do?jsAction=delete';
								}else{
									window.location = './loadFormsTracking.do?jsAction=deleteNULL';
								}
							}
						);
					}
				}
			}
		);
		
		//window.location = './formFields.do?page=edit&id='+id;
	});
	span.append(button);
}

function gotoEditForm(id, toolbar){
	$.getJSON( './pctracking/form/isLockedForm.do',
		{
			ssnid 		: readCookie("ssnid"),
			user_id		: readCookie("user_id"), 
			ksq_seq_no	: id
		},
		function(data) {
			locked = true;
			user = "";
			s = data["status"];
			r = data["response"];
			if (s["code"] == 200) {
				if(r["forms"].length < 1){
					locked = false;
				}else{
					user = r["forms"][0].firstName + " " + r["forms"][0].lastName;
				}
			}else{
				locked = false;
			}
			
			if(!locked){
				if(toolbar){
					window.location = './formFields.do?page=edit&id='+id;
				}else{
					window.open('./formFields.do?page=edit&id='+id);
				}				
			}else{
				createAlert("danger", "Form is currently locked by " + user + ".");
			}
		}
	);
}

function checkProgressFieldPage(dropdown){
	var percent = 0;
	var percentage = 0;
	var max = 5;
	if(!dropdown){
		max = flag.length;
	}
	
	if(flag && flag.length >= 5){
		for(var i=0; i<max; i++){
			if(flag[i]){
				percent++;
			}
		}
		percentage = (percent)/(flag.length)*100;
	}
	console.log("Loading percentage : " + percentage);
	progressBar(percentage);
	
	if(dropdown && percent >= 5 ){
		processData();
	}
}

function loadSearchForms(sortColumn, sortAsc, page){
	//progressBar(10);
	var searchVal = $("#searchVal").val();
	var searchOpt = $("#srch_dd_label").text().replace(/ /g, "_");
	
	searchOpt = searchOpt.toLowerCase();
	if(searchOpt == "type_of_coverage"){
		searchOpt = "type_of_policy";
	}
	page = (page == null)? 1 : page;
	//sortColumn = (sortColumn == null ? "form_id" : sortColumn);
	sortColumn = typeof sortColumn !== 'undefined' ? sortColumn : "updated_date";
	//sortAsc = (sortAsc == null ? false : sortAsc);
	if(sortAsc == null){
		sortAsc = false;
		isJsAction();
	}else if(typeof sortAsc === 'string'){
		sortAsc = (sortAsc == "true" ? true : false);
	}
	
	/*if(searchOpt.indexOf("date") >= 0){
		searchVal = $("#searchValDate").val();
	}*/
	
	$.getJSON( './pctracking/form/searchForms.do',
		{ssnid : readCookie("ssnid"), searchOpt : searchOpt, searchVal: searchVal, sortColumn: sortColumn, sortAsc: sortAsc, page : page, per_page: 50},
  		function(jd) {
  			param = jd["params"];
			res = jd["response"];
			stat = jd["status"];
			div = document.getElementById("resultDiv");
			if (stat["code"] == 200) {
				removeChildElements(div);
				//$("#notice").html("");
				
					rowDiv = document.createElement("div");
					rowDiv.setAttribute("class","row");
					div.appendChild(rowDiv);
					
						colDiv = document.createElement("div");
						colDiv.setAttribute("class","col-lg-11 tableHeader");
						colDiv.setAttribute("style","border-top: 1px solid #0076EB; border-right: 1px solid #0076EB; border-left: 1px solid #0076EB; border-top-left-radius: 6px; border-top-right-radius: 6px; border-bottom: 1px solid #0076EB;");
						rowDiv.appendChild(colDiv);
						
							rowDiv2 = document.createElement("div");
							rowDiv2.setAttribute("class","row");
							colDiv.appendChild(rowDiv2);
					
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnHeader);
								
								panel = document.createElement("span");
								panel.setAttribute("class", "dueAlertPanel");
								panel.style.paddingLeft ="8px";
								pushPin = document.createElement("span");
								pushPin.style.color="red";
								pushPin.style.paddingLeft ="4px";
								$(pushPin).append("<span class='glyphicon glyphicon-bell'></span>");
								panel.appendChild(pushPin);
								
								panel.onclick = function(){
									sortAsc = false;
									sortColumn = "due_date";
									loadSearchForms(sortColumn, sortAsc);
								};
								
								columnHeader.appendChild(panel);
								
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								if(sortColumn == "form_id"){
									columnHeaderText2 = document.createElement("span");
									columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down") + " pull-right");
									columnHeaderText.appendChild(columnHeaderText2);
								}
								columnHeaderText.appendChild(document.createTextNode("FORM ID"));
								columnHeader.appendChild(columnHeaderText);
								
								
								columnHeaderText.onclick = function(){
									sortAsc = (sortColumn == "form_id") ? !sortAsc : false;
									sortColumn = "form_id";
									loadSearchForms(sortColumn, sortAsc);
								};
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								if(sortColumn == "revised_item_no"){
									columnHeaderText2 = document.createElement("span");
									columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down") + " pull-right");
									columnHeaderText.appendChild(columnHeaderText2);
								}
								columnHeaderText.appendChild(document.createTextNode("REVISED ITEM NO"));
								columnHeader.appendChild(columnHeaderText);
								
								
								
								columnHeader.onclick = function(){
									sortAsc = (sortColumn == "revised_item_no") ? !sortAsc : false;
									sortColumn = "revised_item_no";
									loadSearchForms(sortColumn, sortAsc);
								};
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								columnHeaderText.appendChild(document.createTextNode("STATUS"));
								columnHeader.appendChild(columnHeaderText);

								if(sortColumn == "status"){
									columnHeaderText2 = document.createElement("span");
									columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down"));
									columnHeaderText.appendChild(columnHeaderText2);
								}
								
								columnHeader.onclick = function(){
									sortAsc = (sortColumn == "status") ? !sortAsc : false;
									sortColumn = "status";
									loadSearchForms(sortColumn, sortAsc);
								};
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-2");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								columnHeaderText.appendChild(document.createTextNode("POLICY NAME"));
								columnHeader.appendChild(columnHeaderText);
								if(sortColumn == "policy_name"){
									columnHeaderText2 = document.createElement("span");
									columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down"));
									columnHeaderText.appendChild(columnHeaderText2);
								}
								
								
								columnHeader.onclick = function(){
									sortAsc = (sortColumn == "policy_name") ? !sortAsc : false;
									sortColumn = "policy_name";
									loadSearchForms(sortColumn, sortAsc);
								};
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-1");
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
								
								columnHeader.onclick = function(){
									sortAsc = (sortColumn == "lob") ? !sortAsc : false;
									sortColumn = "lob";
									loadSearchForms(sortColumn, sortAsc);
								};
								
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								if(sortColumn == "type_of_document"){
									columnHeaderText2 = document.createElement("span");
									columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down") + " pull-right");
									columnHeaderText.appendChild(columnHeaderText2);
								}
								columnHeaderText.appendChild(document.createTextNode("TYPE OF DOCUMENT"));
								columnHeader.appendChild(columnHeaderText);
								
								
								columnHeader.onclick = function(){
									sortAsc = (sortColumn == "type_of_document") ? !sortAsc : false;
									sortColumn = "type_of_document";
									loadSearchForms(sortColumn, sortAsc);
								};
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								if(sortColumn == "type_of_policy"){
									columnHeaderText2 = document.createElement("span");
									columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down") + " pull-right");
									columnHeaderText.appendChild(columnHeaderText2);
								}
								columnHeaderText.appendChild(document.createTextNode("TYPE OF COVERAGE"));
								columnHeader.appendChild(columnHeaderText);
								
								
								columnHeader.onclick = function(){
									sortAsc = (sortColumn == "type_of_policy") ? !sortAsc : false;
									sortColumn = "type_of_policy";
									loadSearchForms(sortColumn, sortAsc);
								};
								
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								if(sortColumn == "mapping_completed"){
									columnHeaderText2 = document.createElement("span");
									columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down") + " pull-right");
									columnHeaderText.appendChild(columnHeaderText2);
								}
								columnHeaderText.appendChild(document.createTextNode("MAPPING COMPLETED"));
								columnHeader.appendChild(columnHeaderText);
								
								
								columnHeader.onclick = function(){
									sortAsc = (sortColumn == "mapping_completed") ? !sortAsc : false;
									sortColumn = "mapping_completed";
									loadSearchForms(sortColumn, sortAsc);
								};
								
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								if(sortColumn == "parsing_completed"){
									columnHeaderText2 = document.createElement("span");
									columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down") + " pull-right");
									columnHeaderText.appendChild(columnHeaderText2);
								}
								columnHeaderText.appendChild(document.createTextNode("PARSING COMPLETED"));
								columnHeader.appendChild(columnHeaderText);
								
								
								columnHeader.onclick = function(){
									sortAsc = (sortColumn == "parsing_completed") ? !sortAsc : false;
									sortColumn = "parsing_completed";
									loadSearchForms(sortColumn, sortAsc);
								};
								
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								if(sortColumn == "loaded"){
									columnHeaderText2 = document.createElement("span");
									columnHeaderText2.setAttribute("class", ((sortAsc) ? "glyphicon glyphicon-arrow-up" : "glyphicon glyphicon-arrow-down") + " pull-right");
									columnHeaderText.appendChild(columnHeaderText2);
								}
								columnHeaderText.appendChild(document.createTextNode("LOADED"));
								columnHeader.appendChild(columnHeaderText);
								
								
								columnHeader.onclick = function(){
									sortAsc = (sortColumn == "loaded") ? !sortAsc : false;
									sortColumn = "loaded";
									loadSearchForms(sortColumn, sortAsc);
								};
								
								
						colDiv = document.createElement("div");
						colDiv.setAttribute("class","col-lg-1");
						rowDiv.appendChild(colDiv);
							
							rowDiv2 = document.createElement("div");
							rowDiv2.setAttribute("class","row");
							colDiv.appendChild(rowDiv2);
								
								//<div class="col-md-2"><p><button type="button" class="btn btn-default btn-sm">Add New</button></p></div>
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-12");
								rowDiv2.appendChild(columnHeader);
								
									addButton = document.createElement("a");
									//addButton.setAttribute("type","button");
									addButton.setAttribute("href","./formFields.do?page=add");
									addButton.setAttribute("class","btn btn-default-addNew btn glyphicon glyphicon-plus-sign");
									addButton.setAttribute("title","Add Form");
									addButton.style.width = "95%";
									//addButton.appendChild(document.createTextNode("Add New"));
									/*addButton.onclick = function(){
										window.location = './formFields.do?page=add';
									};*/
									columnHeader.appendChild(addButton);
				
				
				if (res.forms.length > 0) {
					gray = true;
					
					var per_page = 50; //set max items per page
					var max_page = Math.ceil(res.total_count/per_page);
					createPagination(page, max_page, "loadSearchForms", new Array(sortColumn, sortAsc));
					
					var start = (page - 1) * per_page;
					var end = start + per_page;
					var len = res.forms.length;
					$.each(res.forms, function(i, obj){
					rowDiv = document.createElement("div");
					rowDiv.setAttribute("class","row");
					div.appendChild(rowDiv);
					
						colDiv = document.createElement("div");
						gray = !gray;
						if(nullToString(obj["status"]).toLowerCase().indexOf("rush") >= 0){
							colDiv.setAttribute("class","col-lg-11 tableRow rowRush" + ((gray) ? " rowGray" : " rowWhite"));
						}else{
							colDiv.setAttribute("class","col-lg-11 tableRow" + ((gray) ? " rowGray" : " rowWhite"));
						}
						colDiv.setAttribute("style","border-right: 1px solid #0076EB; border-left: 1px solid #0076EB;");

						//if(i==per_page - 1 || (((page - 1) * per_page) + (i + 1)) == len){
						if(i==res.forms.length -1){
							colDiv.setAttribute("style","border-right: 1px solid #0076EB; border-left: 1px solid #0076EB;border-bottom: 1px solid #0076EB; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px;");
						}
						colDiv.ondblclick = function(){
							//window.location = '/forms/' + obj["ksq_seq_no"] + '/edit?searchValue=' + $('#srch_dd_label').text()
							//window.location = './formFields.do?page=view&id='+ obj["ksq_seq_no"];
							window.open('./formFields.do?page=view&id='+ obj["ksq_seq_no"]);
						};
						
						rowDiv.appendChild(colDiv);
						
							rowDiv2 = document.createElement("div");
							rowDiv2.setAttribute("class","row");
							rowDiv2.style.minHeight = "35px";
							colDiv.appendChild(rowDiv2);
					
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-1 col-xs-push-quarter");
								rowDiv2.appendChild(columnData);

								/*pushPin = document.createElement("span");
								pushPin.setAttribute("class", "glyphicon glyphicon-pushpin");
								if(!obj["alertDue"]){
									pushPin.style.visibility = "hidden"; 
								}								
								pushPin.style.color="red";
								pushPin.style.paddingLeft = "2px";
								pushPin.style.width = "10px";*/
								panel = document.createElement("span");
								panel.setAttribute("class", "dueAlertPanel");
								pushPin = document.createElement("span");
								pushPin.style.color="red";
								pushPin.style.paddingLeft ="4px";
								panel.appendChild(pushPin);
								
								//var days = (obj["days_due"] != null) ? obj["days_due"] : -1;
								var days = obj["days_due"];
								if(days > 0 && nullToString(obj["status"]).toLowerCase() != 'loaded'){
									pushPin.setAttribute("title", days + " day" + ((days > 1) ? "s" : "") + " left");
									$(pushPin).append("<span class='glyphicon glyphicon-bell'></span>");
								}else if(days == 0 && nullToString(obj["status"]).toLowerCase() != 'loaded'){
									pushPin.setAttribute("title", "Due TODAY!");
									$(pushPin).append("<span class='glyphicon glyphicon-bell blink'></span>");
									//pushPin.appendChild(document.createTextNode("!"));
								}else if(days < 0 && nullToString(obj["status"]).toLowerCase() != 'loaded'){
										pushPin.setAttribute("title", days + " day" + ((Math.abs(days) > 1) ? "s" : ""));
										pushPin.style.color="black";
										$(pushPin).append("<span class='glyphicon glyphicon-bell'></span>");
								}else{
									pushPin.style.visibility = "hidden";
									pushPin.appendChild(document.createTextNode(""));
								}
								
								columnData.appendChild(panel);
								
								columnData2 = document.createElement("span");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(nullToString(obj["form_id"])));
								columnData.appendChild(columnData2);
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(nullToString(obj["revised_item_no"])));
								columnData.appendChild(columnData2);
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(nullToString(obj["status"])));
								//columnData2.appendChild(document.createTextNode(getLookupDesc("status", obj["status"])));
								//getLookupDesc(columnData2, "status", obj["status"]);
								columnData.appendChild(columnData2);
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-2");
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								//columnData2.style.width = "100px";
								columnData2.style.overflow = "hidden";
								columnData2.style.whiteSpace = "nowrap";
								columnData2.style.textOverflow = "ellipsis";
								
								var policy_name = nullToString(obj["policy_name"]);
								/*if(policy_name.length > 25){
									columnData2.setAttribute("title",policy_name);
									policy_name = policy_name.substring(0, 25) + " ...";
								}*/
								columnData2.setAttribute("title",policy_name);
								columnData2.style.textAlign = "left";
								columnData2.appendChild(document.createTextNode(policy_name));
								columnData.appendChild(columnData2);
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(nullToString(obj["lob"])));
								columnData.appendChild(columnData2);
								
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(nullToString(obj["type_of_document"])));
								//getLookupDesc(columnData2, "document_type", obj["type_of_document"]);
								columnData.appendChild(columnData2);
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(nullToString(obj["type_of_policy"])));
								//getLookupDesc(columnData2, "policy_type", obj["type_of_policy"]);
								columnData.appendChild(columnData2);
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(nullToString(format_oracle_date(obj["mapping_completed"]))));
								columnData.appendChild(columnData2);
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(nullToString(format_oracle_date(obj["parsing_completed"]))));
								columnData.appendChild(columnData2);
								
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnData);
								columnData2 = document.createElement("p");
								columnData2.setAttribute("class","well-sm");
								columnData2.appendChild(document.createTextNode(nullToString(format_oracle_date(obj["loaded"]))));
								columnData.appendChild(columnData2);
								
						colDiv = document.createElement("div");
						colDiv.setAttribute("class","col-lg-1");
						rowDiv.appendChild(colDiv);
							
							rowDiv2 = document.createElement("div");
							rowDiv2.setAttribute("class","row");
							colDiv.appendChild(rowDiv2);
							
								columnData = document.createElement("div");
								columnData.setAttribute("class","col-xs-12 btn-group btn-group-justified center-block");
								rowDiv2.appendChild(columnData);
								
									// edit button
									addButton = document.createElement("button");
									addButton.setAttribute("type","button");
									addButton.setAttribute("class","btn btn-default-addNew btn-sm glyphicon glyphicon-pencil");
									addButton.setAttribute("title","Edit Form");
									addButton.onclick = function(){
										//window.location = './formFields.do?page=edit&id='+ obj["ksq_seq_no"];
										gotoEditForm(obj["ksq_seq_no"]);
									};
									columnData.appendChild(addButton);
									
									//clone button
									addButton = document.createElement("button");
									addButton.setAttribute("type","button");
									addButton.setAttribute("class","btn btn-default-addNew btn-sm glyphicon glyphicon-import");
									addButton.setAttribute("title","Clone Form");
									addButton.onclick = function(){
										/*var answer = confirm("Are you sure want to clone this form?");
										
										if(answer){
											window.location = './formFields.do?page=clone&id='+ obj["ksq_seq_no"];
										}*/
										$.getJSON( './pctracking/form/isLockedForm.do',
												{
													ssnid 		: readCookie("ssnid"),
													user_id		: readCookie("user_id"), 
													ksq_seq_no	: obj["ksq_seq_no"]
												},
												function(data) {
													locked = true;
													user = "";
													s = data["status"];
													r = data["response"];
													if (s["code"] == 200) {
														if(r["forms"].length < 1){
															locked = false;
														}else{
															user = r["forms"][0].firstName + " " + r["forms"][0].lastName;
														}
													}else{
														locked = false;
													}
													
													if(!locked){														
														var answer = confirm("Are you sure want to clone this form?");
														
														if(answer){
															//window.location = './formFields.do?page=clone&id='+ obj["ksq_seq_no"];
															window.open('./formFields.do?page=clone&id='+ obj["ksq_seq_no"]);
														}
													}else{
														//window.scrollTo(0,0);
														createAlert("danger", "Form is currently locked by " + user + ".");
													}
												}
											);
									};
									columnData.appendChild(addButton);	
									
									
									//delete button
									addButton = document.createElement("button");
					 				addButton.setAttribute("class","btn btn-default-addNew btn-sm glyphicon glyphicon-trash");
					 				addButton.setAttribute("title","Delete Form");
					 				addButton.onclick = function (){
										
										
										$.getJSON( './pctracking/form/isLockedForm.do',
											{
												ssnid 		: readCookie("ssnid"),
												user_id		: readCookie("user_id"), 
												ksq_seq_no	: obj["ksq_seq_no"]
											},
											function(data) {
												locked = true;
												user = "";
												s = data["status"];
												r = data["response"];
												if (s["code"] == 200) {
													if(r["forms"].length < 1){
														locked = false;
													}else{
														user = r["forms"][0].firstName + " " + r["forms"][0].lastName;
													}
												}else{
													locked = false;
												}
												
												if(!locked){
													var answer = confirm("Are you sure want to delete this form?");
													
													if(answer){
														$.getJSON( './pctracking/form/deleteForm.do',
															{
																ssnid 		: readCookie("ssnid"), 
																ksq_seq_no	: obj["ksq_seq_no"]
															},
														  	function(json) {
																var st = json["status"];
																if (st["code"] == 200) {
																	createAlert("success", "Form successfully deleted.");
																	loadSearchForms(sortColumn, sortAsc, page);
																}else{
																	loadSearchForms(sortColumn, sortAsc, page);
																	//createAlert("danger", "Error, form unsuccessfully deleted.");
																	createAlert("danger", "Form has already been deleted.");
																}
															}
														);
													}
												}else{
													//window.scrollTo(0,0);
													createAlert("danger", "Form is currently locked by " + user + ".");
												}
											}
										);
									};
		 							columnData.appendChild(addButton);
		 							
		 				//var percent = i/(end - start - 1)*100;
		 				//progressBar(percent);
					});
				}else{
					$("#pagination").html("");
					removeChildElements(div);
					/*rowDiv = document.createElement("div");
					rowDiv.appendChild(document.createTextNode("No Data Available"));
					div.appendChild(rowDiv);*/

					createAlert("info", "No Data Available.");
					div.style.display="none";
					//progressBar(100);
				}
			}else if(stat["code"] == 204){
				$(".paging").parent().hide();
				removeChildElements(div);
				createAlert("info", "No Data Available.");
				//progressBar(100);
			}else{
				JSONerror(stat["code"]);
			}
  		}
  	);
	
}

function processFormsDropdowns(flag){
	$( ".datepicker" ).datepicker({ dateFormat: "mm/dd/yy"});
	$( ".selectpicker" ).selectpicker();
	
	createDropDownOptions("form_STATUS", "status", 0);
	createDropDownOptions("form_TYPE_OF_POLICY", "policy_type", 1);
	createDropDownOptions("form_TYPE_OF_DOCUMENT", "document_type", 2);
	createDropDownOptions("form_TYPE_OF_SUBMISSION", "submission_type",3);
	createLOBDropDownOptions(4); //LOB dropdown
	createProprietaryDropDownOptions();
	
	$("#form_TYPE_OF_DOCUMENT").change(function(){
			showRelatedPolicy("TYPE_OF_DOCUMENT");
		}
	);
}

function createDropDownOptions(id, type, index){
	var dd_status = $("#" + id);
	if(dd_status){
		var param = new Array();
		param.push(setPars("ssnid", readCookie("ssnid")));
		param.push(setPars("sortColumn", type ));
		param.push(setPars("sortAsc", true));
		$.getJSON(  './pctracking/' + type + '/listForm' + toCamelCase(type, true) + '.do',
			param.join("&"),
		  	function(jd) {
				res = jd["response"];
				stat = jd["status"];
				if(stat["code"] < 400 ){
					if (res["forms"].length > 0) {
						
						var opt = $("<option></option>");
						opt.attr('value', '0');
						opt.append("Please Select");
						dd_status.append(opt);
						//$(dd_status).selectpicker('refresh');
						
						$.each(res["forms"], function(i, obj){
							var opt = $("<option></option>");
							opt.attr('value', obj[type + "_id"]);
							opt.append(obj[type]);
							dd_status.append(opt);
						});
						$(dd_status).selectpicker('refresh');
					}
				}else{
					JSONerror(stat["code"]);
				}
				flag[index] = true;
				checkProgressFieldPage(true);
			}
		);
		
		
		$(dd_status).change(function(){
			if($(this).val() != 0){ //remove please select option
				$("#" + id + " option[value='0']").remove(); 
				$(dd_status).selectpicker('refresh');
			}
			if(type == "policy_type"){
				setDueDate();
				$("#form_LOB").selectpicker('val',null);
				$("#form_LOB").attr('title', 'Please Select');
				$("#form_LOB").selectpicker('refresh');
				filterLOBs($(this).val());
			}else if(type == "status"){
				selectedText  = $("#" + id + " option[value='"+ $(this).val() +"']").text();
				setCurrentDate(getDatePickerID(selectedText));
			}
			removeHTMLCodesONDropdown(id);
		});
	}
}

function getDatePickerID(status){
	if(status.toUpperCase().indexOf("RECEIVED") >= 0){
		return  "form_DATE_RECEIVED";
	}else if(status.toUpperCase().indexOf("MAPPED") >= 0){
		return "form_MAPPING_COMPLETED";
	}else if(status.toUpperCase().indexOf("PARSED") >= 0){
		return "form_PARSING_COMPLETED";
	}else if(status.toUpperCase().indexOf("LOADED") >= 0){
		return "form_LOADED";
	}else{
		return null;
	}
}

function setCurrentDate(id){
	if(id != null){
		//alert(id);
		$("#" + id).datepicker().datepicker("setDate", new Date());
		if(id == "form_MAPPING_COMPLETED"){
			setMappedBy();
		}
	}
}

function createLOBDropDownOptions(index){
	var id = "form_LOB";
	var dropDown = $("#" + id);
	if(dropDown){
		$.getJSON(  './pctracking/form/getPolicyLOBMappingList.do',
			{ssnid : readCookie("ssnid")},
		  	function(jd) {
				res = jd["response"];
				stat = jd["status"];
				if(stat["code"] < 400 ){
					if (res["forms"].length > 0) {
						
						var opt = $("<option></option>");
						opt.attr('value', 'Please Select');
						opt.append("Please Select");
						dropDown.append(opt);
						//$(dd_status).selectpicker('refresh');
						
						$.each(res["forms"], function(i, obj){
							var opt = $("<option></option>");
							opt.attr('class','policyType_' + obj["policyTypeId"]);
							opt.attr('value', obj["lob_id"]);
							opt.attr("disabled", "disabled");
							opt.append( insertNBSP(obj["lob_id"], 3) + obj["lob_id"] + " : " + obj["lob"] );
							dropDown.append(opt);
						});
						$(dropDown).selectpicker('refresh');
					}
				}else{
					JSONerror(stat["code"]);
				}
				flag[index] = true;
				checkProgressFieldPage(true);
			}
		);
		
		
		$(dropDown).change(function(){
			if($(this).val() != 0){ //remove please select option
				$("#" + id + " option[value='0']").remove(); 
				$(dropDown).selectpicker('refresh');
			}
			
			removeHTMLCodesONDropdown(id);
		});
	}
}

function resizePropDropdown(){
	var btn = $("button[data-id='form_PROPRIETARY']");
	var parentWidth = btn.parent().parent().offsetParent().width();
	var percent = (btn.parent().width()/parentWidth) * 70;
	btn.parent().width(percent);
}

function createProprietaryDropDownOptions(){
	var id = "form_PROPRIETARY";
	var dropDown = $("#" + id);

	resizePropDropdown();
	if(dropDown){
		
		resizePropDropdown();
		
		$(dropDown).change(function(){
			var selected = $("#" + id + " option:selected").val();
			if(selected == 0){ //reset selection
				$(dropDown).selectpicker('val',[]);
				$(dropDown).selectpicker('refresh');
			}
			removeHTMLCodesONDropdown(id);
			resizePropDropdown();
		});
		
		/*$.getJSON(  './pctracking/form/getMembershipList.do',
			{ssnid : readCookie("ssnid")},
		  	function(jd) {
				res = jd["response"];
				stat = jd["status"];
				if(stat["code"] < 400 ){
					if (res["forms"].length > 0) {
						
						var opt = $("<option></option>");
						opt.attr('value', '');
						opt.append("None");
						dropDown.append(opt);
						//$(dd_status).selectpicker('refresh');
						
						$.each(res["forms"], function(i, obj){
							var opt = $("<option></option>");
							opt.attr('value', obj["membershipId"]);
							opt.append( obj["company_name"] + " (" + obj["membershipId"] + ")" );
							dropDown.append(opt);
						});
						$(dropDown).selectpicker('refresh');
					}
				}else{
					JSONerror(stat["code"]);
				}
			}
		);*/
		/*$.ajax({
			type: "GET",
			url: "./pctracking/form/getMembershipList.do",
			data: { ssnid : readCookie("ssnid") },
			cache: true
		}).done(function( jd ) {
			res = jd["response"];
			stat = jd["status"];
			if(stat["code"] < 400 ){
				if (res["forms"].length > 0) {
					
					var opt = $("<option></option>");
					opt.attr('value', '0');
					opt.append("None");
					dropDown.append(opt);
					//$(dd_status).selectpicker('refresh');
					
					$.each(res["forms"], function(i, obj){
						var opt = $("<option></option>");
						opt.attr('value', obj["membershipId"]);
						opt.append( insertNBSP(obj["membershipId"], 5) + obj["membershipId"] + " : " + obj["company_name"]);
						dropDown.append(opt);
					});
					$(dropDown).selectpicker('refresh');
					
					var btn = $("button[data-id='form_PROPRIETARY']");
					var parentWidth = btn.parent().parent().offsetParent().width();
					var percent = (btn.parent().width()/parentWidth) * 70;
					btn.parent().width(percent);
				}
			}else{
				JSONerror(stat["code"]);
			}
	  });
		
		
		$(dropDown).change(function(){
			var selected = $("#" + id + " option:selected").val();
			if(selected == 0){ //reset selection
				$(dropDown).selectpicker('val',[]);
				$(dropDown).selectpicker('refresh');
			}
			btn = $("button[data-id='"+id+"']");
			btn.attr("title", btn.attr("title").replace(/&nbsp;/g,''));
			btn.attr("title", btn.attr("title").replace(/&amp;/g,'&'));
		});*/
	}
}

function filterLOBs(id){
	var showCount = 0;
	var lob = null;
	$("#form_LOB").children('option').each( function(){
		$(this).attr("disabled", "disabled");
		if(this.className == "policyType_" + id){
			$(this).removeAttr("disabled");
			showCount++;
			lob = $(this).val();
		}
	});
	if(showCount == 1){
		$("#form_LOB").selectpicker('val',lob);
	}/*else{
		var opt = $("<option></option>");
		opt.attr('value', '0');
		opt.append("Please Select");
		$("#form_LOB").prepend(opt);
		$("#form_LOB").selectpicker('val',null);
	}*/
	$("#form_LOB").selectpicker('refresh');
}

function getColumn(key){
	if(key == "status"){
		return "status_id";
	}else if(key == "type_of_document"){
		return "document_type_id";
	}else if(key == "type_of_policy"){
		return "policy_type_id";
	}else if(key == "type_of_submission"){
		return "submission_type_id";
	}
}
function processData(disable){
	var id = getUrlVars()["id"];
	var page = getUrlVars()["page"];
	if(page == "view"){
		isJsAction();
		disable = true;
	}else if(page == "edit"){
		lockForm();
	}else if(page == "add"){
		return null;
	}
	$.getJSON('./pctracking/form/getFormDetails.do',
			{ksq_seq_no : id, ssnid : readCookie("ssnid")},
			function (jd){
				stat = jd["status"];
				if (stat["code"] == 200) {
					if(!disable){
						$(".selectpicker").css('color', 'black');
						$(".form-control").css('color', 'black');
					}/*else{
						$(".selectpicker").css('color', '#555');
						$(".form-control").css('color', '#555');
					}*/
					$.each(jd["response"]["form"], function(key, val){
						if($("#form_" + key.toUpperCase()).attr("type") == "date"){
							$("#form_" + key.toUpperCase()).val(format_oracle_date(val));
						}else{
							$("#form_" + key.toUpperCase()).val(val);
							$("#form_" + key.toUpperCase()).attr('title', val);
						}
						//for dropdown fields
						if(key == "status" || key == "type_of_document" || key == "type_of_policy" || key == "type_of_submission"){
							if(val){
								$("#form_" + key.toUpperCase()).val(val[getColumn(key)]);
							}
							$("#form_" + key.toUpperCase()).selectpicker('render');
							removeHTMLCodesONDropdown("form_" + key.toUpperCase());
							if (key == "type_of_document"){
								showRelatedPolicy(key);
							}else if(key == "type_of_policy"){
								if(val){
									filterLOBs(val[getColumn(key)]);
								}
							}
							
						}
						if(key == "lob"){
							if(val != null){
								$("#form_" + key.toUpperCase()).selectpicker('val', val.split(","));
								$("#form_" + key).selectpicker('render');
							}else{
								$("#form_" + key.toUpperCase()).selectpicker('val', 'Nothing selected');
								$("#form_" + key).selectpicker('render');
							}
							removeHTMLCodesONDropdown("form_" + key.toUpperCase());
						}
						if(key == "form_id"){
							$.getJSON('./pctracking/form/getProprietaryMapping.do',
								{form_id : val, ssnid : readCookie("ssnid")},
								function (jd){
									res = jd["response"];
									stat = jd["status"];
									if (stat["code"] == 200) {
										
										dropDown = $("#form_PROPRIETARY");
										prop = $("#propSelected");
										prop.html("");
										
										//alert(res["forms"].join(","));
										//$(dropDown).selectpicker('val',res["forms"]);
										$.each(res["forms"], function(i, obj){
											var opt = $("<option></option>");
											opt.attr('value', obj["membershipId"]);
											opt.attr('selected', 'selected');
											opt.append( insertNBSP(obj["membershipId"], 5) + obj["membershipId"] + " : " + obj["company_name"]);
											
											var opt2 = $("<option></option>");
											opt2.attr('value', obj["membershipId"]);
											opt2.attr('selected', 'selected');
											opt2.append( insertNBSP(obj["membershipId"], 5) + obj["membershipId"] + " : " + obj["company_name"]);
											opt2.dblclick(function(){
												optionDblClick(this);
											});
											
											dropDown.append(opt);
											prop.append(opt2);
										});
										
										$(dropDown).selectpicker('refresh');
										
										removeHTMLCodesONDropdown('form_PROPRIETARY');
										resizePropDropdown();
									}
									if(disable){
										//$("#form_" + key.toUpperCase()).attr("disabled","disabled");
										$("#form_PROPRIETARY").attr("disabled","disabled");
										$("#propSearch").attr("onclick","");
									}	
									
									flag[5] = true;
									checkProgressFieldPage(false);
								}
							);
						}
						if(disable){
							$("#form_" + key.toUpperCase()).attr("disabled","disabled");
							//$("#form_" + key.toUpperCase()).css( 'cursor', 'pointer' );
							// $("#form_PROPRIETARY").attr("disabled","disabled");
							
							//css dropdown toggles
							/*var toggle = $("#form_" + key.toUpperCase());
							if(toggle.hasClass("selectpicker")){
								toggle.parent().parent().hide();
								view = $("#formView_" + key.toUpperCase());
								view.parent().parent().show();
								view.val(toggle.val());
							}*/
						}/*else{
							$("#form_" + key.toUpperCase()).css('color', 'black');
						}*/
					});
			}else if(stat["code"] == 204){
				flag[5] = true;
				//createAlert("danger", "Unable to " + ((disable) ? "view" : "edit") + ". This form has already been deleted.");
				window.location = "./loadFormsTracking.do?jsAction=" + page + "NULL";
			}else{
				JSONerror(stat["code"]);	
			}
			flag[6] = true;
			checkProgressFieldPage(false);
		}
	);
}

function removeHTMLCodesONDropdown(id){
	btn = $("button[data-id='"+id+"']");
	btn.attr("title", btn.attr("title").replace(/&nbsp;/g,''));
	btn.attr("title", btn.attr("title").replace(/&amp;/g,'&'));
}

function showRelatedPolicy(key){
	text = $("#form_" + key.toUpperCase() + " option:selected").text();
	if(text == "Endorsement"){ // id for Endorsement (document Type)
		$(".forEndorsement").show();
	}else{
		$(".forEndorsement").hide();
	}
}

function changeDropdownLabel(textLabel, element){
	$(element).text(textLabel);
}


function changeSearchField(elem){
	/*if($(elem).text().indexOf("DATE") >= 0){
		$("#searchVal").hide();
		$("#searchValDate").show();
		var d = new Date();
		if($("#searchValDate") == null && $("#searchValDate") == "")
			$("#searchValDate").val(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());
	}else{
		$("#searchValDate").hide();
		$("#searchVal").show();
	}*/
}

function createForm(clone){
	if(parsleyValidation()){
		$.getJSON( './pctracking/form/createForm.do',
			{
				ssnid 					: readCookie("ssnid"), 
				revised_item_no			: nullToString($("#form_REVISED_ITEM_NO").val()),
				status					: nullToString($("#form_STATUS").val()),
				policy_name				: nullToString($("#form_POLICY_NAME").val()),
				form_label				: nullToString($("#form_FORM_LABEL").val()),
				form_no					: nullToString($("#form_FORM_NO").val()),
				type_of_policy			: nullToString($("#form_TYPE_OF_POLICY").val()),
				lob						: arrayToString($("#form_LOB").val()),
				type_of_document		: nullToString($("#form_TYPE_OF_DOCUMENT").val()),
				submitter_company		: nullToString($("#form_SUBMITTER_COMPANY").val()),
				submitter_name			: nullToString($("#form_SUBMITTER_NAME").val()),
				submitters_email		: nullToString($("#form_SUBMITTERS_EMAIL").val()),
				
				form_id					: nullToString($("#form_FORM_ID").val()),
				edition_date			: nullToString($("#form_EDITION_DATE").val()),
				related_policy_id		: nullToString($("#form_RELATED_POLICY_ID").val()),
				related_policy			: nullToString($("#form_RELATED_POLICY").val()),
				type_of_submission		: nullToString($("#form_TYPE_OF_SUBMISSION").val()),
				proprietary				: arrayToString($("#form_PROPRIETARY").val()),
				client_reference_file	: nullToString($("#form_CLIENT_REFERENCE_FILE").val()),
				date_received			: nullToString($("#form_DATE_RECEIVED").val()),
				due_date				: nullToString($("#form_DUE_DATE").val()),
				mapping_completed		: nullToString($("#form_MAPPING_COMPLETED").val()),
				mapped_by				: nullToString($("#form_MAPPED_BY").val()),
				parsing_completed		: nullToString($("#form_PARSING_COMPLETED").val()),
				loaded					: nullToString($("#form_LOADED").val()),
				client_notified			: nullToString($("#form_CLIENT_NOTIFIED").val()),
				new_form_id				: nullToString($("#form_NEW_FORM_ID").val()),
				text_file_name			: nullToString($("#form_TEXT_FILE_NAME").val()),
				new_text_file_name		: nullToString($("#form_NEW_TEXT_FILE_NAME").val()),
				new_policy_name			: nullToString($("#form_NEW_POLICY_NAME").val()),
				comments				: nullToString($("#form_COMMENTS").val())
			},
		  	function(jd) {
				var stat = jd["status"];
				var resp = jd["response"];
				if (stat["code"] < 400) {
					//createAlert("success", "Form Successfully Created.");
					jsAction = "create";
					if(clone){
						jsAction = "clone";
					}
					window.location = './formFields.do?page=view&id=' + resp["form"]["ksq_seq_no"] + '&jsAction=' + jsAction;
					//alert(resp["form"]["ksq_seq_no"]);
				}else{
					//createAlert("danger", "Error, form unsuccessfully created.");
					JSONerror(stat["code"]);
				}
			}
		);
	} 	
}

function updateForm(){
	var id = getUrlVars()["id"];
	if(parsleyValidation()){
		$.getJSON( './pctracking/form/updateForm.do',
			{
				ksq_seq_no				: id,
				ssnid 					: readCookie("ssnid"), 
				revised_item_no			: nullToString($("#form_REVISED_ITEM_NO").val()),
				status					: nullToString($("#form_STATUS").val()),
				policy_name				: nullToString($("#form_POLICY_NAME").val()),
				form_label				: nullToString($("#form_FORM_LABEL").val()),
				form_no					: nullToString($("#form_FORM_NO").val()),
				type_of_policy			: nullToString($("#form_TYPE_OF_POLICY").val()),
				lob						: arrayToString($("#form_LOB").val()),
				type_of_document		: nullToString($("#form_TYPE_OF_DOCUMENT").val()),
				submitter_company		: nullToString($("#form_SUBMITTER_COMPANY").val()),
				submitter_name			: nullToString($("#form_SUBMITTER_NAME").val()),
				submitters_email		: nullToString($("#form_SUBMITTERS_EMAIL").val()),
				
				form_id					: nullToString($("#form_FORM_ID").val()),
				edition_date			: nullToString($("#form_EDITION_DATE").val()),
				related_policy_id		: nullToString($("#form_RELATED_POLICY_ID").val()),
				related_policy			: nullToString($("#form_RELATED_POLICY").val()),
				type_of_submission		: nullToString($("#form_TYPE_OF_SUBMISSION").val()),
				proprietary				: arrayToString($("#form_PROPRIETARY").val()),
				client_reference_file	: nullToString($("#form_CLIENT_REFERENCE_FILE").val()),
				date_received			: nullToString($("#form_DATE_RECEIVED").val()),
				due_date				: nullToString($("#form_DUE_DATE").val()),
				mapping_completed		: nullToString($("#form_MAPPING_COMPLETED").val()),
				mapped_by				: nullToString($("#form_MAPPED_BY").val()),
				parsing_completed		: nullToString($("#form_PARSING_COMPLETED").val()),
				loaded					: nullToString($("#form_LOADED").val()),
				client_notified			: nullToString($("#form_CLIENT_NOTIFIED").val()),
				new_form_id				: nullToString($("#form_NEW_FORM_ID").val()),
				text_file_name			: nullToString($("#form_TEXT_FILE_NAME").val()),
				new_text_file_name		: nullToString($("#form_NEW_TEXT_FILE_NAME").val()),
				new_policy_name			: nullToString($("#form_NEW_POLICY_NAME").val()),
				comments				: nullToString($("#form_COMMENTS").val())
			},
		  	function(jd) {
				var s = jd["status"];
				if (s["code"] == 200) {
					//createAlert("success", "Form Successfully Update.");
					window.location = './formFields.do?page=view&jsAction=edit&id=' + id;
				}else if(s["code"] == 204){
					//createAlert("danger", "Unable to edit. This form has already been deleted.");
					window.location = "./loadFormsTracking.do?jsAction=editNULL";
				}else{
					//createAlert("danger", "Error, form unsuccessfully updated.");
					JSONerror(s["code"]);
				}
			}
		);
	}
}

function lockForm(){
	
	var id = getUrlVars()["id"];
	$.getJSON( './pctracking/form/lockForm.do',
		{
			ssnid 		: readCookie("ssnid"), 
			user_id 	: readCookie("user_id"), 
			ksq_seq_no	: id
		},
		function(json){
			flag[7] = true;
			checkProgressFieldPage(false);
		}
	);
	
	/*
	 var id = getUrlVars()["id"];
	 $.getJSON( './pctracking/form/isLockedForm.do',
		{
			ssnid 		: readCookie("ssnid"),
			user_id		: readCookie("user_id"), 
			ksq_seq_no	: id
		},
		function(data) {
			locked = true;
			user = "";
			s = data["status"];
			r = data["response"];
			if (s["code"] == 200) {
				if(r["forms"].length < 1){
					locked = false;
				}else{
					user = r["forms"][0].firstName + " " + r["forms"][0].lastName;
				}
			}else{
				locked = false;
			}
			
			if(!locked){
				var id = getUrlVars()["id"];
				$.getJSON( './pctracking/form/lockForm.do',
					{
						ssnid 		: readCookie("ssnid"), 
						user_id 	: readCookie("user_id"), 
						ksq_seq_no	: id
					},
					function(json){
					}
				);
			}else{
				createAlert("danger", "Form is currently locked by " + user + ".");
				//disable save buttonform_submit
				$("#form_submit").attr("disabled","disabled");
			}
		}
	);*/
}

function unlockForm(){
	var id = getUrlVars()["id"];
	var page = getUrlVars()["page"];
	if(page == "edit"){
		$.getJSON( './pctracking/form/unlockForm.do',
			{
				ssnid 		: readCookie("ssnid"), 
				user_id		: readCookie("user_id"), 
				ksq_seq_no	: id
			},
			function(json){
				//alert("unlocked " + id);
			}
		);
	}
}


function isJsAction(){
	var jsAction = getUrlVars()["jsAction"];
	/*if(jsAction == "create"){
		createAlert("success", "Form Successfully Created.");
		//<button type="button" class="btn btn-default-cancel btn-sm btn-group-justified" onclick="window.location='./loadFormsTracking.do'">Go to List page</button>
		//$("#dynamicButton").append("<button type='button' class='btn btn-default-cancel btn-sm btn-group-justified' onclick='window.location=\"./addForm.do\"'>Add Another Form</button>");
	}else if(jsAction == "copy"){
		createAlert("success", "Form Successfully Copied.");
	}*/
	if(jsAction){
		if(jsAction == "clone"){
			createAlert("success", "Form successfully cloned.");
		}else if(jsAction == "edit"){
			createAlert("success", "Form successfully updated.");
		}else if(jsAction == "create" || jsAction == "delete"){
			createAlert("success", "Form successfully " + toCamelCase(jsAction, false)  + "d.");
		}else if(jsAction == "viewNULL"){
			createAlert("danger", "Unable to view. Form has already been deleted.");
		}else if(jsAction == "editNULL"){
			createAlert("danger", "Unable to edit. Form has already been deleted.");
		}else if(jsAction == "cloneNULL"){
			createAlert("danger", "Unable to clone. Form has already been deleted.");
		}else if(jsAction == "deleteNULL"){
			createAlert("danger", "Form has already been deleted.");
		}
	}
}

function getLookupDesc(element, type, id){
	if(type != null && id != null){
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
							var value = val; 
							/*if(value.length > 17){
								$(element).attr("title", val);
								value = value.substring(0, 16) + " ...";
							}*/
							$(element).text(nullToString(value));
						}
					});
				}else{
					$(element).text("");
				}
			}
		);
	}
}

function setMappedBy(){	
	$("#form_MAPPED_BY").val(readCookie("firstName") + " " + readCookie("lastName"));
}

function searchProprietary(){
	var popup = $("#proprietaryPopup");
	popup.modal({
		keyboard : true
	});
	
	popup.modal('show');
}

function getProprietaryResults(by){
	select = $("#propResults");
	select.html("");
	
	var param = new Array();
	param.push(setPars("ssnid", readCookie("ssnid")));
	if(by == 'name'){
		param.push(setPars("searchField", "company_name"));
		param.push(setPars("searchValue", $("#searchPropValue").val()));
	}else{
		param.push(setPars("searchField", "membershipId"));
		param.push(setPars("searchValue", $("#searchPropValue").val()));
	}
	
	$.getJSON(  './pctracking/form/getMembershipList.do',
		param.join("&"),
	  	function(jd) {
			res = jd["response"];
			stat = jd["status"];
			if(stat["code"] < 400 ){
				if (res["forms"].length > 0) {
						if(select){
						$.each(res["forms"], function(i, obj){
							var opt = $("<option></option>");
							opt.attr('value', obj["membershipId"]);
							opt.append( insertNBSP(obj["membershipId"], 5) + obj["membershipId"] + " : " + obj["company_name"]);
							opt.dblclick(function(){
								optionDblClick(this);
							});
							select.append(opt);
						});
						}
					//$(dropDown).selectpicker('refresh');
				}else{
					//propSearchNotice
					//alert("No result found.");
					//createAlert("info", "No result found.", true, "#propSearchNotice");
					divAlert = $("<div class='col-xs-12 alert alert-info alert-dismissable'>No result found.<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button></div>");
					//divAlert.style.textAlign="center";
					divAlert.css("text-align", "center");
					
					$("#propSearchNotice").append(divAlert);
					//"class","col-xs-12 alert alert-" + alertType + " alert-dismissable"
					
					setTimeout(function(){ 
						divAlert.fadeOut(2000);
					},2000);
				}
			}else{
				JSONerror(stat["code"]);
			}
		}
	);
		
}

function membershipSelection(action){
	if(action == 'add'){
		addSelections('propResults', 'propSelected');
		sortSelections('propSelected');
	}else if(action == 'remove'){
		removeSelections('propResults', 'propSelected');
		sortSelections('propResults');
	}else if(action == 'removeAll'){
		removeAllSections('propResults', 'propSelected');
		sortSelections('propResults');
	}
}

function sortSelections(selection){
	var select = $('#' + selection);

	select.append(select.find('option').sort(function(a, b){
	    return (
	        a = $(a).text().split(":")[1],
	        b = $(b).text().split(":")[1],
	        a == 'NA' ? 1 : b == 'NA' ? -1 : 0|a > b
	    );
	}));
}

function insertMembership(){
	selected = $("#propSelected");
	proprietary = $("#form_PROPRIETARY");
	proprietary.html("");
	
	var opt = $('<option></option>');
	opt.attr('value', 0);
	opt.append("None");
	proprietary.append(opt);
	
	selected.children().each( function () {
		var value = $(this).val();
		var text = $(this).text();
		
		var opt = $('<option></option>');
		opt.attr('value', value);
		opt.attr('selected', 'selected');
		opt.append(text);
		proprietary.append(opt);
	});
	
	proprietary.selectpicker('refresh');
	resizePropDropdown();
	
	removeHTMLCodesONDropdown('form_PROPRIETARY');
	
	$("#proprietaryPopup").modal('hide');
}

function parsleyValidation(){
	var form_id = $("#form_FORM_ID").parsley( 'validate' );
	if(!form_id){
		$(window).scrollTop(0);
		$("#form_FORM_ID").focus();
	}
	
	return (form_id);
}

function optionDblClick(option){
		var parentID = option.parentNode.id.toLowerCase();
		if(parentID.indexOf("result") > 0){
			var id = parentID.substring(0,parentID.indexOf("results")) + "Selected";
			$("#" + id).append($(option));
			sortSelections(id);
		}else if(parentID.indexOf("selected") > 0){
			var id = parentID.substring(0,parentID.indexOf("selected")) + "Results";
			$("#" + id).append($(option));
			sortSelections(id);
		}
}

function setDueDate(){
	//form_DATE_RECEIVED
	//form_TYPE_OF_POLICY
	//form_DUE_DATE
	var received = $("#form_DATE_RECEIVED");
	var policy = $("#form_TYPE_OF_POLICY");
	var due = $("#form_DUE_DATE");
	
	if(received.val() != null && received.val().length > 0){
		var policyType = $("#form_TYPE_OF_POLICY option[value='"+ policy.val() +"']").text();
		var dateReceived = received.datepicker('getDate');
		if(policyType.toUpperCase().indexOf("PROPERTY") >= 0){
			dateReceived.setMonth(dateReceived.getMonth() + 1);
			due.datepicker().datepicker("setDate", dateReceived);
		}else{
			dateReceived.setDate(dateReceived.getDate() + 14);
			due.datepicker().datepicker("setDate", dateReceived);
			/*var newDate =  new Date(dateReceived.setDay(dateReceived.getDay()+14));
			due.datepicker().datepicker("setDate", newDate);*/
		}
	}
}

