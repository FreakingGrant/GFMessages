<?php
$file = fopen("text_messages_list.txt", "r");

// List of text options
$options = [];

while(!feof($file)) {
    $options[] = fgets($file);
}

fclose($file);

echo json_encode(['options' => $options]);