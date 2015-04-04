<?php

// Connect to the sql server
$connect = mysql_connect("localhost", "db_user", "password")
    or die("unable to connect to msql server: " . mysql_error());

// Select the appropriate database
mysql_select_db("budget_db", $connect)
    or die("unable to select database 'db': " . mysql_error());

$id = $_POST["id"];
$id = mysql_real_escape_string($id);

$data = $_POST["data"];
$data = mysql_real_escape_string($data);

$title = $_POST["title"];
$title = mysql_real_escape_string($title);

$pi = $_POST["pi"];
$pi = mysql_real_escape_string($pi);

$sql_query = "INSERT INTO saved (id, title, pi, data) VALUES('$id', '$title', '$pi', '$data')
              ON DUPLICATE KEY UPDATE
              title=VALUES(title), pi=VALUES(pi), data=VALUES(data)";

$result = mysql_query($sql_query)
    or die('Invalid query: ' . mysql_error());

?>