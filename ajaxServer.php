<?php
$fields = array(
	'apikey' => '7hjqpubu99q2xw5n9atsu4hw',
	'dest' => $_POST['location'],
	'rooms' => $_POST['rooms'],
	'adults' => $_POST['people'],
	'children' => 0,
	'startdate' => $_POST['checkin'],
	'enddate' => $_POST['checkout'],
	'format' => 'json'
);
$getString = '';
foreach($fields as $key => $value) {
	$getString .= $key . '=' . urlencode($value) . '&';
}

$ch = curl_init('http://api.hotwire.com/v1/search/hotel?' . substr($getString, 0, -1));
if ($ch !== false) {
	curl_setopt_array($ch, array(
		CURLOPT_HEADER => false,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_TIMEOUT => 10
	));
	$json = curl_exec($ch);
	curl_close($ch);
}

if (!isset($json) || @empty($json)) die(json_encode(array(
    'error' => true,
    'msg' => 'Error executing curl, try again.')));

$decoded = json_decode($json);
$price = 0;

foreach ($decoded->Result as $hotel) {
	$price += $hotel->AveragePricePerNight;
}

echo json_encode(array(
    'avg' => round($price / count($decoded->Result), 2),
    'error' => false));

