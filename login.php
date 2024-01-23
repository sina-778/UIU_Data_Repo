<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title> </title>
    <!-- Favicon -->
    <link rel="apple-touch-icon" sizes="180x180" href="img/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="img/favicon-16x16.png">
   
    <meta name="msapplication-TileColor" content="#da532c">
    <!-- Custom fonts for this template-->
    <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">
    <!-- Custom styles for this template-->
    <link href="css/sb-admin-2.css" rel="stylesheet">
</head>

<body class="bg-gradient-success">
    <div class="container-fluid">
        <div class="row align-items-center justify-content-center">
            <div class="col-xl-4 col-lg-5 mt-5">
                <div class="card o-hidden border-0 shadow-lg mb-2">
                    <div class="card-body pt-5">
                        <div class="p-4">
                            <div class="text-center">
                                <img src="img/logo.png" alt="Logo" style="width: 200px; height: 80px;">
                            </div>
                            
                            <form onsubmit="loginUser(); return false;" class="user" method="POST" enctype="multipart/form-data">
                                <div class="form-group">
                                    <label for="username">Username</label>
                                    <input type="text" class="form-control form-control-user" id="username" name="username" placeholder="Username" autofocus="autofocus" required>
                                </div>
                                <div class="form-group">
                                    <label for="password">Password</label>
                                    <input type="password" class="form-control form-control-user" id="password" name="password" placeholder="Password" required>
                                </div>
                                <button type="submit" name="login" class="btn btn-success btn-user btn-block">
                                Login
                                </button>

                                <!-- <?php if (isset($error_message)): ?>
                                    <p class="text-danger mt-3"><?php echo $error_message; ?></p>
                                <?php endif; ?> -->
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-center instruction-text">
            <p>Don't have account? <a href="register.php"><strong>Register Here</strong></a></p>
        </div>
    </div>
        <!-- Modal -->
        <div class="modal fade" id="errorModal" tabindex="-1" role="dialog" aria-labelledby="errorModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="errorModalLabel" style="color: red; font-weight: bold;">Login FAILED!!</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <strong>Invalid username or password.</strong>
                </div>
                <div class="modal-footer">
 
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap & jQuery Scripts -->
    <script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
    <script src="js/sb-admin-2.min.js"></script>

        <!-- Add jQuery for AJAX -->
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <!-- Include the baseApiUrl configuration -->
    <script src="js/config.js"></script>

    <!-- Include the login.js file with a version parameter -->
    <script src="js/login.js" defer></script>






</body>

</html>



