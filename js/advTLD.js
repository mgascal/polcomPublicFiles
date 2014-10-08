function addSelection(shifterName){
	var leftSelect = document.getElementById("leftSelection_"+shifterName);
	var rightSelect = document.getElementById("rightSelection_"+shifterName);
	if(leftSelect.selectedIndex >= 0 ){
		for (var i = leftSelect.length - 1; i >= 0; i--){
			 if (leftSelect[ i ].selected){
				 var optNew = document.createElement('option');
				 optNew.text = leftSelect[ i ].text;
				 optNew.value = leftSelect[ i ].value;					 
				 rightSelect.add(optNew);
				 leftSelect.remove(i);
			 }
		}
		sortSelection(rightSelect);
	}
}

function removeSelection(shifterName){
	var rightSelect = document.getElementById("rightSelection_"+shifterName);
	var leftSelect = document.getElementById("leftSelection_"+shifterName);
	if(rightSelect.selectedIndex >= 0 ){
		for (var i = rightSelect.length - 1; i >= 0; i--){
			 if (rightSelect[ i ].selected){
				 var optNew = document.createElement('option');
				 optNew.text = rightSelect[ i ].text;
				 optNew.value = [ i ].value;					 
				 leftSelect.add(optNew);
				 rightSelect.remove(i);
			 }
		}
		sortSelection(leftSelect);
	}
}

function removeAllSelection(shifterName){
	var rightSelect = document.getElementById("rightSelection_"+shifterName);
	var leftSelect = document.getElementById("leftSelection_"+shifterName);
	if(rightSelect.length > 0 ){
		for (var i = rightSelect.length - 1; i >= 0; i--){
			 var optNew = document.createElement('option');
			 optNew.text = rightSelect[ i ].text;
			 optNew.value = [ i ].value;
			 leftSelect.add(optNew);
			 rightSelect.remove(i);				 
		}
		sortSelection(leftSelect);
	}
}

function sortSelection(select){
    var tmpAry = new Array();
    for (var i=0;i<select.options.length;i++) {
        tmpAry[i] = new Array();
        tmpAry[i][0] = select.options[i].text;
        tmpAry[i][1] = select.options[i].value;
    }
    tmpAry.sort();
    while (select.options.length > 0) {
    	select.options[0] = null;
    }
    for (var i=0;i<tmpAry.length;i++) {
        var op = new Option(tmpAry[i][0], tmpAry[i][1]);
        select.options[i] = op;
    }
    return;
}