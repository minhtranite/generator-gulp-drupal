(function ($, Drupal) {
  Drupal.behaviors.sample = {
    attach: () => {
      let sampleVar = 'ES6 here';
      console.log(sampleVar);
    }
  };
})(jQuery, Drupal);
