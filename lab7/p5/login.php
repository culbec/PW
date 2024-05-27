<?php
session_start();
require_once ("./db.php");
function process_data($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = process_data($_POST["username"]);
    $password = process_data($_POST["password"]);

    $conn = create_db_connection();
    if ($conn == null) {
        echo "Couldn't initialize a database connection.";
        session_destroy();
        //header("Location: ./index.html");
        exit(1);
    }

    $query = $conn->prepare("SELECT * FROM users WHERE username=:username");
    $query->bindParam(":username", $username, PDO::PARAM_STR);
    $query->execute();

    $result = $query->fetchAll(PDO::FETCH_ASSOC);
    echo $result;
    if (!count($result)) {
        echo "Invalid data!";
        session_destroy();
        // header("Location: ./index.html");
        exit(1);
    }

    $hashed = $result[0]["password"];
    echo $hashed;
    if (!password_verify($password, $hashed)) {
        echo "Invalid data!";
        session_destroy();
        // header("Location: ./index.html");
        exit(1);
    }

    $_SESSION["user_id"] = $result[0]['id'];
    header("Location: ./profile.php");
} else {
    echo "Method not allowed!";
}

?>