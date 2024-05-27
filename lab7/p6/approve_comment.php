<?php
require_once ("./db.php");

$conn = create_db_connection();

if ($conn == null) {
    echo "Couldn't establish a connection with the database!";
    exit(1);
}

$id = process_data($_POST["id"]);

$sql = $conn->prepare("UPDATE comments SET status = 'approved' WHERE id=:id");
$sql->bindParam(":id", $id, PDO::PARAM_INT);
$sql->execute();

if ($sql->rowCount() == 0) {
    echo "Something went wrong..." . $sql->errorInfo() . "\n";
    exit(1);
}

echo "Comment approved!";