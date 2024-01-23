<?php
$host = "localhost";
$user = "sina";
$password = "sqls3rv3r";
$database = "courtside";

$conn = mysqli_connect($host, $user, $password, $database);

// Check conn
if (!$conn) {
    die("conn failed: " . mysqli_connect_error());
}
?>
