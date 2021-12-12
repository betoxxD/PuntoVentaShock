<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<table>
    <tbody>
        <tr>
            <td>Hola, hemos recibido una solicitud de recuperación de contraseña, a continuación te entregamos tu nueva contraseña. Te sugerimos cambiarla una vez que logres ingresar.</td>
            <td></td>
        </tr>
        <tr>
            <td>Nueva contraseña</td>
            <td><?php echo $password?></td>
        </tr>
        <tr>
            <td>¿No has solicitado un cambio de contraseña? Ignora este correo.</td>
            <td></td>
        </tr>
    </tbody>
</table>
</body>
</html>