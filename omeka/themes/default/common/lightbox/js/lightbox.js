// -----------------------------------------------------------------------------------
//
//	Lightbox v2.05
//	by Lokesh Dhakar - http://www.lokeshdhakar.com
//	Last Modification: 3/18/11
//
//	For more information, visit:
//	http://lokeshdhakar.com/projects/lightbox2/
//
//	Licensed under the Creative Commons Attribution 2.5 License - http://creativecommons.org/licenses/by/2.5/
//  	- Free for use in both personal and commercial projects
//		- Attribution requires leaving author name, author link, and the license info intact.
//	
//  Thanks: Scott Upton(uptonic.com), Peter-Paul Koch(quirksmode.com), and Thomas Fuchs(mir.aculo.us) for ideas, libs, and snippets.
//  		Artemy Tregubenko (arty.name) for cleanup and help in updating to latest ver of proto-aculous.
//
// -----------------------------------------------------------------------------------
/*

    Table of Contents
    -----------------
    Configuration

    Lightbox Class Declaration
    - initialize()
    - updateImageList()
    - start()
    - changeImage()
    - resizeImageContainer()
    - showImage()
    - updateDetails()
    - updateNav()
    - enableKeyboardNav()
    - disableKeyboardNav()
    - keyboardAction()
    - preloadNeighborImages()
    - end()
    
    Function Calls
    - document.observe()
   
*/
// -----------------------------------------------------------------------------------

// rrb
// setting topdir to "" because running hostname no subdir configuration...
var topdir="";
// end of rrb

//
//  Configurationl
//
// rrb - added additional fields to support images for LightBox2Plus : fileBottomNavCloseImage, fileBottomNavDetailsImage, fileBottomNavFullImage, fileBottomNavDivider

LightboxOptions = Object.extend({
    fileLoadingImage:        'http://' + window.location.hostname + topdir + '/themes/default/common/lightbox/images/loading.gif',     
    fileBottomNavCloseImage: 'http://' + window.location.hostname + topdir + '/themes/default/common/lightbox/images/rrbLB2plus-closeThis.gif',
    fileBottomNavDetailsImage: 'http://' + window.location.hostname + topdir + '/themes/default/common/lightbox/images/rrbLB2plus-seeImageInfo.gif',
    fileBottomNavDetailsCloseImage: 'http://' + window.location.hostname + topdir + '/themes/default/common/lightbox/images/detailsMinus.gif',
    fileBottomNavFullImage: 'http://' + window.location.hostname + topdir + '/themes/default/common/lightbox/images/rrbLB2plus-downloadImage.gif',
    fileBottomNavDivider: 'http://' + window.location.hostname + topdir + '/themes/default/common/lightbox/images/rrbLB2plus-divider.gif',

    overlayOpacity: 0.8,   // controls transparency of shadow overlay

    animate: true,         // toggles resizing animations
    resizeSpeed: 7,        // controls the speed of the image resizing animations (1=slowest and 10=fastest)

    borderSize: 10,         //if you adjust the padding in the CSS, you will need to update this variable

	// When grouping images this is used to write: Image # of #.
	// Change it for non-english localization
	labelImage: "Image",
	labelOf: "of"
}, window.LightboxOptions || {});

// -----------------------------------------------------------------------------------

var Lightbox = Class.create();

Lightbox.prototype = {
    imageArray: [],
    activeImage: undefined,
    
    // initialize()
    // Constructor runs on completion of the DOM loading. Calls updateImageList and then
    // the function inserts html at the bottom of the page which is used to display the shadow 
    // overlay and the image container.
    //
    initialize: function() {    
        
        this.updateImageList();
        
        this.keyboardAction = this.keyboardAction.bindAsEventListener(this);

        if (LightboxOptions.resizeSpeed > 10) LightboxOptions.resizeSpeed = 10;
        if (LightboxOptions.resizeSpeed < 1)  LightboxOptions.resizeSpeed = 1;

	    this.resizeDuration = LightboxOptions.animate ? ((11 - LightboxOptions.resizeSpeed) * 0.15) : 0;
	    this.overlayDuration = LightboxOptions.animate ? 0.2 : 0;  // shadow fade in/out duration

        // When Lightbox starts it will resize itself from 250 by 250 to the current image dimension.
        // If animations are turned off, it will be hidden as to prevent a flicker of a
        // white 250 by 250 box.
        var size = (LightboxOptions.animate ? 250 : 1) + 'px';
        

        // Code inserts html at the bottom of the page that looks similar to this:
        //
        //  <div id="overlay"></div>
        //  <div id="lightbox">
        //      <div id="outerImageContainer">
        //          <div id="imageContainer">
        //              <img id="lightboxImage">
        //              <div style="" id="hoverNav">
        //                  <a href="#" id="prevLink"></a>
        //                  <a href="#" id="nextLink"></a>
        //              </div>
        //              <div id="loading">
        //                  <a href="#" id="loadingLink">
        //                      <img src="images/loading.gif">
        //                  </a>
        //              </div>
        //          </div>
        //      </div>
        //      <div id="imageDataContainer">
        //          <div id="imageData">
        //              <div id="imageDetails">
        //                  <span id="caption"></span>
        //                  <span id="numberDisplay"></span>
        //              </div>
        //              <div id="bottomNav">
        //                  <a href="#" id="bottomNavClose">
        //                      <img src="images/close.gif">
        //                  </a>
        //              </div>
        //          </div>
        //      </div>
        //  </div>


        var objBody = $$('body')[0];

		objBody.appendChild(Builder.node('div',{id:'overlay'}));
	
        objBody.appendChild(Builder.node('div',{id:'lightbox'}, [
            Builder.node('div',{id:'outerImageContainer'}, 
                Builder.node('div',{id:'imageContainer'}, [
                    Builder.node('img',{id:'lightboxImage'}), 
                    Builder.node('div',{id:'hoverNav'}, [
                        Builder.node('a',{id:'prevLink', href: '#' }),
                        Builder.node('a',{id:'nextLink', href: '#' })
                    ]),
                    Builder.node('div',{id:'loading'}, 
                        Builder.node('a',{id:'loadingLink', href: '#' }, 
                            Builder.node('img', {src: LightboxOptions.fileLoadingImage})
                        )
                    )
                ])
            ),
		Builder.node('div', {id:'imageDataContainer'},
                	Builder.node('div',{id:'imageData',display:'block',position:'relative'}, [
                    		Builder.node('div',{id:'imageDetails'}, [
                        		Builder.node('span',{id:'caption'}),
                        		Builder.node('span',{id:'numberDisplay'})
                    		]),
                    		Builder.node('div',{id:'bottomNav'},[
					Builder.node('a',{id:'bottomFullImageLink', href: '#',title:'Download image' },
						Builder.node('img',{id:'fullImageButton',src: LightboxOptions.fileBottomNavFullImage,alt:'Download image'})
					),
					Builder.node('img',{id:'myDivider1',src:LightboxOptions.fileBottomNavDivider}),
					Builder.node('a',{id:'bottomNavDetails', href: '#',title:'See Image Info' },
			    			Builder.node('img', { id:'detailsButton',alt:'See Image Info',src: LightboxOptions.fileBottomNavDetailsImage })
					),
					Builder.node('img',{id:'myDivider2',src:LightboxOptions.fileBottomNavDivider}),
                        		Builder.node('a',{title:'Close this',id:'bottomNavClose', href: '#' },
                            			Builder.node('img', { alt:'Close this',src: LightboxOptions.fileBottomNavCloseImage })
                        		)
				]),

                        	Builder.node('div',{id:'repositoryMetadata', style: 'position:relative; display:block; width: 99%; height:100%; text-align:left; padding-left:5px; padding-right:5px; padding-bottom:10px;'},
                                	Builder.node('span',{id:'repData',style:'width:100%; height:100%;'})
                        	)
                	])
            	)
        ]));


		$('overlay').hide().observe('click', (function() { this.end(); }).bind(this));
		$('lightbox').hide().observe('click', (function(event) { if (event.element().id == 'lightbox') this.end(); }).bind(this));

//rrb
		$('lightbox').hide().observe('focus',(function() { $('lightbox').scrollTo(); }).bind(this));

		$('outerImageContainer').setStyle({ width: size, height: size });
		$('prevLink').observe('click', (function(event) { event.stop(); this.changeImage(this.activeImage - 1); }).bindAsEventListener(this));
		$('nextLink').observe('click', (function(event) { event.stop(); this.changeImage(this.activeImage + 1); }).bindAsEventListener(this));
		$('loadingLink').observe('click', (function(event) { event.stop(); this.end(); }).bind(this));
		$('bottomNavClose').observe('click', (function(event) { event.stop(); this.end(); }).bind(this));

//end of rrb
		$('lightbox').hide().observe('focus',(function(event) {this.scrollTo();}).bind(this));

//rrb
		if (metadatalink_enabled)
		{
			$('bottomNavDetails').observe('click', (function(event) { event.stop(); this.getDetails(this.activeImage); }).bindAsEventListener(this));
		}
		else
		{
//			$('bottomNavDetails').observe('click', (function(event) { event.stop(); alert("Image information not available."); }).bindAsEventListener(this));
			$('detailsButton').setStyle({opacity:0});
			$('bottomNavDetails').remove();
			$('myDivider1').setStyle({opacity:0});
			$('myDivider2').setStyle({opacity:0});
		}

		if (downloadlink_enabled)
		{
			$('bottomFullImageLink').observe('click',(function(event) {event.stop(); this.navToFullImage(this.activeImage); }).bindAsEventListener(this));
		}
		else
		{
//			$('bottomFullImageLink').observe('click',(function(event) {event.stop(); alert("This image is not available for download."); }).bindAsEventListener(this));
			$('fullImageButton').setStyle({opacity:0});
			$('bottomFullImageLink').remove();
                        $('myDivider1').setStyle({opacity:0});
                        $('myDivider2').setStyle({opacity:0});
		}

		if (metadatalink_enabled===false && downloadlink_enabled===false)
		{
			$('bottomNav').setStyle({width:'125px'});
			$('bottomNavClose').setStyle({float:'right'});
		}

		if (metadatalink_enabled && downloadlink_enabled===false)
		{
			$('bottomNav').setStyle({width:'250px'});
//			$('bottomNavClose').setStyle({float:'right'});
//			$('bottomNavDetails').setStyle({float:'right'});
		}

		$('repositoryMetadata').hide();
// end rrb

        var th = this;
        (function(){
            var ids = 
                'overlay lightbox outerImageContainer imageContainer lightboxImage hoverNav prevLink nextLink loading loadingLink ' + 
                'imageDataContainer imageData imageDetails caption numberDisplay bottomNav bottomNavDetails bottomNavClose repositoryMetadata repData';   
            $w(ids).each(function(id){ th[id] = $(id); });
        }).defer();
    },

    //
    // updateImageList()
    // Loops through anchor tags looking for 'lightbox' references and applies onclick
    // events to appropriate links. You can rerun after dynamically adding images w/ajax.
    //
    updateImageList: function() {   
        this.updateImageList = Prototype.emptyFunction;

        document.observe('click', (function(event){
            var target = event.findElement('a[rel^=lightbox]') || event.findElement('area[rel^=lightbox]');
            if (target) {
                event.stop();
                this.start(target);
            }
        }).bind(this));
    },
    
    //
    //  start()
    //  Display overlay and lightbox. If image is part of a set, add siblings to imageArray.
    //
    start: function(imageLink) {    

        $$('select', 'object', 'embed').each(function(node){ node.style.visibility = 'hidden' });

        // stretch overlay to fill page and fade in
        var arrayPageSize = this.getPageSize();
        $('overlay').setStyle({ width: arrayPageSize[0] + 'px', height: arrayPageSize[1] + 'px' });

        new Effect.Appear(this.overlay, { duration: this.overlayDuration, from: 0.0, to: LightboxOptions.overlayOpacity });

        this.imageArray = [];
        var imageNum = 0;       

        if ((imageLink.getAttribute("rel") == 'lightbox')){
            // if image is NOT part of a set, add single image to imageArray
            this.imageArray.push([imageLink.href, imageLink.title]);         
        } else {
            // if image is part of a set..
            this.imageArray = 
                $$(imageLink.tagName + '[href][rel="' + imageLink.rel + '"]').
                collect(function(anchor){ return [anchor.href, anchor.title]; }).
                uniq();
            
            while (this.imageArray[imageNum][0] != imageLink.href) { imageNum++; }
        }

        // calculate top and left offset for the lightbox 
        var arrayPageScroll = document.viewport.getScrollOffsets();
        var lightboxTop = arrayPageScroll[1] + (document.viewport.getHeight() / 10);
        var lightboxLeft = arrayPageScroll[0];
        this.lightbox.setStyle({ top: lightboxTop + 'px', left: lightboxLeft + 'px' }).show();
        
        this.changeImage(imageNum);
    },

	// rrb
	// getDetails()

	getDetails: function(imageNum)
	{
		// $('detailsButton').readAttribute('src').endsWith('details.gif')

		if (!$('repositoryMetadata').visible())
		{
			//this.caption.update("pressed details").show();
			var doi=this.imageArray[this.activeImage][0];
			doi=doi.replace("http://usf.sobek.ufl.edu/content","").replace(".jpg","").substring(21);
				
//			this.repData.update(' doi=[' + doi + '].').show();
			$('repositoryMetadata').show();
			// must try again on this - doesn't work if the page is long and the image location on the page is way above the bottom of the page.
			// probably need to get pixel y of bottom of metadata section
//			jQuery("html,body").animate({scrollTop:60000},'fast');
//			$('detailsButton').setAttribute('src','http://' + window.location.hostname + topdir + '/themes/default/common/lightbox/images/detailsMinus.gif');
		}
		else
		{
			//this.caption.update("pressed minus details").show();
			this.repositoryMetadata.hide();
//			$('detailsButton').setAttribute('src','http://' + window.location.hostname + topdir + '/themes/default/common/lightbox/images/details.gif');
		}
	},

	//rrb
	//navToFullImage

	navToFullImage: function(imageNum)
	{
		var url_current=this.imageArray[this.activeImage][0];
                var doi=url_current.replace("http://usf.sobek.ufl.edu/content/","").replace(".jpg","").substring(21);

//		alert("navToFullImage, doi after=[" + doi + "].");

		if (url_current.indexOf("usfldc:")>0)
		{
			myurl="http://usf.sobek.ufl.edu/xml/results/?t=" + doi;

			$.ajax({
				type:"GET",
				url:myurl,
				cache:false,
				dataType:"xml",
				contentType:"text/xml",
				mimeType:"text/xml",
				success: function(xml)
				{

				},
				error: function(jqxhr,textStatus,errorThrown)
				{
//					alert("error while trying to get packageid from doi from sobek.");
				}
			});

			xmlDoc = $.parseXML(xml);
			$xml = $(xmlDoc);
			$path=$xml.find("Folder[@type='web']");
			url=$path + "/" + doi + ".jpg";	

			window.open(url,"_blank");
		}
		else
		{
			url=this.imageArray[this.activeImage][0];
			url=url.replace("/fullsize/","/files/");
			window.open(url,"_blank");
		}
	},

// end of rrb

    //
    //  changeImage()
    //  Hide most elements and preload image in preparation for resizing image container.
    //
    changeImage: function(imageNum) {   
        
        this.activeImage = imageNum; // update global var

        // hide elements during transition
        if (LightboxOptions.animate) this.loading.show();
        this.lightboxImage.hide();
        this.hoverNav.hide();
        this.prevLink.hide();
        this.nextLink.hide();
		// HACK: Opera9 does not currently support scriptaculous opacity and appear fx
        this.imageDataContainer.setStyle({opacity: .0001});
        this.numberDisplay.hide();      
        
        var imgPreloader = new Image();
        
        // once image is preloaded, resize image container
        imgPreloader.onload = (function(){
            this.lightboxImage.src = this.imageArray[this.activeImage][0];
            /*Bug Fixed by Andy Scott*/
            this.lightboxImage.width = imgPreloader.width;
            this.lightboxImage.height = imgPreloader.height;
            /*End of Bug Fix*/
            this.resizeImageContainer(imgPreloader.width, imgPreloader.height);
        }).bind(this);
        imgPreloader.src = this.imageArray[this.activeImage][0];
    },

    //
    //  resizeImageContainer()
    //
    resizeImageContainer: function(imgWidth, imgHeight) {

        // get current width and height
        var widthCurrent  = this.outerImageContainer.getWidth();
        var heightCurrent = this.outerImageContainer.getHeight();

        // get new width and height
        var widthNew  = (imgWidth  + LightboxOptions.borderSize * 2);
        var heightNew = (imgHeight + LightboxOptions.borderSize * 2);

        // scalars based on change from old to new
        var xScale = (widthNew  / widthCurrent)  * 100;
        var yScale = (heightNew / heightCurrent) * 100;

        // calculate size difference between new and old image, and resize if necessary
        var wDiff = widthCurrent - widthNew;
        var hDiff = heightCurrent - heightNew;

        if (hDiff != 0) new Effect.Scale(this.outerImageContainer, yScale, {scaleX: false, duration: this.resizeDuration, queue: 'front'}); 
        if (wDiff != 0) new Effect.Scale(this.outerImageContainer, xScale, {scaleY: false, duration: this.resizeDuration, delay: this.resizeDuration}); 

        // if new and old image are same size and no scaling transition is necessary, 
        // do a quick pause to prevent image flicker.
        var timeout = 0;
        if ((hDiff == 0) && (wDiff == 0)){
            timeout = 100;
            if (Prototype.Browser.IE) timeout = 250;   
        }

        (function(){
            this.prevLink.setStyle({ height: imgHeight + 'px' });
            this.nextLink.setStyle({ height: imgHeight + 'px' });
            this.imageDataContainer.setStyle({ width: widthNew + 'px' });

            this.showImage();
        }).bind(this).delay(timeout / 1000);
    },
    
    //
    //  showImage()
    //  Display image and begin preloading neighbors.
    //
    showImage: function(){
        this.loading.hide();
        new Effect.Appear(this.lightboxImage, { 
            duration: this.resizeDuration, 
            queue: 'end', 
            afterFinish: (function(){ this.updateDetails(); }).bind(this) 
        });
        this.preloadNeighborImages();
    },

    //
    //  updateDetails()
    //  Display caption, image number, and bottom nav.
    //
    updateDetails: function() {
   
	this.caption.update(this.imageArray[this.activeImage][1]).show();

	// rrb
	var doi=this.imageArray[this.activeImage][0];
	var omekaid="";

	var pathArray=window.location.pathname.split('/');
//	alert(pathArray.toString());

	var pos=doi.indexOf("?id=");

//	alert("doi before =[" + doi + "], pos=[" + pos + "].");

	if (pos>0)
	{
		omekaid=doi.substring(pos+4);
		myurl="http://" + window.location.hostname + topdir + "/dcs.php?omekaid=" + omekaid + "&topdir=" + topdir.substring(1);
	}
	else
	{		
		doi=doi.replace("http://usf.sobek.ufl.edu/content/","").replace(".jpg","").substring(21);

//		alert("doi after=[" + doi + "].");
		myurl="http://" + window.location.hostname + topdir + "/dcs.php?doi=" + doi + "&topdir=" + topdir.substring(1) + "&sobekcm=true";
	}

//	alert("ajax myurl=[" + myurl + "].");

	jQuery.ajax(
	{
		type: "GET",
		url:myurl,
		cache:false,
		dataType: "html",
		contentType: "text/html",
		mimeType: "text/html",
		success: function(html)
		{
//			alert("success. [" + html + "].");
			jQuery("#repositoryMetadata").html(html);
		},
		complete: function(html,status)
		{
//			alert("Got metadata. [" + html + "], status=" + status + "].");
		},
		error: function(jqxhr,textStatus,errorThrown)
		{
//				alert("error in getting metadata, url=[" + myurl + "], textStatus=[" + textStatus + ", errorThrown=[" + errorThrown + "].");
				jQuery("#repositoryMetadata").html("Error retrieving metadata.");
		}
	});
		

//	this.repositoryMetadata.update("this is the metadata.");

// end of rrb

        // if image is part of set display 'Image x of x' 
        if (this.imageArray.length > 1){
            this.numberDisplay.update( LightboxOptions.labelImage + ' ' + (this.activeImage + 1) + ' ' + LightboxOptions.labelOf + '  ' + this.imageArray.length).show();
        }

        new Effect.Parallel(
            [ 
                new Effect.SlideDown(this.imageDataContainer, { sync: true, duration: this.resizeDuration, from: 0.0, to: 1.0 }), 
                new Effect.Appear(this.imageDataContainer, { sync: true, duration: this.resizeDuration }) 
            ], 
            { 
                duration: this.resizeDuration, 
                afterFinish: (function() {
	                // update overlay size and update nav
	                var arrayPageSize = this.getPageSize();
	                this.overlay.setStyle({ width: arrayPageSize[0] + 'px', height: arrayPageSize[1] + 'px' });
	                this.updateNav();
                }).bind(this)
            } 
        );
    },

    //
    //  updateNav()
    //  Display appropriate previous and next hover navigation.
    //
    updateNav: function() {

        this.hoverNav.show();               

        // if not first image in set, display prev image button
        if (this.activeImage > 0) this.prevLink.show();

        // if not last image in set, display next image button
        if (this.activeImage < (this.imageArray.length - 1)) this.nextLink.show();
        
        this.enableKeyboardNav();
    },

    //
    //  enableKeyboardNav()
    //
    enableKeyboardNav: function() {
        document.observe('keydown', this.keyboardAction); 
    },

    //
    //  disableKeyboardNav()
    //
    disableKeyboardNav: function() {
        document.stopObserving('keydown', this.keyboardAction); 
    },

    //
    //  keyboardAction()
    //
    keyboardAction: function(event) {
        var keycode = event.keyCode;

        var escapeKey;
        if (event.DOM_VK_ESCAPE) {  // mozilla
            escapeKey = event.DOM_VK_ESCAPE;
        } else { // ie
            escapeKey = 27;
        }

        var key = String.fromCharCode(keycode).toLowerCase();
        
        if (key.match(/x|o|c/) || (keycode == escapeKey)){ // close lightbox
            this.end();
        } else if ((key == 'p') || (keycode == 37)){ // display previous image
            if (this.activeImage != 0){
                this.disableKeyboardNav();
                this.changeImage(this.activeImage - 1);
            }
        } else if ((key == 'n') || (keycode == 39)){ // display next image
            if (this.activeImage != (this.imageArray.length - 1)){
                this.disableKeyboardNav();
                this.changeImage(this.activeImage + 1);
            }
        }
    },

    //
    //  preloadNeighborImages()
    //  Preload previous and next images.
    //
    preloadNeighborImages: function(){
        var preloadNextImage, preloadPrevImage;
        if (this.imageArray.length > this.activeImage + 1){
            preloadNextImage = new Image();
            preloadNextImage.src = this.imageArray[this.activeImage + 1][0];
        }
        if (this.activeImage > 0){
            preloadPrevImage = new Image();
            preloadPrevImage.src = this.imageArray[this.activeImage - 1][0];
        }
    
    },

    //
    //  end()
    //
    end: function() {
        this.disableKeyboardNav();
        this.lightbox.hide();
        new Effect.Fade(this.overlay, { duration: this.overlayDuration });
        $$('select', 'object', 'embed').each(function(node){ node.style.visibility = 'visible' });
    },

    //
    //  getPageSize()
    //
    getPageSize: function() {
	        
	     var xScroll, yScroll;
		
		if (window.innerHeight && window.scrollMaxY) {	
			xScroll = window.innerWidth + window.scrollMaxX;
			yScroll = window.innerHeight + window.scrollMaxY;
		} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
			xScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
			xScroll = document.body.offsetWidth;
			yScroll = document.body.offsetHeight;
		}
		
		var windowWidth, windowHeight;
		
		if (self.innerHeight) {	// all except Explorer
			if(document.documentElement.clientWidth){
				windowWidth = document.documentElement.clientWidth; 
			} else {
				windowWidth = self.innerWidth;
			}
			windowHeight = self.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		} else if (document.body) { // other Explorers
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
		}	

		// for small pages with total height less then height of the viewport
		if(yScroll < windowHeight){
			pageHeight = windowHeight;
		} else { 
			pageHeight = yScroll;
		}
	
		// for small pages with total width less then width of the viewport
		if(xScroll < windowWidth){	
			pageWidth = xScroll;		
		} else {
			pageWidth = windowWidth;
		}

		return [pageWidth,pageHeight];
	}
}

document.observe('dom:loaded', function () { new Lightbox(); });
