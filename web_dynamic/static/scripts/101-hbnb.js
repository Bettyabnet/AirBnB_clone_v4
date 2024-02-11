// Listen for changes on each input checkbox tag:

//     if the checkbox is checked, you must store the Amenity ID in a variable (dictionary or list)
//     if the checkbox is unchecked, you must remove the Amenity ID from the variable
//     update the h4 tag inside the div Amenities with the list of Amenities checked
$(document).ready(function () {
  // Function to update API status based on response
  function updateAPIStatus(status) {
    const $apiStatusDiv = $('#api_status');
    if (status === 'OK') {
      $apiStatusDiv.addClass('available');
    } else {
      $apiStatusDiv.removeClass('available');
    }
  }

  // Function to handle checkbox changes for states and cities
  function handleCheckboxChange() {
    const selectedLocations = {};

    // Loop through all input checkboxes
    $('.locations input[type=checkbox]').each(function () {
      const locationID = $(this).data('id');
      const locationName = $(this).data('name');

      if ($(this).is(':checked')) {
        selectedLocations[locationID] = locationName;
      } else {
        delete selectedLocations[locationID];
      }
    });

    // Update the text of the h4 tag based on the selected locations
    const selectedLocationsList = Object.values(selectedLocations).join(', ');
    $('.locations h4').text(selectedLocationsList);
  }

  // Listen for changes on each input checkbox tag
  $('.locations input[type=checkbox]').change(function () {
    handleCheckboxChange();
  });

  // Listen for changes on each input checkbox tag for amenities
  $('.amenities input[type=checkbox]').change(function () {
    const amenityID = $(this).data('id');
    const amenityName = $(this).data('name');
    const $selectedAmenities = $('#selected-amenities');

    if ($(this).is(':checked')) {
      // Append the newly selected amenity to the list
      $selectedAmenities.append('<span data-id="' + amenityID + '">' + amenityName + '</span>');
    } else {
      // Remove the unselected amenity from the list
      $selectedAmenities.find('span[data-id="' + amenityID + '"]').remove();
    }

    // Update the text of the h4 tag based on the number of selected amenities
    const numSelectedAmenities = $selectedAmenities.find('span').length;
    if (numSelectedAmenities === 0) {
      $selectedAmenities.text('No amenities selected');
    } else if (numSelectedAmenities === 1) {
      $selectedAmenities.text('1 amenity selected');
    } else {
      $selectedAmenities.text(numSelectedAmenities + ' amenities selected');
    }
  });

  // const selectedAmenities = {};

  // $('.amenities input[type=checkbox]').change(function () {
  //   const amenityID = $(this).data('id');
  //   const amenityName = $(this).data('name');

  //   if ($(this).is(':checked')) {
  //     selectedAmenities[amenityID] = amenityName;
  //   } else {
  //     delete selectedAmenities[amenityID];
  //   }

  //   const selectedAmenitiesList = Object.values(selectedAmenities).join(', ');
  //   $('#selected-amenities').text(selectedAmenitiesList);
  // });

  // Request API status
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    const status = data.status;
    updateAPIStatus(status);
  });

  // fetch data about places
	//fetch
	$.post({
		url: 'http://0.0.0.0:5001/api/v1/places_search',
		data: JSON.stringify({}),
		headers: {
			"Content-Type": "application/json",
		},
		success: (data) => {
			data.forEach((place) =>
				$("section.places").append(
					`<article>
			      <div class="title_box">
			        <h2>${place.name}</h2>
			        <div class="price_by_night">$${place.price_by_night}</div>
			      </div>
			      <div class="information">
              <div class="max_guest">${place.max_guest} Guest${
                    place.max_guest !== 1 ? "s" : ""
                  }</div>
              <div class="number_rooms">${place.number_rooms} Bedroom${
                    place.number_rooms !== 1 ? "s" : ""
                  }</div>
              <div class="number_bathrooms">${place.number_bathrooms} Bathroom${
                    place.number_bathrooms !== 1 ? "s" : ""
                  }</div>
			      </div> 
            <div class="description">
            ${place.description}
            </div>
				  </article>`
				)
			);
		},
		dataType: "json",
	});

  // search places
	// Handle search button click
  $('button').click(function () {
    // Gather selected amenities, states, and cities
    const selectedAmenities = $('#selected-amenities').find('span').map(function () {
      return $(this).data('id');
    }).get();
    const selectedStates = $('.locations h4').first().text();
    const selectedCities = $('.locations h4').last().text();

    // Make a POST request to places_search with the selected data
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/places_search',
      contentType: 'application/json',
      data: JSON.stringify({
        amenities: selectedAmenities,
        states: selectedStates,
        cities: selectedCities
      }),
      success: function (data) {
        // Update the places section with the search results
        // (Assuming you have a function to handle this)
        updatePlaces(data);
      }
    });
  });

});
