<?php
# Ensure command is set
if(!isset($_POST['command'])) {
    die(json_encode(array(
        'error' => true,
        'msg' => 'POST variable \'command\' not set.'
    )));
}

# Initiate fields array
$fields = array(
    'apikey' => '7hjqpubu99q2xw5n9atsu4hw',
    'format' => 'json'
);

# Append fields & finish url depending on command
switch($_POST['command']) {
    case 'getHotelPrice':
        $fields += array(
            'dest' => $_POST['location'],
            'rooms' => $_POST['rooms'],
            'adults' => $_POST['people'],
            'children' => 0,
            'startdate' => $_POST['checkin'],
            'enddate' => $_POST['checkout']
        );
        $apiType = 'hotel';
        break;
    case 'getCarPrice':
        $fields += array(
            'dest' => $_POST['location'],
            'startdate' => $_POST['pickup'],
            'enddate' => $_POST['dropoff'],
            'pickuptime' => '10:00',
            'dropofftime' => '13:30'
        );
        $apiType = 'car';
        break;
    default:
        die(json_encode(array(
            'error' => true,
            'msg' => "Unknown command '{$_POST['command']}'.")));    
}

# Form & format url params
$getString = '';
foreach($fields as $key => $value) {
    $getString .= $key . '=' . urlencode($value) . '&';
}

# Communicate w/ API via cURL
$ch = curl_init("http://api.hotwire.com/v1/search/{$apiType}?" . substr($getString, 0, -1));
if ($ch !== false) {
    curl_setopt_array($ch, array(
        CURLOPT_HEADER => false,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20
    ));
    $json = curl_exec($ch);
    curl_close($ch);
}

# If error or empty, return error message
if (!isset($json) || @empty($json)) {
    die(json_encode(array(
        'error' => true,
        'msg' => 'Error executing curl, try again.'
    )));
}

# Decode API return & init. price
$decoded = json_decode($json);
$price = 0;

# Add all prices returned (instances of PHP stdObject)
foreach ($decoded->Result as $hotel) {
    $price += $hotel->TotalPrice;
}

# Return average total price
echo json_encode(array(
    'avg' => number_format($price / count($decoded->Result), 2, '.', ''),
    'error' => false
));
