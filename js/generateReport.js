var flag = new Array();

function loadGenerateReportPage(countPage){
	//progressBar(10);
	setNavigation("Generate Report");
	$("#title").text("Generate Report");
	
	if(countPage){
		var settings = $(".setting");
		settings.hide();
	
		button = $("#toggleSetting");
		button.click(function(){
			if(settings.is(":visible")){
				button.text("Show Settings");
				settings.toggle();
			}else{
				button.text("Hide Settings");
				settings.toggle();
			}
		});
		flag = new Array();
		createCheckBoxOptions('status', 9);
		createCheckBoxOptions('policy_type');
		createCheckBoxOptions('document_type', 5);
		createCheckBoxOptions('submission_type');
	}else{
		$(".moreThan50").hide();
		//progressBar(100);
	}
}

function checkProgressFieldPage(){
	var percent = 0;
	var percentage = 0;
	
	if(flag && flag.length >0){
		for(var i=0; i<flag.length; i++){
			if(flag[i]){
				percent++;
			}
		}
		percentage = (percent)/(flag.length)*100;
	}
	console.log("Loading percentage : " + percentage);
	//progressBar(percentage);
}

function createCheckBoxOptions(type, maxSelection){
	flag.push(false);
	var flagIndex = flag.length -1;
	var div = $('#collapse' + toCamelCase(type, true));
	div.html("");
	
	var panel = $("<div class='panel-body'></div>");
	div.append(panel);
	
		
		if(div){
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
							var max_row = Math.ceil(res["forms"].length/6);
							for( var z = 0; z < max_row; z++){
								var start = z * 6;
								var end = start + 6;
								if(end > res["forms"].length){
									end = res["forms"].length;
								}

								var row = $("<div class='row'></div>");
								panel.append(row);
								
								$.each(res["forms"].slice(start, end), function(i, obj){
									var col = $("<div class='col-xs-2'></div>");
									row.append(col);
									
									var divCheck = $("<div class='checkbox'></div>");
									col.append(divCheck);
									
									var label = $("<label></label>");
									divCheck.append(label);
									
									var input = $("<input type='checkbox'>");
									input.attr('name', toCamelCase(type) + 'Checkbox');
									input.attr('value', obj[type + "_id"]);
									
									//set default settings
									if(type == "status" || type == "document_type" || type == "submission_type"){
										var desc = obj[type].toLowerCase();
										if(type == "status" && 
												(desc == "to analyst"
													|| desc == "to analyst"
													|| desc == "analyzed"
													|| desc == "parsed"
													|| desc == "loaded"
													|| desc == "already in system"
													|| desc == "rush analysis"
													|| desc == "rush parsing"	)
											){
											input.attr('checked','checked');
										}
										else if(type == "document_type" && 
												(desc == "endorsement" || desc == "policy")
										){
											input.attr('checked','checked');
										}
										else if(type == "submission_type" && 
												(desc == "client submission" || desc == "web collected" || desc == "conversion")
										){
											input.attr('checked','checked');
										}
									}else{
										input.attr('checked','checked');
									}
									
									
									input.click(function(){
										var length = $( "input[name='"+ toCamelCase(type) +"Checkbox']:checked" ).length;
										if(maxSelection != null && maxSelection > 0){
											if(length > maxSelection){
												this.checked = false;
												alert("Maximum selection reached.");
											}
										}
										if(length == 0){
											this.checked = true;
											alert("Minimum of one item is required.");
										}
									});
									
									label.append(input);
									label.append(obj[type]);
								});
							}
						}
					}else{
						JSONerror(stat["code"]);
					}
					
					//flag[flagIndex] = true;
					//checkProgressFieldPage();
				}
			);
		}
	/*
	 * if(dd_status){
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
			}
		);
	 */
	
	
}
	
function loadGenerateReport(page){
	//progressBar(10);
	page = (page == null)? 1 : page;
	var per_page = 50; //set max items per page
	
	var dateFrom = $("#reportDateFrom").val();
	var dateTo = $("#reportDateTo").val();
	var filterBy = getColumnFilter($("#date_dd_label").text());
	//alert(dateFrom + " " + dateTo);
	/*
	 * var param = new Array();
	param.push(setPars("sortColumn", sortColumn));
	param.push(setPars("sortAsc", sortAsc));
	param.push(setPars("ssnid", readCookie("ssnid")));
	
	$.getJSON(  './pctracking/user/listUsers.do',
		param.join("&"),
		ssnid=advib3eb4174154b4242bbda72b47b86de81sen&dateFrom=06%2F10%2F2014&dateTo=06%2F17%2F2014&filterBy=updated_date
	 */
	var param = new Array();
	param.push(setPars("dateFrom", dateFrom));
	param.push(setPars("dateTo", dateTo));
	param.push(setPars("filterBy", filterBy));
	param.push(setPars("page", page));
	param.push(setPars("per_page", per_page));
	param.push(setPars("ssnid", readCookie("ssnid")));
	$("#notice").html("");
	$.getJSON(  './pctracking/form/generateReport.do',
		param.join("&"),
  		function(jd) {
  			param = jd["params"];
			res = jd["response"];
			stat = jd["status"];
			div = document.getElementById("reportTable");
			removeChildElements(div);
			if (stat["code"] == 200) {
					rowDiv = document.createElement("div");
					rowDiv.setAttribute("class","row");
					div.appendChild(rowDiv);
					
						colDiv = document.createElement("div");
						colDiv.setAttribute("class","col-lg-12 tableHeader");
						colDiv.setAttribute("style","border-top-left-radius: 6px; border-top-right-radius: 6px; border-top: 1px solid #0076EB; border-right: 1px solid #0076EB; border-left: 1px solid #0076EB; border-bottom: 1px solid #0076EB; cursor: auto");
						rowDiv.appendChild(colDiv);
						
							rowDiv2 = document.createElement("div");
							rowDiv2.setAttribute("class","row");
							colDiv.appendChild(rowDiv2);

								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								columnHeaderText.appendChild(document.createTextNode("Created Date"));
								columnHeader.appendChild(columnHeaderText);
							
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-2");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								columnHeaderText.appendChild(document.createTextNode("Policy Name"));
								columnHeader.appendChild(columnHeaderText);
				
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								columnHeaderText.appendChild(document.createTextNode("Date Received"));
								columnHeader.appendChild(columnHeaderText);
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								columnHeaderText.appendChild(document.createTextNode("Type of Document"));
								columnHeader.appendChild(columnHeaderText);
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								columnHeaderText.appendChild(document.createTextNode("Type of Submission"));
								columnHeader.appendChild(columnHeaderText);
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								columnHeaderText.appendChild(document.createTextNode("Type of Coverage"));
								columnHeader.appendChild(columnHeaderText);
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								columnHeaderText.appendChild(document.createTextNode("Mapped"));
								columnHeader.appendChild(columnHeaderText);
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								columnHeaderText.appendChild(document.createTextNode("Parsed"));
								columnHeader.appendChild(columnHeaderText);
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								columnHeaderText.appendChild(document.createTextNode("Loaded"));
								columnHeader.appendChild(columnHeaderText);
								
								columnHeader = document.createElement("div");
								columnHeader.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnHeader);
								columnHeaderText = document.createElement("p");
								columnHeaderText.setAttribute("class","well-sm");
								columnHeaderText.appendChild(document.createTextNode("Status"));
								columnHeader.appendChild(columnHeaderText);
					
					$(".paging").parent().show();
					var max_page = Math.ceil(res.total_count/per_page);
					createPagination(page, max_page, "loadGenerateReport", new Array());
								
					if (res.forms.length > 0) {
						var gray = true;
						/*var end = 50;
						$(".moreThan50").show();
						if(res.forms.length < 51){
							end = res.forms.length;
							$(".moreThan50").hide();
						}*/
						var start = (page - 1) * per_page;
						var end = start + per_page;
						var len = res.forms.length;
						$.each(res.forms, function(i, obj){
					rowDiv = document.createElement("div");
					rowDiv.setAttribute("class","row");
					div.appendChild(rowDiv);
					
						colDiv = document.createElement("div");
						gray = !gray;
						colDiv.setAttribute("class","col-lg-12 tableRow" + ((gray) ? " rowGray1" : " rowWhite1"));
						colDiv.setAttribute("style","border-right: 1px solid #0076EB; border-left: 1px solid #0076EB;");
						//if(i==per_page - 1 || (((page - 1) * per_page) + (i + 1)) == len){ //index 49 border bottom
						if(i==res.forms.length -1){
							colDiv.setAttribute("style","border-right: 1px solid #0076EB; border-left: 1px solid #0076EB; border-bottom: 1px solid #0076EB; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px;");
						}
						//colDiv.setAttribute("style","border: 1px solid #0076EB"); XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
						rowDiv.appendChild(colDiv);
						
							rowDiv2 = document.createElement("div");
							rowDiv2.setAttribute("class","row");
							colDiv.appendChild(rowDiv2);
							
								columnDiv = document.createElement("div");
								columnDiv.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnDiv);
								columnDiv2 = document.createElement("p");
								columnDiv2.setAttribute("class","well-sm");
								columnDiv2.appendChild(document.createTextNode(nullToString(format_oracle_date(obj["create_date"]))));
								columnDiv.appendChild(columnDiv2);
							
								columnDiv = document.createElement("div");
								columnDiv.setAttribute("class","col-xs-2");
								rowDiv2.appendChild(columnDiv);
								columnDiv2 = document.createElement("p");
								columnDiv2.setAttribute("class","well-sm");
								columnDiv2.appendChild(document.createTextNode(nullToString(obj["policy_name"])));
								columnDiv.appendChild(columnDiv2);
							
								columnDiv = document.createElement("div");
								columnDiv.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnDiv);
								columnDiv2 = document.createElement("p");
								columnDiv2.setAttribute("class","well-sm");
								columnDiv2.appendChild(document.createTextNode(nullToString(format_oracle_date(obj["date_received"]))));
								columnDiv.appendChild(columnDiv2);
								
								columnDiv = document.createElement("div");
								columnDiv.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnDiv);
								columnDiv2 = document.createElement("p");
								columnDiv2.setAttribute("class","well-sm");
								columnDiv2.appendChild(document.createTextNode(nullToString(obj["type_of_document"])));
								columnDiv.appendChild(columnDiv2);
								
								columnDiv = document.createElement("div");
								columnDiv.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnDiv);
								columnDiv2 = document.createElement("p");
								columnDiv2.setAttribute("class","well-sm");
								columnDiv2.appendChild(document.createTextNode(nullToString(obj["type_of_submission"])));
								columnDiv.appendChild(columnDiv2);
								
								columnDiv = document.createElement("div");
								columnDiv.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnDiv);
								columnDiv2 = document.createElement("p");
								columnDiv2.setAttribute("class","well-sm");
								columnDiv2.appendChild(document.createTextNode(nullToString(obj["type_of_policy"])));
								columnDiv.appendChild(columnDiv2);
								
								columnDiv = document.createElement("div");
								columnDiv.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnDiv);
								columnDiv2 = document.createElement("p");
								columnDiv2.setAttribute("class","well-sm");
								columnDiv2.appendChild(document.createTextNode(nullToString(format_oracle_date(obj["mapping_completed"]))));
								columnDiv.appendChild(columnDiv2);
								
								columnDiv = document.createElement("div");
								columnDiv.setAttribute("class","col-md-1");
								rowDiv2.appendChild(columnDiv);
								columnDiv2 = document.createElement("p");
								columnDiv2.setAttribute("class","well-sm");
								columnDiv2.appendChild(document.createTextNode(nullToString(format_oracle_date(obj["parsing_completed"]))));
								columnDiv.appendChild(columnDiv2);
								
								columnDiv = document.createElement("div");
								columnDiv.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnDiv);
								columnDiv2 = document.createElement("p");
								columnDiv2.setAttribute("class","well-sm");
								columnDiv2.appendChild(document.createTextNode(nullToString(format_oracle_date(obj["loaded"]))));
								columnDiv.appendChild(columnDiv2);
								
								columnDiv = document.createElement("div");
								columnDiv.setAttribute("class","col-xs-1");
								rowDiv2.appendChild(columnDiv);
								columnDiv2 = document.createElement("p");
								columnDiv2.setAttribute("class","well-sm");
								columnDiv2.appendChild(document.createTextNode(nullToString(obj["status"])));
								columnDiv.appendChild(columnDiv2);

						});
						$("#btnDownload").unbind( "click");
						$("#btnDownload").click(function(){
							downloadExcel(filterBy, dateFrom, dateTo);
						});
					}else{
						$(".paging").parent().hide();
						removeChildElements(div);
						
						/*rowDiv = document.createElement("div");
						rowDiv.appendChild(document.createTextNode("No Data Available"));
						div.appendChild(rowDiv);
						*/
						createAlert("info", "No Data Available");
						div.style.display="none";
						$("#btnDownload").unbind( "click" );
						$("#btnDownload").click(function(){
							createAlert("info", "No Data Available", false);
						});
					}
					
					
			}else if(stat["code"] == 204){
				$(".paging").parent().hide();
				removeChildElements(div);
				createAlert("info", "No Data Available", false);
				$("#btnDownload").unbind( "click");
				$("#btnDownload").click(function(){
					createAlert("info", "No Data Available", false);
				});
				
			}else{
				JSONerror(stat["code"]);
			}
			//progressBar(100);
  		}
 	);
}

function changeDateDropdown(selected, element){
	$(element).text($(selected).text());
}

function getColumnFilter(text){
	
	var filterBy = "";
	if(text == "RECEIVED DATE"){
		filterBy = "date_received";
	}else if(text == "MAPPED DATE"){
		filterBy = "mapping_completed";
	}else if(text == "PARSED DATE"){
		filterBy = "parsing_completed";
	}else if(text == "LOADED DATE"){
		filterBy = "loaded";
	}else if(text == "CREATED DATE"){
		filterBy = "create_date";
	}else if(text == "UPDATED DATE"){
		filterBy = "updated_date";
	}else if(text == "DUE DATE"){
		filterBy = "due_date";
	}
	
	return filterBy;
}

function downloadExcel(filterBy, dateFrom, dateTo){
	
	//var dateFrom = $("#reportDateFrom").val();
	//var dateTo = $("#reportDateTo").val();
	//var filterBy = getColumnFilter($("#date_dd_label").text());
	
	var param = new Array();
	param.push(setPars("dateFrom", dateFrom));
	param.push(setPars("dateTo", dateTo));
	param.push(setPars("filterBy", filterBy));
	param.push(setPars("ssnid", readCookie("ssnid")));
	//$.getJSON(  './pctracking/form/generateReport.do',
		
	window.location = './pctracking/form/downloadReport.do?' + param.join("&");
}

function getCheckboxArray(type){
	var id = new Array();
	var desc = new Array();
	$("input[name='"+ type +"Checkbox']").each( function () {
		if(this.checked){
			id.push($(this).val());
			desc.push($(this).parent().text());
		}
	});
	
	return new Array(id, desc);
}

function downloadExcelCount(filterBy, dateFrom, dateTo){
	
	//var dateFrom = $("#reportDateFrom").val();
	//var dateTo = $("#reportDateTo").val();
	//var filterBy = getColumnFilter($("#date_dd_label").text());
	jsonParam =new Array("test", "test2");
	var param = new Array();
	param.push(setPars("dateFrom", dateFrom));
	param.push(setPars("dateTo", dateTo));
	param.push(setPars("filterBy", filterBy));
	param.push(setPars("ssnid", readCookie("ssnid")));
	
	var p = getCheckboxArray("status");
	param.push(setPars("statusId",p[0]));
	param.push(setPars("statusDesc",p[1]));
	
	var p = getCheckboxArray("policyType");
	param.push(setPars("policyTypeId",p[0]));
	param.push(setPars("policyTypeDesc",p[1]));
	
	var p = getCheckboxArray("documentType");
	param.push(setPars("documentTypeId",p[0]));
	param.push(setPars("documentTypeDesc",p[1]));
	
	var p = getCheckboxArray("submissionType");
	param.push(setPars("submissionTypeId",p[0]));
	param.push(setPars("submissionTypeDesc",p[1]));
	
	//$.getJSON(  './pctracking/form/generateReport.do',
		
	window.location = './pctracking/form/downloadReportCount.do?' + param.join("&");
}

function toggleClass(className){
	//alert(className);
	var child = $("." + className);
	if(child.is(":visible")){
		$("." + className + "_header").attr('class', 'glyphicon glyphicon-plus toggleButton ' + className + '_header');
		$("." + className + "_total").toggle();
		child.toggle();
	}else{
		$("." + className + "_header").attr('class', 'glyphicon glyphicon-minus toggleButton ' + className + '_header');
		$("." + className + "_total").toggle();
		child.toggle();
	}
}

function loadGenerateReportCount(){
	//progressBar(10);
	$(".setting").hide();
	$("#toggleSetting").text("Show Settings");
	var dateFrom = $("#reportDateFrom").val();
	var dateTo = $("#reportDateTo").val();
	//var filterBy = getColumnFilter($("#date_dd_label").text());
	var filterBy = "updated_date";
	//alert(dateFrom + " " + dateTo);
	/*
	 * var param = new Array();
	param.push(setPars("sortColumn", sortColumn));
	param.push(setPars("sortAsc", sortAsc));
	param.push(setPars("ssnid", readCookie("ssnid")));
	
	$.getJSON(  './pctracking/user/listUsers.do',
		param.join("&"),
		ssnid=advib3eb4174154b4242bbda72b47b86de81sen&dateFrom=06%2F10%2F2014&dateTo=06%2F17%2F2014&filterBy=updated_date
	 */
	var param = new Array();
	param.push(setPars("dateFrom", dateFrom));
	param.push(setPars("dateTo", dateTo));
	param.push(setPars("filterBy", filterBy));
	param.push(setPars("ssnid", readCookie("ssnid")));
	$("#notice").html("");
	$.getJSON(  './pctracking/form/generateReportCount.do',
		param.join("&"),
  		function(jd) {
  			param = jd["params"];
			res = jd["response"];
			stat = jd["status"];
			if (stat["code"] == 200) {
				if (res.forms.length > 0) {
					createCountUI();
					//prevSubmission
					$.each(res.forms, function(i, obj){
						var countValue = $(".cell_" + obj[2] + "_" + obj[3] + "_" + obj[0] + "_" + obj[1]);
						//countValue.css("text-align", "center");
						countValue.text(obj[4]);
						var totalValue = $(".cell_" + obj[2] + "_" + obj[3] + "_" + obj[0]);
						//totalValue.css("text-align", "center");
						totalValue.text(obj[4] + parseInt(totalValue.text()));
					});
					$("#btnDownload").unbind( "click");
					$("#btnDownload").click(function(){
						downloadExcelCount(filterBy, dateFrom, dateTo);
					});
				}
			}else if(stat["code"] == 204){
				$("#reportTable").html("");
				createAlert("info", "No Data Available", false);
				$("#btnDownload").unbind( "click");
				$("#btnDownload").click(function(){
					createAlert("info", "No Data Available", false);
				});
				
			}else{
				JSONerror(stat["code"]);
			}
			//progressBar(100);
		}
	);
}

function createCountUI(){
	var div = $("#reportTable");
	div.html("");
	
	//if(columnOptions.length > 1){
		var submissionID;
		var policyID;
		var documentID;
		var statusID;
		
		var divRow = $('<div class="row"></div>');
		div.append(divRow);
		var divCol = $('<div class="col-xs-2">&nbsp;</div>');
		divRow.append(divCol);
		divCol = $('<div class="col-xs-10 col-xs-offset-quarter"></div>');
		divRow.append(divCol);
		
		var tab = $('<ul class="nav nav-tabs" role="tablist"></ul>');
		divCol.append(tab);
			
			//var columnSelected = columnOptions[1].split("_")[0];
			var columnSelected = "documentType";
			//alert(columnSelected);
			var counter = 0;
			$("input[name='"+ columnSelected +"Checkbox']").each( function () {
				if(this.checked){
					var moreItems = $('<ul class="dropdown-menu" role="menu" aria-labelledby="myTabDrop1">');
					if(counter == 5){
						var items = $('<li class="dropdown"></div>');
						tab.append(items);
						
						var anchor = $('<a href="#" id="myTabDrop1" class="dropdown-toggle" data-toggle="dropdown"></a>');
						items.append(anchor);
						anchor.append("More");
						anchor.append($('<span class="caret"></span>'));
						items.append(moreItems);
					}
					var items = $('<li' + ((counter == 0) ? ' class="active"' : '') + '><a href="#' + columnSelected + "_" + $(this).val() + '" role="tab" data-toggle="tab">' + $(this).parent().text() + '</a></li>');
					if(counter > 4){
						moreItems.append(items);
					}else{
						tab.append(items);
					}
					counter++;
				}
			});
			var tabContent = $('<div class="tab-content">');
			div.append(tabContent);
			
			var counter = 0;
			$("input[name='"+ columnSelected +"Checkbox']").each( function () {
				if(this.checked){
					
					documentID = $(this).val();
					var tabPane = $('<div class="tab-pane'+ ((counter == 0) ? ' active' : '') +'" id="' + columnSelected + "_" + $(this).val() + '">');
					tabContent.append(tabPane);
					
					//STATUS HEADER
					var divRow = $('<div class="row columnCountHeader rowGray1 divBorderTopCorners divBorderBottomCorners">');
					tabPane.append(divRow);
					
					var divCol = $('<div class="col-xs-2"></div>');
					divRow.append(divCol);
					
					var statusCheckbox = "status";
					var statusCount = $( "input[name='"+ statusCheckbox +"Checkbox']:checked" ).length;
					//alert(statusCount);
					$("input[name='"+ statusCheckbox +"Checkbox']").each( function (i) {
						if(this.checked){
							if(statusCount < 6){
								divCol = $('<div class="col-xs-2 text-center"></div>');
							}else{
								divCol = $('<div class="col-xs-1 text-center"></div>');
							}
							divRow.append(divCol);
							divCol.append($(this).parent().text());
						}
					});
					
					
					//SUBMISSION TYPE ROW HEADER
					var submissionCheckbox = "submissionType";
					$("input[name='"+ submissionCheckbox +"Checkbox']").each( function () {
						if(this.checked){
							submissionID = $(this).val();

							var divRow = $('<div class="row rowGray1 rowCountHeader divBorderTopCorners">');
							tabPane.append(divRow);
							var divCol = $('<div class="col-xs-2"><span class="glyphicon glyphicon-minus toggleButton submissionType_' + submissionID + '_header " onClick="toggleClass(\'submissionType_' + submissionID + '\');"></span> ' + $(this).parent().text() + '</div>');
							divRow.append(divCol);
							
							$("input[name='"+ statusCheckbox +"Checkbox']:checked").each( function (i) {
								//if(this.checked){
									statusID = $(this).val();
									//alert(i);
									if(statusCount < 6){
										divCol = $('<div class="text-center col-xs-2"></div>');
									}else{
										divCol = $('<div class="text-center col-xs-1"></div>');
									}
									divRow.append(divCol);
									cell = "cell_" + documentID + "_" + statusID  + "_" + submissionID;
									
									var span = $('<span class="submissionType_' + submissionID + '_total ' + cell + '">0</span>');
									divCol.append(span);
									span.hide();
								//}
							});
							
							
							//POLICY TYPE ROWS
							var policyCheckbox = "policyType";
							var policyCount = $( "input[name='"+ policyCheckbox +"Checkbox']:checked" ).length;
							blue = true;
							$("input[name='"+ policyCheckbox +"Checkbox']").each( function (i) {
								if(this.checked){
									policyID = $(this).val();
									blue = !blue;
									var divRow = $('<div class="row divBorderSides' + ((policyCount - 1 == i)? ' divBorderBottomCorners' : '') + ' submissionType_' + submissionID  + ((blue) ? ' rowGray1' : ' rowWhite1') + '" style="font-size:10pt;">');
									tabPane.append(divRow);
									var divCol = $('<div class="col-xs-2 indentText">' + $(this).parent().text() + '</div>');
									divRow.append(divCol);
									
									$("input[name='"+ statusCheckbox +"Checkbox']").each( function () {
										if(this.checked){
											statusID = $(this).val();
											cell = "cell_" + documentID + "_" + statusID  + "_" + submissionID + "_" + policyID ;
											if(statusCount < 6){
												divCol = $('<div class="text-center col-xs-2 ' + cell + '"></div>');
											}else{
												divCol = $('<div class="text-center col-xs-1 ' + cell + '"></div>');
											}
											divRow.append(divCol);
											//divCol.append("count");
										}
									});
								}
							});
						}
					});
					
					counter++;
				}
			});
}
