

$("#menu-toggle").click(function (e) {
   e.preventDefault();
   $("#wrapper").toggleClass("toggled");
});
$("#menu-toggle-2").click(function (e) {
   e.preventDefault();
   $("#wrapper").toggleClass("toggled-2");
   $('#menu ul').hide();
});

function initMenu() {
   $('#menu ul').hide();
   $('#menu ul').children('.current').parent().show();
   //$('#menu ul:first').show();
   $('#menu li a').click(
      function () {
         var checkElement = $(this).next();
         if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
            return false;
         }
         if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
            $('#menu ul:visible').slideUp('normal');
            checkElement.slideDown('normal');
            return false;
         }
      }
   );
}
$(document).ready(function () {
   initMenu();
});

// function readURL(input) {
//    console.log(input.files)
//    const files = input.files
//    const number_of_images = Object.keys(files).length
//    console.log(number_of_images);

//    Object.entries(files).forEach(
//       ([key, value]) => console.log(key, value)
//    );

//    // if (input.files && input.files[0]) {
//       var reader = new FileReader();

//       reader.onload = function (e) {
//          $('#blah')
//             .attr('src', e.target.result)
//             .width(150)
//             .height(200);
//       };

//       reader.readAsDataURL(input.files[0]);
//    // }
// }

// function readURL2(input) {

//    if (input.files && input.files[0]) {
//       var reader = new FileReader();

//       reader.onload = function (e) {
//          $('#blah2')
//             .attr('src', e.target.result)
//             .width(150)
//             .height(200);
//       };

//       reader.readAsDataURL(input.files[0]);
//    }
// }
