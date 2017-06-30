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
        maxWidth: "100%",
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

    //  Set locale.
        this.url = "https://deckofcardsapi.com/api/deck/new/draw/?count=5";
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
		
        var cards = this.cards;

        var top = document.createElement("div");
        top.classList.add("list-row");
			
		// card # 1
        var pic = document.createElement("div");
        var img = document.createElement("img");
        img.classList.add("photo");
        img.src = cards[0].image; // the first object is cards[0]
        pic.appendChild(img);
        wrapper.appendChild(pic);
			
		 	
		// card #2
		var pic2 = document.createElement("div");
        var img2 = document.createElement("img");
		img2.classList.add("photo2");	
		setTimeout(function() {
            img2.src = cards[1].image; // the second object is cards[1]
        }, 3 * 1000);
		pic2.appendChild(img2);
		wrapper.appendChild(pic2);
			
			
		// card #3
		var pic3 = document.createElement("div");
        var img3 = document.createElement("img");
		img3.classList.add("photo3");	
		setTimeout(function() {
            img3.src = cards[2].image; // the third object is cards[2]
        }, 5 * 1000);
		pic3.appendChild(img3);
		wrapper.appendChild(pic3);
			
			
		// card #4
		var pic4 = document.createElement("div");
        var img4 = document.createElement("img");
		img4.classList.add("photo4");	
		setTimeout(function() {
            img4.src = cards[3].image; // the fourth object is cards[3]
        }, 7 * 1000);
		pic4.appendChild(img4);
		wrapper.appendChild(pic4);	
			
			
		// card #5
		var pic5 = document.createElement("div");
        var img5 = document.createElement("img");
		img5.classList.add("photo5");	
		setTimeout(function() {
            img5.src = cards[4].image; // the fifth object is cards[4]
        }, 9 * 1000);
		pic5.appendChild(img5);
		wrapper.appendChild(pic5);		
			
        return wrapper;
    },


    processCARDS: function(data) {
        this.today = data.Today;
        this.cards = data.cards; // cards = objects
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
