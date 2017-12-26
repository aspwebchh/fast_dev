<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admin extends CI_Controller {
	public function index() {
		$this->load->view("admin/index.html");
	}

	public function article_list() {
		$this->load->view("admin/_article_list.html");
	}

	public function article_form() {
		$this->load->view("admin/_article_form.html");
	}
}
