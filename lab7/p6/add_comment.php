<?php
require_once("./db.php");

$conn = create_db_connection();

if ($conn == null) {
    echo "Couldn't establish a connection with the database!";
    exit(1);
}

$username = process_data($_POST["username"]);
$comment = process_data($_POST["comment"]);

try {
    // Begin transaction
    $conn->beginTransaction();

    $comment_query = $conn->prepare("INSERT INTO comments (username, text, status) VALUES (:username, :comment, 'pending')");
    $comment_query->bindParam(":username", $username, PDO::PARAM_STR);
    $comment_query->bindParam(":comment", $comment, PDO::PARAM_STR);
    $comment_query->execute();

    if (!$comment_query->rowCount()) {
        echo "Something went wrong..." . $comment_query->errorInfo() . "\n";
        exit(1);
    }

    $conn->commit();
    echo 'Comment added successfully!';

} catch (Exception $e) {
    // Rollback the transaction
    $conn->rollBack();
    echo "Failed: " . $e->getMessage();
    exit(1);
}