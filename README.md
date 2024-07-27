![FBR](https://raw.githubusercontent.com/celsou/fuscabr/master/fuscabr/templates/internal/fbr.png)


Fala português? Leia o [README traduzido](README_pt.md)

## What is FBR?
FBR (previously FUScaBR) is a Javascript library created to add resources to ScadaBR, such as, for example, the ability to align elements in the Graphic View. You can consider FBR as an add-on for ScadaBR.

## How does FBR work?
The current version of FBR is based on modules. Each module adds specific functionality to ScadaBR. The modules present in the latest version of FBR are:
- **Align module** (align.js): adds alignment capabilities to Graphical View.
- **Calendar module** (calendar.js): allows you to use an interactive calendar to select dates in the "Chart Comparator" component of the Graphic View.
- **Chart module** (chart.js): allows you to integrate the [Chart.js library](https://www.chartjs.org/) with ScadaBR's "server-side scripts". The server-side script templates required for this are included in the Code Snippet module.
- **Code Editor module** (ceditor.js): integrates the powerful [CodeMirror](https://codemirror.net/) code editor to ScadaBR, improving the user experience when using resources involving script creation.
- **Code Snippet module** (csnippet.js): it allows the use of several ready-made code templates with the "HTML" and "server-side script" components in the Graphic View. In addition, you can create your own templates and add them to the module. 
- **Fixes module** (fixes.js): corrects some bugs present in specific versions of ScadaBR. Check the module settings to enable or disable fixes individually.

## Installation
FBR 2.1+ has installers for Windows and Linux. Get them from the [downloads page](https://github.com/celsou/fuscabr/releases/latest/).

Also check the [installation instructions](https://github.com/celsou/fuscabr/wiki/Installation).

## Internationalization
FBR has support for internationalization. Currently, there are translations in Portuguese, English and Spanish. You can check how to change the FBR language (or create new translations) at [FBR Wiki](https://github.com/celsou/fuscabr/wiki/FBR-localization). Collaborators to translate FBR into other languages are welcome.

## Settings
FBR's settings are based on JSON files. These files are located inside `fuscabr/conf` folder and control the library in general as well as specific behaviors of the modules. You can get more information at [FBR Wiki](https://github.com/celsou/fuscabr/wiki/FBR-settings).

## Support for Scada-LTS
Current versions of FBR were not built with Scada-LTS compatibility in mind. FBR version 2.1.1 brings changes to the script templates to _start_ an official support process for Scada-LTS. Future versions (3.x) will bring better support for Scada-LTS.

The Scada-LTS team is working on [integrating FBR version 2.0 into Scada-LTS](https://github.com/SCADA-LTS/Scada-LTS/releases/tag/v2.7.8). This effort is not related to me directly, so if you find any bugs related to the FBR version pre-installed in Scada-LTS, don't forget to report them to the Scada-LTS team as well.

## License
FBR is distributed under the MIT license.
