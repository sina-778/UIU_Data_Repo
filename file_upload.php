<?php
// Start the session
session_start();

// Check if userID is not set in the session
if (!isset($_SESSION['userID'])) {
    // Redirect to the login page
    header('Location: login.php');
    exit();
}

// Rest of your existing code...

include 'header.php';
?>


<!-- Divider -->
<hr class="sidebar-divider my-0">

<!-- Nav Item - Dashboard -->
<li class="nav-item">
    <a class="nav-link" href="home.php">
        <i class="fas fa-fw fa-tachometer-alt"></i>
        <span>Dashboard</span></a>
</li>


<!-- Divider -->
<hr class="sidebar-divider">

<!-- Heading -->
<div class="sidebar-heading">
    File
</div>

<!-- Nav Item - Gaming Page -->
<li class="nav-item active">
    <a class="nav-link" href="file_upload.php">
        <i class="fas fa-gamepad"></i>
        <span>File Upload</span></a>
</li>

<!-- Sidebar Toggler (Sidebar) -->
<div class="text-center d-none d-md-inline">
    <button class="rounded-circle border-0" id="sidebarToggle"></button>
</div>
</ul>
<!-- End of Sidebar -->

<!-- Content Wrapper -->
<div id="content-wrapper" class="d-flex flex-column">

    <!-- Main Content -->
    <div id="content">

        <!-- Topbar -->
        <?php include 'nav.php'; ?>

        <div class="container-fluid">
            <div class="row align-items-center justify-content-center min-vh-100">

                <div class="card o-hidden border-0 shadow-lg my-5 file-upload-class">
                    <div class="card-body p-0">
                        <div class="p-5">
                        <form onsubmit="uploadDataset(); return false;" class="user" method="POST" enctype="multipart/form-data">
                            <!-- Updated Form Action to Call API -->
                            
                            <div class="form-group">
                                    <input type="hidden" class="form-control form-control-user" id="userID" name="userID" placeholder="User ID" required>
                            </div>
                                <div class="form-group">
                                    <label for="name">Title</label>
                                    <input type="text" class="form-control form-control-user" id="name" name="title" placeholder="File Name" required>
                                </div>

                                <div class="form-group">
                                    <label for="category">Select Category:</label>
                                    
                                    <select class="form-select cat-select" id="category" aria-label="Default select example">
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Education">Education</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Others">Others</option>
                                    </select>
                                    
                                </div>
                                <div class="form-group">
                                    <label for="fileDescription">File Description</label>
                                    <textarea type="text" class="form-control form-control-user" id="fileDescription" name="description" placeholder="File Description" rows="3"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="excelFile">Upload Excel File</label>
                                    <input type="file" class="form-control-file" id="excelFile" name="file" accept=".xlsx, .xls" required>
                                </div>

                                <button type="submit" name="upload" class="btn btn-success btn-user btn-block">
                                    Upload
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- /.container-fluid -->

    </div>

    <!-- Include jQuery and other scripts -->
    <script src="vendor/jquery/jquery.min.js"></script>
    <!-- Include the baseApiUrl configuration -->
    <script src="js/config.js"></script>
    <!-- Include upload.js file -->
    <script src="js/upload.js" defer></script>

    <!-- End of Main Content -->

    <?php include 'footer.php'; ?>
</body>

</html>



