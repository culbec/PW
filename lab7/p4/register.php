<?php
$server = "localhost";
$db = "BestSite";
$user = "mariadb";
$pass = "mariadb";

$conn = mysqli_connect($server, $user, $pass, $db);
if (!$conn) {
    die("Couldn't connect: " . mysqli_connect_error());
}

$email = trim(htmlspecialchars(mysqli_real_escape_string($conn, $_POST["email"])));
$username = trim(htmlspecialchars(mysqli_real_escape_string($conn, $_POST["username"])));
$password = password_hash(trim(htmlspecialchars(mysqli_real_escape_string($conn, $_POST["password"]))), PASSWORD_BCRYPT);

$pattern_email = '/^[^\.\s][\w\-\.{2,}]+@([\w-]+\.)+[\w-]{2,}$/';
$pattern_user = '/^[a-zA-Z][a-zA-Z0-9-_\.]{1,16}$/';
$pattern_pass = '/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/';

preg_match($pattern_email, $email, $matches_email, PREG_OFFSET_CAPTURE);
preg_match($pattern_user, $username, $matches_user, PREG_OFFSET_CAPTURE);
preg_match($pattern_pass, $password, $matches_pass, PREG_OFFSET_CAPTURE);

if (!count($matches_email) ||!count($matches_user) || !count($matches_pass)) {
    echo "Email: " . count($matches_email);
    echo "User: " . count($matches_user);
    echo "Password: " . count($matches_pass);
    echo file_get_contents("./index.html");
    return;
}

$query = mysqli_prepare($conn, 'SELECT * FROM users where username = ? and password = ?');
$query->bind_param('ss', $username, $password);
$query->execute();
$result = $query->get_result();

if (!$result || $result->num_rows) {
    echo "User-ul deja exista!";
    echo file_get_contents("./index.html");
    return;
}

$to = $email;
$subject = 'Email confirmation - Best Site';
$message = "Confirm your email at: http://localhost/p4/confirm-email.php?username=$username";
$headers = "From: best-site@example.com" . "\r\n" .
           "Reply-To: best-site@example.com" . "\r\n" .
           "X-Mailer: PHP/" . phpversion();

$val = mail($to, $subject, $message, $headers);
if (!$val) {
    echo "Mail not sent...";
    return;
}

echo "Mail sent successfully...";
// Inserting the user.
$query = mysqli_prepare($conn, 'INSERT INTO users(username, password, email, status) values (?, ?, ?, ?)');
$status = "pending";
$query->bind_param('ssss', $username, $password, $email, $status);
$query->execute();

if (!$conn->affected_rows) {
    echo "Couldn't register the user...";
    echo file_get_contents("./index.html");
    return;
}

?>