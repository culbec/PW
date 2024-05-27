<?php
require_once ("./db.php");
$conn = create_db_connection();

if ($conn == null) {
    echo "Couldn't establish a connection with the database!";
    exit(1);
}

$id = $_POST["id"];

$delete_query = $conn->prepare("DELETE FROM uploaded_images WHERE id=:id");
$delete_query->bindParam(":id", $id, PDO::PARAM_INT);
$delete_query->execute();

if ($delete_query->rowCount()) {
    header("Location: profile.php");
} else {
    echo "Error: " . $sqlUpdate . "<br>" . $delete_query->errorInfo();
}

?>