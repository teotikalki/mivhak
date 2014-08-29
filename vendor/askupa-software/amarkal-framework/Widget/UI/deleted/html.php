<?php

namespace Amarkal\Widget\UI;

/**
 * Implements an HTML component.
 * 
 * Template file: Template/html.php
 * 
 * This component can be used for creating custom fields or for simple HTML
 * output.
 * 
 * Usage Example:
 * 
 * $component = new Select(array(
 *			'description'	=> 'Some descriptive text',
 *			'html'			=> '<label>My custom field</label><p>Some text...</p>'
 *	));
 */
class html 
extends AbstractComponent
{
	
	/**
	 * {@inheritdoc}
	 */
	public function default_settings() {
		return array(
			'description'	=> 'Some descriptive text',
			'html'			=> ''
		);
	}
}
