<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require( APPPATH.'/libraries/RestController.php');
require( APPPATH.'/libraries/Format.php');

use chriskacerguis\RestServer\RestController;

class Administrador extends RestController {

    public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('url');
		$this->load->model('Administrador_model');
		$this->load->helper(['jwt', 'authorization']); 
	}

	public function index_get() {
		$query = $this->db->get('administrador');
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
		$query = $this->db->get('administrador');
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
				'mensaje' => 'Es necesario el ID',
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
		$respuesta = $this->Administrador_model->delete($id);
		$this->response( $respuesta );
	}

	public function index_post() {
		$data = $this->post();
		$this->load->library('form_validation');
		$this->form_validation->set_data($data);
		$result = $this->Administrador_model->set_datos($data);
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
		$anterior = $this->Administrador_model->get($id);
		$data = $this->put();
		$data['id'] = $id;
		$this->load->library('form_validation');
		$this->form_validation->set_data($data);
		if(is_null($data['contrasena'])) {
			$data['contrasena'] = $anterior->contrasena;
		}
		$obj = $this->Administrador_model->set_datos( $data );
		$respuesta = $obj->update();
		if ($respuesta['err']) {
			$this->response($respuesta, RestController::HTTP_BAD_REQUEST);
		} else {
			$this->response($respuesta);
		}
	}

	public function login_post(){
		$administrador = $this->post();

		$respuesta = $this->Administrador_model->login($administrador['correo'], $administrador['contrasena']);
		
		if(isset($respuesta)){
			// Create a token from the user data and send it as reponse
			$token = AUTHORIZATION::generateToken($respuesta);
            $respuesta = array(
				'err' => false,
				'mensaje' => 'Inicio de sesión correcto.',
				'token' => $token,
				'administrador' => $respuesta,
				'err_code' => 'HTTP_OK'
			);

			$this->response($respuesta); 
        }          
		
        $respuesta = array(
            'err' => true,
            'mensaje' => 'El registro email no se encontro registrado.',
            'administrador' => null,
            'err_code' => 'HTTP_NOT_FOUND'
        );
        $this->response($respuesta, RestController::HTTP_NOT_FOUND);
    }

	private function verify_request()
	{
		// Get all the headers
		$headers = $this->input->request_headers();
		// Extract the token
		$token = $headers['Authorization'];
		// Use try-catch
		// JWT library throws exception if the token is not valid
		try {
			// Validate the token
			// Successfull validation will return the decoded user data else returns false
			$data = AUTHORIZATION::validateToken($token);
			if ($data === false) {
				$status = parent::HTTP_UNAUTHORIZED;
				$response = ['status' => $status, 'msg' => 'Unauthorized Access!'];
				$this->response($response, $status);
				exit();
			} else {
				return $data;
			}
		} catch (Exception $e) {
			// Token is invalid
			// Send the unathorized access message
			$status = parent::HTTP_UNAUTHORIZED;
			$response = ['status' => $status, 'msg' => 'Unauthorized Access! '];
			$this->response($response, $status);
		}
	}

	public function get_me_data_post()
	{
		// Call the verification method and store the return value in the variable
		$data = $this->verify_request();
		// Send the return data as reponse
		$status = parent::HTTP_OK;
		$response = ['status' => $status, 'data' => $data];
		$this->response($response, $status);
	}
}
