var Life = {

    settings: {},

    /**
     * Initialise the application
     */
    init: function() {
        this.app = document.getElementById('app');
        this.form = document.getElementById('settings');
        this.form.addEventListener('submit', this.saveSetting.bind(this));
        this.now = new Date;

        document.getElementById('openSettings').addEventListener('click', this.openSettings.bind(this));
        document.getElementById('closeSettings').addEventListener('click', this.closeSettings.bind(this));

        this.loadSettings();
        this.setFormValues();
        this.getCountries();
    },

    /**
     * Start the application
     */
    start: function() {
        this.app.innerHTML = '';
        var life = document.createElement('ul');
        life.setAttribute('id', 'life');
        this.app.appendChild(life);
        this.life = document.getElementById('life');
        this.findYouAreHere();
        this.findLifeExpectancy();
        this.drawCountries();
        this.drawDots();
        this.drawExplanation();
    },

    /**
     * Draw the dots
     */
    drawDots: function() {
        var i = 0;
        var month;
        while(i < this.totalLife) {
            month = document.createElement('li');
            if(i === this.monthsSinceBorn) {
                month.classList.add('you-are-here');
            }
            this.life.appendChild(month);
            i++;
        }
    },

    /**
     * Write a nice explanation as to what this is
     */
    drawExplanation: function() {
        var country = this.getCountryInfo();
        var explain1 = document.createElement('h3');
        var explain2 = document.createElement('h3');
        explain1.innerHTML = "Since you are living in " + country.country +
                " you have a life expectancy of " + country.overall + " years, or " +
                parseInt(parseFloat(country.overall) * 12, 10) + " months.";
        explain2.innerHTML = "You were born " + this.monthsSinceBorn + " months ago.";
        var explainContainer = document.getElementById('explain');
        explainContainer.innerHTML = '';
        explainContainer.appendChild(explain1);
        explainContainer.appendChild(explain2);
    },

    /**
     * Calculate the number of months since the person was born
     */
    findYouAreHere: function() {
        this.monthsSinceBorn =
            ((this.now.getFullYear() - this.settings.year) * 12)
            + (this.now.getMonth() - this.settings.month);
    },

    /**
     * Find the life expectancy, or set it to a sensible default
     */
    findLifeExpectancy: function () {
        var country = this.getCountryInfo();
        if(this.settings.country) {
            this.totalLife = parseInt(country.overall * 12);
            return;
        }
        this.totalLife = 900;
    },

    /**
     * Get the country info object
     *
     * @returns {*}
     */
    getCountryInfo: function() {
        for(var i = 0; i < this.countries.length; i++) {
            if(this.countries[i].country === this.settings.country) {
                return this.countries[i];
            }
        }
    },

    /**
     * Save the settings on form submit and run the application
     * @param e
     */
    saveSetting: function(e) {
        this.settings.month = parseInt(this.form.month.value, 10);
        if(!this.settings.month) {
            alert('Please enter a number in the month field');
            return;
        }

        if(this.form.year.value.length === 2) this.form.year.value = '19' + this.form.year.value;
        this.settings.year = parseInt(this.form.year.value, 10);
        if(!this.settings.year) {
            alert('Please enter a number in the year field');
            return;
        }

        this.settings.country = this.form.country.value;

        this.persistSettings();
        this.start();
        e.preventDefault();
    },

    /**
     * Save the settings to localstorage
     */
    persistSettings: function() {
        window.localStorage.setItem('settings', JSON.stringify(this.settings));
    },

    /**
     * Load the settings from the storage
     */
    loadSettings: function() {
        var settings = window.localStorage.getItem('settings');
        if(typeof settings === 'string') {
            this.settings = JSON.parse(settings);
        }
    },

    /**
     * Set settings form values after loading
     */
    setFormValues: function() {
        this.form.year.value = this.settings.year;
        this.form.month.value = this.settings.month;
        this.form.country.value = this.settings.country;
    },

    /**
     * Open the settings panel
     */
    openSettings: function() {
        document.body.classList.add('settings-open');
    },

    /**
     * Close the settings panel
     */
    closeSettings: function() {
        document.body.classList.remove('settings-open');
    },

    /**
     * Get the countries list from the json file
     */
    getCountries: function() {
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
                this.countries = JSON.parse(xmlhttp.responseText);
                this.start();
            }
        }.bind(this);
        xmlhttp.open("GET", chrome.extension.getURL('countries.json'), true);
        xmlhttp.send();
    },

    /**
     * Draw the country options to the country dropdown
     */
    drawCountries: function() {
        var node, country;
        for(var i = 0; i < this.countries.length; i++) {
            country = this.countries[i].country;
            node = document.createElement('option');
            node.setAttribute('value', country);
            node.innerHTML = country;
            if(this.settings.country === country) {
                node.setAttribute('selected', 'selected');
            }
            this.form.country.appendChild(node);
        }
    }

};

Life.init();
