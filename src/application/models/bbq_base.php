<?php
loadGm2ClassFile("listen_base.php");

abstract class bbq_base extends listen_base
{
    protected function listPageAsNull() {
        return array("data_count"=>0, "data_list"=> array());
    }

    private function getType($obj)
    {
        $type = gettype($obj);
        if ($type != "array") {
            return $type;
        } else {
            foreach ($obj as $key => $value) {
                if (gettype($key) == "integer") {
                    return "list";
                } else {
                    return "map";
                }
            }
        }
    }

    protected function stringToIntegerInData($data)
    {
        $type = $this->getType($data);
        switch ($type) {
            case "list":
            case "map":
                foreach ($data as $key => $item) {
                    $data[$key] = $this->stringToIntegerInData($item);
                }
                return $data;
            default:
                if (is_numeric($data)) {
                    return intval($data);
                } else {
                    return $data;
                }
        }
    }

    protected function getLimit()
    {
        $page = @$_GET["page"];
        $page = empty($page) ? 1 : $page;
        $skip = ($page - 1) * GM2_PER_PAGE;
        $limit = GM2_PER_PAGE;
        return [$skip, $limit];
    }

    protected function listByPage($data)
    {
        list($skip, $limit) = $this->getLimit();
        if (empty($data)) {
            $count = 0;
            $dataList = array();
        } else {
            $count = count($data);
            $dataList = array_slice($data, $skip, $limit);
        }
        return array("data_list" => $dataList, "data_count" => $count);
    }
}
