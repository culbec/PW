<?php
$server = "localhost";
$db = "MockArticle";
$db_user = 'mariadb';
$db_password = 'mariadb';

function process_data($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function create_db_connection() {
    global $server, $db, $db_user, $db_password;
    $conn = null;

    try {
        $conn = new PDO("mysql:host=$server;dbname=$db", $db_user, $db_password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        echo "". $e->getMessage() ."";
    }
    
    return $conn;
}

