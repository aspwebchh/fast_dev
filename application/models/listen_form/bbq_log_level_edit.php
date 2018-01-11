<?php

loadGm2ClassFile("bbq_base.php");

class bbq_log_level_edit extends bbq_base {
    public function submit() {

        return  array(
            "retCode" => 0,
            "retmsg" => "123567",
            "map" => array(
                "a" => 1,
                "b" => 2,
                "c" => 3
            ),
            "list" =>array(
                array(
                    "a" => 1,
                    "b" => 2,
                    "c" => 3
                ),
                array(
                    "a" => 1,
                    "b" => 2,
                    "c" => 3
                ),
                array(
                    "a" => 1,
                    "b" => 2,
                    "c" => 3
                ),
            )
        );
    }

    public function data() {
        $data = array(
            "begin_time" => "2017-11-11",
            "end_time" => "2017-11-11",
            "interval" => "20",
            "content" => "12321",
        );
        return $data;
    }
}