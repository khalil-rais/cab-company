<?php

use Drupal\Core\Form\FormStateInterface;
use Drupal\Component\Utility\Unicode;
use Drupal\Core\Url;
use Drupal\Core\Menu\MenuLinkInterface;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;

function gavias_huggi_preprocess_menu__main(&$variables) {
  $variables['attributes']['class'][] = 'clearfix sm sm-blue';

  foreach ($variables['items'] as &$item) {
   $menu_link_attributes = _gavias_huggi_attributes_get_attributes($item['original_link']);

      if (count($menu_link_attributes)) {
         $url_attributes = $item['url']->getOption('attributes') ?: [];
         $attributes = array_merge($url_attributes, $menu_link_attributes);

         $item['url']->setOption('attributes', $attributes);
         $item['gva_block_content'] = '';
         $item['attributes']['gva_class'] = (isset($attributes['gva_class']) && $attributes['gva_class']) ? trim($attributes['gva_class']): '';
         $item['attributes']['gva_icon'] = (isset($attributes['gva_icon']) && $attributes['gva_icon']) ? trim($attributes['gva_icon']): '';
         $item['attributes']['gva_layout'] = (isset($attributes['gva_layout']) && $attributes['gva_layout']) ? $attributes['gva_layout']: '';
         $item['attributes']['gva_layout_columns'] = (isset($attributes['gva_layout_columns']) && $attributes['gva_layout_columns']) ? $attributes['gva_layout_columns']: 4;
         $item['attributes']['gva_block'] = (isset($attributes['gva_block']) && $attributes['gva_block']) ? $attributes['gva_block']: '';
         if(isset($attributes['gva_layout']) && $attributes['gva_layout']=='menu-block'){
            $item['gva_block_content'] = gavias_huggi_render_block($attributes['gva_block']);
         }
     }
   }
}

function _gavias_huggi_attributes_get_attributes(MenuLinkInterface $menu_link_content_plugin) {
  $attributes = [];

  try {
    $plugin_id = $menu_link_content_plugin->getPluginId();
  }
  catch (PluginNotFoundException $e) {
    return $attributes;
  }

  if (strpos($plugin_id, ':') === FALSE) {
    return $attributes;
  }

  list($entity_type, $uuid) = explode(':', $plugin_id, 2);
  $entity = \Drupal::entityManager()->loadEntityByUuid($entity_type, $uuid);

  if ($entity) {
    $options = $entity->link->first()->options;
    $attributes = isset($options['attributes']) ? $options['attributes'] : [];
    if (isset($attributes['gva_class'])) {
      $attributes['gva_class'] = explode(' ', $attributes['gva_class']);
    }
  }

  return $attributes;
}