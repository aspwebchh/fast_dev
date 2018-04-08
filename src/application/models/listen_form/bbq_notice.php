<?php

loadGm2ClassFile("bbq_base.php");

class bbq_notice extends bbq_base {
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
}