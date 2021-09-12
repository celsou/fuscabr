/******************************************
 * FUScaBR - "Funções úteis para o ScadaBR"
 * License: MIT
 ******************************************/
 "use strict";
 
 fuscabr.ceditor = {
	createdEditors: [],
	watchdog: null,

	createEditor: function(textAreaSelector, mode) {		
		var textArea = document.querySelector(textAreaSelector);
		var modesFolder = this.conf.modesFolder;
		
		this.loadDependency(modesFolder + "javascript/javascript.js", "script");
		this.loadDependency(modesFolder + "xml/xml.js", "script");
		this.loadDependency(modesFolder + "css/css.js", "script");
		this.loadDependency(modesFolder + "htmlmixed/htmlmixed.js", "script");
		this.loadDependency(modesFolder + "sql/sql.js", "script");

		
		var editorConf = {};
		
		if (mode == "html") {
			this.unloadDependency(modesFolder + "sql/sql.js", "script");

			editorConf.mode = "htmlmixed";
		} else if (mode == "javascript" || mode == "json") {
			this.unloadDependency(modesFolder + "xml/xml.js", "script");
			this.unloadDependency(modesFolder + "css/css.js", "script");
			this.unloadDependency(modesFolder + "htmlmixed/htmlmixed.js", "script");
			
			editorConf.mode = { name: "javascript" };
			editorConf.mode.json = (mode == "json") ? true : false;
		} else if (mode == "sql") {
			this.unloadDependency(modesFolder + "javascript/javascript.js", "script");
			this.unloadDependency(modesFolder + "xml/xml.js", "script");
			this.unloadDependency(modesFolder + "css/css.js", "script");
			this.unloadDependency(modesFolder + "htmlmixed/htmlmixed.js", "script");
			
			editorConf.mode = "sql";
		}
		
		fuscabr.ceditor.createdEditors.push(CodeMirror.fromTextArea(textArea, editorConf));
	},
	
	createListener: function(selector, eventType, funcObj, catchParent) {
		var element = document.querySelector(selector);
		if (catchParent)
			element = element.parentElement;
		
		if (element)
			element.addEventListener(eventType, funcObj, true);
	},

	createCustomCSS: function(elementsToHide) {
		var stylesheet = document.createElement("style");
		stylesheet.innerHTML = ".CodeMirror { border: 1px solid " + + "}";
		
		if (elementsToHide) {
			for (var i of elementsToHide)
				stylesheet.innerHTML += i + "{ display: none !important }"
		}

		document.getElementById("fuscabr-modules").appendChild(stylesheet);
	},

	loadDependency: function(src, type) {
		var htmlTag;
		if (type == "script") {
			htmlTag = document.createElement("script");
			htmlTag.src = src;
		} else if (type == "style") {
			htmlTag = document.createElement("link");
			htmlTag.rel = "stylesheet";
			htmlTag.href = src;
		} 
		
		document.getElementById("fuscabr-modules").appendChild(htmlTag);
	},

	unloadDependency: function(src, type) {
		var element;
		
		if (type == "script") {
			element = document.querySelector("fuscabr-modules > script[src*='" + src + "']");
		} else if (type == "style") {
			element = document.querySelector("fuscabr-modules > link[href*='" + src + "']");
		}
		
		if (element)
			element.remove();
	},

	loadCodeMirror: function() {
		var scriptUrl = this.conf.baseFolder + "codemirror.js";
		var styleUrl = this.conf.baseFolder + "codemirror.css"
		
		if (!document.querySelector("fuscabr-modules > script[src*='codemirror.js']")) {			
			this.loadDependency(scriptUrl, "script");
			this.loadDependency(styleUrl, "style");
		}
	},

	updateEditors: function() {
		for (var cm of this.createdEditors)
			cm.setValue(cm.getTextArea().value);
	},

	updateTextAreas: function() {
		for (var cm of this.createdEditors)
			cm.save();
	},

	generalWatchdog: function(targetElement) {
		var element = document.querySelector(targetElement);
		this.watchdog = element.value;
		
		setInterval(function() {
			if (watchdog != document.querySelector(targetElement).value)
				fuscabr.ceditor.updateEditors();
		}, this.conf.watchdogInterval);
	},

	viewEditWatchdog: function(targetElement) {
		var element = document.querySelector(targetElement);
		
		var watchdogFunc = function() {
			if (element.style.display != "none") {
				fuscabr.ceditor.updateEditors();
				clearInterval(watchdog);
			}
		}
		
		this.watchdog = setInterval(watchdogFunc, this.conf.watchdogInterval);
	},

	start: function(pageUrl) {
		if (pageUrl.includes("sql.shtm")) {
			this.createCustomCSS(["#sqlString"]);
			this.createEditor("#sqlString", "sql");
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
		} else if (typeof CodeMirror == "object") {
			//console.info("Code Editor module loaded.");
			fuscabr.ceditor.start(window.location.href);
		} else {
			fuscabr.ceditor.loadCodeMirror();
			setTimeout(fuscabr.ceditor.init, 50);
		}
	}
	 
 }

fuscabr.ceditor.init();
