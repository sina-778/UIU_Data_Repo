<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title></title>
    <!-- Favicon -->
    <link rel="apple-touch-icon" sizes="180x180" href="img/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="img/favicon-16x16.png">
    <link rel="manifest" href="img/site.webmanifest">
    <link rel="mask-icon" href="img/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <!-- Custom fonts for this template-->
    <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">
    <!-- Custom styles for this template-->
    <link href="css/sb-admin-2.css" rel="stylesheet">

</head>

<body class="bg-gradient-success">
    <div class="container-fluid">
        <div class="row align-items-center justify-content-center min-vh-100">
            <div class="col-xl-4 col-lg-5 m-5">
                <div class="card o-hidden border-0 shadow-lg mb-2">
                    <div class="card-body pt-5">
                        <div class="p-4">
                            <div class="text-center">
                                <img src="img/logo.png" alt="Logo" style="width: 200px; height: 80px;">
                            </div>
                            <form class="user p-3" id="registrationForm">
                                <div class="form-group">
                                    <label for="studentID">Name</label>
                                    <input type="text" class="form-control form-control-user" id="studentID" name="studentID" placeholder="Full Name" required>
                                </div>
                                <div class="form-group">
                                    <label for="email">Email Address</label>
                                    <input type="email" class="form-control form-control-user" id="email" name="email" placeholder="Email Address" required>
                                </div>
                                <div class="form-group">
                                    <label for="username">User/Student ID</label>
                                    <input type="text" class="form-control form-control-user" id="username" name="username" placeholder="User/Student ID" required>
                                </div>
                                <div class="form-group">
                                    <label for="password">Password</label>
                                    <input type="password" class="form-control form-control-user" id="password" name="password" placeholder="Password" required>
                                </div>
                                <button class="btn btn-success btn-user btn-block" type="submit"">
                                    Register
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="text-center instruction-text">
                    <p>Already have an account? <a href="login.php"><strong>Login Here</strong></a></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Add jQuery for AJAX -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <!-- Include the baseApiUrl configuration -->
    <script src="js/config.js"></script>

    <!-- Add your external JavaScript file for API call -->
    <script src="js/register.js"></script>

</body>

</html>
