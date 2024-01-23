<?php

header('Location: index.php');
exit;

// session_start();

// // Check if the session variable user_id is set and not empty
// if (isset($_SESSION['user_id']) && !empty($_SESSION['user_id'])) {
//     // Include the database connection file
//     include('dbcon.php');

//     // Escape the user_id to prevent SQL injection
//     $user_id = mysqli_real_escape_string($conn, $_SESSION['user_id']);

//     // Query the database to fetch the role for the current user
//     $query = "SELECT role FROM admin WHERE user_id = '$user_id'";
//     $result = mysqli_query($conn, $query);

//     if ($result && mysqli_num_rows($result) > 0) {
//         $row = mysqli_fetch_assoc($result);
//         $userRole = $row['role'];
//     } else {
//         // User not found in the database, handle the error as needed
//         $userRole = "User not found in the database";
//     }

//     // Close the database connection
//     mysqli_close($conn);
// } else {
//     // Redirect to login page or handle the case where the user is not logged in
//     header('Location: index.php');
//     exit;
// }
?>
