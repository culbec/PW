<?php
require_once("./db.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = process_data($_POST["username"]);
    $password = process_data($_POST["password"]);

    $conn = create_db_connection();
    if ($conn == null) {
        echo "Couldn't initialize a database connection.";
        header("Location: ./index.php");
        exit(1);
    }

    $query = $conn->prepare("SELECT * FROM users WHERE username=:username");
    $query->bindParam(":username", $username, PDO::PARAM_STR);
    $query->execute();

    $result = $query->fetchAll(PDO::FETCH_ASSOC);
    if ($result === false || !count($result)) {
        echo "Invalid data!";
        header("Location: ./index.php");
        exit(1);
    }

    $hashed = $result[0]["password"];
    if (!password_verify($password, $hashed)) {
        echo "Invalid data!";
        header("Location: ./index.php");
        exit(1);
    }

    $role = $result[0]["role"];
    if ($role != "administrator") {
        echo "User not an administrator";
        exit(1);
    }

    $_SESSION["user_id"] = $result[0]['id'];
    header("Location: ./comments.php");
} else {
    echo "Method not allowed!";
}