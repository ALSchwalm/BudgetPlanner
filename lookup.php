<?php

// Connect to the sql server
$connect = mysql_connect("localhost", "db_user", "password")
         or die("unable to connect to msql server: " . mysql_error());

// Select the appropriate database
mysql_select_db("budget_db", $connect)
    or die("unable to select database 'db': " . mysql_error());

$name = $_GET["query"];
$name = mysql_real_escape_string($name);

// Run the actual query
$result = mysql_query("SELECT name, duration, salary
                       FROM people WHERE name LIKE '%$name%' LIMIT 20", $connect)
        or die('Invalid query: ' . mysql_error());

// Collect the result into an arry
$rows = array();
while ($row = mysql_fetch_assoc($result)) {
    $rows[] = ["value"=>$row["name"], "data"=>$row];
}

// Return the array encoded as json
print json_encode(["suggestions"=>$rows]);

?>