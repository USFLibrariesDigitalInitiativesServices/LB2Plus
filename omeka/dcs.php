<?php

date_default_timezone_set("America/New_York");

$debug=false;

if (isset($_REQUEST["topdir"]))
{
        $topdir=$_REQUEST["topdir"];
}
else
{
        $topdir="";
}

if (isset($_REQUEST["omekaid"]))
{
	$omekaid=$_REQUEST["omekaid"];
	$url="http://dis.lib.usf.edu/special/getMetadataFromOmekaDC.php?omekaid=$omekaid&topdir=$topdir";
}
else if (isset($_REQUEST["doi"]) && isset($_REQUEST["sobekcm"]))
{
	if ($debug)	mail("rbernard@usf.edu","Omeka/dcs.php",date("Y-m-d H:i:s") . "\r\n\r\ndoi=[" . $_REQUEST["doi"] . "].\r\nsobekcm=[" . $_REQUEST["sobekcm"] . "].\r\n");

	$doi=$_REQUEST["doi"];

	$host_content="usf.sobek.ufl.edu";

	$url="http://$host_content/xml/results/?t=$doi";

//	print "<p>URL=[$url].</p>";

	$data=file_get_contents($url);

//	print "<br/></br>";
//	print htmlentities($data);

	$xml=new SimpleXMLElement($data);

	if (!$xml)
	{
		print "<p>failed to parse xml.</p>";
		break;
	}
	else
	{
//		print "<br/><br/>";
//		print htmlentities($xml->asXml());
	}

	$results=$xml->xpath("//ItemResult[1]/@ID");

	if (!$results)
	{
		print "<p>no results.</p>";
		break;
	}

	$packageid=$results[0];

//	print "<p>packageid=[$packageid].</p>";

	$bibid=substr($packageid,0,10);
	$vid=substr($packageid,11);
	$url="http://$host_content/$bibid/$vid/citation/";
}
else
{
	return "Error - omekaid or doi is required.";
}

$data=file_get_contents($url);

if (isset($_REQUEST["sobekcm"]))
{
	$pos1=strpos($data,"<div class=\"sbkCiv_CitationSection\" id=\"sbkCiv_Biblio");
	$pos2=strpos($data,"END CITATION VIEWER OUTPUT");

	$out=substr($data,$pos1,$pos2-$pos1);

	$out=str_replace("<!--","",$out);
	$out=str_replace("</td>","",$out);

	$data="<br/><br/>" . $out;
}

print $data;

if ($debug)
{
	mail("rbernard@usf.edu","Omeka/dcs.php",date("Y-m-d H:i:s") . "\r\n\r\nurl=[$url]\r\n\r\ndata=[" . $data . "]\r\n\r\n");
}

?>
