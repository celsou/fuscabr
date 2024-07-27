/******************************************
 * FBR - "Funções úteis para o ScadaBR"
 * License: MIT
 ******************************************/
 "use strict";

 fuscabr.ceditor = {
	createdEditors: [],
	watchdog: null,
	fileCounter: [0, 0],


	/*
	* Dependency management methods
	*/



	// Load a dependency (a Javascript or CSS file)
	loadDependency: function(src, type, callback) {
		var htmlTag;
		if (type == "script") {
			htmlTag = document.createElement("script");
			htmlTag.src = src;
		} else if (type == "style") {
			htmlTag = document.createElement("link");
			htmlTag.rel = "stylesheet";
			htmlTag.href = src;
		}

		if (callback)
			htmlTag.addEventListener("load", callback);

		document.getElementById("fuscabr-modules").appendChild(htmlTag);
	},

	// Load CodeMirror main script, and call start() function
	loadCodeMirror: function() {
		var conf = this.conf;
		this.loadDependency(conf.baseFolder + "codemirror.css", "style");
		if (conf.theme != "codemirror.css" && conf.theme != "default")
			this.loadDependency(conf.themesFolder + conf.theme, "style");

		this.loadDependency(conf.baseFolder + "codemirror.min.js", "script", fuscabr.ceditor.start);
	},

	// Load all CodeMirror dependencies for the given language
	loadLanguage: function(language, callback, retry) {
		var modesFolder = this.conf.modesFolder;
		var addonsFolder = this.conf.addonsFolder;
		var scriptSrc = [];

		// Define the files needed to each programming language mode
		if (language == "html") {
			// Addons
			scriptSrc.push(addonsFolder + "fold/xml-fold.js");
			scriptSrc.push(addonsFolder + "edit/closebrackets.js");
			scriptSrc.push(addonsFolder + "edit/closetag.js");
			scriptSrc.push(addonsFolder + "edit/matchbrackets.js");
			// Languages
			scriptSrc.push(modesFolder + "xml/xml.js");
			scriptSrc.push(modesFolder + "javascript/javascript.js");
			scriptSrc.push(modesFolder + "css/css.js");
			scriptSrc.push(modesFolder + "htmlmixed/htmlmixed.js");
		} else if (language == "javascript" || language == "json") {		
			// Addons
			scriptSrc.push(addonsFolder + "edit/closebrackets.js");
			scriptSrc.push(addonsFolder + "edit/matchbrackets.js");
			// Languages
			scriptSrc.push(modesFolder + "javascript/javascript.js");
		} else if (language == "sql") {			
			// Addons
			scriptSrc.push(addonsFolder + "edit/closebrackets.js");
			scriptSrc.push(addonsFolder + "edit/matchbrackets.js");
			// Languages
			scriptSrc.push(modesFolder + "sql/sql.js");
		}

					
		if (retry) {
			// Load the files (if not already loaded)
			var notLoadedScripts = [];
			
			for (var i = 0; i < scriptSrc.length; i++) {
				if (!document.querySelector("#fuscabr-modules script[src*='" + scriptSrc[i] + "']")) {
					notLoadedScripts.push(scriptSrc[i]);
				}
			}
		
			if (notLoadedScripts.length) {
				scriptSrc = notLoadedScripts;
			}
		}
		
		var promises = [];
		for (var i of scriptSrc) {
			promises.push(fuscabr.ceditor.load(i, "javascript", true));				
		}
		var promise = Promise.all(promises);
		
		promise.then(function() {
			setTimeout(callback, 200);
		}).catch(function() {
			fuscabr.ceditor.loadLanguage(language, callback, true);
		});
	},

	loadLanguageCb: function(counter, index, callback) {
		fuscabr.ceditor.fileCounter[index]++;
		
		if (counter == fuscabr.ceditor.fileCounter[index]) {
			fuscabr.ceditor.fileCounter[index] = 0;
			callback();
		}		
	},

	load: function(url, type, skipCache) {
		return new Promise(function(resolve, reject) {
			let elm;
			let skipCacheUrl = url.includes("?") ? (url + "&ts=" + Date.now()) : (url + "?ts=" + Date.now());
			if (skipCache)
				url = skipCacheUrl;
			
			if (type == "javascript") {
				elm = document.createElement("script");
				elm.src = url;
				elm.async = true;
			} else if (type == "css") {
				elm = document.createElement("link");
				elm.rel = "stylesheet";
				elm.href = url;
			}
									
			elm.addEventListener("error", function(err) { reject(err, elm); });
			elm.addEventListener("load", resolve);
			
			document.getElementById("fuscabr-modules").appendChild(elm);
		});
	},


	/*
	* Runtime methods
	*/



	// Update all editors with the respective textareas content
	updateEditors: function() {
		for (var cm of fuscabr.ceditor.createdEditors)
			cm.setValue(cm.getTextArea().value);
	},

	// Update all textareas with the respective editors content
	updateTextAreas: function() {
		for (var cm of fuscabr.ceditor.createdEditors)
			cm.save();
	},

	// Watchdog to update editors (general use)
	generalWatchdog: function(targetElement) {
		var element = document.querySelector(targetElement);
		this.watchdog = element.value;

		// Detect if the value of the given <input> has changed
		setInterval(function() {
			if (fuscabr.ceditor.watchdog != document.querySelector(targetElement).value) {
				fuscabr.ceditor.watchdog = document.querySelector(targetElement).value;
				fuscabr.ceditor.updateEditors();
			}
		}, this.conf.watchdogInterval);
	},

	// Watchdog to update editors (used in Import/Export page)
	emportWatchdog: function(targetElement) {
		var element = document.querySelector(targetElement);

		// Detect if the element is enabled (input property "disabled")
		var watchdogFunc = function() {
			if (!element.disabled) {
				fuscabr.ceditor.updateEditors();
				clearInterval(fuscabr.ceditor.watchdog);
			}
		}

		this.watchdog = setInterval(watchdogFunc, this.conf.watchdogInterval);
	},

	// Watchdog to update editors (used in View Edit page)
	viewEditWatchdog: function(targetElement) {
		var element = document.querySelector(targetElement);

		// Detect if the element is hidden (CSS property "display")
		var watchdogFunc = function() {
			if (element.style.display != "none") {
				fuscabr.ceditor.updateEditors();
				clearInterval(fuscabr.ceditor.watchdog);
			}
		}

		this.watchdog = setInterval(watchdogFunc, this.conf.watchdogInterval);
	},



	/*
	* Initialization methods
	*/



	// Create a new CodeMirror editor instance
	createEditor: function(textAreaSelector, mode, pageRef) {
		var textArea = document.querySelector(textAreaSelector);
		var editorConf = { lineNumbers: true, indentUnit: 4 };

		// Define editor's theme
		if (this.conf.theme != "default" && this.conf.theme != "codemirror.css")
			editorConf.theme = this.conf.theme.replace(".css", "");

		// General Addons
		editorConf.autoCloseBrackets = true;
		editorConf.matchBrackets = true;

		// Define editor's programming language
		if (mode == "html" || mode == "htmlmixed") {
			editorConf.mode = "htmlmixed";
			// Addons
			editorConf.autoCloseTags = true;
		} else if (mode == "javascript" || mode == "json") {
			editorConf.mode = { name: "javascript" };
			editorConf.mode.json = (mode == "json") ? true : false;
		} else if (mode == "sql") {
			editorConf.mode = "sql";
		}

		var cm = CodeMirror.fromTextArea(textArea, editorConf);

		// Define editor's size
		var size = this.conf.editorSize;
		if (size[pageRef])
			cm.setSize(size[pageRef].width, size[pageRef].height);
		else
			cm.setSize(size.default.width, size.default.height);
		cm.refresh();

		this.createdEditors.push(cm);
	},

	// Create event listeners
	createListener: function(selector, eventType, funcObj, catchParent) {
		var element = document.querySelector(selector);

		if (catchParent)
			element = element.parentElement;

		if (element)
			element.addEventListener(eventType, funcObj, true);
	},

	// Apply a custom CSS to CodeMirror instances
	createCustomCSS: function() {
		var stylesheet = document.createElement("style");
		stylesheet.innerHTML = ".CodeMirror { border: 1px solid " + this.conf.editorBorderColor + ";"
		stylesheet.innerHTML += "font-size: " + this.conf.editorFontSize + "}";
		// Fix scrollbar CSS bugs
		stylesheet.innerHTML += ".CodeMirror-scroll, .CodeMirror-sizer, .CodeMirror-gutter, .CodeMirror-gutters, .CodeMirror-linenumber { box-sizing: content-box !important; }";

		document.getElementById("fuscabr-modules").appendChild(stylesheet);
	},

	// Main function, detect current page and create editors
	start: function() {
		var pageUrl = window.location.href;
		var ceditor = fuscabr.ceditor;
		ceditor.createCustomCSS();

		if (pageUrl.includes("sql.shtm")) {
			// SQL page

			// Editor
			ceditor.loadLanguage("sql", function(){
				ceditor.createEditor("#sqlString", "sql", "sql.shtm");
			});

		} else if (pageUrl.includes("emport.shtm")) {
			// Import/Export page

			// Editor
			ceditor.loadLanguage("json", function() {
				ceditor.createEditor("#emportData", "json", "emport.shtm");
			});
			// Listeners and watchdog
			ceditor.createListener("#exportJsonBtn", "click", function() {
				ceditor.emportWatchdog("#exportJsonBtn");
			});
			ceditor.createListener("#importJsonBtn", "click", ceditor.updateTextAreas);

		} else if (pageUrl.includes("point_links.shtm")) {
			// Point link page

			// Editor
			ceditor.loadLanguage("javascript", function() {
				ceditor.createEditor("#script", "javascript", "point_links.shtm");
			});
			// Watchdog
			ceditor.generalWatchdog("#xid");
			// Listeners
			ceditor.createListener("img[onclick*='savePointLink()']", "click", ceditor.updateTextAreas, true);
			ceditor.createListener("img[onclick*='validateScript()']", "click", ceditor.updateTextAreas, true);

		}  else if (pageUrl.includes("compound_events.shtm")) {
			// Compound events page

			// Editor
			ceditor.loadLanguage("javascript", function() {
				ceditor.createEditor("#condition", "javascript", "compound_events.shtm");
			});
			// Watchdog
			ceditor.generalWatchdog("#xid");
			// Listeners
			ceditor.createListener("img[onclick*='saveCompoundEvent()']", "click", ceditor.updateTextAreas, true);
			ceditor.createListener("img[onclick*='validate()']", "click", ceditor.updateTextAreas, true);
			// Re-asign insertText() function
			insertText = function(text) {
				ceditor.createdEditors[0].replaceSelection(text);
			};

		} else if (pageUrl.includes("scripting.shtm")) {
			// Scripting page

			// Editor
			ceditor.loadLanguage("javascript", function() {
				ceditor.createEditor("#script", "javascript", "scripting.shtm");
			});
			// Watchdog
			ceditor.generalWatchdog("#xid");
			// Listeners
			ceditor.createListener("#executeScriptImg", "click", ceditor.updateTextAreas, true);
			ceditor.createListener("img[onclick*='saveScript()']", "click", ceditor.updateTextAreas, true);

		} else if (pageUrl.includes("view_edit.shtm")) {
			// Graphic View Edit page

			// Editors
			ceditor.loadLanguage("javascript", function() {
				ceditor.createEditor("#graphicRendererScriptScript", "javascript", "view_edit.shtm");
			});
			ceditor.loadLanguage("html", function() {
				ceditor.createEditor("#staticPointContent", "html", "view_edit.shtm");
			});
			// Listeners
			ceditor.createListener("#graphicRendererScriptScript", "change", ceditor.updateEditors);
			ceditor.createListener("#staticPointContent", "change", ceditor.updateEditors);
			ceditor.createListener("#graphicRendererEditorPopup .fuscabr-csnippet-apply", "click", ceditor.updateEditors);
			ceditor.createListener("#htmlEditor .fuscabr-csnippet-apply", "click", ceditor.updateEditors);
			ceditor.createListener("img[onclick*='staticEditor.save()']", "click", ceditor.updateTextAreas, true);
			ceditor.createListener("img[onclick*='graphicRendererEditor.save()']", "click", ceditor.updateTextAreas, true);
			// Re-asign functions, adding the watchdog
			openStaticEditor = function(cid) {
				closeEditors();
				fuscabr.ceditor.viewEditWatchdog("#staticEditorPopup");
				staticEditor.open(cid);
			}
			openGraphicRendererEditor = function(cid) {
				closeEditors();
				fuscabr.ceditor.viewEditWatchdog("#graphicRendererEditorPopup");
				graphicRendererEditor.open(cid);
			}
			
			// Add custom callbacks if Code Snippet module is active
			if (!!fuscabr.csnippet) {
				fuscabr.csnippet.callbackFunctions.push(fuscabr.ceditor.updateEditors);
			}

		} else if (pageUrl.includes("data_source_edit.shtm")) {
			// Data sources
			if (document.getElementById("webcamLiveFeedCode")) {
				// HTTP Image data source

				// Editor
				ceditor.loadLanguage("html", function() {
					ceditor.createEditor("#webcamLiveFeedCode", "html", "httpimage_ds");
				});
				// Watchdog
				ceditor.generalWatchdog("#xid");
				// Listener
				ceditor.createListener("img[onclick*='savePoint()']", "click", ceditor.updateTextAreas, true);

			} else if (document.getElementById("script")) {
				// Meta data source

				//Editor
				ceditor.loadLanguage("javascript", function() {
					ceditor.createEditor("#script", "javascript", "meta_ds");
				});
				// Watchdog
				ceditor.generalWatchdog("#xid");
				// Listeners
				ceditor.createListener("img[onclick*='validateScript()']", "click", ceditor.updateTextAreas, true);
				ceditor.createListener("img[onclick*='savePoint()']", "click", ceditor.updateTextAreas, true);

			} else if (document.getElementById("selectStatement")) {
				// SQL data source

				// Editors
				ceditor.loadLanguage("sql", function() {
					ceditor.createEditor("#selectStatement", "sql", "sql_ds_1");
				});
				ceditor.loadLanguage("sql", function() {
					ceditor.createEditor("textarea[name='updateStatement']", "sql", "sql_ds_2");
				});
				// Watchdog
				ceditor.generalWatchdog("#xid");
				// Listeners
				ceditor.createListener("#sqlTestBtn", "click", ceditor.updateTextAreas, true);
				ceditor.createListener("img[onclick*='saveDataSource()']", "click", ceditor.updateTextAreas, true);
				ceditor.createListener("img[onclick*='savePoint()']", "click", ceditor.updateTextAreas, true);

			} else {
				// Other data source type. Do nothing
				//console.log("Hello!");
			}
		}
	},

	// Get module settings
	getSettings: function()	{
		ajaxGetJson("resources/fuscabr/conf/modules/ceditor.json", function(response) {
			fuscabr.ceditor.conf = response;
			fuscabr.ceditor.init();
		});
	},

	// Init module
	init: function() {
		if (!fuscabr.ceditor.conf) {
			fuscabr.ceditor.getSettings();
		} else {
			//console.info("Code Editor module loaded.");
			fuscabr.ceditor.loadCodeMirror();
		}
	}
 }

fuscabr.ceditor.init();
