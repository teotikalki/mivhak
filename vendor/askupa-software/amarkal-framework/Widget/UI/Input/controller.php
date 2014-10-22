<?php

namespace Amarkal\Widget\UI;

/**
 * Implements an Input component.
 * 
 * Template file: Template/Input.php
 * 
 * Input is the most common form control. The input component supports
 * for all HTML5 types: text, password, datetime, datetime-local, date, month, 
 * time, week, number, email, url, search, tel, and color.
 * 
 * Usage Example:
 * 
 * $component = new Textfield(array(
 *		'name'			=> 'textfield_1',
 *		'label'			=> 'Title',
 *		'default'		=> 'Enter your title here',
 *		'type'			=> 'text'
 *		'disabled'		=> false,
 *		'filter'		=> function( $v ) { return trim( strip_tags( $v ) ); },
 *		'validation'	=> function( $v ) { return strlen($v) <= 25; },
 * 		'error_message' => 'Error: the title must be less than 25 characters',
 *		'description'	=> 'This is the widget's title'
 * ));
 */
class Input 
extends \Amarkal\Widget\AbstractComponent
implements  \Amarkal\Widget\ValidatableComponentInterface,
			\Amarkal\Widget\FilterableComponentInterface,
			\Amarkal\Widget\DisableableComponentInterface
{
	
	/**
	 * {@inheritdoc}
	 */
	public function default_settings() {
		return array(
			'name'			=> 'textfield',
			'label'			=> 'Text Field',
			'type'			=> 'text',
			'default'		=> 'Enter your text here',
			'disabled'		=> false,
			'filter'		=> function( $v ) { return $v; },
			'validation'	=> function( $v ) { return true; },
			'error_message' => 'Error: invalid value',
			'description'	=> NULL,
			'help'			=> NULL
		);
	}
	
	/**
	 * {@inheritdoc}
	 */
	public function required_settings() {
		return array('name');
	}
	
	/**
	 * {@inheritdoc}
	 */
	public function get_default_value() {
		return $this->config['default'];
	}
	
	/**
	 * {@inheritdoc}
	 */
	public function get_name() {
		return $this->config['name'];
	}
	
	/**
	 * {@inheritdoc}
	 */
	public function apply_filter( &$value ) {

		$callable = $this->config['filter'];

		if( is_callable( $callable ) ) {
			$value = $callable( $value );
		}
	}
	
	/**
	 * {@inheritdoc}
	 */
	public function validate( $value ) {
		
		$callable = $this->config['validation'];
		
		if( is_callable( $callable ) ) {
			return $callable( $value );
		}
		
		return false;
	}
	
	/**
	 * {@inheritdoc}
	 */
	public function set_error_message( $message ) {
		$this->template->error = true;
		$this->template->error_message = $message;
	}
	
	/**
	 * {@inheritdoc}
	 */
	public function get_error_message() {
		return $this->config['error_message'];
	}
	
	/**
	 * {@inheritdoc}
	 */
	public function set_value( $value ) {
		$this->template->value = $value;
	}
	
	/**
	 * {@inheritdoc}
	 */
	public function set_id_attribute( $id ) {
		$this->template->id = $id;
	}
	
	/**
	 * {@inheritdoc}
	 */
	public function set_name_attribute( $name ) {
		$this->template->name = $name;
	}
	
	/**
	 * {@inheritdoc}
	 */
	public function is_disabled() {
		return $this->config['disabled'];
	}
}
