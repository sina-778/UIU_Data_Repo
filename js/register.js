// register.js


$(document).ready(function () {
    // Get the register button element
    const registerButton = document.querySelector('button');

    // Add event listener to the register button
    registerButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Call the registerUser function
        registerUser();
    });

    function registerUser() {
        // Get form data
        var formData = {
            studentID: $('#username').val(),
            username: $('#studentID').val(),
            password: $('#password').val(),
            email: $('#email').val()
        };

        // Log form data to the console for debugging
        console.log("Form Data:", formData);

        // Make AJAX request to the API
        $.ajax({
            type: "POST",
            url: baseApiUrl + "/uiuDataAPI/register.php",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                // Parse JSON response
                var jsonResponse = JSON.parse(response);

                // Log the parsed response to the console for debugging
                console.log("Parsed Response:", jsonResponse);

                // Show alert based on the status and message
                if (jsonResponse.message === "Registration successful") {
                    console.log("Parsed Response SINA:", jsonResponse);
                    alert("Success: " + jsonResponse.message + "\nUser ID: " + jsonResponse.user_id);
                    // Handle success, e.g., redirect to another page
                    window.location.href = "home.php"; // Redirect to the home page after successful registration
                }
                else {
                    alert(jsonResponse.message);
                    // Handle other status codes or errors
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
});



// $(document).ready(function () {
//     // Attach the registerUser function to the click event of the button
//     $('button').click(function () {
//         // Get form data
//         var formData = {
//             studentID: $('#username').val(),
//             username: $('#studentID').val(),
//             password: $('#password').val(),
//             email: $('#email').val()
//         };

//         // Log form data to the console for debugging
//         console.log("Form Data:", formData);

//         // Make AJAX request to the API
//         $.ajax({
//             type: "POST",
//             url: baseApiUrl + "/uiuDataAPI/register.php",
//             contentType: "application/json",
//             data: JSON.stringify(formData),
//             success: function (response) {
//                 // Parse JSON response
//                 var jsonResponse = JSON.parse(response);

//                 // Log the parsed response to the console for debugging
//                 console.log("Parsed Response:", jsonResponse);

//                 // Show alert based on the status and message
//                 if (jsonResponse.status === 200) {
//                     alert("Success: " + jsonResponse.message);
//                     // Handle success, e.g., redirect to another page
//                     window.location.href = "home.php"; // Redirect to the home page after successful registration
//                 } else {
//                     alert("Error: " + jsonResponse.message);
//                     // Handle other status codes or errors
//                 }
//             },
//             error: function (xhr, status, error) {
//                 // Log the error to the console for debugging
//                 console.error("API Error:", xhr.responseText);
//                 var jsonResponse = JSON.parse(response);

//                 alert("Error: " + jsonResponse.message);
//                 // Handle error
//             }
//         });
//     });
// });
