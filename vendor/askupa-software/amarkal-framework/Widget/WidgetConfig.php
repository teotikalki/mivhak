<?php

namespace Amarkal\Widget;

/**
 * Implements a configuration object to be used with Amarkal Widget.
 */
class WidgetConfig {
    
    private $configuration;
    
    public function __construct( array $config ) {
        
        $defaults = array(
            'name'            => 'My Plugin',
            'description'     => 'My Plugin\'s description',
            'version'         => '1.0',
            'callback'        => function( $args, $instance ){},  // Overrides WP_Widget::widget()
            'cpanel'          => new \Amarkal\Widget\ControlPanel()
        );
        
        $config = array_merge( $defaults, $config );
        
        $config['slug'] = \Amarkal\Common\Tools::strtoslug( $config['name'] );
        
        $this->configuration = $config;
    }
    
    public function __get( $name ) {
        return $this->configuration[ $name ];
    }
}
