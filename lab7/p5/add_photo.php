<?php
session_start();
require_once ("./db.php");

$conn = create_db_connection();

if ($conn == null) {
    echo "Couldn't establish a connection with the database!";
    exit(1);
}

$user_id = $_SESSION["user_id"];

// Photo uploading.
if (isset($_POST['upload'])) {
    $path = $_FILES['path']['name'];
    $description = trim(stripslashes(htmlspecialchars($_POST["description"])));
    $target = "images/" . basename($path);

    // Check if the uploaded file is an image
    $imageFileType = strtolower(pathinfo($target, PATHINFO_EXTENSION));
    if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
        echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
        exit(1);
    }

    try {
        // Begin transaction
        $conn->beginTransaction();

        $image_query = $conn->prepare("INSERT INTO uploaded_images (path, description, user_id) VALUES (:path, :description, :user_id)");
        $image_query->bindParam(":path", $path, PDO::PARAM_STR);
        $image_query->bindParam(":description", $description, PDO::PARAM_STR);
        $image_query->bindParam(":user_id", $user_id, PDO::PARAM_INT);

        $image_query->execute();

        if (!$image_query->rowCount()) {
            echo "Something went wrong..." . $image_query->errorInfo() . "\n";
            exit(1);
        }

        if (move_uploaded_file($_FILES['path']['tmp_name'], $target)) {
            echo "Image uploaded successfully";
            // Commit the transaction
            $conn->commit();
        } else {
            throw new Exception("Failed to move uploaded file. Error: " . $_FILES['path']['error']);
        }
    } catch (Exception $e) {
        // Rollback the transaction
        $conn->rollBack();
        echo "Failed: " . $e->getMessage();
        exit(1);
    }
}
?>