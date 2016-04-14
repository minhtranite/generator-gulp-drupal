<?php
/**
 * @file
 * The primary PHP file for this theme.
 */

/**
 * Implements hook_css_alter().
 * @param $css
 */
function <%= name %>_css_alter(&$css) {
  if (!variable_get('preprocess_css')) {
    foreach ($css as $key => $value) {
      $is_core = (strpos($value['data'], 'misc/') === 0 || strpos($value['data'], 'modules/') === 0);
      if ((!variable_get('link_css_skip_system', TRUE) || !$is_core) && file_exists($value['data'])) {
        $css[$key]['preprocess'] = FALSE;
      }
    }
  }
}