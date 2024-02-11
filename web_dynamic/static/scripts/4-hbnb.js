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

  const selectedAmenities = {};

  $('.amenities input[type=checkbox]').change(function () {
    const amenityID = $(this).data('id');
    const amenityName = $(this).data('name');

    if ($(this).is(':checked')) {
      selectedAmenities[amenityID] = amenityName;
    } else {
      delete selectedAmenities[amenityID];
    }

    const selectedAmenitiesList = Object.values(selectedAmenities).join(', ');
    $('#selected-amenities').text(selectedAmenitiesList);
  });

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
	$(".filters button").bind("click", searchPlace);
	searchPlace();
});
