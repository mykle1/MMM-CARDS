/* Magic Mirror
 * Module: MMM-CARDS
 *
 * By Mykle1
 *
 */
Module.register("MMM-CARDS", {

    // Module config defaults.
    defaults: {
        useHeader: true,             // False if you don't want a header      
        header: "5 Card Stud",       // Any text you want. useHeader must be true
        maxWidth: "100%",
        animationSpeed: 3000,        // Cards fade in and out (speed)
        initialLoadDelay: 4250,
        retryDelay: 2500,
        rotateInterval: 60 * 1000,
        updateInterval: 30 * 1000,   // 30 seconds = 2 hands a minute

    },

    getStyles: function() {
        return ["MMM-CARDS.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.0",

            //  Set locale.
        this.url = "https://deckofcardsapi.com/api/deck/new/draw/?count=10";
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

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }

        var cards = this.cards;

        var top = document.createElement("div");
        top.classList.add("list-row");


        // The heading for your cards
        var mirrorCards = document.createElement("div");
        var mmCards = document.createElement("p");
        mmCards.classList.add("xsmall", "bright", "spacer");
        mmCards.innerHTML = "My cards are . . .";
        mirrorCards.appendChild(mmCards);
        wrapper.appendChild(mirrorCards);


        // The mirror is always the dealer. Every hand is a newly shuffled deck so
        // I get the 1, 3, 5 ,7 and 9th card as it should be
        // MM gets the 2, 4, 6, 8 and 10th card as it should be

        // My card # 1
        var pic = document.createElement("div");
        var img = document.createElement("img");
        img.classList.add("photo");
        img.src = cards[0].image; // the first object is cards[0]
        pic.appendChild(img);
        wrapper.appendChild(pic);


        // My card #2
        var pic2 = document.createElement("div");
        var img2 = document.createElement("img");
        img2.classList.add("photo2");
        setTimeout(function() {
            img2.src = cards[2].image;
        }, 3 * 1000);
        pic2.appendChild(img2);
        wrapper.appendChild(pic2);


        // My card #3
        var pic3 = document.createElement("div");
        var img3 = document.createElement("img");
        img3.classList.add("photo3");
        setTimeout(function() {
            img3.src = cards[4].image;
        }, 5 * 1000);
        pic3.appendChild(img3);
        wrapper.appendChild(pic3);


        // My card #4
        var pic4 = document.createElement("div");
        var img4 = document.createElement("img");
        img4.classList.add("photo4");
        setTimeout(function() {
            img4.src = cards[6].image;
        }, 7 * 1000);
        pic4.appendChild(img4);
        wrapper.appendChild(pic4);


        // My card #5
        var pic5 = document.createElement("div");
        var img5 = document.createElement("img");
        img5.classList.add("photo5");
        setTimeout(function() {
            img5.src = cards[8].image;
        }, 9 * 1000);
        pic5.appendChild(img5);
        wrapper.appendChild(pic5);


        // The heading between my cards and the mirror's cards
        var mirrorCards = document.createElement("div");
        var mmCards = document.createElement("p");
        mmCards.classList.add("xsmall", "bright", "spacer");
        setTimeout(function() {
            mmCards.innerHTML = "Magic Mirror's Cards";
        }, 11 * 1000);
        mirrorCards.appendChild(mmCards);
        wrapper.appendChild(mirrorCards);


        // The mirror's cards start here

        // MM card # 1 
        var pic6 = document.createElement("div");
        var img6 = document.createElement("img");
        img6.classList.add("photo6");
        setTimeout(function() {
            img6.src = cards[1].image;
        }, 13 * 1000);
        pic6.appendChild(img6);
        wrapper.appendChild(pic6);


        // MM card #2
        var pic7 = document.createElement("div");
        var img7 = document.createElement("img");
        img7.classList.add("photo7");
        setTimeout(function() {
            img7.src = cards[3].image;
        }, 15 * 1000);
        pic7.appendChild(img7);
        wrapper.appendChild(pic7);


        // MM card #3
        var pic8 = document.createElement("div");
        var img8 = document.createElement("img");
        img8.classList.add("photo8");
        setTimeout(function() {
            img8.src = cards[5].image;
        }, 17 * 1000);
        pic8.appendChild(img8);
        wrapper.appendChild(pic8);


        // MM card #4
        var pic9 = document.createElement("div");
        var img9 = document.createElement("img");
        img9.classList.add("photo9");
        setTimeout(function() {
            img9.src = cards[7].image;
        }, 19 * 1000);
        pic9.appendChild(img9);
        wrapper.appendChild(pic9);


        // MM card #5
        var pic10 = document.createElement("div");
        var img10 = document.createElement("img");
        img10.classList.add("photo10");
        setTimeout(function() {
            img10.src = cards[9].image;
        }, 21 * 1000);
        pic10.appendChild(img10);
        wrapper.appendChild(pic10);

        return wrapper;
    },

    
/////  Add this function to the modules you want to control with voice //////

    notificationReceived: function(notification, payload) {
        if (notification === 'HIDE_CARDS') {
            this.hide(1000);
        }  else if (notification === 'SHOW_CARDS') {
            this.show(1000);
        }
            
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
