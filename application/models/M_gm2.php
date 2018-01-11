<?php
class M_gm2 extends CI_Model{
    const MODE_LIST = "list";
    const MODE_FORM = "form";
    const MODE_VIEW = "view";


    public function __construct(){
        $this->load->helper("common");
        parent::__construct();
    }

    private function getDomListFromFiles() {
		$dir = "xml_config";
        $files = scandir($dir);
        $result = array();
        foreach($files as $file) {
            if( $file == '.' || $file == '..') {
                continue;
            }
            $path = $dir . "/" . $file;
            $doc = new DOMDocument();
            $doc->load($path);
            $result[] = $doc;
        }
        return $result;
    }

    public function getActionXml( $actionId, $actionMode, $actionType ) {
        $docs = $this->getDomListFromFiles();
        $group = array_filter($docs,function($doc) use($actionId){
            $root =  $doc->getElementsByTagName("PageGroup");
            $root = $root->item(0);
            if( $root == null ) {
                return false;
            }
            $textContent =  $root->attributes->getNamedItem("id")->textContent;
            return $textContent == $actionId;
        });
        if( !count($group)) {
            return null;
        }
        $group = array_values($group);
        $doc = $group[0];
        $pages =  $doc->getElementsByTagName("Page");
        foreach($pages as $page) {
            $mode = $page->attributes->getNamedItem("mode")->textContent;
            $type = @$page->attributes->getNamedItem("type")->textContent;
            if(empty($type)) {
                $type = "";
            }
            if(empty($actionType)) {
                $actionType = "";
            }
            if($mode == $actionMode && $type == $actionType) {
                $resultXml = $page->ownerDocument->saveXML($page);
                return $resultXml;
            }
        }
        return null;
    }

    public function getAction( $actionId, $actionMode,$actionType ) {
        $acitonXml = $this->getActionXml($actionId, $actionMode, $actionType);
        $doc =  new DOMDocument();
        $doc->loadXML($acitonXml);
        return $doc;
    }

    public function getActionList() {
        $docs = $this->getDomListFromFiles();
        return array_map(function($doc){
            $root =  $doc->getElementsByTagName("PageGroup");
            $root = $root->item(0);
            $id = $root->attributes->getNamedItem("id")->textContent;
            $title = $root->attributes->getNamedItem("title")->textContent;
            $pages = $root->getElementsByTagName("Page");
            $mode = array();
            foreach($pages as $page){
                $mode[] = $page->attributes->getNamedItem("mode")->textContent;
            }
            return array( "id" => $id, "title" => $title, "mode" => $mode );
        },$docs);
    }

    private function getListenClassName($actionId, $actionMode, $actionType) {
        $doc = $this->getAction($actionId,$actionMode, $actionType);
        $listenNode = $doc->getElementsByTagName("listen");
        if( $listenNode->length == 0 ) {
            return null;
        } else {
            return $listenNode->item(0)->attributes->getNamedItem("class")->nodeValue;
        }
    }

    public function callListenClass( $actionId, $actionMode, $method, $actionType = null ) {
        $listenClassName = $this->getListenClassName( $actionId, $actionMode, $actionType);
        if( strlen($listenClassName) == 0 ) {
            return null;
        }
        switch($actionMode) {
            case self::MODE_LIST:
                $path = "listen_list";
                break;
            case self::MODE_FORM:
                $path = "listen_form";
                break;
            case self::MODE_VIEW:
                $path = "listen_view";
                break;
            default:
                return null;
        }
        $path = "{$path}/{$listenClassName}.php";
        include_once $path;
        $object = new $listenClassName();
        $object->setEnv( null );
        $object->setUserInfo(null);
        $object->setOwner( $this );
        return $object->$method();
    }
}

