(function ($) {
  $(document).ready(function () {
  
    // === ColorPicker ===
    if($.fn.ColorPicker){
      $('input.color-picker').each(function(){
        var $input = $(this);
        var name = $input.attr('name');
        $( "<span class=\"color-check color-"+name+"\"></span>" ).insertAfter( $input );
        $input.ColorPicker({
          onChange:function (hsb, hex, rgb) {
           $('span.color-' + name).css('backgroundColor', '#' + hex);
            $input.val( '#' + hex );
          } 
       });
      });
    };

    $('input.color-picker').on('change', function(){
      var name = $(this).attr('name');
      $('span.color-' + name).css('backgroundColor', $(this).val());
    });

    $('input.color-picker').each(function(){
      $color = $(this).val();
      $name = $(this).attr('name');
      $('span.color-' + $name).css('backgroundColor', $color);
    });

  });

  $(window).load(function(){

    $('input.color-picker').each(function(){
      $color = $(this).val();
      $name = $(this).attr('name');
      $('span.color-' + $name).css('backgroundColor', $color);
    });
  })

})(jQuery);

