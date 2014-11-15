(function(){
  $(document).ready(function(){
    $("#apply").click(showLogin);
  });

  $(document).ready(function() {
    $("#attendeeNoun").typed({
      strings: ["asdf", "programmers", "designers", "students"],
      typeSpeed: 50,
      backSpeed: 50,
      startDelay: 0,
      backDelay: 2000,
      callback: function() {
        setTimeout(function() {
          $('.typed-cursor').css('visibility', 'visible');
        }, 1200)
      }
    });
  });

  showLogin = function(){
    $("#loginModal").modal({
      show: true
    });
  };

}());
