// upload.js

function uploadDataset() {
    // Get form data
    var formData = {
        userID: $('#userID').val(),
        title: $('#name').val(),
        category: $('#category').val(),
        description: $('#fileDescription').val()
    };

    // Log form data to the console for debugging
    console.log("Form Data:", formData);

    // Create a FormData object for file upload
    var fileData = new FormData();
    fileData.append('file', $('#excelFile')[0].files[0]);

    // Add other form data to FormData
    for (var key in formData) {
        fileData.append(key, formData[key]);
    }

    // Make AJAX request to the API
    $.ajax({
        type: "POST",
        url: baseApiUrl + "/uiuDataAPI/dataUpload.php",
        processData: false,
        contentType: false,
        data: fileData,
        success: function (response) {
            // Log the response to the console for debugging
            console.log("API Response:", response);

            alert("Dataset uploaded successfully");
            // Handle success, e.g., redirect to another page
            window.location.href = "admin.php"; // Redirect to home page after successful upload
        },
        error: function (xhr, status, error) {
            // Log the error to the console for debugging
            console.error("API Error:", xhr.responseText);

            alert("Error: " + xhr.responseText);
            // Handle error
        }
    });
}
