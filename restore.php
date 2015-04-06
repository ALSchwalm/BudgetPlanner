<?php

include("connection.php");

$id = $_GET["id"];
$id = mysql_real_escape_string($id);

$sql_query = "SELECT data FROM saved WHERE id='$id'";

$result = mysql_query($sql_query)
    or die('Invalid query: ' . mysql_error());

print json_encode(mysql_fetch_assoc($result)["data"]);

?>