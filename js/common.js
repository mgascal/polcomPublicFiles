function setNavigation(type){
	if(type != null){
		$("#navigation").val(type);
		$("#navLabel").text(getLabel(type) + "  ");
	}
}

function setUserLabel(){
	//alert(document.cookie);
	$("#labeluser").text(readCookie("firstName") + " " +readCookie("lastName"));
	/*$.getJSON('./pctracking/user/getUserInfo.do',
			{ username: readCookie("username"), ssnid : readCookie("ssnid")},
			function(jd) {
				param = jd["params"];
				res = jd["response"];
				stat = jd["status"];
				if (stat["code"] == 200) {
					if (res["form"]) {
						$("#labeluser").text(res["form"]["firstName"] + " " + res["form"]["lastName"]);
					}
				}else{
					
				}
				
			}
		);*/
	/*createCookie("firstName", res["form"]["firstName"], 1);
	createCookie("lastName", res["form"]["lastName"], 1);*/
}

function removeChildElements(e){
	
	 /*while (e.lastChild)
     e.removeChild(e.lastChild);*/
	e.innerHTML="";
}

function nullToString(field){
	
	return (field == null) ? "" : field;
	
}

function arrayToString(field){
	
	if(field !=null){
		return field.join(",");
	}else{
		return "";
	}
}


function setPars(name, value){
	return name + "=" + encodeURIComponent(value);
}

function format_oracle_date(date, withTime){
	ret = "";
	if(date != null){
		d = new Date(date);
		ret = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1) ;
		ret += "/";
		ret += (d.getDate()) < 10 ? "0" + (d.getDate()) : (d.getDate());
		ret += "/";
		ret += d.getFullYear();
		
		if(withTime){
			ret += " ";
			ret += (d.getHours() < 10 ) ? "0" + (d.getHours()) : d.getHours();
			ret += ":";
			ret += (d.getMinutes() < 10 ) ? "0" + (d.getMinutes()) : d.getMinutes();
			ret += ":";
			ret += (d.getSeconds() < 10 ) ? "0" + (d.getSeconds()) : d.getSeconds();
		}
	}
	return ret;
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

function dropDownChange(element){
	((element.parentNode).parentNode).parentNode.getElementsByTagName("input")[0].value = $(element).text();//element.innerText; //value for selected text
	((element.parentNode).parentNode).parentNode.getElementsByTagName("input")[1].value = $(element).val(); //hidden input for selected id
	//showHideDropdown(element.parentNode);
}

function multiSelectDropDownChange(element){
	//alert("test");
	/*var e = $(element.parentNode).closest('button');
	alert(e.id);*/
	var e  = element.parentNode.parentNode.getElementsByTagName("button")[0];
	alert(e.childNodes[0].class);
}


function toCamelCase(str, capitalizeFirst){
	var arr = splitString(str);
	if(!capitalizeFirst){
		arr[0] = arr[0].substring(0,1).toLowerCase() + arr[0].substring(1,arr[0].length);
	}
	return arr.join("");
	
}

function splitString(str){
	var arr = str.split("_");
	for(var i = 0; i < arr.length; i++){
		arr[i] = arr[i].substring(0,1).toUpperCase() + arr[i].substring(1,arr[i].length);
	}
	return arr;
}

function getLabel(type){
	var arr = splitString(type);
	
	return arr.join(" ");
}

function createAlert(alertType, message, fade, id){
	
	fade = typeof fade !== 'undefined' ? fade : true;
	id = typeof id !== 'undefined' ? id : "#notice";
	var notice = $(id);
	notice.html("");
	//removeChildElements(notice);
	
	//scroll to Top
	$(window).scrollTop(0);
	
	var row = document.createElement("div");
	row.setAttribute("class", "row");
	notice.append(row);
		
		var col = document.createElement("div");
		col.setAttribute("class", "col-xs-12");
		row.appendChild(col);
		
			var container = document.createElement("div");
			container.setAttribute("class", "container");
			col.appendChild(container);
			
				var subRow = document.createElement("div");
				subRow.setAttribute("class", "row");
				container.appendChild(subRow);
				
					var div = document.createElement("div");
					div.setAttribute("class","col-xs-12 alert alert-" + alertType + " alert-dismissable");
					if(!fade){
						/*var button = document.createElement("button");
						button.setAttribute("type","button");
						button.setAttribute("class","close");
						button.setAttribute("data-dismiss","alert");
						button.setAttribute("aria-hidden","true");
						button.appendChild(document.createTextNode("&amp;times;"));
						
						div.appendChild(button);*/
						$(div).append("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>");
						div.style.textAlign="center";
					}
					div.appendChild(document.createTextNode(message));
					div.style.marginBottom  = "5px";
					subRow.appendChild(div);
	if(fade){
		setTimeout(function(){ 
			$(row).fadeOut(2000);
		},2000);
	}
}


function createPagination(page, max_page, func, func_params){
	$(".paging").parent().show();
	var paging = $("#pagination");
	var range = 5; //should be odd number
	var half_range = Math.floor( range / 2 );
	var start = 1;
	var end = range;
		
	if(max_page < range + 1){
		end = max_page;
	}else if(max_page - half_range < page){
		start = max_page - range + 1;
		end = max_page;
	}else if(page > half_range + 1){
		start = page - half_range;
		end = start + range - 1;
	}
	
	paging.html("");
	
	params = "";
	if(func_params.length > 0 ){
		params = "\"" + func_params.join("\",\"") + "\",";
	}
	paging.append($("<li " + ((page == 1) ? "class='disabled'><a" : "><a onclick='" + func + "(" + params + " 1)'") + "><span class='glyphicon glyphicon-fast-backward'></span></a></li>"));
	paging.append($("<li " + ((page == 1) ? "class='disabled'><a" : "><a onclick='" + func + "(" + params + (page - 1) + ")'") + "><span class='glyphicon glyphicon-backward'></span></a></li>"));
	for(var i=start; i <= end; i++){
		paging.append($("<li " + ((page == i) ? "class='active'" : "") + "><a onclick='" + func + "(" + params + i + ")'> " + i + "</a></li>"));
	}
	paging.append($("<li " + ((page == max_page) ? "class='disabled'><a" : "><a onclick='" + func + "(" + params + (page + 1) + ")'") + "><span class='glyphicon glyphicon-forward'></span></a></li>"));
	paging.append($("<li " + ((page == max_page) ? "class='disabled'><a" : "><a onclick='" + func + "(" + params + max_page + ")'") + "><span class='glyphicon glyphicon-fast-forward'></span></a></li>"));
}

function JSONerror(code){
	if(code == 401){
		window.location = './logout.do?code=' + code;
	}
}

function insertNBSP(value, maxlength){
	var space = "";
	for(var d = (value + "").length; d < maxlength; d ++) {
		space += "&nbsp;&nbsp;";
	}
	return space;
}

function hideNonAdminPages(){
	
	if(readCookie("userType") != "Admin"){
		$(".nonAdmin").hide();
	}
}
function addSelections(choices, selections){
	var choices_dropdown = $("#" + choices);
	var selections_dropdown = $("#" + selections);
	
	choices_dropdown.children().each( function () {
		if(this.selected){
			//alert($(this).val());
			selections_dropdown.append($(this));
		}
	});
}

function removeSelections(choices, selections){
	var choices_dropdown = $("#" + choices);
	var selections_dropdown = $("#" + selections);
	
	selections_dropdown.children().each( function () {
		if(this.selected){
			//alert($(this).val());
			choices_dropdown.append($(this));
		}
	});
}

function removeAllSections(choices, selections){
	var choices_dropdown = $("#" + choices);
	var selections_dropdown = $("#" + selections);
	
	selections_dropdown.children().each( function () {
		choices_dropdown.append($(this));
	});
}



function progressBar(percent){
	percent = percent.toFixed(0);
	var bar = $(".progress-bar"); 
	bar.attr('aria-valuenow', percent);
	bar.attr('style', 'width: ' + percent + '%');
	bar.first().text(percent + '% Complete');
	
	if(percent < 100){
		$("#loading").show();
		$("#body").hide();
	}else{
		setTimeout(function(){ 
			$("#loading")
				.fadeOut()
				.queue( function(){
					$("#body").fadeIn().delay(5000);
					$(this).dequeue;
				}).
				delay(200);
		},500);
	}
}

function days_between(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date1_ms - date2_ms;

    // Convert back to days and return
    return Math.round((difference_ms + ONE_DAY)/ONE_DAY);

}
