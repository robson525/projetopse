<?php header('Content-Type: text/html; charset=utf-8');
include "configuration.php";
$config = new JConfig();

$conn = mysql_connect($config->host, $config->user, $config->password) or die("Erro ao Conectar: ".mysql_error());
$db = mysql_select_db($config->db, $conn) or die("Erro Banco de Dados: ".mysql_error());

$id = 17;

$texto =  <<<EOD
<p><span style="font-size: 12pt;">Os educadores-cursistas, que conclu&iacuterem os cinco m&oacute;dulos do curso &nbsp;e obtiverem nas atividades avaliativas m&eacute;dia final igual ou superior a 50, receber&atilde;o certificado com titulo de&nbsp;Extens&atilde;o Universit&aacute;ria&nbsp;emitido pela Pr&oacute;-Reitoria de Extens&atilde;o - PROEX da Universidade Federal do Par&aacute; com carga hor&aacute;ria de 180 horas.</span></p>
<p><span style="font-size: 12pt;">&nbsp;</span></p><br><br><br><br><br><br><br>

EOD;


$sql = "UPDATE jom_content SET introtext = '$texto' WHERE id = $id;";
$query = mysql_query($sql) or die("Erro Query: ".mysql_error());

if($query)
	echo $sql;

?>
<br><br><br>
<br>ª = &ordf;
<br>ç = &ccedil;
<br>á = &aacute;
<br>ã = &atilde;
<br>é = &eacute;
<br>í = &iacute;
<br>ó = &oacute;
<br>õ = &otilde;