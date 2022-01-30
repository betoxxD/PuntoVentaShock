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

	public function filtros_get()
	{
		$params = (object) $this->get();
		$condicion = null;
		$condicionesSabores = null;
		$condicionesDetalles = null;
		$orden = null;
		// Condiciones de ordenamiento
		if (isset($params->precio) && $params->precio != 'null' && $params->precio != '') {
			if (isset($orden)) {
				$orden .= ", p.precio '$params->precio' ";
			} else {
				$orden = " p.precio '$params->precio' ";
			}
		}
		if (isset($params->nombre) && $params->nombre != 'null' && $params->nombre != '') {
			if (isset($orden)) {
				$orden .= ", p.nombre '$params->nombre' ";
			} else {
				$orden = " p.nombre '$params->nombre' ";
			}
		}
		// Condiciones del detalle de producto
		if (isset($params->sabores) && $params->sabores != 'null' && $params->sabores != '') {
			foreach (explode(',', $params->sabores) as $sabor) {
				if (isset($condicionesSabores)) {
					$condicionesSabores .= " OR pd.id_sabor = '$sabor' ";
				} else {
					$condicionesSabores = " pd.id_sabor = '$sabor' ";
				}
			}
			if (isset($condicion)) {
				$condicion .= " AND  ($condicionesSabores) ";
			} else {
				$condicion = " ($condicionesSabores) ";
			}
		}
		if(isset($params->color) && $params->color != 'null' && $params->color != ''){
			if (isset($condicion)) {
				$condicion .= " AND  pd.id_color = '$params->color' ";
			} else {
				$condicion = " pd.id_color = '$params->color' ";
			}
		}
		// Condiciones del producto
		if (isset($params->categoria) && $params->categoria != 'null' && $params->categoria != '') {
			if (isset($condicion)) {
				$condicion .= " AND  p.categoria = '$params->categoria' ";
			} else {
				$condicion = " p.categoria = '$params->categoria' ";
			}
		}
		if (isset($params->subcategoria) && $params->subcategoria != 'null' && $params->subcategoria != '') {
			if (isset($condicion)) {
				$condicion .= " AND  p.id_subcategoria = '$params->subcategoria' ";
			} else {
				$condicion = " p.id_subcategoria = '$params->subcategoria' ";
			}
		}
		if (isset($params->precioMin) && $params->precioMin != 'null' && $params->precioMin != '') {
			if (isset($condicion)) {
				$condicion .= " AND  p.precio >= '$params->precioMin' ";
			} else {
				$condicion = " p.precio >= '$params->precioMin' ";
			}
		}
		if (isset($params->precioMax) && $params->precioMax != 'null' && $params->precioMax != '') {
			if (isset($condicion)) {
				$condicion .= " AND  p.precio <= '$params->precioMax' ";
			} else {
				$condicion = " p.precio <= '$params->precioMax' ";
			}
		}
		$this->db->order_by($orden);
		$query = $this->db->query("SELECT DISTINCT p.id, p.nombre, p.imagenes, p.precio, p.cantidad, p.descripcion, p.caracteristicas, p.categoria, p.id_subcategoria FROM producto p JOIN producto_detalle pd ON p.id = pd.id_producto WHERE $condicion");
		$result = $query->result();
		foreach ($result as $row) {
			$this->db->where('id', $row->id_subcategoria);
			$query = $this->db->get('subcategoria');
			$row->subcategoria = $query->row();
		}
		$respuesta = array(
			'err' => FALSE,
			'cuantos' => count($result),
			'lista' => $result,
			'err_code' => 'HTTP_OK'
		);
		$this->response($respuesta);
	}

	public function minMaxPrice_get()
	{
		$query = $this->db->query('SELECT MAX(precio) AS maximo, MIN(precio) AS minimo FROM producto;');
		$result = $query->row();
		$respuesta = array(
			'err' => FALSE,
			'maximo' => $result->maximo,
			'minimo' => $result->minimo,
			'err_code' => 'HTTP_OK'
		);
		$this->response($respuesta);
	}

	public function productos_get()
	{
		$this->db->where('categoria != "sabor"');
		$query = $this->db->get('producto');
		$result = $query->result();
		foreach ($result as $row) {
			$this->db->where('id', $row->id_subcategoria);
			$query = $this->db->get('subcategoria');
			$row->subcategoria = $query->row();
		}
		$respuesta = array(
			'err' => FALSE,
			'cuantos' => count($result),
			'lista' => $result,
			'err_code' => 'HTTP_OK'
		);
		$this->response($respuesta);
	}

	public function vapers_get()
	{
		$this->db->where('categoria = "vaper"');
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

	public function sabor_get()
	{
		$this->db->where('categoria = "sabor"');
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

	public function productosById_get()
	{
		$id = $this->uri->segment(3);
		$this->db->where('id', $id);
		$query = $this->db->get('producto');
		$producto = $query->row();
		$this->db->where('id_producto', $id);
		$query = $this->db->get('producto_detalle');
		$producto_detalle = $query->result();
		foreach ($producto_detalle as $row) {
			$this->db->where('id', $row->id_sabor);
			$query = $this->db->get('sabor');
			$row->sabor = $query->row();
			$this->db->where('id', $row->id_color);
			$query = $this->db->get('color');
			$row->color = $query->row();
		}
		$query = $this->db->where('id_producto', $id);
		$query = $this->db->get('adicional_info');
		$adicional_info = $query->result();
		foreach ($adicional_info as $row) {
			$this->db->where('id', $row->id_titulo_adicional);
			$query = $this->db->get('titulo_adicional');
			$row->titulo_adicional = $query->row();
		}
		$producto->adicional_info = $adicional_info;
		$producto->producto_detalle = $producto_detalle;
		$respuesta = array(
			'err' => FALSE,
			'lista' => $producto,
			'err_code' => 'HTTP_OK'
		);
		$this->response($respuesta);
	}

	public function fourVapers_get()
	{
		// Select no muy eficiente con muchos registros, debido a la natureza de la consulta debería de funcionar
		// En caso de que se requiera una consulta más eficiente, cambiar la consulta
		$query = $this->db->query("SELECT * FROM producto WHERE categoria = 'vaper' ORDER BY RAND() LIMIT 4;");
		$respuesta = array(
			'err' => FALSE,
			'cuantos' => count($query->result()),
			'lista' => $query->result(),
			'err_code' => 'HTTP_OK'
		);
		$this->response($respuesta);
	}

	public function four_get()
	{
		// Select no muy eficiente con muchos registros, debido a la natureza de la consulta debería de funcionar
		// En caso de que se requiera una consulta más eficiente, cambiar la consulta
		$query = $this->db->query("SELECT * FROM producto WHERE categoria != 'sabor' ORDER BY RAND() LIMIT 4;");
		$respuesta = array(
			'err' => FALSE,
			'cuantos' => count($query->result()),
			'lista' => $query->result(),
			'err_code' => 'HTTP_OK'
		);
		$this->response($respuesta);
	}

	public function nuevo_get()
	{
		$query = $this->db->query("SELECT * FROM producto WHERE categoria != 'sabor' ORDER BY id DESC LIMIT 4;");
		$respuesta = array(
			'err' => FALSE,
			'cuantos' => count($query->result()),
			'lista' => $query->result(),
			'err_code' => 'HTTP_OK'
		);
		$this->response($respuesta);
	}

	public function sixFlavors_get()
	{
		// Select no muy eficiente con muchos registros, debido a la natureza de la consulta debería de funcionar
		// En caso de que se requiera una consulta más eficiente, cambiar la consulta
		$query = $this->db->query("SELECT * FROM producto WHERE categoria = 'sabor' ORDER BY RAND() LIMIT 6;");
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
