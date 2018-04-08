<?php
//登陆相关
class Login_model extends CI_Model {
	function __construct() {
		parent::__construct ();
		$this->load->helper( 'cookie' );
		$this->load->helper( 'url' );
	}
	
	//获得登陆信息
	public function getLoginInfo() {
		$userName = get_cookie('user_name');
		$userID = get_cookie('user_id');
		$roleID = get_cookie('role_id');
		$userKey = get_cookie('user_key');
		return array(
				'user_name' => $userName,
				'user_id' => $userID,
				'role_id' => $roleID,
				'user_key' => $userKey
		);
	}

	public function checkLogin( $userName, $password ) {
		if( $userName == "fast_dev" && $password = "123456" ) {
			return array(
				'success'=> 1,
				'msg'=> '验证通过',
				'user_info'=> array(
					"user_name" => "fast_dev",
					"password" => "123456",
					"role_id" => "1",
					"id" => 1
				)
			);
		} else {
			return array(
				'success'=> 0,
				'msg'=> '此帐号被禁止登陆',
			);
		}
	}

	///登陆验证
	/*public function checkLogin( $userName, $password ) {
		$sql = "select * from user where user_name = '$userName' and password = '$password'";
		$result = $this->db->query( $sql );
		if( $result->num_rows() > 0 ) {
			$row = $result->row_array();
			if( $row['state'] == 1 ) {
				return array(
						'success'=> 1,
						'msg'=> '验证通过',
						'user_info'=> $result->row_array()
				);
			} else {
				return array(
						'success'=> 0,
						'msg'=> '此帐号被禁止登陆',
				);
			}
		} else {
			return array(  'success' => 0, 'msg'=> '用户名或密码错误' );
		}
	}*/
	
	//生成登陆验证散列密码
	public function createUserKey( $userID, $userName ) {
		$userKey = md5( $userID . $userName . 'aspwebchh');
		return $userKey;
	}
	
	//执行登陆操作
	public function doLogin( $userInfo ) {
		$userName = $userInfo[ 'user_name' ];
		$userID = $userInfo[ 'id' ];
		$userKey = $this->createUserKey( $userID, $userName );
		setcookie('user_name', $userName);
		setcookie('user_id', $userID);
		setcookie('user_key', $userKey);
	}
	
	//退出登陆
	public function doLogout( $returnURL ) {
		delete_cookie('user_name','', '');
		delete_cookie('user_id','', '');
		delete_cookie('user_key','', '');
		if( $returnURL ) {
			redirect($returnURL);
		} else {
			redirect( '?m=login&c=welcome' );
		}
	}

	public function  isLogin() {
		$loginInfo = $this->getLoginInfo ();
		$userKey = $this->createUserKey ( $loginInfo ['user_id'], $loginInfo ['user_name'] );
		if ($userKey != $loginInfo ['user_key']) {
			return false;
		} else {
			return true;
		}
	}
}