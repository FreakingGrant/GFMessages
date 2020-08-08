<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Twilio\Rest\Client;

// Your Account SID and Auth Token from twilio.com/console
$account_sid = 'AC62c834c8da37c84687e4e53fc523fb06';
$auth_token = '23134a257ffe0b05e254189f38c828d7';

// Phone numbers and message
$twilio_number = "+14245437138";
$target_number = $_POST['to'];
$text_message = $_POST['textMessage'];


// print_r($_POST);
// echo json_encode(['ok' => true, '_POST' => $_POST]);
// return;

$client = new Client($account_sid, $auth_token);


$message = $client->messages->create(
// Where to send a text message (your cell phone?)
    $target_number,
    array(
        'from' => $twilio_number,
        'body' => $text_message
    )
);


if ($message->errorCode === null) {
    echo json_encode(['ok' => true]);
}
else {
    echo json_encode(['ok' => false, 'errorMessage' => $message->errorMessage]);
    // echo json_encode(['ok' => false, 'errorMessage' => "It failed!"]);
}
