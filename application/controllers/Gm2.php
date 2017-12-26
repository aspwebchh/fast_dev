<?php

class Gm2 extends CI_Controller{
    public function __construct(){
        parent::__construct();
        $this->load->model("m_gm2");
    }

    public function index(){
        $this->load->view("admin/default.html");
    }

    public function getAction() {
        $actionId = $this->input->get("action_id");
        $actionMode = $this->input->get("action_mode");
        $actionType = $this->input->get("action_type");
        $result = $this->m_gm2->getActionXml( $actionId, $actionMode, $actionType );
        echo $result;
    }

    public function getActionList() {
        $result = $this->m_gm2->getActionList();
        echo json_encode($result);
    }

    public function forList() {
        $actionId = $this->input->get("action_id");
        $actionMode = $this->input->get("action_mode");
        $method = $this->input->get("method");
        $actionType = $this->input->get("action_type");
        $result = $this->m_gm2->callListenClass($actionId,$actionMode, $method, $actionType);
        echo json_encode($result);
    }

    public function forForm() {
        $actionId = $this->input->get("action_id");
        $actionMode = $this->input->get("action_mode");
        $method = $this->input->get("method");
        $actionType = $this->input->get("action_type");
        $result =  $this->m_gm2->callListenClass( $actionId, $actionMode, $method, $actionType );
        echo json_encode($result);
    }

    public function forView() {
        $actionId = $this->input->get("action_id");
        $actionMode = $this->input->get("action_mode");
        $method = $this->input->get("method");
        $actionType = $this->input->get("action_type");
        $result =  $this->m_gm2->callListenClass( $actionId, $actionMode, $method, $actionType );
        echo json_encode($result);
    }
	
	public function forZone(){
		$actionId = $this->input->get("action_id");
        $method = $this->input->get("method");
        $result =  $this->m_gm2->getZoneList( $actionId, $method);
        echo json_encode($result);
	}
}