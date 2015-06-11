The software is provided in a minimal Omeka 1.5.1 web folder layout, default theme.

Installation notes:

1. The URL slug for the exhibit and theme must be the same.
2. The Lightbox2Plus installation can be in the default theme and each separate new theme can point to it.
3. Subsequently for each new theme you will modify the common/header.php to point to lightbox.css and lightbox files (js and images). 

Per exhibit/theme configuration:

Lightbox2Plus initialization options:

lightbox2Plus-config.js is located in the root of the theme folder and contains two initialization options.

	downloadlink_enabled, a boolean. true enables the link for the patron to download the jpg.

		downloadlink_enabled=true;

	metadatalink_enabled, a boolean. true enables the link for the patron to view the metadata.

		metadatalink_enabled=true;
