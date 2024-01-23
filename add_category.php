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

include 'admin-header.php';
?>

<!-- Divider -->
<hr class="sidebar-divider my-0">

<!-- Nav Item - Dashboard -->
<li class="nav-item">
    <a class="nav-link" href="admin.php">
        <i class="fas fa-fw fa-tachometer-alt"></i>
        <span>Home</span></a>
</li>


<!-- Divider -->
<hr class="sidebar-divider">

<!-- Heading -->
<div class="sidebar-heading">
    File
</div>

<!-- Nav Item - Gaming Page -->
<li class="nav-item">
    <a class="nav-link" href="admin-file-uploader.php">
        <i class="fas fa-gamepad"></i>
        <span>File Upload</span></a>
</li>



<!-- Divider -->
<hr class="sidebar-divider d-none d-md-block">

<!-- Heading -->
<div class="sidebar-heading">
    Category
</div>

<!-- Nav Item - Reports Page -->
<li class="nav-item active">
    <a class="nav-link" href="add_category.php">
        <i class="fas fa-file-download"></i>
        <span>Manage Category</span>
    </a>
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
        <!-- End of Topbar -->

        <!-- Begin Page Content -->
        <div class="container-fluid">

            <!-- Content Row -->
            <div class="row">
                
            </div>
            <div class="my-3">
                <div class="row">
                    <div class="col-1 filter-lavel pt-2">
                        <h2>Filter By: <h2>
                    </div>
                    <div class="col-11">
                        <ul class="dataset-filter" id="category-list">
                            <!-- Categories will be dynamically added here -->
                        </ul>
                    </div>
                </div>
            </div>
            <div class="row" id="admin-dataset-card-row">
            </div>

        </div>
        <!-- /.container-fluid -->

    </div>
    
    <?php include 'footer.php'; ?>

        <!-- Add jQuery for AJAX -->
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

        <!-- Include the baseApiUrl configuration -->
        <script src="js/config.js"></script>   

    <!-- End of Main Content -->
    <script src="js/admin-dataset.js" ></script>
</div>

