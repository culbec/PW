<?php
$server = "localhost";
$db = "BestSite";
$user = "mariadb";
$pass = "mariadb";

$conn = mysqli_connect($server, $user, $pass, $db);
if (!$conn) {
    die("Couldn't connect: " . mysqli_connect_error());
}

$username = trim(htmlspecialchars(mysqli_real_escape_string($conn, $_GET["username"])));

$query = mysqli_prepare($conn, 'UPDATE users SET status = ? where username = ?');
$status = 'confirmed';
$query->bind_param('ss', $status, $username);
$query->execute();
$result = $query->get_result();

if (!$conn->affected_rows) {
    echo ''. $conn->error;
    die(1);
}

echo 'Account confirmed<br\>';
?>