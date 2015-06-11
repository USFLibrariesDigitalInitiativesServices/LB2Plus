<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title><?php echo settings('site_title'); echo isset($title) ? ' | ' . $title : ''; ?></title>

<!-- Meta -->
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="description" content="<?php echo settings('description'); ?>" />

<?php echo auto_discovery_link_tag(); ?>

<!-- Plugin Stuff -->
<?php plugin_header(); ?>

<!-- Stylesheets -->
<?php
queue_css('style');
display_css(); 
?>

<!-- Lightbox style sheet -->
<link rel="stylesheet" href="<?php echo WEB_ROOT;?>/themes/default/css/lightbox.css" type="text/css" media="screen" />
<!-- End Lightbox stylesheet -->

<!-- JavaScripts -->
<?php echo display_js(); ?>

<!-- Start Lightbox includes -->
<script type="text/javascript" src="<?php echo WEB_ROOT;?>/themes/default/common/lightbox/js/prototype.js"></script>
<script type="text/javascript" src="<?php echo WEB_ROOT;?>/themes/default/common/lightbox/js/scriptaculous.js?load=effects,builder"></script>
<script type="text/javascript" src="<?php echo WEB_ROOT;?>/themes/<?php echo html_escape(exhibit('slug')); ?>/lightbox2Plus-config.js"></script>
<script type="text/javascript" src="<?php echo WEB_ROOT;?>/themes/default/common/lightbox/js/lightbox.js"></script>
<!-- End Lightbox includes -->

<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-11530892-9']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
</head>
<body<?php echo isset($bodyid) ? ' id="'.$bodyid.'"' : ''; ?><?php echo isset($bodyclass) ? ' class="'.$bodyclass.'"' : ''; ?>>
<div class="container" id="site_info">
<p class="rtxt"><a href="http://lib.usf.edu" target="_blank">USF Libraries</a>  |  <a href="http://lib.usf.edu/special-collections" target="_blank">Special &amp; Digital Collections</a>  |  <a href="http://exhibits.lib.usf.edu" target="_blank">Exhibits</a></p>
</div>
<div id="outerexhibit">
	<div id="wrap" class="container_12">

		<div id="header">
		<div id="site-title"><?php echo link_to_exhibit(custom_display_logo()); ?></div>
		</div>
		<div class="clear"></div>
		<div id="content">
		    
			<div id="primary-nav">
            <div class="nav-head">Search</div>
				<div id="search-wrap">
				    <?php echo simple_search(); ?>
				    <?php echo link_to_advanced_search(); ?>
    			</div>
                
                <?php echo exhibit_builder_nested_nav(null, false); ?> 
			</div>
