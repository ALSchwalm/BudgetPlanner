<?php

$state = $_GET["state"];
$city = $_GET["city"];

$curl = curl_init("http://www.travel.msstate.edu/hcma/plhcma.php?state=$state&county=&city=$city");
curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
$output = curl_exec($curl);
echo $output;
curl_close($curl);