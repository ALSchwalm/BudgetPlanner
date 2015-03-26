<?php

// Connect to the sql server
$connect = mysql_connect("localhost", "db_user", "password")
    or die("unable to connect to msql server: " . mysql_error());

// Select the appropriate database
mysql_select_db("budget_db", $connect)
    or die("unable to select database 'db': " . mysql_error());

$id = $_GET["id"];
$id = mysql_real_escape_string($id);

$sql_query = "SELECT data FROM saved WHERE id='$id'";

$result = mysql_query($sql_query)
    or die('Invalid query: ' . mysql_error());

print json_encode(mysql_fetch_assoc($result)["data"]);

?>