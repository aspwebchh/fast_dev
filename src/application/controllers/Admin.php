<?php
defined('BASEPATH') OR exit('No direct script access allowed');

include_once('Backend.php');

class Admin extends Backend {
	function __construct() {
		parent::__construct ();
	}

	public function index() {
		$this->load->view("admin/index.html");
	}
}
