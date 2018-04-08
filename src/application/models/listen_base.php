<?php
abstract class listen_base {
    protected $env;
    protected $userInfo;
    protected $owner;

    public function setEnv( $env ) {
        $this->env = $env;
    }

    public function setUserInfo($userInfo) {
        $this->userInfo = $userInfo;
    }

    public function setOwner( $owner ) {
        $this->owner = $owner;
    }

    protected function leftString($content, $len) {
        $newContent = substr($content,0,$len);
        if( strlen($content) > $len) {
            $newContent .= "…";
        }
        return $newContent;
    }

    protected function getDateFromQueryString( $field ) {
        $dateTime = trim( @$_GET[$field] );
        $dateTime = str_replace("+"," ",$dateTime);
        return $dateTime;
    }

    protected function exportData() {
        $db = $this->env->getBBQLogSrc();
        $sqls = $this->getSqlsForListPage();
        if(empty($sqls)){
            return array();
        }
        $exportSql = $sqls["export_sql"];
        $data = $db->query($exportSql)->result_array();
        return $data;
    }

    protected function getSqlsForListPage() {
        return array();
    }

    protected function toGBK( $val ) {
       return iconv('utf-8','gb2312',$val);
    }

    public function export(){
        $dic = $_GET["dic"];
        $headData = json_decode( $dic, true );
        $data = $this->exportData();
        $data = array_map(function($item) use($headData){
            $newItem = array();
            foreach($headData as $key => $val) {
                if( isset($item[$key])) {
                    $val = $this->toGBK($val);
                    $newItem[$val] = $this->toGBK( $item[$key] );
                }
            }
            return $newItem;
        }, $data);
        $this->exportCsv($data);
    }

    private function exportCsv( $data ) {
        ob_start();
        $fileName = date("Y_m_d_H_i_s");
        $dataList = $this->convertToListInList($data);
        echo $this->data2Csv($dataList);
        Header("Content-type:text/csv");
        header("content-Disposition:filename=$fileName.csv" );
        ob_end_flush();
    }

    private function convertToListInList( $data ) {
        if(count($data) == 0 ) {
            return array();
        }
        $keys = array_keys($data[0]);
        $values = array();
        array_walk($data, function($item)use(&$values){
            array_push($values, array_values($item));
        });
        array_unshift($values,$keys);
        return $values;
    }

    private function data2Csv( $data ) {
        if( count( $data ) == 0 ) {
            return "";
        }
        $item = array_shift($data);
        return implode(",",  $item ) . "\n" . $this-> data2Csv($data);
    }
}