# FRITZ!Box Dark Mode

Dunkle Oberflächen für die FRITZ!Box-Weboberfläche, einschließlich der gekapselten Web-Komponenten moderner FRITZ!OS-Versionen.

**Version 1.1.4 · MIT-Lizenz · Community-Projekt**

[![Greasy Fork installs](https://img.shields.io/greasyfork/dt/602848?label=Greasy%20Fork%20installs)](https://greasyfork.org/de/scripts/602848-fritz-box-dark-mode-shadow-dom/stats)
[![GitHub release downloads](https://img.shields.io/github/downloads/xerexexe/fritzbox-dark-mode/total?label=GitHub%20release%20downloads)](https://github.com/xerexexe/fritzbox-dark-mode/releases)

Die Zähler zeigen Greasy-Fork-Installationen und Downloads der hochgeladenen GitHub-Release-Dateien. Direkte Raw-Downloads werden von GitHub nicht erfasst; die Zahlen sind keine Anzahl eindeutiger Nutzer.

## Installation

1. Tampermonkey im Browser installieren.
2. [Userscript über Greasy Fork installieren](https://greasyfork.org/de/scripts/602848-fritz-box-dark-mode-shadow-dom).
3. Ältere oder andere Dark-Mode-Scripts für dieselbe Seite deaktivieren und die FRITZ!Box-Seite neu laden.

Alternativ ist die [Installation direkt aus GitHub](https://raw.githubusercontent.com/xerexexe/fritzbox-dark-mode/main/fritzbox-dark.user.js) möglich. Falls der Browser die Datei nur als Text anzeigt, ihren vollständigen Inhalt in ein neues Tampermonkey-Script einfügen und speichern.

Unten rechts schaltet **Dunkel / Hell** die Ansicht um. Die Auswahl wird lokal für die jeweilige Router-Adresse gespeichert. Die Installation aus GitHub prüft Updates über die Metadatei dieses Repositorys. Bei Installation über Greasy Fork übernimmt Greasy Fork die Updates.

Hinweis für frühe Tester: Die erste Veröffentlichung wurde kurzzeitig als 3.2.1 angeboten. Diese Nummer stammte aus der Entwicklung und wurde auf 1.0.0 berichtigt. Bereits installierte 3.2.x-Kopien einmal durch 1.0.0 ersetzen, damit spätere 1.x-Updates erkannt werden. Die Darstellung bleibt gleich.

## Funktionen

- Neutrale Anthrazit- und Grautöne mit blauen Akzenten; der Aufbau der FRITZ!Box-Oberfläche bleibt erhalten.
- Dunkle Kopfzeile, Navigation, Karten, Tabellen, Eingabefelder und Reiter.
- Unterstützung für offene sowie nach Script-Start erfasste geschlossene Shadow Roots.
- Nachgeladene Ansichten und neu erstellte Komponenten werden berücksichtigt.
- Dunkle Ladeflächen ab Seitenstart mit zeitlich begrenztem Ausblendschutz.
- Geänderte Bereiche werden gezielt und in begrenzten Portionen eingefärbt. Mausbewegungen und gewöhnliche Änderungen laufender Textanzeigen lösen keine vollständigen Farbprüfungen aus.
- Die dunkle Dokumentbasis übersteht einen ausgetauschten Seitenkopf. Bereits sichtbare Bereiche bleiben beim Nachfärben, nachgeladenem CSS und Größenänderungen sichtbar.
- Lesbare Feldüberschriften ohne weiße Querstreifen, dunkle Tabellen-Fußleisten und Schraffuren für fehlende WLAN-Messwerte.
- Dunkle Dialogköpfe, Dialogfußleisten und Schatten ohne weiße Streifen.
- Mesh-Geräte bleiben auch dann sichtbar, wenn FRITZ!OS sie beim Live-Update neu aufbaut. Verbindungswerte werden weiterhin aktualisiert.
- Dunkle Abdeckungen an Mesh-Linienenden; klassische WLAN-Verbindungen erscheinen als ruhigere grüne Striche mit transparenten Lücken.
- Farbige Statusanzeigen, andere Verbindungslinien und Gerätebilder bleiben erhalten.
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

Direkt in Chrome mit Tampermonkey auf einer **FRITZ!Box 7590 AX** geprüft: Übersicht, Navigation und Mesh-Reiter zunächst unter FRITZ!OS 8.40-137813 BETA; die Mesh-Korrekturen der 1.1.4 zusätzlich unter **FRITZ!OS 8.51**. Andere Modelle und FRITZ!OS-Versionen können weitere Anpassungen benötigen. Firefox, Greasemonkey und andere Script-Manager wurden nicht praktisch geprüft; insbesondere die Ausführung im Seitenkontext kann sich unterscheiden.

Bereits vor Script-Start erzeugte geschlossene Shadow Roots sind nachträglich nicht erreichbar. Bilder und Verbindungsgrafiken werden nicht invertiert. Inline-Farben mit '!important' können Vorrang haben. Falls der Script-Manager erst nach dem ersten Browserbild startet, kann das Script dieses frühere Bild nicht beeinflussen. Der Ladeschutz greift ab seiner Ausführung und auch bei internen Seitenwechseln.

Canvas-Diagramme im Online-Monitor werden leicht aufgehellt, damit ihre fest eingezeichneten Achsen lesbarer sind. Messwerte und Diagrammstruktur bleiben gleich.

Der generische Farbfallback prüft betroffene Teilbäume, bündelt Messungen und verwendet gemeinsame CSS-Regeln für gleiche Farbkombinationen. Kleine Änderungen mit höchstens 24 besuchten Elementen können vor dem nächsten Bild nachgefärbt werden. Große Änderungen werden auf mehrere Animationsframes mit höchstens 200 Elementen pro Durchlauf verteilt. Sehr große Ansichten benötigen deshalb mehrere Bilder bis zur vollständigen Einfärbung. Der anfängliche Ausblendschutz und der Schutz neuer Flächen sind auf höchstens eine Sekunde begrenzt; neu aufgebaute Mesh-Geräte werden nicht ausgeblendet.

## Datenschutz

Das Script enthält keine Netzwerkanfragen und überträgt keine Routerdaten. Es speichert nur die Hell-/Dunkel-Auswahl in 'localStorage' unter 'fritzbox-dark-mode-v3'. Die normalen Updateprüfungen führt der Script-Manager über die Installationsquelle durch.

Das Script verändert die Darstellung im Browser und nimmt keine Router-Konfigurationsänderungen vor.

## Fehler melden

Bitte [ein Issue öffnen](https://github.com/xerexexe/fritzbox-dark-mode/issues) und Script-Version, Browser, Script-Manager, FRITZ!OS-Version und betroffene Ansicht nennen. Private Angaben aus Screenshots entfernen.

## Entwicklung und Veröffentlichung

Die ausführbare Quelle steht in 'fritzbox-dark.user.js'. Bei Updates die Version erhöhen und den Metadatenblock identisch nach 'fritzbox-dark.meta.js' übernehmen. Änderungen und Prüfergebnisse im Changelog dokumentieren.

Die Datei 'greasyfork-description.html' enthält die Beschreibung für Greasy Fork. [Die veröffentlichte Greasy-Fork-Seite](https://greasyfork.org/de/scripts/602848-fritz-box-dark-mode-shadow-dom) synchronisiert Code und Beschreibung automatisch aus dem 'main'-Branch dieses Repositorys. Es wird der vollständige, lesbare Script-Code veröffentlicht, kein externer Loader.

Lokale Browserprüfungen deckten Dokumentstart, neutrale Flächen und Texte, Statusfarben, SVG-Linien, offene/geschlossene/verschachtelte/später erzeugte Shadow Roots, ersetzte Komponenten-Inhalte, Klassenwechsel, eingebettete Seiten, Umschalter, gespeicherte Auswahl und Beobachter-Stabilität ab. Ein weiterer Test prüfte die aus FRITZ!OS gelesenen Selektoren und Pseudoelemente.

1.1.2 behebt die Blockaden der Version 1.1.0 bei häufigen Seitenereignissen. Der lokale Belastungstest bestand 19 Prüfungen mit 12.000 Elementen: Browser-Timer liefen während des Aufbaus weiter; im Leerlauf, bei Mausereignissen und laufenden Textänderungen fanden keine Farbprüfungen statt. Eine Einzeländerung las nur eine Elementdarstellung aus. Die Bedienbarkeit wurde außerdem auf der echten FRITZ!Box bestätigt.

14 zusätzliche Dialogprüfungen decken offene und geschlossene Shadow Roots, eigene Schattenvariablen am Dialogcontainer, unveränderte Schattenabmessungen und die Hell-/Dunkel-Umschaltung ab. Die korrigierten Schatten wurden im Originaldialog auf der FRITZ!Box geprüft. Diese Prüfungen ersetzen keinen Test jeder FRITZ!OS-Ansicht.

1.1.4 bestand 45 lokale Prüfungen: 19 Belastungsprüfungen, 10 Prüfungen laufender Aktualisierungen und 16 Mesh-Prüfungen. Beim Ersetzen eines Mesh-Geräts zeigt der Vergleich mit 1.1.3 den verbliebenen Ausblendfehler; die Korrektur hält den Ersatzknoten sichtbar. Horizontale und vertikale WLAN-Linien, offene und geschlossene Shadow Roots, dunkle Endabdeckungen, unveränderte Linienabmessungen und Hell-/Dunkel-Umschaltung sind abgedeckt. Die korrigierten Abdeckungen und WLAN-Linien wurden anschließend im echten Mesh unter FRITZ!OS 8.51 geprüft und die Fassung vom Nutzer freigegeben. Die internen Teststände 1.1.3 und 1.1.1 wurden nicht separat veröffentlicht.

Die reproduzierbaren Prüfseiten liegen in `tests/`. Mit `node tests/serve.mjs` starten und folgende Seiten öffnen:

- `http://127.0.0.1:8766/`: Belastungstest mit 12.000 Elementen.
- `http://127.0.0.1:8766/dialog`: Dialogtest.
- `http://127.0.0.1:8766/live`: laufende Aktualisierungen und ersetzte Mesh-Geräte.
- `http://127.0.0.1:8766/mesh`: Mesh-Linien und Endabdeckungen.

Die Testseiten verwenden künstliche Daten und haben keine Routerfunktion.

## Lizenz

Copyright © 2026 xerexexe. [MIT](LICENSE).

Inoffizielles Community-Projekt, nicht mit FRITZ! verbunden. Marken, Logos und die ursprünglichen Oberflächen-Assets gehören ihren jeweiligen Rechteinhabern; diese werden vom Script nicht mitgeliefert.
