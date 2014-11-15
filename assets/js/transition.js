function goToPage(page){
 $(document).ready(function(){
  $('body').fadeOut(750, function(){
   window.location=page;
  });
 });
}