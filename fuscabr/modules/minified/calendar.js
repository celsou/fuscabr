/******************************************
 * FUScaBR - "Funções úteis para o ScadaBR"
 * License: MIT
 ******************************************/
"use strict";fuscabr.calendar={start:function(){this.shouldCreateCalendars()&&("undefined"==typeof flatpickr?this.loadFlatpickr():(this.localizeFlatpickr(),this.createCalendars()))},createCalendars:function(){flatpickr(".fuscabr-calendar",{enableTime:!0,altInput:!0,dateFormat:"d/m/Y H:i:S"})},shouldCreateCalendars:function(){for(var a of this.conf.rules)for(var e of a.pages)if(window.location.pathname.includes(e)){var t=document.querySelectorAll(a.inputSelector);for(var n of t)n.classList.add("fuscabr-calendar");if(t.length)return!0}return!1},loadFlatpickr:function(){if(!this.loadStarted){this.loadStarted=!0;var a=document.createElement("script");a.src=this.conf.flatpickrLocaleFile,a.onload=function(){fuscabr.calendar.start()};var e=document.createElement("link");e.href=this.conf.flatpickrCSSFile,e.rel="stylesheet";var t=document.createElement("script");t.src=this.conf.flatpickrFile,t.onload=function(){document.getElementById("fuscabr-modules").appendChild(a)},document.getElementById("fuscabr-modules").appendChild(t),document.getElementById("fuscabr-modules").appendChild(e)}},localizeFlatpickr:function(){var a=fuscabr.common.conf.language;this.conf.detectBrowserLocale&&(a=(navigator.language||navigator.userLanguage).replace(/-.*/,"")),flatpickr.l10ns[a]?flatpickr.localize(flatpickr.l10ns[a]):console.warn("Flatpickr locale not found. Using default locale (English).")},getSettings:function(){ajaxGetJson("resources/fuscabr/conf/modules/calendar.json",function(a){fuscabr.calendar.conf=a,fuscabr.calendar.init()})},init:function(){fuscabr.calendar.conf?fuscabr.calendar.start():fuscabr.calendar.getSettings()}},fuscabr.calendar.init();