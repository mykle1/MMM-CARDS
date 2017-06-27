/* Magic Mirror
 * Module: MMM-CARDS
 *
 * By Mykle1
 *
 */
Module.register("MMM-CARDS", {

    // Module config defaults.
    defaults: {
        rotateInterval: 60 * 1000,      // New cards rotation.
        header: "Five Card Stud",    // Any text you want
        maxWidth: "350px",
        animationSpeed: 3000,           // Cards fade in and out (speed)
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 60 * 1000,      // 1 minute

    },

    getStyles: function() {
        return ["MMM-CARDS.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.0",

        // Set locale.
        this.url = "https://deckofcardsapi.com/api/deck/new/draw/?count=2";
        this.cards = [];
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Shuffling the deck . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }
		
		 // common header
         var header = document.createElement("header");
         header.classList.add("xsmall", "bright", "header");
         header.innerHTML = this.config.header;
         wrapper.appendChild(header);
		
		


        var cardsKeys = Object.keys(this.cards);
        if (cardsKeys.length > 0) {
            if (this.activeItem >= cardsKeys.length) {
                this.activeItem = 0;
            }
            var cards = this.cards[cardsKeys[this.activeItem]];

		for (var i = 0; i < cards.length; i++) {
                var cards = cards[i];	
			
			


            var top = document.createElement("div");
            top.classList.add("list-row");

            var pic = document.createElement("div");
            var img = document.createElement("img");
			img.classList.add("photo");	
            img.src = cards[0].image; // I tried cards.data[0].image; with processCARDS comment
            pic.appendChild(img);
            wrapper.appendChild(pic);
			
		// FOR MORE CARDS 5? for five card stud. One of these for each card.
		//	var pic2 = document.createElement("div");
        //    var img2 = document.createElement("img");
		//	img.classList.add("photo2");	
        //    img2.src = cards[0].image
        //    pic2.appendChild(img2);
        //    wrapper.appendChild(pic2);
			
			
        // GET 5 CARDS AND USE THIS TO HAVE THEM APPEAR ONE AFTER THE OTHER.
        //    setTimeout(function() {
        //        cardsAnswer.innerHTML = "What is " + cards.answer + "?"
        //    }, 20 * 1000);
			} 
        }
        return wrapper;
    },


    processCARDS: function(data) {
        this.today = data.Today;
        this.cards = data; // with this.cards = data.items;
      console.log(this.cards); // checking my data
        this.loaded = true;
    },

    scheduleCarousel: function() {
        console.log("Carousel of Cards fucktion!");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getCARDS();
        }, this.config.updateInterval);
        this.getCARDS(this.config.initialLoadDelay);
        var self = this;
    },

    getCARDS: function() {
        this.sendSocketNotification('GET_CARDS', this.url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "CARDS_RESULT") {
            this.processCARDS(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});