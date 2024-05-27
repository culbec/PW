<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile</title>
    
    <link rel="stylesheet" href="./style.css">
</head>

<body>
    <div class="top-nav">
        <div class="header">
            <h1>PhotoPost</h1>
        </div>
        <div class="nav">
            <a href="profile.php">Profile</a>
            <a href="add_photo.html">Add photo</a>
            <a href="user_photos.php">User photos</a>
            <a href="logout.php">Logout</a>
        </div>
    </div>

    <div class="container">
        <?php
        session_start();
        require_once ("./db.php");

        $conn = create_db_connection();

        if ($conn == null) {
            echo "Couldn't establish a connection with the database!";
            exit(1);
        }

        $user_id = $_SESSION["user_id"];

        $image_query = $conn->prepare("SELECT * FROM uploaded_images WHERE user_id=:user_id");
        $image_query->bindParam(":user_id", $user_id, PDO::PARAM_INT);
        $image_query->execute();

        $result = $image_query->fetchAll(PDO::FETCH_ASSOC);
        if (count($result) == 0) {
            echo "No images were uploaded.";
            exit(1);
        }

        foreach ($result as $row) {
            echo "<img src='./images/" . $row["path"] . "'>";
            echo "<p>" . $row["description"] . "</p>";
            echo "<form action='remove_photo.php' method='POST'>";
            echo "<input type='hidden' name='id' value='" . $row["id"] . "'>";
            echo "<button type='submit'>Delete</button>";
            echo "</form>";
        }
        ?>
    </div>

</body>

</html>