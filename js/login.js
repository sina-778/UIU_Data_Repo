// login.js
function loginUser() {
    // Get form data
    var formData = {
        userID: $('#username').val(), // Assuming your username field corresponds to userID
        password: $('#password').val()
        
    };

    // Log form data to the console for debugging
    console.log("Form Data:", formData);
 

    // Make AJAX request to the login API
    $.ajax({
        type: "POST",
        url: baseApiUrl +  "/uiuDataAPI/login.php", // Adjust the path if needed
        contentType: "application/json",
        data: JSON.stringify(formData),
        
        // success: function (response) {
        //     alert(response);
        //     // Log the response to the console for debugging
        //     console.log("API Response:", response);
        //     // Handle success, e.g., redirect to another page
        //     window.location.href = "home.php"; 

        // },

        success: function (response) {
            //alert(response);
            // Log the response to the console for debugging
            console.log("API Response:", response);
        
            // Parse JSON response
            var jsonResponse = JSON.parse(response);
        
            // Check user role and redirect
            if (jsonResponse.user_role === 'User') {
                window.location.href = "home.php";
            } else if (jsonResponse.user_role === 'Admin') {
                window.location.href = "admin.php";
            } else {
                // Handle other roles if needed
                alert("Unknown user role");
            }
        },
        error: function (xhr, status, error) {
            // Log the error to the console for debugging
            console.error("API Error:", xhr.responseText);
            
            try {
                // Try to parse the JSON response
                var jsonResponse = JSON.parse(xhr.responseText);
                if (jsonResponse.error) {
                    // Display just the error message
                    alert("Error: " + jsonResponse.error);
                } else {
                    // If parsing is successful but there's no 'error' property
                    alert("Error: " + xhr.responseText);
                }
            } catch (e) {
                // If parsing fails, display the full response
                alert("Error: " + xhr.responseText);
            }
        }
    });
}
