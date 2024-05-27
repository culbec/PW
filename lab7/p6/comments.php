<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comments</title>

    <link rel="stylesheet" href="./style.css"/>
</head>

<body>

    <div class="container">
        <?php
        require_once ("./db.php");

        $conn = create_db_connection();

        if ($conn == null) {
            echo "Couldn't establish a connection with the database!";
            exit(1);
        }

        $query = $conn->prepare("SELECT * FROM comments where status='pending'");
        $query->execute();
        $comments = $query->fetchAll(PDO::FETCH_ASSOC);

        foreach ($comments as $comment) {
            echo "<form method='POST' action='approve_comment.php'>";
            echo "<input type='hidden' name='id' value='" . $comment['id'] . "'>";
            echo "<p>" . $comment['username'] . "</p>";
            echo "<p>" . $comment['text'] . "</p>";
            echo "<p>Status: " . $comment['status'] . "</p>";
            echo "<button type='submit'>Approve</button>";
            echo "</form>";
        }
        ?>
    </div>

</body>

</html>