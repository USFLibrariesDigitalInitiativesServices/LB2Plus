The software is provided in a minimal Omeka 1.5.1 web folder layout [omeka], default theme. Support files are in the php and xsl folders. It is assumed that the person installing LB2Plus is experienced with Omeka 1.5.1 and has the necessary permissions to perform the install, etc.

Installation steps:

1. Copy the /omeka/themes/default/common/lightbox folder into your [omekawebdir]/themes/default/common/ folder.
2. Examine the /omeka/themes/default/common/header.php file and copy and paste the code for the css (link) and js (script) statements into the [omekawebdir]/themes/[yourtheme]/common/header.php file.
3. Copy the lightbox2Plus-config.js file into the root of [yourtheme] folder.
4. Copy the omeka/themes/default/css/lightbox.css file into the [yourtheme]/css/ folder.
5. Copy the /php/getMetadataFromOmekaDC.php file into a folder outside of your [omekawebdir].
6. Copy the /xsl/ files to a folder outside of your [omekawebdir].
7. Edit the [folder used in #5 & #6]/getMetadataFromOmekaDC.php file and update the xsl URLs and URL pointing to your Omeka installation.
6. Copy the /omeka/dcs.php file into your [omekawebdir] folder.
7. Edit the [omekawebdir]/dcs.php file and update the required url variable for getMetadataFromOmekaDC. Also update the url variable pointing to your SobekCM website. Update the email addresses in the debug mail statements.
7. Edit the [omekawebdir]/themes/default/common/lightbox/js/lightbox.js file and update the URL for the getMetadataFromOmekaDC.php file to where you will be serving it from (outside of your [omekawebdir]).
8. Edit the [omekawebdir]/themes/default/common/lightbox/js/lightbox.js file and update the various URLs to point to your SobekCM instance.
9. Yes, it would have been better to not hard-code the URLs and expand use of the configuration file. Perhaps a later release.

Installation notes:

1. The URL slug for the exhibit and theme MUST be the same.
2. To reduce duplication the Lightbox2Plus installation should be in the default theme and each new theme will point to it.
3. Of the /omeka/themes/default/common/lightbox/js/ js files, all are original (v2.05) except the modified lightbox.js file.
5. Of the /omeka/themes/default/common/lightbox/images/ image files, all are original (v2.05) except the addition of the 'rrbLB2plus' image files.
6. Your web server must support the XSL module for using XSLTProcessor (http://php.net/manual/en/book.xsl.php) and the DOM (enabled by default).

Exhibit/theme - LB2Plus configuration options:

lightbox2Plus-config.js is located in the root of the theme folder and contains two initialization options.

1. downloadlink_enabled, a boolean. true enables the link for the patron to download the jpg.

	downloadlink_enabled=true;

2. metadatalink_enabled, a boolean. true enables the link for the patron to view the metadata.

	metadatalink_enabled=true;
