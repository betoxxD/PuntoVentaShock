<?php
defined('BASEPATH') or exit('No direct script access allowed');

require(APPPATH . '/libraries/RestController.php');
require(APPPATH . '/libraries/Format.php');

use chriskacerguis\RestServer\RestController;

class Producto extends RestController
{

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
		$this->load->helper('url');
		$this->load->model('Producto_model');
		$this->load->helper(['jwt', 'authorization']);
	}

	public function index_get()
	{
		$this->db->order_by('codigo', 'ASC');
		$query = $this->db->get('producto');
		$result = $query->result();
		$respuesta = array(
			'err' => FALSE,
			'cuantos' => count($result),
			'lista' => $result,
			'err_code' => 'HTTP_OK'
		);
		$this->response($respuesta);
	}

	public function byId_get()
	{
		$id = $this->uri->segment(3);
		$this->db->where('id', $id);
		$query = $this->db->get('producto');
		$respuesta = array(
			'err' => FALSE,
			'cuantos' => count($query->result()),
			'lista' => $query->result(),
			'err_code' => 'HTTP_OK'
		);
		$this->response($respuesta);
	}

	public function index_delete()
	{
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
		$respuesta = $this->Producto_model->delete($id);
		$this->response($respuesta);
	}

	public function index_post()
	{
		$data = $this->post();
		$this->load->library('form_validation');
		$this->form_validation->set_data($data);
		$result = $this->Producto_model->set_datos($data);
		$respuesta = $result->insert();

		if ($respuesta['err']) {
			$this->response($respuesta, RestController::HTTP_BAD_REQUEST);
		} else {
			$this->response($respuesta);
		}
		$this->response($respuesta, RestController::HTTP_BAD_REQUEST);
	}

	public function index_put()
	{
		$id = $this->uri->segment(2);
		$anterior = $this->Producto_model->get($id);
		$data = $this->put();
		$data['id'] = $id;
		$this->load->library('form_validation');
		$this->form_validation->set_data($data);
		$obj = $this->Producto_model->set_datos($data);
		$respuesta = $obj->update();
		if ($respuesta['err']) {
			$this->response($respuesta, RestController::HTTP_BAD_REQUEST);
		} else {
			$this->response($respuesta);
		}
	}

	public function upload_post()
	{

		// $data = 'entro';
		$id = $this->uri->segment(3);
		$campo = $this->uri->segment(4);
		$producto = $this->Producto_model->get($id);

		if (!file_exists('./uploads/Productos')) {
			mkdir('./uploads/Productos', 0755);
		}
		if (!file_exists('./uploads/Productos/producto-' . $id)) {
			mkdir('./uploads/Productos/producto-' . $id, 0755);
		}

		if (count($_FILES) > 0) {
			$config['upload_path'] = './uploads/Productos/producto-' . $id;
			$config['allowed_types'] = 'gif|jpg|jpeg|png|GIF|JPG|JPEG|PNG|pdf|PDF';
			$config['max_size'] = '0';
			$config['max_width'] = '0';
			$config['max_height'] = '0';
			$this->load->library('upload', $config);
			foreach ($_FILES as $nombre => $archivo) {
				if (!$this->upload->do_upload($nombre)) {
					$error = array('error' => $this->upload->display_errors());
					$respuesta = array(
						'err' => true,
						'mensaje' => 'Ocurrio un error al subir los archivos',
						'errors' => $error,
					);
				} else {
					$data = array('upload_data' => $this->upload->data());
					if (!isset($producto->$campo) || $producto->$campo == '') {
						$producto->$campo = $data['upload_data']['file_name'];
					} else {
						$ant_imgs = $producto->$campo;
						$producto->$campo = $ant_imgs . "," . $data['upload_data']['file_name'];
					}
					$result = $producto->update();
					$respuesta = array(
						'err' => false,
						'data' => $data['upload_data'],
						'mensaje' => 'Subida de archivo correta',
						'update' => $result,
						'producto' => $producto,
						'err_code' => 'HTTP_OK'
					);
				}
			}

			$this->response($respuesta);
		} else {
			$this->response(array(
				'err' => true,
				'mensaje' => 'No selecciono ningun archivo',
				'data' => $this->post(),
				'err_code' => 'HTTP_BAD_REQUEST'
			));
		}
	}
}
