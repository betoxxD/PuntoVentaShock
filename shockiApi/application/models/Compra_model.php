<?php

defined('BASEPATH') or exit('No direct scrips access allowed');

class Compra_model extends CI_Model
{
	public $id;
	public $total;
	public $fecha_hora;
	public $cant_prendas;

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}
	public function set_datos($data_cruda)
	{
		foreach ($data_cruda as $nombre_campo => $valor_campo) {
			if (property_exists('Compra_model', $nombre_campo)) {
				$this->$nombre_campo = $valor_campo;
			}
		}
		return $this;
	}

	public function get($id)
	{
		$this->db->where(array('id' => $id));
		$query = $this->db->get('compra');
		$row = $query->custom_row_object(0, 'Compra_model');
		if (isset($row)) {
			$row->id = intval($row->id);
		}
		return $row;
	}

	public function insert()
	{
		$hecho = $this->db->insert('compra', $this);
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
				'mensaje' => 'Error al insertar.',
				'error' => $this->db->error(),
				'err_code' => 'HTTP_INTERNAL_SERVER_ERROR'
			);
		}
		return $respuesta;
	}

	public function update()
	{
		$this->db->where('id', $this->id);
		$hecho = $this->db->update('compra', $this);

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
		$query = $this->db->delete('compra');
		$res = array(
			'err' => false,
			'mensaje' => 'Dato eliminado correctamente.',
			'result' => $query
		);

		return $res;
	}
}
