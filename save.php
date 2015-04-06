<?php

include("connection.php");

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