	Polymer({
		/**
		* The `theme` attribute is optional
		* Specifying a supported 'theme' attribute will enfore which css styling to be applied to the calculator.
		* Currently, there are only 2 themes, a 'light' one. the default, and a 'dark' theme - one hopefully looking darker - the darkening of the colors are my own making and provide a simple proof of concept.
		*
		* @attribute theme
		* @type string
		* @default 'light'
		*/      	
		theme:"light",

		/**
		* `validKeys` is meant to be a 'private' property, one used to define which character keys are considered valid by the calculator.
		*
		* @property validKeys
		* @type string
		* @default "+=/*x-0123456789c"
		*/
		validKeys : "+=/*x-0123456789c",

		/**
		* `validThemes` is meant to be a 'private' property, one used to define which themes are officially supported by the calculator.
		* No validation made on the format for now, but one should stick to a list of (themeIdAsString) separated by spaces. 
		* Sticking to [0..9-_a...z] is probably the safest thing to do also for now.
		* @property validThemes
		* @type string
		* @default "light dark"
		*/
		validThemes : "light dark",

		/**
		* `defaultTheme` is what it sounds :-)
		* Logically, it is set to a value found in the 'validThemes' attribute defined above.
		*
		* @property defaultTheme
		* @type string
		* @default "light"
		*/
		defaultTheme: "light",


		/**
		* `currentThemeAsText` is a (clumsy) way to remain gramatically correct. 
		*  The string is used when writing out to the console.
		*
		* @property currentThemeAsText
		* @type string
		* @default "no theme."
		*/
		currentThemeAsText: "no theme.",

		ready: function() {
			this.themeChanged();
			this.addEventListener('click', this.onClick);
		},

		/**
		* The `consoleLog` method is a temporary dev tool.
		* It provides a rudimentary way to display text strings on the dedicated 'daConsole' div.
		* @method consoleLog
		* @param {String} message Pass in text message to display inside 'daConsole'.
		*/
		consoleLog: function(message) {
			this.$.line.textContent += message;
		},

		/**
		* The `onClick` method is a callback, used to register any click event happening on the calculator.
		* It checks if a valid target got hit (one of the keys) before treating the event.
		* The original code had a bunch of baked inline javascript code defined for each <input> field.... brrrrr. 
		* I know this is merely a proof of concept and that time was precious, but I just couldn't go with it.
		*
		* @method onClick
		* @param {Object} evt Receives in an Event object with the details about the click event
		*/
		onClick: function(evt) {
			var target = evt.path[0];
			if (target.value) {
				var value = target.value.trim().toLowerCase();
				if (this.validKeys.indexOf(value)>=0) {
					if(value=="c") {
						this.inputReset();
					} else 
					if (value=="=") {
						this.inputCalculate();
					} else 
					if (value=="x") {
						this.inputAppend("*");
					} else 
						this.inputAppend(value);
				}
			}
		},

		/**
		* The `inputAppend` method appends a string to the Calculator one-line display.
		*
		* @method inputAppend
		* @param {String} more Pass in a string to be appended to what's already displayed in the calculator display.
		*/
		inputAppend: function(more) {
			if(this.$ && this.$.calcInput)
				this.$.calcInput.value += more;
		},

		/**
		* The `inputReset` method clears the content of the Calculator one-line display.
		*
		* @method inputReset
		*/
		inputReset: function() {
			if(this.$ && this.$.calcInput)
				this.$.calcInput.value = '';	      	
		},

		/*********************************************************************************************
		************** BETTER PAY ATTENTION TO THIS **************************************************
		**
		**				Using EVAL() to calculate()
		**
		**	TODO: 			pros/cons of sticking to eval() + extra input filtering and sanetization 
		**			versus 	pros/cons of writing our own calculator expression parser and evaluator.
		*/
		/**
		* The `inputCalculate` method EVALUATES the string it grabs from the Calculator one-line display.
		* It does take a leap of faith indeed, relying on the 'onClick' and 'inputAppend' functions to do the right thing, i.e., 
		* ensure that the string currently displayed in the calculator input display is a 'safe and valid' string.
		* Safe to be going through 'eval()'
		* Valid in terms of calculus expression, ie, is a valid arithmetical expression which can be solved to a value.
		*
		* @method inputCalculate
		* @return {} Nothing is returned, but the call has the side-effect of replacing the content of the one-line display by the result of the calculation 
		*/
		inputCalculate: function() {
			if(this.$ && this.$.calcInput)
				this.$.calcInput.value = eval(this.$.calcInput.value);
		},

		/**
		* The `themeChanged` method is a callback, used to handle changes to the 'theme' attribute.
		* It's a chance to sanitize and check the theme id.
		* This filtering is not a necessity in the sense that unsupported values should simply be ignored
		* without breaking anything, everything displaying correctly using the default style. 
		* @method themeChanged
		*/
		themeChanged: function() {
			var because = "",
				so_the_default = " so the default theme (" + this.defaultTheme + ") has been applied.";

			if (this.theme) {
				this.theme = this.theme.trim().toLowerCase();
				if (this.validThemes.indexOf(this.theme)<0) { 
					because = " Surprised? Well, '" + this.theme + "'' is not a valid theme." + so_the_default;
					this.theme = this.defaultTheme;
				} else {
					because = " Just as requested.";
				}
			} else {
				this.theme = this.defaultTheme;
				because = " No theme attribute were specified. " + so_the_default;
			}
			this.currentThemeAsText = "the " + this.theme + " theme." + because;
		}
	});
