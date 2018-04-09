document.addEventListener('DOMContentLoaded', function(){
  // simple lazy loader for images, grabs datasrc attribute and changes it to src
  [].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = function() {
      img.removeAttribute('data-src');
    };
  });







  
});

