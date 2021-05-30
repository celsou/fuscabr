# FUScaBR - "Funções Úteis para o ScadaBR"

## What is FUScaBR?
FUScaBR is a Javascript library created to add resources to ScadaBR, such as, for example, the ability to align elements in the Graphic View. You can consider FUScaBR as an add-on for ScadaBR.

## How does FUScaBR work?
The current version of FUScaBR is based on modules. Each module adds specific functionality to ScadaBR. The modules present in version 2.0 are:
- Align module (align.js): adds alignment capabilities to Graphical View.
- Calendar module (calendar.js): allows you to use an interactive calendar to select dates in the "Chart Comparator" component of the Graphic View.
- Chart module (chart.js): allows you to integrate the Chart.js library with ScadaBR's "server-side scripts". The server-side script templates required for this are included in the Code Snippet module.
- Code Snippet module (csnippet.js): it allows the use of several ready-made code templates with the "HTML" and "server-side script" components in the Graphic View. In addition, you can create your own templates and add them to the module. 
- Fixes module (fixes.js): Corrects some bugs present in specific versions of ScadaBR. Check the module settings to enable or disable fixes individually.

## Installation
- Download the [latest release](https://github.com/celsou/fuscabr/releases/latest/).
- Extract the `FUScaBR.zip` file
- Copy the `fuscabr` folder into the `resources/` folder in your ScadaBR installation.
- In your ScadaBR installation, edit the file `WEB-INF/tags/page.tag` and add a script tag with the content `<script src="resources/fuscabr/fuscabr.js"></script>`
- Clear your browser's cache

## Internationalization
FUScaBR 2.0 has support for internationalization. Currently, there are translations only in Portuguese and English. You can translate FUScaBR by editing the files in `fuscabr/conf/i18n` and change the default language in the file `conf/common.json`. I hope to create a translation tutorial on the FUScaBR Wiki soon. Collaborators to translate FUScaBR into other languages are welcome.

## Settings
FUScaBR's settings is based on JSON files. These files are located inside `fuscabr/conf` folder and control the library in general as well as specific behaviors of the modules. I will soon try to describe how to configure FUScaBR on the [FUScaBR Wiki](https://github.com/celsou/fuscabr/wiki).

## License
FUScaBR is distributed under the MIT license.
