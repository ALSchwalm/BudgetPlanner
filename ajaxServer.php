<?php
$fields = array(
	'apikey' => '7hjqpubu99q2xw5n9atsu4hw',
	'dest' => 'Jackson, MS',
	'rooms' => 1,
	'adults' => 1,
	'children' => 0,
	'startdate' => '04/01/2015',
	'enddate' => '04/05/2015',
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

if (!isset($json) || @empty($json)) die('PC Load Letter');

$decoded = json_decode($json);
$price = 0;

foreach ($decoded->Result as $hotel) {
	$price += $hotel->AveragePricePerNight;
}

echo 'Average: $' . round($price / count($decoded->Result), 2) . '/ night';

