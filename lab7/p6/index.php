<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Copilot Pro - Review</title>

    <link rel="stylesheet" href="./style.css" />
</head>

<body>
    <div class="top-nav">
        <form action="./login.php" method="POST">
            <label>Username</label>
            <input type="text" name="username" required>
            <label>Password</label>
            <input type="password" name="password" required>
            <button type="submit">Login</button>
        </form>
    </div>
    <div class="container">
        <article>
            <h1>One month with Microsoft’s AI vision of the future: Copilot Pro</h1>
            <img
                src="https://duet-cdn.vox-cdn.com/thumbor/0x0:2040x1360/640x427/filters:focal(1020x680:1021x681):format(webp)/cdn.vox-cdn.com/uploads/chorus_asset/file/25297823/STK259_MICROSOFT_COPILOT_E.jpg" />
            <p>Copilot Pro is a $20 per month subscription that includes AI features in Office apps and better image
                generation tools.</p>
            <p>Microsoft’s Copilot Pro launched last month as a $20 monthly subscription that provides access to
                AI-powered features inside some Office apps, alongside priority access to the latest OpenAI models and
                improved image generation.

                I’ve been testing Copilot Pro over the past month to see if it’s worth the $20 subscription for my daily
                needs and just how good or bad the AI image and text generation is across Office apps like Word, Excel,
                and PowerPoint. Some of the Copilot Pro features are a little disappointing right now, whereas others
                are truly useful improvements that I’m not sure I want to live without.

                Let’s dig into everything you get with Copilot Pro right now.</p>

            <h2>Designer Image Creation</h2>
            <p>One of the main draws of subscribing to Copilot Pro is an improved version of Designer, Microsoft’s image
                creation tool. Designer uses OpenAI’s DALL-E 3 model to generate content, and the paid Copilot Pro
                version creates widescreen images with far more detail than the free version.

                I’ve been using Designer to experiment with images, and I’ve found it particularly impressive when you
                feed it as much detail as possible. Asking Designer for “an image of a dachshund sitting by a window
                staring at a slice of bacon” generates some good examples, but you can get Designer to do much more with
                some additional prompting. Adding in more descriptive language to generate a “hyper-real painting” with
                “natural lighting, medium shot, and shallow depth of field” will greatly improve image results.

                As you can see in the two examples below, Designer gets the natural lighting correct, with some depth of
                field around the bacon. Unfortunately, there are multiple slices of bacon here instead of just one, and
                they’re giant pieces of bacon.</p>
        </article>
    </div>
    <div class="container">
        <h3>Comments</h3>
        <br />
        <h4>Add comment</h4>
        <form method="POST" action="add_comment.php">
            <input type='text' name='username' placeholder='Username' maxlength="30" required><br>
            <textarea name="comment" placeholder="Comentariu" required maxlength="255"></textarea>
            <button type='submit'>Submit</button>
        </form>

        <?php
        require_once ("./db.php");

        $conn = create_db_connection();

        if ($conn == null) {
            echo "Couldn't establish a connection with the database!";
            exit(1);
        }

        $comment_query = $conn->prepare("SELECT * FROM comments WHERE status='approved'");
        $comment_query->execute();

        $result = $comment_query->fetchAll(PDO::FETCH_ASSOC);
        if ($result === false || count($result) == 0) {
            echo "No comments.";
            exit(1);
        }

        echo "<table>" .
            "<tr>" .
            "<th>Username</th>" . "<th>Comment</th>" .
            "</tr>";

        foreach ($result as $row) {
            echo "<tr>" . "<td>" . $row["username"] . "</td>" . "<td>" . $row["text"] . "</td>" . "</tr>";
        }

        echo "</table>";
        ?>
    </div>
</body>

</html>