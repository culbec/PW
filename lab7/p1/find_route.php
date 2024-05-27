<?php
$server = "localhost";
$db = "TrenuriWeb";
$user = "mariadb";
$pass= "mariadb";

try {
    $conn = new PDO("mysql:host=$server;dbname=$db", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die($e);
}

$departure = trim(htmlspecialchars(filter_var($_GET["departure-input"], FILTER_SANITIZE_STRING)));
$arrival = trim(htmlspecialchars(filter_var($_GET["arrival-input"], FILTER_SANITIZE_STRING)));
$direct_route = isset($_GET["direct-route"]);


if ($direct_route == true) {
    $query = $conn->prepare("
    SELECT *
    from Trenuri
    WHERE plecare = :plecare AND sosire = :sosire
    ");

    $query->bindParam(":plecare", $departure, PDO::PARAM_STR);
    $query->bindParam(":sosire", $arrival, PDO::PARAM_STR);
    $query->execute();

    $result = $query->fetchAll(PDO::FETCH_ASSOC);

    echo "<table class=\"train-table\">";
    echo "<tr>";
    echo "<th>Numar</th>";
    echo "<th>Tip</th>";
    echo "<th>Oras plecare</th>";
    echo "<th>Oras sosire</th>";
    echo "<th>Data plecare</th>";
    echo "<th>Data sosire</th>";
    echo "</tr>";

    foreach ($result as $row) {
        echo "<tr>";
        echo "<td>" . $row["numar"] . "</td>";
        echo "<td>" . $row["tip"] . "</td>";
        echo "<td>" . $row["plecare"] . "</td>";
        echo "<td>" . $row["sosire"] . "</td>";
        echo "<td>" . $row["ora_plecare"] . "</td>";
        echo "<td>" . $row["ora_sosire"] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    $query = $conn->prepare("
    SELECT T1.numar, T1.tip, T1.plecare, T1.sosire, T1.ora_plecare, T1.ora_sosire, 
    T2.numar as numar_leg, T2.Tip as tip_leg, T2.plecare as plecare_leg, T2.sosire as sosire_leg, T2.ora_plecare as ora_plecare_leg, T2.ora_sosire as ora_sosire_leg
    FROM Trenuri T1
    JOIN Trenuri T
    JOIN Trenuri T2 ON T1.sosire = T.plecare and T.sosire = T2.sosire
    WHERE T1.plecare = :plecare 
    AND T2.sosire = :sosire
    ");

    $query->bindParam(":plecare", $departure, PDO::PARAM_STR);
    $query->bindParam(":sosire", $arrival, PDO::PARAM_STR);
    $query->execute();

    $result = $query->fetchAll(PDO::FETCH_ASSOC);

    echo "<link rel=\"stylesheet\" href=\"./style.css\"/>";
    echo "<table class=\"train-table\">";
    echo "<tr>";
    echo "<th>Numar</th>";
    echo "<th>Tip</th>";
    echo "<th>Oras plecare</th>";
    echo "<th>Oras sosire</th>";
    echo "<th>Data plecare</th>";
    echo "<th>Data sosire</th>";
    echo "</tr>";

    foreach ($result as $row) {
        echo "<tr>";
        echo "<td>" . $row["numar"] . "</td>";
        echo "<td>" . $row["tip"] . "</td>";
        echo "<td>" . $row["plecare"] . "</td>";
        echo "<td>" . $row["sosire"] . "</td>";
        echo "<td>" . $row["ora_plecare"] . "</td>";
        echo "<td>" . $row["ora_sosire"] . "</td>";
        echo "</tr>";

        echo "<tr>";
        echo "<td>" . $row["numar_leg"] . "</td>";
        echo "<td>" . $row["tip_leg"] . "</td>";
        echo "<td>" . $row["plecare_leg"] . "</td>";
        echo "<td>" . $row["sosire_leg"] . "</td>";
        echo "<td>" . $row["ora_plecare_leg"] . "</td>";
        echo "<td>" . $row["ora_sosire_leg"] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
}

?>