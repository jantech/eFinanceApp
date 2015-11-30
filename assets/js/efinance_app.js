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
    return d;
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
    tx.executeSql("CREATE TABLE IF NOT EXISTS tbl_sync (id INTEGER PRIMARY KEY ASC, sync_userid TEXT, last_sync_date DATETIME)", []);
    tx.executeSql("CREATE TABLE IF NOT EXISTS tbl_remember (id INTEGER, username TEXT, password TEXT)", []);

  });
}


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
  efDB.webdb.getRememberedUserInfoFromLocalDB();
  //efDB.webdb.getAllTodoItems(loadTodoItems);
}

init();
