// GenFunctions
function request_get_js(param) {
	return htmlEntities(addSlashes(param.trim()));
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function addSlashes(string) {
    return string.replace(/\\/g, '\\\\').
        replace(/\u0008/g, '\\b').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\f/g, '\\f').
        replace(/\r/g, '\\r').
        replace(/'/g, '\\\'').
        replace(/"/g, '\\"');
}

function getCurrentDateFormat() {
    var d = new Date,
        dformat = [d.getDate(), d.getMonth()+1, d.getFullYear()].join('-')+' '+[d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
    return dformat;
}

function getCurrentDateDBFormat() {
    var d = new Date,
        dformat = [d.getFullYear(), ("0" + (d.getMonth() + 1)).slice(-2), ("0" + d.getDate()).slice(-2)].join('-')+' '+[("0" + d.getHours()).slice(-2), ("0" + d.getMinutes()).slice(-2), ("0" + d.getSeconds()).slice(-2)].join(':');
    return dformat;
}

function isInArray(value, array) {

    //var rr = array.indexOf(value);
    var rr = $.inArray(parseInt(value), array);
    //console.log("value : "+value+"; array: "+array+" ::: Result : "+rr);
    
    if(rr>=0)
        return "1";
    else
        return "0";
  //return array.indexOf(value) > -1;
}

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
    return this;
}

var efDB = {};
efDB.webdb = {};

efDB.webdb.db = null;

efDB.webdb.openDB = function() {
  var dbSize = 5 * 1024 * 1024; // 5MB
  efDB.webdb.db = openDatabase("eFinance", "1.0", "eFinance App", dbSize);
}

efDB.webdb.onError = function(tx, e) {
  alert("There has been an error: " + e.message);
}

efDB.webdb.onSuccess = function(tx, r) {
  // re-render the data.
  // loadTodoItems is defined in Step 4a
  //efDB.webdb.getAllTodoItems(loadTodoItems);
}

efDB.webdb.createTables = function() {
  var db = efDB.webdb.db;
  db.transaction(function(tx) {
    
    tx.executeSql("CREATE TABLE IF NOT EXISTS tbl_app_settings (id INTEGER PRIMARY KEY ASC, app_name TEXT, app_logo TEXT, status INTEGER, ts DATETIME)", []);
    tx.executeSql("CREATE TABLE IF NOT EXISTS tbl_customer (id INTEGER PRIMARY KEY ASC, customer_number INTEGER, customer_name TEXT, address TEXT, mobile_no TEXT, status INTEGER, created DATETIME, createdby TEXT, modified DATETIME, modifiedby TEXT)", []);
    tx.executeSql("CREATE TABLE IF NOT EXISTS tbl_transaction_master (id INTEGER PRIMARY KEY ASC, customer_id INTEGER, trans_date DATETIME, amount INTEGER, status INTEGER, created DATETIME, createdby TEXT, modified DATETIME, modifiedby TEXT)", []);
    tx.executeSql("CREATE TABLE IF NOT EXISTS tbl_transaction_payments (id INTEGER PRIMARY KEY ASC, trans_master_id INTEGER, customer_id INTEGER, payment_date DATETIME, amount INTEGER, status INTEGER, created DATETIME, createdby TEXT, modified DATETIME, modifiedby TEXT)", []);
    tx.executeSql("CREATE TABLE IF NOT EXISTS tbl_users (id INTEGER PRIMARY KEY ASC, fullname TEXT, username TEXT, password TEXT, status INTEGER, usertype INTEGER, created DATETIME, createdby TEXT, modified DATETIME, modifiedby TEXT)", []);
    //tx.executeSql("DROP TABLE tbl_sync", []);
    tx.executeSql("CREATE TABLE IF NOT EXISTS tbl_sync (id INTEGER PRIMARY KEY ASC, last_sync_date DATETIME)", []);
    tx.executeSql("CREATE TABLE IF NOT EXISTS tbl_remember (id INTEGER, username TEXT, password TEXT)", []);

  });
}

// Customers DB Transactions
var LocalCustomerIdsArray = [];

efDB.webdb.getLocalCustomerIdsArray = function()
{
    var db = efDB.webdb.db;

    db.transaction(function (tx) {

        tx.executeSql('SELECT id FROM tbl_customer ', [], function (tx, results) 
        {
           var len = results.rows.length;
           if (len>0)
           {
                //console.log("ROWS FOUND");
                for(var i=0;i<len;i++)
                {
                    LocalCustomerIdsArray[i] = results.rows[i].id;
                }
           }
           else
           {
                console.log("Customer ROWS NOT FOUND");
           }
        }, null);

    });

}

efDB.webdb.syncTblCustomers = function(datas)
{
    var datas_size = Object.size(datas);

    for(var i=0;i<datas_size;i++)
    {        
        var cur_data_objData = datas[i].data;
        var cur_data_id = datas[i].id;

        var idFound = isInArray(cur_data_id,LocalCustomerIdsArray);
        
        if(idFound=="0")
        {
            //console.log("INSERT");
            efDB.webdb.saveCustomer(cur_data_objData,"1");
        }else{
            //console.log("UPDATE");
            efDB.webdb.saveCustomer(cur_data_objData,"2");
        }
    }

}

efDB.webdb.saveCustomer = function(cur_data_objData,type)
{
    var db = efDB.webdb.db;
    var id = cur_data_objData.id;
    var customer_name = cur_data_objData.customer_name;
    var customer_number = cur_data_objData.customer_number;
    var mobile_no = cur_data_objData.mobile_no;
    var address = cur_data_objData.address;
    var status = cur_data_objData.status;
    var created = cur_data_objData.created;
    var createdby = cur_data_objData.createdby;
    var modified = cur_data_objData.modified;
    var modifiedby = cur_data_objData.modifiedby;

    if(type=="1")
    {
        db.transaction(function (tx) {        
            var sql = "INSERT INTO tbl_customer (id , customer_number, customer_name, address, mobile_no, status, created, createdby, modified, modifiedby) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            tx.executeSql(sql, [id, customer_number, customer_name, address, mobile_no, status, created, createdby, modified, modifiedby]);
        });
    }
    else if(type=="2")
    {
        db.transaction(function (tx) {
            var sql = "UPDATE tbl_customer SET  customer_number=?, customer_name=?, address=?, mobile_no=?, status=?, created=?, createdby=?, modified=?, modifiedby=? WHERE id = '"+id+"' ";
            tx.executeSql(sql, [customer_number, customer_name, address, mobile_no, status, created, createdby, modified, modifiedby]);
        });
    }
}
// -----------------------------------------------------------------------------------------------------------------------------------------------------------

// transaction_master DB Transactions
var LocalTransactionMasterIdsArray = [];

efDB.webdb.getTransactionMasterIdsArray = function()
{
    var db = efDB.webdb.db;

    db.transaction(function (tx) {

        tx.executeSql('SELECT id FROM tbl_transaction_master ', [], function (tx, results) 
        {
           var len = results.rows.length;
           //console.log("len : "+len);
           if (len>0)
           {
                //console.log("ROWS FOUND");
                //console.log(results.rows);
                for(var i=0;i<len;i++)
                {
                    LocalTransactionMasterIdsArray[i] = results.rows[i].id;
                }
           }
           else
           {
                console.log("TransactionMaster - ROWS NOT FOUND");
           }
        }, null);

    });

}

efDB.webdb.syncTblTransactionMaster = function(datas)
{

    var datas_size = Object.size(datas);

    for(var i=0;i<datas_size;i++)
    {        
        var cur_data_objData = datas[i].data;
        var cur_data_id = datas[i].id;

        var idFound = isInArray(cur_data_id,LocalTransactionMasterIdsArray);

        if(idFound==0)
        {
            //console.log("INSERT -- TransactionMaster");
            efDB.webdb.saveTransactionMaster(cur_data_objData,"1");
        }else{
            //console.log("UPDATE -- TransactionMaster");
            efDB.webdb.saveTransactionMaster(cur_data_objData,"2");
        }

    }

}

efDB.webdb.saveTransactionMaster = function(cur_data_objData,type)
{
    var db = efDB.webdb.db;
    var id = cur_data_objData.id;
    var customer_id = cur_data_objData.customer_id;
    var trans_date = cur_data_objData.trans_date;
    var amount = cur_data_objData.amount;
    var status = cur_data_objData.status;
    var created = cur_data_objData.created;
    var createdby = cur_data_objData.createdby;
    var modified = cur_data_objData.modified;
    var modifiedby = cur_data_objData.modifiedby;

    if(type=="1")
    {
        db.transaction(function (tx) {
            var sql = "INSERT INTO tbl_transaction_master (id, customer_id, trans_date, amount, status, created, createdby, modified, modifiedby) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            tx.executeSql(sql, [id, customer_id, trans_date, amount, status, created, createdby, modified, modifiedby]);
        });
    }
    else if(type=="2")
    {
        db.transaction(function (tx) {
            var sql = "UPDATE tbl_transaction_master SET customer_id=?, trans_date=?, amount=?, status=?, created=?, createdby=?, modified=?, modifiedby=? WHERE id = '"+id+"' ";
            tx.executeSql(sql, [customer_id, trans_date, amount, status, created, createdby, modified, modifiedby]);
        });
    }

}

// -----------------------------------------------------------------------------------------------------------------------------------------------------------
// transaction_payments DB Transactions
var LocalTransactionPaymentsIdsArray = [];

efDB.webdb.getTransactionPaymentsIdsArray = function()
{
    var db = efDB.webdb.db;

    db.transaction(function (tx) {

        tx.executeSql('SELECT id FROM tbl_transaction_payments ', [], function (tx, results) 
        {
           var len = results.rows.length;
           //console.log("len : "+len);
           if (len>0)
           {
                //console.log("ROWS FOUND");
                //console.log(results.rows);
                for(var i=0;i<len;i++)
                {
                    LocalTransactionPaymentsIdsArray[i] = results.rows[i].id;
                }
           }
           else
           {
                console.log("TransactionPayments - ROWS NOT FOUND");
           }
        }, null);

    });

}

efDB.webdb.syncTblTransactionPaymentsMaster = function(datas)
{
    var datas_size = Object.size(datas);

    for(var i=0;i<datas_size;i++)
    {        
        var cur_data_objData = datas[i].data;
        var cur_data_id = datas[i].id;

        var idFound = isInArray(cur_data_id,LocalTransactionPaymentsIdsArray);
        //console.log("idFound : "+idFound);

        if(idFound==0)
        {
            //console.log("INSERT -- TransactionMaster");
            efDB.webdb.saveTransactionPayments(cur_data_objData, "1");
        }else{
            //console.log("UPDATE -- TransactionMaster");
            efDB.webdb.saveTransactionPayments(cur_data_objData, "2");
        }

    }

}

efDB.webdb.saveTransactionPayments = function(cur_data_objData,type)
{
    var db = efDB.webdb.db;
    var id = cur_data_objData.id;
    var trans_master_id = cur_data_objData.trans_master_id;
    var customer_id = cur_data_objData.customer_id;
    var payment_date = cur_data_objData.payment_date;
    var amount = cur_data_objData.amount;
    var status = cur_data_objData.status;
    var created = cur_data_objData.created;
    var createdby = cur_data_objData.createdby;
    var modified = cur_data_objData.modified;
    var modifiedby = cur_data_objData.modifiedby;

    if(type=="1")
    {
        //id, trans_master_id, customer_id, payment_date, amount, status, created, createdby, modified, modifiedby
        db.transaction(function (tx) {
            var sql = "INSERT INTO tbl_transaction_payments (id, trans_master_id, customer_id, payment_date, amount, status, created, createdby, modified, modifiedby) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            tx.executeSql(sql, [id, trans_master_id, customer_id, payment_date, amount, status, created, createdby, modified, modifiedby]);
        });
    }
    else if(type=="2")
    {
        db.transaction(function (tx) {
            var sql = "UPDATE tbl_transaction_payments SET trans_master_id=?, customer_id=?, trans_date=?, amount=?, status=?, created=?, createdby=?, modified=?, modifiedby=? WHERE id = '"+id+"' ";
            tx.executeSql(sql, [trans_master_id, customer_id, payment_date, amount, status, created, createdby, modified, modifiedby]);
        });
    }

}

// -----------------------------------------------------------------------------------------------------------------------------------------------------------
// app_settings DB Transactions
var LocalAppSettingsIdsArray = [];

efDB.webdb.getAppSettingsIdsArray = function()
{
    var db = efDB.webdb.db;

    db.transaction(function (tx) {

        tx.executeSql('SELECT id FROM tbl_app_settings ', [], function (tx, results) 
        {
           var len = results.rows.length;
           //console.log("len : "+len);
           if (len>0)
           {
                //console.log("ROWS FOUND");
                //console.log(results.rows);
                for(var i=0;i<len;i++)
                {
                    LocalAppSettingsIdsArray[i] = results.rows[i].id;
                }
           }
           else
           {
                console.log("AppSettings - ROWS NOT FOUND");
           }
        }, null);

    });

}

efDB.webdb.syncTblAppSettings = function(datas)
{
    var datas_size = Object.size(datas);

    for(var i=0;i<datas_size;i++)
    {        
        var cur_data_objData = datas[i].data;
        var cur_data_id = datas[i].id;

        var idFound = isInArray(cur_data_id,LocalAppSettingsIdsArray);
        //console.log("idFound : "+idFound);

        if(idFound==0)
        {
            //console.log("INSERT -- TransactionMaster");
            efDB.webdb.saveAppSettings(cur_data_objData, "1");
        }else{
            //console.log("UPDATE -- TransactionMaster");
            efDB.webdb.saveAppSettings(cur_data_objData, "2");
        }

    }

}

efDB.webdb.saveAppSettings = function(cur_data_objData,type)
{
    var db = efDB.webdb.db;
    var id = cur_data_objData.id;
    var app_name = cur_data_objData.app_name;
    var app_logo = cur_data_objData.app_logo;
    var status = cur_data_objData.status;
    var ts = cur_data_objData.ts;

    if(type=="1")
    {
        db.transaction(function (tx) {
            var sql = "INSERT INTO tbl_app_settings (id, app_name, app_logo, status, ts) VALUES (?, ?, ?, ?, ?)";
            tx.executeSql(sql, [id, app_name, app_logo, status, ts]);
        });
    }
    else if(type=="2")
    {
        db.transaction(function (tx) {
            var sql = "UPDATE tbl_app_settings SET app_name=?, app_logo=?, status=?, ts=? WHERE id = '"+id+"' ";
            tx.executeSql(sql, [app_name, app_logo, status, ts]);
        });
    }

}



// -----------------------------------------------------------------------------------------------------------------------------------------------------------
// tbl_users DB Transactions
var LocalUsersIdsArray = [];

efDB.webdb.getUsersIdsArray = function()
{
    var db = efDB.webdb.db;

    db.transaction(function (tx) {

        tx.executeSql('SELECT id FROM tbl_users ', [], function (tx, results) 
        {
           var len = results.rows.length;
           //console.log("len : "+len);
           if (len>0)
           {
                //console.log("ROWS FOUND");
                //console.log(results.rows);
                for(var i=0;i<len;i++)
                {
                    LocalUsersIdsArray[i] = results.rows[i].id;
                }
           }
           else
           {
                console.log("Users - ROWS NOT FOUND");
           }
        }, null);

    });

}

efDB.webdb.syncTblUsers = function(datas)
{
    var datas_size = Object.size(datas);

    for(var i=0;i<datas_size;i++)
    {        
        var cur_data_objData = datas[i].data;
        var cur_data_id = datas[i].id;

        var idFound = isInArray(cur_data_id,LocalUsersIdsArray);
        //console.log("idFound : "+idFound);

        if(idFound==0)
        {
            //console.log("INSERT -- TransactionMaster");
            efDB.webdb.saveUsers(cur_data_objData, "1");
        }else{
            //console.log("UPDATE -- TransactionMaster");
            efDB.webdb.saveUsers(cur_data_objData, "2");
        }

    }

}

efDB.webdb.saveUsers = function(cur_data_objData,type)
{
    var db = efDB.webdb.db;
    var id = cur_data_objData.id;
    var fullname = cur_data_objData.fullname;
    var username = cur_data_objData.username;
    var password = cur_data_objData.password;
    var usertype = cur_data_objData.usertype;
    var status = cur_data_objData.status;
    var created = cur_data_objData.created;
    var createdby = cur_data_objData.createdby;
    var modified = cur_data_objData.modified;
    var modifiedby = cur_data_objData.modifiedby;

    if(type=="1")
    {
        db.transaction(function (tx) {
            var sql = "INSERT INTO tbl_users (id, fullname, username, password, status, usertype, created, createdby, modified, modifiedby) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            tx.executeSql(sql, [id, fullname, username, password, status, usertype, created, createdby, modified, modifiedby]);
        });
    }
    else if(type=="2")
    {
        db.transaction(function (tx) {
            var sql = "UPDATE tbl_users SET fullname=?, username=?, password=?, status=?, usertype=?, created=?, createdby=?, modified=?, modifiedby=? WHERE id = '"+id+"' ";
            tx.executeSql(sql, [fullname, username, password, status, usertype, created, createdby, modified, modifiedby]);
        });
    }

}



// -----------------------------------------------------------------------------------------------------------------------------------------------------------
// tbl_sync DB Transactions
var LocalSyncIdsArray = [];

efDB.webdb.getSyncIdsArray = function()
{
    var db = efDB.webdb.db;

    db.transaction(function (tx) {

        tx.executeSql('SELECT id FROM tbl_sync ', [], function (tx, results) 
        {
           var len = results.rows.length;
           //console.log("len : "+len);
           if (len>0)
           {
                //console.log("ROWS FOUND");
                //console.log(results.rows);
                for(var i=0;i<len;i++)
                {
                    LocalSyncIdsArray[i] = results.rows[i].id;
                }
           }
           else
           {
                console.log("Sync - ROWS NOT FOUND");
           }
        }, null);

    });

}

efDB.webdb.syncTblSync = function(datas)
{
    //var datas_size = Object.size(datas);

    var idFound = LocalSyncIdsArray.length;

    if(idFound==0)
    {
        //console.log("INSERT -- TransactionMaster");
        efDB.webdb.saveSync(datas, "1");
    }else{
        //console.log("UPDATE -- TransactionMaster");
        efDB.webdb.saveSync(datas, "2");
    }

}

efDB.webdb.saveSync = function(cur_data_objData,type)
{
    var db = efDB.webdb.db;
    var id = "1";
    var last_sync_date = cur_data_objData;
    
    if(type=="1")
    {
        db.transaction(function (tx) {
            var sql = "INSERT INTO tbl_sync (id, last_sync_date) VALUES (?, ?)";
            tx.executeSql(sql, [id, last_sync_date]);
        });
    }
    else if(type=="2")
    {
        db.transaction(function (tx) {
            var sql = "UPDATE tbl_sync SET last_sync_date=? WHERE id = '1' ";
            tx.executeSql(sql, [last_sync_date]);
        });
    }

}

var lastSyncDateLocalDB = "";

var full_array = {
                    "lastsync" : "",
                    "syncStartDate" : "",
                    "syncEndDate" : "",
                    "customers" : {},
                    "transaction_master" : {},
                    "transaction_payments" : {}
                };

efDB.webdb.getLastSyncDate = function()
{
    var db = efDB.webdb.db;
    // LastSyncDate
    db.transaction(function (tx) {

        tx.executeSql('SELECT * FROM tbl_sync WHERE id = "1" ', [], function (tx, results) 
        {
           var len = results.rows.length;
           if (len>0)
           {
                lastSyncDateLocalDB = results.rows[0].last_sync_date;
                full_array.syncStartDate = lastSyncDateLocalDB;
           }
           else
           {
                console.log("Sync - ROWS NOT FOUND");
           }
        }, null);

    });

}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------

efDB.webdb.syncLocalDB2Server = function() {

    var current_sync = getCurrentDateDBFormat();
    //var lastSyncDateLocalDB = efDB.webdb.getLastSyncDate();

    /*console.log(" current_sync : "+current_sync);
    console.log(" lastSyncDateLocalDB : "+lastSyncDateLocalDB);*/

    full_array.lastsync = current_sync;
    full_array.syncEndDate = current_sync;

    var customers = [];

    var db = efDB.webdb.db;

    var wh = ' WHERE modified>="'+lastSyncDateLocalDB+'" and modified<="'+current_sync+'" ';

    // Customers
    db.transaction(function (tx) {

        tx.executeSql('SELECT * FROM tbl_customer '+wh+' ', [], function (tx, results) 
        {
           var len = results.rows.length;
           if (len>0)
           {
                for(var i=0;i<len;i++)
                {
                    customers.push({"id":results.rows[i].id, "data":results.rows[i] });
                }

                full_array.customers = customers;
           }
           else
           {
                console.log("Sync - ROWS NOT FOUND");
           }
        }, null);

    });

    var transaction_master = [];
    // transaction_master
    db.transaction(function (tx) {

        tx.executeSql('SELECT * FROM tbl_transaction_master '+wh+' ', [], function (tx, results) 
        {
           var len = results.rows.length;
           if (len>0)
           {
                for(var i=0;i<len;i++)
                {
                    transaction_master.push({"id":results.rows[i].id, "data":results.rows[i] });
                }

                full_array.transaction_master = transaction_master;
           }
           else
           {
                console.log("Sync - ROWS NOT FOUND");
           }
        }, null);

    });


    var transaction_payments = [];
    // transaction_payments
    db.transaction(function (tx) {

        tx.executeSql('SELECT * FROM tbl_transaction_payments '+wh+' ', [], function (tx, results) 
        {
           var len = results.rows.length;
           if (len>0)
           {
                for(var i=0;i<len;i++)
                {
                    transaction_payments.push({"id":results.rows[i].id, "data":results.rows[i] });
                }

                full_array.transaction_payments = transaction_payments;

                /*console.log("full_array");
                console.log(full_array);*/

                fnSendClient2Server(full_array);
           }
           else
           {
                console.log("Sync - ROWS NOT FOUND");
           }
        }, null);

    });

}

var curUserDetails = [];

efDB.webdb.checkUserLogin = function()
{
    var db = efDB.webdb.db;

    db.transaction(function (tx) {

        tx.executeSql('SELECT * FROM tbl_users ', [], function (tx, results) 
        {
           var len = results.rows.length;
           if (len>0)
           {
               curUserDetails.push({ "id": results.rows[0].id, "username":results.rows[0].username, "password":results.rows[0].password, "fullname":results.rows[0].fullname });
           }
           else
           {
                return 0;
           }
        }, null);

    });

}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------
// Remember User Info
efDB.webdb.getRememberedUserInfoFromLocalDB = function() {
    
    var db = efDB.webdb.db;
    db.transaction(function (tx) {
      
      tx.executeSql("SELECT * FROM tbl_remember WHERE id='1' ", [], function (tx, results) {
       
            var len = results.rows.length, i;

            if(len>0)
            {
                for (i = 0; i < len; i++)
                {
                    document.getElementById("uname").value=results.rows.item(i).username;
                    document.getElementById("pwd").value=results.rows.item(i).password;
                    document.getElementById("rmb").checked = true;
                }
            }else{
                    document.getElementById("uname").value="";
                    document.getElementById("pwd").value="";
                    document.getElementById("rmb").checked = false;
            }

        }, null);
    });

}

efDB.webdb.deleteRememberLocalDB = function() {
    
    var db = efDB.webdb.db;
    db.transaction(function (tx) {  

        var tbl_upd="DELETE FROM `tbl_remember` WHERE id='1' ";
        tx.executeSql(tbl_upd);

        console.log("Remembered User Deleted!");
    });

}

efDB.webdb.rememberLocalDB = function(login_details) {
    
    var db = efDB.webdb.db;

    var un = login_details.un;
    var pwd = login_details.pwd;

    db.transaction(function (tx) {
      
      tx.executeSql("SELECT * FROM tbl_remember WHERE id='1' ", [], function (tx, results) {
       
            var len = results.rows.length, i;

            if(0==len)
            {
                db.transaction(function (tx) {  
                        var tbl_ins="INSERT INTO `tbl_remember` (`id`, `username`, `password`) VALUES (1, '"+un+"', '"+pwd+"')";
                        tx.executeSql(tbl_ins);

                        console.log("User Remembered!");
                    });
            }else{

                db.transaction(function (tx) {  
                        var tbl_upd="UPDATE `tbl_remember` SET `username` = '"+un+"' , `password`='"+pwd+"' WHERE id='1' ";
                        tx.executeSql(tbl_upd);

                        console.log("Updated User Remembered!");
                });
            }

        }, null);
    });

}

function init() {
  efDB.webdb.openDB();
  efDB.webdb.createTables();
  efDB.webdb.getLocalCustomerIdsArray();
  efDB.webdb.getTransactionMasterIdsArray();
  efDB.webdb.getTransactionPaymentsIdsArray();
  efDB.webdb.getAppSettingsIdsArray();
  efDB.webdb.getUsersIdsArray();
  efDB.webdb.getSyncIdsArray();
  efDB.webdb.checkUserLogin();
}

init();

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function fnServer2ClientResult(output)
{
    /*console.log("fnServer2ClientResult");
    console.log(output);*/

    var size = Object.size(output);
    //console.log("Result Count : "+size);

    if(size>0){

        var status = output.status;
        var lastsync = output.lastsync;
        var result_data = output.result_data;

        var customer_arr = result_data.customers;
        var transaction_master_arr = result_data.transaction_master;
        var transaction_payments_arr = result_data.transaction_payments;
        var app_settings_arr = result_data.app_settings;
        var users_arr = result_data.users;

        efDB.webdb.syncTblCustomers(customer_arr);
        efDB.webdb.syncTblTransactionMaster(transaction_master_arr);
        efDB.webdb.syncTblTransactionPaymentsMaster(transaction_payments_arr);
        efDB.webdb.syncTblAppSettings(app_settings_arr);
        efDB.webdb.syncTblUsers(users_arr);
        efDB.webdb.syncTblSync(lastsync);

    }

}

function fnSendClient2Server(datas)
{
    var http = location.protocol;
    var slashes = http.concat("//");
    var host = slashes.concat(window.location.hostname);

    var newurl = host+"/eFinance/ws/c2s.php";

    var data = { type: "sync", localDBData: datas };

    $.ajax({
        crossDomain: true,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        async:false,
        url: newurl,
        data: data,
        dataType: "jsonp",                
        jsonpCallback: "fnClient2ServerResult"
    });
}

function fnClient2ServerResult(output)
{
    /*console.log("fnClient2ServerResult");
    console.log(fnClient2ServerResult);*/
}