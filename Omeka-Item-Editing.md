Linking to an existing SobekCM package image in an Omeka item.

1. Create a new item.
2. Enter a title in the Title field.
3. Enter a Digital Object Identifier (DOI) in the Identifier field. We enter it in the form 'usfldc:DOI' where usfldc is our namespace for USF Libraries Digital Collections and DOI is our digital object identifier in the form cid-#####[additional characters] where cid is our 3 digit collection identifier (alphanumeric). ##### is a five digit number with leading zeros. Example, usfldc:B45-00001.
4. Make the item public and save the changes.
5. Follow normal Omeka exhibit development procedures to create exhibit pages and add items to those pages, etc.

The Lightbox2Plus plugin will see the specially coded identifier in the item.

Note: The coding of the identifer in the Identifier field assumes you add a [local, independent of your SobekCM instance] digital object identifier. This is how your SobekCM packageid is retreived via retrieving results from http://your.sobeckcm.webiste/xml/results/?t=
