<?php
function popMessage($msg, $url) {
	$script = "
	<script>
		alert( '$msg' );
		window.location.href = '$url';
	</script>
	";
	echo $script;
	die ();
}

function popMessageBack($msg) {
	$script = "<script>
		alert( '$msg' );
		window.history.back();
	</script>
	";
	echo $script;
	die ();
}

//html页面的一些公用导入文件
function initClientResource() {
	$baseUrl = base_url();
   //echo $baseUrl;
   // print_r($_SERVER);
	$html = '<link rel="stylesheet" type="text/css" href="css/gm_style.css?v='. RESOURCE_VERSION .'">';
	$html .= '<script type="text/javascript" src="js/seajs/sea.js?v='. RESOURCE_VERSION .'"></script>';
	$html .= '<script type="text/javascript" src="js/seajs/seajsconfig.js?v='. RESOURCE_VERSION .'"></script>';
	echo $html;
}

//将object转换成array(递归到底)
function get_object_vars_deep($obj) {
	if (is_object ( $obj )) {
		$obj = get_object_vars ( $obj );
	}
	if (is_array ( $obj )) {
		foreach ( $obj as $key => $value ) {
			$obj [$key] = get_object_vars_deep ( $value );
		}
	}
	return $obj;
}

//获得状态(fail或ok)
function getHistoryState( $gmReturn ) {
	if(!is_array($gmReturn) ) {
		return 'Fail';
	}
	$return  = @$gmReturn[ 'Return' ];
	if(!is_numeric($return)) {
		return 'Fail';
	}
	if( $return != 0 ) {
		return 'Fail';
	}
	return 'OK';
}

//在一个数组中查找键值， 键名有多个
function getValue( $map, $keys ) {
	foreach( $keys as $key ) {
		if(isset($map[ $key ])) {
			return $map[ $key ];
		}
	}	
}	

function isEmpty( $val ) {
	$v = trim( $val );
	if( $v === 0 || $v === '0' ) {
		return false;
	}
	return empty( $v );
}

function getLimit() {
	$pageIndex = @$_GET[ 'page' ];
	if(empty($pageIndex)) {
		$pageIndex = 1;
	}
	$pageSize = PER_PAGE;
	$start = ( $pageIndex - 1 ) * $pageSize;
	return $start . ',' .  $pageSize;
}

function paramCharReplace( $param ) {
	return str_replace(',', "，", $param);
}


function getEnvironment() {
	$url = base_url();
	if( strpos( $url, 'gm.om.dianhun.cn' ) !== false ) {
		return 'outer_net';
	} else if( strpos( $url, 'gmdev.om.dianhun.cn' ) !== false ) {
		return 'inner_net';
	} else {
		return 'local';
	}
}

function createFactoryName() {
	$env = getEnvironment();
	if( $env == 'outer_net' ) {
		return 'm_outer_net_factory';
	} else if( $env == 'inner_net' ) {
		return 'm_inner_net_factory';
	} else if( $env == 'local' ) {
		return 'm_local_factory';
	} else {
		throw new Exception('环境错误');
	}
}

function getCdnInfo() {
	$env = getEnvironment();
	if( $env == 'outer_net' ) {
		return array( 'url' => 'http://cdnsrc.tafang.com/', 
					  'path' => '/data/www/cdnsrc/' );
	} else if( $env == 'inner_net' ) {
		return array( 'url' => 'http://gmdev.om.dianhun.cn/upload/', 
					   'path' => 'upload/' );
	} else if( $env == 'local' ) {
		return array( 'url' => 'http://192.168.110.233/samba/gm_chh/upload/', 
					  'path' => 'upload/' );
	} else {
		throw new Exception('环境错误');	
	}
}

function encodeContent( $content ) {
	$content = preg_replace("/\%/", '%25', $content);
	return $content;
}

function importView( $filePath ) {
	$fullPath = APPPATH . '/views/' . $filePath;
	if( file_exists( $fullPath ) ) {
		include_once $fullPath;
	} else {
		throw new Exception('找不到视图文件');
	}
}

function isDateTime($param = '', $format = 'Y-m-d H:i:s') {
	return strtotime( date( $format, strtotime( $param ) ) ) === strtotime( $param );
}

function isInteger( $val ) {
	return preg_match("/^\d+$/", $val );	 
}

function getErrorJSON( $msg ) {
	$error = array(
			'error' => 1,
			'msg' => $msg
	);
	return json_encode( $error );
}

function getSuccessJSON( $msg, $data = null ) {
	$success = array(
			'error' => 0,
			'msg' => $msg
	);
	if( $data ) {
		$success[ 'data' ] = $data;
	}
	return json_encode( $success );	
}

function convertToIntArray( $stringArray ) {
	foreach( $stringArray  as $key => $value ) {
		$stringArray[$key] = intval( $value );
	}
	return $stringArray;
}

function jsonFormat($data, $indent = null){
	// json encode
	$data = json_encode($data, JSON_UNESCAPED_UNICODE);
	// 缩进处理
	$ret = '';
	$pos = 0;
	$length = strlen($data);
	$indent = isset($indent)? $indent : '    ';
	$newline = "\n";
	$prevchar = '';
	$outofquotes = true;

	for($i=0; $i<=$length; $i++){

		$char = substr($data, $i, 1);

		if($char=='"' && $prevchar!='\\'){
			$outofquotes = !$outofquotes;
		}elseif(($char=='}' || $char==']') && $outofquotes){
			$ret .= $newline;
			$pos --;
			for($j=0; $j<$pos; $j++){
				$ret .= $indent;
			}
		}

		$ret .= $char;

		if(($char==',' || $char=='{' || $char=='[') && $outofquotes){
			$ret .= $newline;
			if($char=='{' || $char=='['){
				$pos ++;
			}

			for($j=0; $j<$pos; $j++){
				$ret .= $indent;
			}
		}

		$prevchar = $char;
	}

	return $ret;
}

function loadGm2ClassFile( $filePath ) {
	$path = dirname(BASEPATH) . "/application/models/" . $filePath;
	include_once $path;
}