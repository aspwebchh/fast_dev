<?php

abstract class Backend extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->model("login_model");
        $this->validateLogin ();
    }

    // 进行登陆验证，不合法的退出
    private function validateLogin() {
        $isLogin = $this->login_model->isLogin ();
        if (!$isLogin) {
            $this->login_model->doLogout ();
        }
    }

}