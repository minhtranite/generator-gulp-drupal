# Gulp Drupal

## Usage

### Dev

```bash
npm run start
```

### Build

```bash
npm run build
```

## Troubleshoot

### BrowserSync not inject css file.

At the moment BrowserSync don't support [`<style> @import url("..."); </style>`](https://github.com/BrowserSync/browser-sync/issues/10) so we need alter drupal css.

Please implement hook `hook_css_alter()`:

```php
/**
 * Implements hook_css_alter().
 * @param $css
 */
function YOUR_THEME_css_alter(&$css) {
  if (!variable_get('preprocess_css')) {
    foreach ($css as $key => $value) {
      $is_core = (strpos($value['data'], 'misc/') === 0 || strpos($value['data'], 'modules/') === 0);
      if ((!variable_get('link_css_skip_system', TRUE) || !$is_core) && file_exists($value['data'])) {
        $css[$key]['preprocess'] = FALSE;
      }
    }
  }
}
```