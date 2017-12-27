<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {
	function __construct() {
		parent::__construct ();
		$this->load->model("login_model");
	}

	public function index() {
		$this->load->view('welcome_message');
	}
	
	public function login() {
		$this->load->view('admin/login_v2.html');
	}

	public function check_login() {
		$userName = $_POST ["user_name"];
		$password = $_POST ['password'];
		$result = $this->login_model->checkLogin ( $userName, $password );
		if ( $result ['success'] ) {
			$this->login_model->doLogin ( $result ['user_info'] );
		}
		echo json_encode($result);
	}
}
