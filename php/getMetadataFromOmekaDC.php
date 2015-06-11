<?php

date_default_timezone_set("America/New_York");

if (!isset($_REQUEST["topdir"]))
{
	$topdir="";
}
else
{
	$topdir="/" . $_REQUEST["topdir"];
}

if (isset($_REQUEST["omekahost"]))
{
	$omekahost=$_REQUEST["omekahost"];
}
else
{
	$omekahost="exhibits";
}

if (!isset($_REQUEST["omekaid"]))
{
	print "<div>Error - an Omeka ID was not provided.</div>";
}
else
{
	$omekaid=$_REQUEST["omekaid"];

	$dc2marc21slimxslurl="http://dis.lib.usf.edu/dcs-public/xsl/DC2MARC21slim.xsl";
	$omekadcurl="http://$omekahost.lib.usf.edu/items/show/$omekaid?output=dcmes-xml";
	$omekadc=file_get_contents($omekadcurl);
	$omekadc=substr($omekadc,strpos($omekadc,"<"));

	$marcxml=mytransform($omekadc,$dc2marc21slimxslurl);

//	file_put_contents("/tmp/getMetadataFromOmekaDC.log",date("Y-m-d H:i:s") . " : omekadc url=[$omekadcurl]=[$omekadc].\r\n",FILE_APPEND);

	$out=mytransform($marcxml,"http://" . $_SERVER["HTTP_HOST"] . "/dcs-public/xsl/getMetadataService.xsl");

	$pos1=strpos($out,"<img");
	$pos2=strpos($out,">",$pos1+1);

	$out=substr($out,0,$pos1) . substr($out,$pos2+1);

	print $out;
}

function mytransform($xmldata,$myxsl)
{
	$data=@file_get_contents($myxsl);

	$xml=new DOMDocument;
	$xml->loadXML($xmldata);

	$xsl=new DOMDocument;
	$xsl->loadXML($data);

	$proc=new XSLTProcessor;
	$proc->importStyleSheet($xsl);

	$data=$proc->transformToXML($xml);

	return $data;
}

?>
