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

    function loadDatasets(selectedCategory = '', searchTerm = '', approvalStatus = 'Approved') {
        var apiUrl = baseApiUrl + "/uiuDataAPI/getDataset.php";
        var params = [];

        if (selectedCategory && selectedCategory !== 'All Datasets') {
            params.push('category=' + encodeURIComponent(selectedCategory));
        }
        if (searchTerm) {
            params.push('search=' + encodeURIComponent(searchTerm));
        }
        if (params.length) {
            apiUrl += '?' + params.join('&');
        }

        params.push('approvalStatus=' + encodeURIComponent(approvalStatus));

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
        var cardsContainer = $('#dataset-card-row');
        cardsContainer.empty(); // Clear existing datasets/cards

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
            
            //var downloadButton = $('<button>').addClass('btn btn-success btn-user btn-block').text('Download');
            // Download Button
            var downloadButton = $('<button>')
                .addClass('btn btn-success btn-user btn-block')
                .text('Download')
                .click(function () {
                    // Call the downloadDataset function with the dataset ID
                    downloadDataset(dataset.DatasetID);
                });            
            
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
});
