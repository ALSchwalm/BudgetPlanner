<?php
include("connection.php");

$name = $_GET["query"];
$name = mysql_real_escape_string($name);

// Run the actual query
$result = mysql_query("SELECT name, duration, salary
                       FROM people WHERE name LIKE '%$name%' LIMIT 20", $connect)
        or die('Invalid query: ' . mysql_error());

// Collect the result into an arry
$rows = array();
while ($row = mysql_fetch_assoc($result)) {
    $rows[] = array("value"=>$row["name"], "data"=>$row);
}

// Return the array encoded as json
$json = json_encode(array("suggestions"=>$rows))
      or die(json_last_error());

print $json;

?>