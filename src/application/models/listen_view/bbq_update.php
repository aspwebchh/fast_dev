<?php

loadGm2ClassFile("bbq_base.php");

class bbq_update extends bbq_base {
    public function data() {
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
}