# FRITZ!Box Dark Mode

Dunkle Oberflächen für die FRITZ!Box-Weboberfläche, einschließlich der gekapselten Web-Komponenten moderner FRITZ!OS-Versionen.

**Version 1.0.0 · MIT-Lizenz · Community-Projekt**

## Installation

1. Tampermonkey im Browser installieren.
2. [Userscript über Greasy Fork installieren](https://greasyfork.org/de/scripts/602848-fritz-box-dark-mode-shadow-dom).
3. Ältere oder andere Dark-Mode-Scripts für dieselbe Seite deaktivieren und die FRITZ!Box-Seite neu laden.

Alternativ ist die [Installation direkt aus GitHub](https://raw.githubusercontent.com/xerexexe/fritzbox-dark-mode/main/fritzbox-dark.user.js) möglich. Falls der Browser die Datei nur als Text anzeigt, ihren vollständigen Inhalt in ein neues Tampermonkey-Script einfügen und speichern.

Unten rechts schaltet **Dunkel / Hell** die Ansicht um. Die Auswahl wird lokal für die jeweilige Router-Adresse gespeichert. Die Installation aus GitHub prüft Updates über die Metadatei dieses Repositorys. Bei Installation über Greasy Fork übernimmt Greasy Fork die Updates.

Hinweis für frühe Tester: Die erste Veröffentlichung wurde kurzzeitig als 3.2.1 angeboten. Diese Nummer stammte aus der Entwicklung und wurde auf 1.0.0 berichtigt. Bereits installierte 3.2.x-Kopien einmal durch 1.0.0 ersetzen, damit spätere 1.x-Updates erkannt werden. Die Darstellung bleibt gleich.

## Funktionen

- Dunkle Kopfzeile, Navigation, Karten, Tabellen, Eingabefelder und Reiter.
- Unterstützung für offene sowie nach Script-Start erfasste geschlossene Shadow Roots.
- Nachgeladene Ansichten und neu erstellte Komponenten werden berücksichtigt.
- Dunkle Ladeflächen ab Seitenstart; neue Komponenten werden erst nach ihrer Farbanpassung eingeblendet.
- Lesbare Feldüberschriften ohne weiße Querstreifen, dunkle Tabellen-Fußleisten und Schraffuren für fehlende WLAN-Messwerte.
- Farbige Statusanzeigen, Verbindungslinien und Gerätebilder bleiben erhalten.
- Helle und dunkle Ansicht lassen sich ohne Neuladen umschalten.
- Keine externen Bibliotheken, Werbung oder Telemetrie.

## Adressen

Standardmäßig läuft das Script über HTTP und HTTPS auf 'fritz.box', dessen Unterdomains und '192.168.178.1'.

Für eine abweichende IP-Adresse im Script-Kopf eine passende Zeile ergänzen, beispielsweise:

```javascript
// @match        *://192.168.188.1/*
```

Nur die tatsächlich verwendete Router-Adresse ergänzen.

## Kompatibilität und Grenzen

Direkt in Chrome mit Tampermonkey auf einer **FRITZ!Box 7590 AX, FRITZ!OS 8.40-137813 BETA** geprüft: Übersicht, Navigation und Mesh-Reiter. Andere Modelle und FRITZ!OS-Versionen können weitere Anpassungen benötigen. Firefox, Greasemonkey und andere Script-Manager wurden nicht praktisch geprüft; insbesondere die Ausführung im Seitenkontext kann sich unterscheiden.

Bereits vor Script-Start erzeugte geschlossene Shadow Roots sind nachträglich nicht erreichbar. Bilder und Verbindungsgrafiken werden nicht invertiert. Inline-Farben mit '!important' können Vorrang haben. Falls der Script-Manager erst nach dem ersten Browserbild startet, kann das Script dieses frühere Bild nicht beeinflussen. Der Ladeschutz greift ab seiner Ausführung und auch bei internen Seitenwechseln.

Canvas-Diagramme im Online-Monitor werden leicht aufgehellt, damit ihre fest eingezeichneten Achsen lesbarer sind. Messwerte und Diagrammstruktur bleiben gleich.

Der generische Farbfallback liest bei Änderungen die berechneten Farben und ergänzt eigene Styles. Sehr große oder häufig aktualisierte Ansichten können dadurch zusätzlichen Aufwand im Browser verursachen.

## Datenschutz

Das Script enthält keine Netzwerkanfragen und überträgt keine Routerdaten. Es speichert nur die Hell-/Dunkel-Auswahl in 'localStorage' unter 'fritzbox-dark-mode-v3'. Die normalen Updateprüfungen führt der Script-Manager über die Installationsquelle durch.

Das Script verändert die Darstellung im Browser und nimmt keine Router-Konfigurationsänderungen vor.

## Fehler melden

Bitte [ein Issue öffnen](https://github.com/xerexexe/fritzbox-dark-mode/issues) und Script-Version, Browser, Script-Manager, FRITZ!OS-Version und betroffene Ansicht nennen. Private Angaben aus Screenshots entfernen.

## Entwicklung und Veröffentlichung

Die ausführbare Quelle steht in 'fritzbox-dark.user.js'. Bei Updates die Version erhöhen und den Metadatenblock identisch nach 'fritzbox-dark.meta.js' übernehmen. Änderungen und Prüfergebnisse im Changelog dokumentieren.

Die Datei 'greasyfork-description.html' enthält die Beschreibung für Greasy Fork. [Die veröffentlichte Greasy-Fork-Seite](https://greasyfork.org/de/scripts/602848-fritz-box-dark-mode-shadow-dom) synchronisiert Code und Beschreibung automatisch aus dem 'main'-Branch dieses Repositorys. Es wird der vollständige, lesbare Script-Code veröffentlicht, kein externer Loader.

Lokale Browserprüfungen deckten Dokumentstart, neutrale Flächen und Texte, Statusfarben, SVG-Linien, offene/geschlossene/verschachtelte/später erzeugte Shadow Roots, ersetzte Komponenten-Inhalte, Klassenwechsel, eingebettete Seiten, Umschalter, gespeicherte Auswahl und Beobachter-Stabilität ab. Ein weiterer Test prüfte die aus FRITZ!OS gelesenen Selektoren und Pseudoelemente.

## Lizenz

Copyright © 2026 xerexexe. [MIT](LICENSE).

Inoffizielles Community-Projekt, nicht mit FRITZ! verbunden. Marken, Logos und die ursprünglichen Oberflächen-Assets gehören ihren jeweiligen Rechteinhabern; diese werden vom Script nicht mitgeliefert.
