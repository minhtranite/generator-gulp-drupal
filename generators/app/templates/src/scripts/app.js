(function ($, Drupal) {
  Drupal.behaviors.sample = {
    attach: function () {
      let sampleVar = 'ES6 here';
      console.log(sampleVar);
    }
  };
})(jQuery, Drupal);
