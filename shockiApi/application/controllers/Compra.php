<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require( APPPATH.'/libraries/RestController.php');
require( APPPATH.'/libraries/Format.php');

use chriskacerguis\RestServer\RestController;

class Compra extends RestController {

    public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('url');
		$this->load->model('Compra_model');
		$this->load->helper(['jwt', 'authorization']); 
	}

	public function index_get() {
		$query = $this->db->get('compra');
		$respuesta = array(
        'err' => FALSE,
        'cuantos' => count($query->result()),
        'lista' => $query->result(),
        'err_code' => 'HTTP_OK');
		$this->response($respuesta);
	}

	public function byId_get() {
		$id = $this->uri->segment(3);
		$this->db->where('id', $id);
		$query = $this->db->get('compra');
		$respuesta = array(
        'err' => FALSE,
        'cuantos' => count($query->result()),
        'lista' => $query->result(),
        'err_code' => 'HTTP_OK');
		$this->response($respuesta);
	}

	public function index_delete() {
		$id = $this->uri->segment(2);
		if (!isset($id)) {
			$respuesta = array(
				'err' => TRUE,
				'mensaje' => 'Es necesario el ID del numero',
				'err_code' => 'HTTP_BAD_REQUEST'
			);
			$this->response($respuesta);
			return;
		}

		if (!is_numeric($id)) {
			$respuesta = array(
				'err' => false,
				'mensaje' => 'El ID debe ser numérico.',
				'result' => $id,
				'err_code' => 'HTTP_BAD_REQUEST'
			);
			$this->response($respuesta, RestController::HTTP_BAD_REQUEST);

			return;
		}
		$respuesta = $this->Compra_model->delete($id);
		$this->response( $respuesta );
	}

	public function index_post() {
		$data = $this->post();
		$this->load->library('form_validation');
		$this->form_validation->set_data($data);
		$result = $this->Compra_model->set_datos($data);
		$respuesta = $result->insert();

		if ($respuesta['err']) {
			$this->response($respuesta, RestController::HTTP_BAD_REQUEST);
		} else {
			$this->response($respuesta);
		}
		$this->response($respuesta, RestController::HTTP_BAD_REQUEST);
	}

	public function index_put() {
        $id = $this->uri->segment(2);
		$anterior = $this->Compra_model->get($id);
		$data = $this->put();
		$data['id'] = $id;
		$this->load->library('form_validation');
		$this->form_validation->set_data($data);
		$obj = $this->Compra_model->set_datos( $data );
		$respuesta = $obj->update();
		if ($respuesta['err']) {
			$this->response($respuesta, RestController::HTTP_BAD_REQUEST);
		} else {
			$this->response($respuesta);
		}
	}
}
