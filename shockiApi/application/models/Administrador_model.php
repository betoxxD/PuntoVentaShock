<?php

defined('BASEPATH') or exit('No direct scrips access allowed');

class Administrador_model extends CI_Model
{
	public $id;
	public $nombre;
	public $apellidos;
	public $correo;
	public $contrasena;
	public $telefono;

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}
	public function set_datos($data_cruda)
	{
		foreach ($data_cruda as $nombre_campo => $valor_campo) {
			if (property_exists('Administrador_model', $nombre_campo)) {
				$this->$nombre_campo = $valor_campo;
			}
		}
		return $this;
	}

	public function get($id)
	{
		$this->db->where(array('id' => $id));
		$query = $this->db->get('administrador');
		$row = $query->custom_row_object(0, 'Administrador_model');
		if (isset($row)) {
			$row->id = intval($row->id);
		}
		return $row;
	}

	public function insert()
	{
		$query = $this->db->get_where('administrador', array('correo' => $this->correo));
		$administrador = $query->row();

		if (isset($administrador)) {
			$respuesta = array(
				'err' => TRUE,
				'mensaje' => 'Correo ya registrado.',
				'err_code' => 'HTTP_BAD_REQUEST'
			);

			return $respuesta;
		}
		$this->contrasena =  hash('sha512', $this->contrasena);
		$hecho = $this->db->insert('administrador', $this);
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
		if (strlen($this->contrasena) < 30) {

			$this->contrasena =  hash('sha512', $this->contrasena);
		}
		$hecho = $this->db->update('administrador', $this);

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
		$query = $this->db->delete('administrador');
		$res = array(
			'err' => false,
			'mensaje' => 'Dato eliminado correctamente.',
			'result' => $query
		);

		return $res;
	}

	/** Funcion Login */

	public function login($correo, $password)
	{
		$password =  hash('sha512', $password);
		$this->db->where(array('correo' => $correo, 'contrasena' => $password));
		$query = $this->db->get('administrador');

		$row = $query->custom_row_object(0, 'Administrador_model');

		if (isset($row)) {
			$row->id = intval($row->id);
			$row->contrasena = '';
		}

		return $row;
	}
}
