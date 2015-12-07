
function renderTable(tableData)
{
	console.log("Inside >> renderTable ");
	console.log(tableData);

	var tableHtml = "";
	var tableTHead = "";
	var tableBody = "";

	var thead_arr = tableData[0].tabHead;
	var tbody_arr = tableData[0].tabBody;

	for(var i=0;i<thead_arr.length;i++)
	{
		tableTHead += '<th>'+thead_arr[i]+'</th>';
	}
	
	for(var i=0;i<tbody_arr.length;i++)
	{
		tableBody += '<tr>';
		tableBody += '<td>'+tbody_arr[i].customer_number+'</td>';
		tableBody += '<td>'+tbody_arr[i].customer_name+'</td>';
		tableBody += '<td>'+getDisplayFormatedDate(tbody_arr[i].trans_date)+'</td>';
		tableBody += '<td>'+tbody_arr[i].total_amount+'</td>';
		tableBody += '<td>'+tbody_arr[i].total_paid+'</td>';
		tableBody += '<td>'+tbody_arr[i].remain_bal+'</td>';
		tableBody += '<td> <a class="paynow cursor btn btn-sm btn-success" tmid="'+tbody_arr[i].tmid+'" cid="'+tbody_arr[i].tm_customer_id+'"><i class="fui-paypal"></i></a> &nbsp; <a class="editTrans cursor btn btn-sm btn-info" tmid="'+tbody_arr[i].tmid+'" cid="'+tbody_arr[i].tm_customer_id+'"><i class="fui-new"></i></a>  &nbsp; <a class="viewPayments cursor btn btn-sm btn-inverse" tmid="'+tbody_arr[i].tmid+'" cid="'+tbody_arr[i].tm_customer_id+'"><i class="fui-list-numbered"></i></a> </td>';
		tableBody += '</tr>';
	}

	tableHtml += '<table id="example" class="table table-striped table-bordered dt-responsive nowrap" cellspacing="0" width="100%">';

	tableHtml += '<thead>';
	tableHtml += '<tr>'+tableTHead+'</tr>';
	tableHtml += '</thead>';
	
	tableHtml += '<tbody>';
	tableHtml += tableBody;
	tableHtml += '</tbody>';
	
	tableHtml += '</table>';

	$("#render_page_content").html(tableHtml);

	$('#example').DataTable();

}


function renderPaymentTable(tableData)
{
	console.log("Inside >> renderPaymentTable ");
	console.log(tableData);

	var tableHtml = "";
	var tableTHead = "";
	var tableBody = "";

	var thead_arr = tableData[0].tabHead;
	var tbody_arr = tableData[0].tabBody;

	for(var i=0;i<thead_arr.length;i++)
	{
		tableTHead += '<th>'+thead_arr[i]+'</th>';
	}
	
	for(var i=0;i<tbody_arr.length;i++)
	{
		tableBody += '<tr>';
		tableBody += '<td>'+getDisplayFormatedDate(tbody_arr[i].payment_date)+'</td>';
		tableBody += '<td>'+tbody_arr[i].amount+'</td>';
		tableBody += '<td> <a class="editPayment cursor btn btn-sm btn-info" tpid="'+tbody_arr[i].id+'" tmid="'+tbody_arr[i].tp_trans_master_id+'" cid="'+tbody_arr[i].tp_customer_id+'"><i class="fui-new"></i></a>  &nbsp; <a class="delPayment cursor btn btn-sm btn-danger" tpid="'+tbody_arr[i].id+'" tmid="'+tbody_arr[i].tp_trans_master_id+'" cid="'+tbody_arr[i].tp_customer_id+'"><i class="fui-trash"></i></a> </td>';
		tableBody += '</tr>';
	}

	tableHtml += '<table id="example" class="table table-striped table-bordered dt-responsive nowrap" cellspacing="0" width="100%">';

	tableHtml += '<thead>';
	tableHtml += '<tr>'+tableTHead+'</tr>';
	tableHtml += '</thead>';
	
	tableHtml += '<tbody>';
	tableHtml += tableBody;
	tableHtml += '</tbody>';
	
	tableHtml += '</table>';

	$("#render_page_content").html(tableHtml);

	$('#example').DataTable();

}


function renderCustomerTable(tableData)
{
	console.log("Inside >> renderCustomerTable ");
	console.log(tableData);

	var tableHtml = "";
	var tableTHead = "";
	var tableBody = "";

	var thead_arr = tableData[0].tabHead;
	var tbody_arr = tableData[0].tabBody;

	for(var i=0;i<thead_arr.length;i++)
	{
		tableTHead += '<th>'+thead_arr[i]+'</th>';
	}
	
	for(var i=0;i<tbody_arr.length;i++)
	{
		tableBody += '<tr>';
		tableBody += '<td>'+tbody_arr[i].customer_number+'</td>';
		tableBody += '<td>'+tbody_arr[i].customer_name+'</td>';
		tableBody += '<td>'+tbody_arr[i].address+'</td>';
		tableBody += '<td>'+tbody_arr[i].mobile_no+'</td>';
		tableBody += '<td> <a class="editCustomer cursor btn btn-sm btn-info" cid="'+tbody_arr[i].id+'"><i class="fui-new"></i></a>  &nbsp; <a class="delCustomer cursor btn btn-sm btn-danger" cid="'+tbody_arr[i].id+'" ><i class="fui-trash"></i></a> </td>';
		tableBody += '</tr>';
	}

	tableHtml += '<table id="example" class="table table-striped table-bordered dt-responsive nowrap" cellspacing="0" width="100%">';

	tableHtml += '<thead>';
	tableHtml += '<tr>'+tableTHead+'</tr>';
	tableHtml += '</thead>';
	
	tableHtml += '<tbody>';
	tableHtml += tableBody;
	tableHtml += '</tbody>';
	
	tableHtml += '</table>';

	$("#render_page_content").html(tableHtml);

	$('#example').DataTable();

}