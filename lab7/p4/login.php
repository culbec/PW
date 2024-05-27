<?php
$server = "localhost";
$db = "BestSite";
$user = "mariadb";
$pass = "mariadb";

$conn = mysqli_connect($server, $user, $pass, $db);
if (!$conn) {
    die("Couldn't connect: " . mysqli_connect_error());
}

$username = trim(htmlspecialchars(mysqli_real_escape_string($conn, $_POST["username"])));
$password = trim(htmlspecialchars(mysqli_real_escape_string($conn, $_POST["password"])));

$query = mysqli_prepare($conn, 'SELECT * FROM users where username = ?');
$query->bind_param('s', $username);
$query->execute();
$result = $query->get_result();

if (!$result->num_rows) {
    echo "Date invalide";
    echo file_get_contents("./index.html");
    return;
}

$row = $result->fetch_row();
$hashed = $row[2];
if (!password_verify($password, $hashed)) {
    echo "Date invalide";
    echo file_get_contents("./index.html");
    return;
}

if (!strcmp($row[4], "pending")) {
    echo "Inregistrarea este inca in asteptare...";
    echo file_get_contents("./index.html");
    return;
}

echo "User logat";

?>