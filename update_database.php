<?php

// TEMPORARY VALUES: DO NOT UPDATE WITH ACTUAL PASSWORD
// Connect to the sql server
$connect = mysql_connect("localhost", "db_user", "password")
    or die("unable to connect to msql server: " . mysql_error());

// Select the appropriate database
mysql_select_db("budget_db", $connect)
    or die("unable to select database 'db': " . mysql_error());

// Create the table
$result = mysql_query(
    "CREATE TABLE IF NOT EXISTS people (
        msu_id INT NOT NULL PRIMARY KEY,
        duration VARCHAR(10),
        name VARCHAR(50),
        title VARCHAR(100),
        department VARCHAR(100),
        salary FLOAT
    )", $connect)
        or die('Invalid query: ' . mysql_error());

$result = mysql_query(
    "CREATE TABLE IF NOT EXISTS saved (
        id VARCHAR(13) NOT NULL PRIMARY KEY,
        title TEXT,
        pi TEXT,
        data TEXT
    )"
) or die('Invalid query: ' . mysql_error());

// Get the data from the csv file
$csvData = file_get_contents("HPC_data.csv");

// Convert to array and drop first element
$lines = explode(PHP_EOL, $csvData);

// Drop first element (the column titles)
array_shift($lines);

foreach ($lines as $line) {
    $data = str_getcsv($line);

    // Skip empty lines
    if (!$data[0])
        continue;

    $escaped_values = array_map('mysql_real_escape_string', array_values($data));

    // Add quotes to string types. This is bad and should be fixed
    $escaped_values[0] = "\"".$escaped_values[0]."\"";
    $escaped_values[2] = "\"".$escaped_values[2]."\"";
    $escaped_values[3] = "\"".$escaped_values[3]."\"";
    $escaped_values[4] = "\"".$escaped_values[4]."\"";
    $values  = implode(", ", $escaped_values);

    // Insert values into the table or update them if they already exist
    $sql_query = "INSERT INTO people (name, msu_id, duration, title, department, salary)
                  VALUES($values) ON DUPLICATE KEY UPDATE
                  name=VALUES(name), duration=VALUES(duration), title=VALUES(title),
                  department=VALUES(department), salary=VALUES(salary)";

    $result = mysql_query($sql_query) or
        die('Invalid query: ' . mysql_error());
}
?>