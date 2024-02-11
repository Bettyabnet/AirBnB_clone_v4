// Listen for changes on each input checkbox tag:

//     if the checkbox is checked, you must store the Amenity ID in a variable (dictionary or list)
//     if the checkbox is unchecked, you must remove the Amenity ID from the variable
//     update the h4 tag inside the div Amenities with the list of Amenities checked

$(document).ready(function () {
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
});
