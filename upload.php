<?php
if (isset($_POST['upload'])) {
    // Define the directory where files will be stored
    $targetDirectory = "/excel_files/";
    
    // Get the file name
    $fileName = $_FILES['excelFile']['name'];
    
    // Get the file description
    $fileDescription = $_POST['fileDescription'];
    
    // Define the target file path
    $targetFilePath = __DIR__ . $targetDirectory . $fileName;
    
    // Check if the file already exists
    if (file_exists($targetFilePath)) {
        echo "File already exists.";
    } else {
        // Try to move the uploaded file to the target directory
        if (move_uploaded_file($_FILES['excelFile']['tmp_name'], $targetFilePath)) {
            // File uploaded successfully, now insert into the database
            include '../admin_api/dbcon.php'; // Include your database connection script here

            // SQL query to insert file information into the "ExcelFiles" table
            $sql = "INSERT INTO ExcelFiles (Name, FileDescription, FileLocation) VALUES (?, ?, ?)";

            try {
                $stmt = $conn->prepare($sql);
                $stmt->execute([$fileName, $fileDescription, $targetFilePath]);
                // File information inserted successfully
                header('Location: file_upload.php'); // Redirect to a success page
                exit();
            } catch (PDOException $e) {
                echo "Database query error: " . $e->getMessage();
            }
        } else {
            echo "File upload failed.";
        }
    }
}
?>
