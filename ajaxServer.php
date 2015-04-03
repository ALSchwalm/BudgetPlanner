<?php
if(!isset($_POST['command'])) {
    die(json_encode(array(
        'error' => true,
        'msg' => 'POST variable \'command\' not set.')));
}

switch($_POST['command']) {
    case 'getHotelPrice':
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
                CURLOPT_TIMEOUT => 20
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
            $price += $hotel->TotalPrice;
        }
        
        echo json_encode(array(
            'avg' => number_format($price / count($decoded->Result), 2, '.', ''),
            'error' => false));
        break;
    case 'getCarPrice':
        $fields = array(
            'apikey' => '7hjqpubu99q2xw5n9atsu4hw',
            'dest' => $_POST['location'],
            'startdate' => $_POST['pickup'],
            'enddate' => $_POST['dropoff'],
            'pickuptime' => '10:00',
            'dropofftime' => '13:30',
            'format' => 'json'
        );
        $getString = '';
        foreach($fields as $key => $value) {
            $getString .= $key . '=' . urlencode($value) . '&';
        }
        
        $ch = curl_init('http://api.hotwire.com/v1/search/car?' . substr($getString, 0, -1));
        if ($ch !== false) {
            curl_setopt_array($ch, array(
                CURLOPT_HEADER => false,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 20
            ));
            $json = curl_exec($ch);
            curl_close($ch);
        }
        
        if (!isset($json) || @empty($json)) die(json_encode(array(
            'error' => true,
            'msg' => 'Error executing curl, try again.')));
        
        $decoded = json_decode($json);
        $price = 0;
        
        foreach ($decoded->Result as $car) {
            $price += $car->TotalPrice;
        }
        echo json_encode(array(
            'avg' => number_format($price / count($decoded->Result), 2, '.', ''),
            'error' => false));
        break;
    case 'getPlanePrice':
    
        break;
    default:
        die(json_encode(array(
            'error' => true,
            'msg' => "Unknown command '{$_POST['command']}'.")));    
}


