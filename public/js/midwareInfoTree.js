function changeTreeStatus(xObj, evt)
{
	var status;
	var curRowIndex;
	
	curRowIndex = getTableRowIndex(evt);
	
	status = xObj.id.substring((xObj.id.length - 1),xObj.id.length);
	
	if ('0' == status)
	{
		document.getElementById(xObj.id).id = xObj.id.substring(0,(xObj.id.length - 1)) + '1';
		openTree(curRowIndex, xObj.id);
	}
	else if ('1' == status)
	{
		document.getElementById(xObj.id).id = xObj.id.substring(0, (xObj.id.length - 1)) + '0';
		closeTree(curRowIndex, xObj.id);
	}
}

function getTableRowIndex(e)
{ 
	var evt;
	var ObjTd; 
	var rowIndex; 
		
	evt = window.event ? window.event : e; 
	
	objTd = evt.srcElement ? evt.srcElement : evt.target; 
	rowIndex = objTd.parentNode.rowIndex;

	
	return rowIndex;
} 

function openTree(curRowIndex, id)
{
	var infoTable = document.getElementById("infoTable");
	var index;
	
	if (12 == id.length) //-- open second level tree --//
	{
		index = id.substring(0, 10);
		
		index = Number(index);
		
		for (var i = 0; i < midIds[index][2].length; ++i)
		{
			var row = infoTable.insertRow(curRowIndex + 1 + i);
			var cell = document.createElement('td');
			cell.colSpan = 3;
			cell.onclick = secondTreeEvt;
			cell.id = i + "_" + id.substring(0, 10) + "_0";
			cell.height = 50;
			cell.innerHTML = midIds[index][2][i][0]; 
			
			row.appendChild(cell);
		}
	}
	else if (14 == id.length)
	{
		var type;
		var sum;
		var infos = "";
		
		index = id.substring(2, 12);
		type = id.substring(0,1);
		
		type = Number(type);
		index = Number(index);
		sum = midIds[index][2][type][1];
		
		if ("烤烟监控" == midIds[index][2][type][0])
		{
			infos = sendHttpReq('GET', ('tobacco_monitor?midid=' + midIds[index][1]), null);
		}
		else if ("育苗监控" == midIds[index][2][type][0])
		{
			infos = sendHttpReq('GET', ('seedling_monitor?midid=' + midIds[index][1]), null);
		}
		
		if ("null" == infos)
		{
			return;
		}
		
		for (var i = 0; i < sum; ++i)
		{
			var row = infoTable.insertRow(curRowIndex + 1 + i);
			var cell = row.insertCell();
			var index = 0;
			
			cell.colSpan = 3;
			cell.height = 50;
			cell.id = "0000000000_0_" + i;

			index = infos.indexOf('&');
			cell.innerHTML = infos.substring(0, index);				
			infos = infos.substring((index + 1));
		}		
	}

	
	//sendHttpReq("POST", path, jsonStr);
}

function closeTree(curRowIndex, id)
{
	var infoTable = document.getElementById("infoTable");
	var index;
	var i = 0;
	var sum = 0;
	
	if (12 == id.length)
	{				
		var cur_index ;
		
		index = id.substring(0, 10);
		index = Number(index);
		
		for (i = 0; i < midIds[index][2].length; ++i)
		{
			sum += midIds[index][2][i][1];
		}
		
		sum += midIds[index][2].length ;
		
		cur_index = infoTable.rows[curRowIndex].cells[0].id.substring(0, 10);
		cur_index = Number(cur_index);
		
		for (i = 0; i < sum; ++i)
		{
			var tmp_index;
			
			tmp_index = infoTable.rows[curRowIndex + 1].cells[0].id.substring(0, 10);
			tmp_index = Number(tmp_index);
			
			if ((cur_index + 1) == tmp_index)
			{
				break;
			}
					
			infoTable.deleteRow(curRowIndex + 1);
		}
	}
	else if (14 == id.length)
	{
		var type = 0;
		
		index = id.substring(2, 12);
		index = Number(index);
		
		type = id.substring(0, 1);
		type = Number(type);
		
		sum = midIds[index][2][type][1];
		
		for (i = 0; i < sum; ++i)
		{
			infoTable.deleteRow(curRowIndex + 1);
		}
	}
}

function createXmlHttpRequest()
{
	if (window.ActiveXObject)
	{
		return new ActiveXObject("Microsoft.XMLHTTP");
	}
	else if (window.XMLHttpRequest)
	{
		return new XMLHttpRequest();
	}
}

function sendHttpReq(method, url, data)
{
	var http_request = createXmlHttpRequest();
		
	http_request.open(method, url, false);
	http_request.setRequestHeader('Content-Type', 'text/plain');
	http_request.send(data);
	
	return http_request.responseText;
}

function initInfoTable(sum)
{
	var infoTable = '<table id="infoTable" width="1070" height="100" border="1" align="center" cellspacing="0" bordercolor="#000000">';
	var tableHeader = 
	' <tr>\
    	<td width="697" class="midIdItem0" >中间件名称ID</td>\
   	 	<td width="176" class="midIdItem1" >网络状态</td>\
    	<td width="250" class="midIdItem2" >时间</td>\
 	 </tr>'
	var myTable = '';
	

	myTable = infoTable + tableHeader;
	for (var i = 0; i < sum; ++i)
	{
		var row = '';
		var chDate = '';
		var id = "0000000000";
		
		id = id + i;
		id = id.substring((id.length - 10));
		
		chDate = getChDate();					
		
		row = '<tr>' +
						'<td id="' + id + '_0" ' + 'class="midIdItem0" onClick="changeTreeStatus(this, arguments[0])">' + midIds[i][0] + "："  + midIds[i][1] + '</td>' +

						'<td class="midIdItem1">' + '状态：在线' + '</td>' +
						'<td id="' + id + '_date"' + 'class="midIdItem2">' + chDate + '</td>'+
					'</tr>';
		myTable += row;
	}

	document.getElementById("table_div").innerHTML = myTable;
}

function loadMidwareInfo()
{
	var tmp = "2&湖南长沙,4301221101,2,烤烟监控,2,育苗监控,2,&湖南浏阳,4301811101,1,烤烟监控,2,&&";
	var subStr = "";
	var index = 0;
	var midwareSum = 0;	
	var monitorSum = 0;	
	var i;
	
	tmp = sendHttpReq('GET', 'midwareInfo', null);
		
	index = tmp.indexOf('&');
	midwareSum = Number(tmp.substring(0, index));
	
	tmp = tmp.substring((index + 1));
	
	for (i = 0; i < midwareSum; ++i)
	{
		var array = new Array();
		var monitorArrs = new Array();
		
		index = tmp.indexOf(',');	
		array[0] = tmp.substring(0,index);	
		tmp = tmp.substring((index + 1));
	
		index = tmp.indexOf(',');	
		array[1] = tmp.substring(0,index);
		tmp = tmp.substring((index + 1));
		
		index = tmp.indexOf(',');	
		monitorSum = tmp.substring(0, index);
		tmp = tmp.substring((index + 1));

		for (var j = 0; j < monitorSum; ++j)
		{
			var monitorArr = new Array();
			
			index = tmp.indexOf(',');	
			monitorArr[0] = tmp.substring(0, index);
			tmp = tmp.substring((index + 1));	

			index = tmp.indexOf(',');	
			monitorArr[1] = tmp.substring(0, index);
			tmp = tmp.substring((index + 1));
	
			monitorArrs[j] = monitorArr;
		}

		array[2] = monitorArrs;
		
		midIds[i] = array;
		
		tmp = tmp.substring(1, tmp.length);
	}
	
	return 	midwareSum;
}

function init()
{

	//var midId0 = new Array("湖南长沙","0000000000",[["烤烟监控",2],["育苗监控",2]]);

	initInfoTable(loadMidwareInfo());

	//document.getElementById("display").innerHTML = midIds[2][2][0][1];
	setTimeout("updateDate()", 1000);
}

function updateDate()
{
	var sum = midIds.length;
	
	for (var i = 0; i < sum; ++i)
	{
		var id = "0000000000";
		
		id = id + i;
		id = id.substring((id.length - 10));
		id = id + '_date';
		
		document.getElementById(id).innerHTML = getChDate();
	}
	
	try
	{
		//document.getElementById("display").innerHTML = document.getElementById("0000000000_0_0").innerHTML;
	}
	catch(err)
	{
		
	}
	
	setTimeout("updateDate()", 1000);	
}

function getChDate()
{
	var date = new Date();
	var tmp = '0000';
	var chDate = '';
	
	tmp = tmp + date.getFullYear();
	tmp = tmp.substring((tmp.length - 4)) + "年";
	chDate = tmp;
	tmp = "00";
	tmp = tmp + (date.getMonth() + 1);
	tmp = tmp.substring((tmp.length - 2)) + "月";
	chDate = chDate + tmp;
	tmp = "00";
	tmp = tmp + (date.getDate());
	tmp = tmp.substring((tmp.length - 2)) + "日 ";
	chDate = chDate + tmp;
	tmp = "00";
	tmp = tmp + (date.getHours());
	tmp = tmp.substring((tmp.length - 2)) + ":";
	chDate = chDate + tmp;
	tmp = "00";
	tmp = tmp + (date.getMinutes());
	tmp = tmp.substring((tmp.length - 2)) + " ";
	chDate = chDate + tmp;		
	tmp = "00";
	tmp = tmp + (date.getSeconds());
	tmp = tmp.substring((tmp.length - 2));
	chDate = chDate + tmp;	
	
	return chDate;	
}

function secondTreeEvt()
{
	changeTreeStatus(this, arguments[0]);
}
