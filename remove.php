<?php

include("connection.php");

$id = $_POST["id"];
$id = mysql_real_escape_string($id);

$sql_query = "DELETE FROM saved WHERE id='$id'";

$result = mysql_query($sql_query)
    or die('Invalid query: ' . mysql_error());

?>