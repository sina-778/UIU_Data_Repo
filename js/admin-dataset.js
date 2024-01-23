$(document).ready(function () {
    // Initial call to load all datasets
    loadDatasets();

    // Call the API to get categories
    $.ajax({
        type: "GET",
        url: baseApiUrl + "/uiuDataAPI/getCategories.php",
        dataType: "json",
        success: function (categories) {
            populateCategories(categories);
        },
        error: function (xhr, status, error) {
            console.error("API Error:", xhr.responseText);
        }
    });

    function populateCategories(categories) {
        var categoryList = $('#category-list');
    
        // Add 'All Datasets' as a special category
        var allDatasetsItem = $('<li>')
            .text('All Datasets')
            .click(function() {
                loadDatasets('All Datasets');
            });
        categoryList.append(allDatasetsItem);
    
        // Add other categories
        categories.forEach(function (category) {
            var listItem = $('<li>')
                .text(category.CategoryName)
                .click(function() {
                    loadDatasets(category.CategoryName);
                });
            categoryList.append(listItem);
        });
    }

    

    // Event delegation for dynamically included navbar search
    $(document).on('click', '.navbar-search button', function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        var searchTerm = $('.navbar-search input[type="text"]').val(); // Ensure we are targeting the correct input
        console.log("Search Term:", searchTerm); // Debugging log
        loadDatasets('', searchTerm);
    });

        // Event handler for search form submission
        $('.navbar-search').on('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission
            var searchTerm = $(this).find('input[type="text"]').val(); // Get the search term from the input
            loadDatasets('', searchTerm);
        });

    function loadDatasets(selectedCategory = '', searchTerm = '',  approvalStatus = 'Pending') {
        var apiUrl = baseApiUrl + "/uiuDataAPI/getDataset.php";
        var params = [];

        console.log("AJAX URL: ", apiUrl);

        if (selectedCategory && selectedCategory !== 'All Datasets') {
            params.push('category=' + encodeURIComponent(selectedCategory));
        }
        if (searchTerm) {
            params.push('search=' + encodeURIComponent(searchTerm));
        }
        if (approvalStatus) {
            params.push('approvalStatus=' + encodeURIComponent(approvalStatus));
        }
        if (params.length) {
            apiUrl += '?' + params.join('&');
        }


        console.log("AJAX URL: ", apiUrl);

        $.ajax({
            type: "GET",
            url: apiUrl,
            dataType: "json",
            success: function (datasets) {
                console.log("Datasets loaded:", datasets);
                displayDatasets(datasets);
            },
            error: function (xhr, status, error) {
                console.error("API Error:", xhr.responseText);
            }
        });
    }


    function displayDatasets(datasets) {
        var cardsContainer = $('#admin-dataset-card-row');
        cardsContainer.empty();
    
        // Iterate through each dataset and append a card to the container
        datasets.forEach(function (dataset) {
            var cardCol = $('<div>').addClass('col-4');

            var card = $('<div>').addClass('card shadow mb-4');
    
            var cardHeader = $('<div>').addClass('card-header py-3 d-flex flex-row align-items-center justify-content-between');
            var cardTitle = $('<h6>').addClass('m-0 font-weight-bold text-primary').text(dataset.Title);
    
            var dropdown = $('<div>').addClass('dropdown no-arrow');
            var dropdownToggle = $('<a>').addClass('dropdown-toggle').attr('href', '#').attr('role', 'button').attr('id', 'dropdownMenuLink').attr('data-toggle', 'dropdown').attr('aria-haspopup', 'true').attr('aria-expanded', 'false');
            var ellipsisIcon = $('<i>').addClass('fas fa-ellipsis-v fa-sm fa-fw text-gray-400');
            dropdownToggle.append(ellipsisIcon);
    
            var dropdownMenu = $('<div>').addClass('dropdown-menu dropdown-menu-right shadow animated--fade-in').attr('aria-labelledby', 'dropdownMenuLink');
           
    
            dropdown.append(dropdownToggle);
            dropdown.append(dropdownMenu);
    
            cardHeader.append(cardTitle);
            cardHeader.append(dropdown);
    
            var cardBody = $('<div>').addClass('card-body');
    
            var category = $('<div>').addClass('dataset-category mb-2');
            category.append($('<p>').addClass('uploaded-by mb-2').text('Uploaded By: ' + dataset.UserID));
            category.append($('<h3>').text('Category: ' + dataset.Category));
    
            var description = $('<div>').addClass('dataset-description');
            description.text(dataset.Description);
    
            cardBody.append(category);
            cardBody.append(description);
    
            var buttonDiv = $('<div>').addClass('download-button-div');
            //var approveButton = $('<button>').addClass('btn btn-success btn-user btn-block').text('Approve');
            //var rejectButton = $('<button>').addClass('btn btn-danger btn-user btn-block').text('Reject');
            
            var approveButton = $('<button>')
            .addClass('btn btn-success btn-user btn-block')
            .text('Approve')
            .click(function () {
                updateDatasetStatus(dataset.DatasetID, 'Approved');
            });

            var rejectButton = $('<button>')
            .addClass('btn btn-danger btn-user btn-block')
            .text('Reject')
            .click(function () {
                updateDatasetStatus(dataset.DatasetID, 'Rejected');
            });

            // Download Button
            var downloadButton = $('<button>')
                .addClass('btn btn-success btn-user btn-block')
                .text('Download')
                .click(function () {
                    // Call the downloadDataset function with the dataset ID
                    downloadDataset(dataset.DatasetID);
                }); 
            //var downloadButton = $('<button>').addClass('btn btn-info btn-user btn-block').text('Download');
            buttonDiv.append(approveButton)
            buttonDiv.append(rejectButton)
            buttonDiv.append(downloadButton)
            cardBody.append(buttonDiv);
    
            card.append(cardHeader);
            card.append(cardBody);
    
            cardCol.append(card);
            cardsContainer.append(cardCol);
        });
    }

    

    function downloadDataset(datasetID) {
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = baseApiUrl + "/uiuDataAPI/downloadDataset.php?datasetID=" + datasetID;
        document.body.appendChild(iframe);
        
        setTimeout(function () {
            document.body.removeChild(iframe);
        }, 1000);
    }

    

    function updateDatasetStatus(datasetId, status) {
        $.ajax({
            type: "POST",
            url: baseApiUrl + "/uiuDataAPI/updateDatasetStatus.php",
            data: { datasetId: datasetId, status: status },
            success: function (response) {
                var result = JSON.parse(response);

                if (result.success) {
                    loadDatasets('', '', 'Pending'); // Now loadDatasets is accessible
                } else if (result.error) {
                    alert("Error: " + result.error);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error updating dataset status:", xhr.responseText);
                alert("Failed to update dataset status. Please try again.");
            }
        });
    }



});


// function updateDatasetStatus(datasetId, status) {
//     $.ajax({
//         type: "POST",
//         url: baseApiUrl + "/uiuDataAPI/updateDatasetStatus.php",
//         data: { datasetId: datasetId, status: status },
//         success: function (response) {
//             // Parse the response to JSON
//             var result = JSON.parse(response);

//             if (result.success) {
//                 alert('Dataset has been ' + status); // Show status message
//                 loadDatasets(); // Reload datasets
//             } else if (result.error) {
//                 alert("Error: " + result.error);
//             }
            
//             // Optionally, refresh the dataset list
//             loadDatasets();
//         },
//         error: function (xhr, status, error) {
//             console.error("Error updating dataset status:", xhr.responseText);
//             alert("Failed to update dataset status. Please try again.");
//         }
//     });
// }

// function updateDatasetStatus(datasetId, status) {
//     $.ajax({
//         type: "POST",
//         url: baseApiUrl + "/uiuDataAPI/updateDatasetStatus.php",
//         data: { datasetId: datasetId, status: status },
//         success: function (response) {
//             var result = JSON.parse(response);

//             if (result.success) {
//                 alert('Dataset has been ' + status);
//                 loadDatasets('', '', 'Pending');
//             } else if (result.error) {
//                 alert("Error: " + result.error);
//             }
//         },
//         error: function (xhr, status, error) {
//             console.error("Error updating dataset status:", xhr.responseText);
//             alert("Failed to update dataset status. Please try again.");
//         }
//     });
// }



