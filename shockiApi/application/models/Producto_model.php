<?php

defined('BASEPATH') or exit('No direct scrips access allowed');

class Producto_model extends CI_Model
{
	public $id;
	public $descripcion;
	public $precio;
	public $codigo;
	public $marca;

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}
	public function set_datos($data_cruda)
	{
		foreach ($data_cruda as $nombre_campo => $valor_campo) {
			if (property_exists('Producto_model', $nombre_campo)) {
				$this->$nombre_campo = $valor_campo;
			}
		}
		return $this;
	}

	public function get($id)
	{
		$this->db->where(array('id' => $id));
		$query = $this->db->get('producto');
		$row = $query->custom_row_object(0, 'Producto_model');
		if (isset($row)) {
			$row->id = intval($row->id);
		}
		return $row;
	}

	public function insert()
	{
		$this->db->where('codigo', $this->codigo);
		$query = $this->db->get('producto');
		$result = $query->result();
		if (count($result) > 0) {
			$respuesta = array(
				'err' => TRUE,
				'mensaje' => 'Este producto ya se encuentra registrado.',
				'error' => $this->db->error(),
				'err_code' => 'HTTP_INTERNAL_SERVER_ERROR'
			);
			return $respuesta;
		}
		$hecho = $this->db->insert('producto', $this);
		if ($hecho) {
			$respuesta = array(
				'err' => FALSE,
				'mensaje' => 'Registro insertado correctamente',
				'id' => $this->db->insert_id(),
				'err_code' => 'HTTP_OK'
			);
		} else {
			$respuesta = array(
				'err' => TRUE,
				'mensaje' => 'Error al insertar, inténtalo más tarde.',
				'error' => $this->db->error(),
				'err_code' => 'HTTP_INTERNAL_SERVER_ERROR'
			);
		}
		return $respuesta;
	}

	public function update()
	{
		$this->db->where('codigo', $this->codigo);
		$this->db->where('id !=', $this->id);
		$query = $this->db->get('producto');
		$result = $query->result();
		if (count($result) > 0) {
			$respuesta = array(
				'err' => TRUE,
				'mensaje' => 'Este código ya se encuentra registrado.',
				'error' => $this->db->error(),
				'err_code' => 'HTTP_INTERNAL_SERVER_ERROR'
			);
			return $respuesta;
		}
		$this->db->where('id', $this->id);
		$hecho = $this->db->update('producto', $this);

		if ($hecho) {
			$respuesta = array(
				'err' => FALSE,
				'mensaje' => 'Registro actualizado correctamente',
				'id' => $this->id
			);
		} else {
			$respuesta = array(
				'err' => TRUE,
				'mensaje' => 'Error al actualizar.',
				'error' => $this->db->error()
			);
		}
		return $respuesta;
	}

	public function delete($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->delete('producto');
		$res = array(
			'err' => false,
			'mensaje' => 'Dato eliminado correctamente.',
			'result' => $query
		);

		return $res;
	}
}
