# Änderungen

## 1.1.4 — 2026-11-10

- Bereits sichtbare Bereiche bleiben bei Klassen-/Stiländerungen, nachgeladenem CSS und Größenänderungen sichtbar. Verschobene bestehende Elemente werden nicht erneut ausgeblendet.
- Neu aufgebaute Mesh-Geräte vom Ausblendschutz ausnehmen, damit Live-Aktualisierungen die Geräteanzeige nicht leeren. Datenaktualisierungen selbst bleiben aktiv.
- Startschutz und vorübergehendes Ausblenden neuer Flächen auf höchstens eine Sekunde begrenzen.
- Unveränderte Attribute ignorieren; kleine Änderungen mit höchstens 24 besuchten Elementen vor dem nächsten Bild nachfärben. Große Änderungen weiterhin in begrenzten Animationsframe-Portionen bearbeiten.
- Weiße Balken an Mesh-Linienenden korrigieren: Die Pseudoelemente und ihre Abdeckfarben passen jetzt zum dunklen Hintergrund.
- Klassische horizontale und vertikale WLAN-Linien durch gedämpfte grüne Striche mit transparenten Lücken ersetzen. Linienabmessungen, LAN-Muster und Geräteanordnung bleiben erhalten.
- Mesh-Tooltips direkt abdunkeln.
- 45 lokale Prüfungen bestanden: 19 Belastungsprüfungen mit 12.000 Elementen, 10 Prüfungen laufender Aktualisierungen und 16 Mesh-Prüfungen. Beim Vergleich mit 1.1.3 blieb ein Ersatzgerät in 45 erfassten Bildern verborgen; mit 1.1.4 in keinem.
- Installierte 1.1.4, dunkle Endabdeckungen und die neuen WLAN-Linien im echten Chrome-/Tampermonkey-Tab auf FRITZ!Box 7590 AX mit FRITZ!OS 8.51 geprüft und vom Nutzer freigegeben.
- Der lokale Teststand 1.1.3 ist enthalten und wurde nicht separat veröffentlicht.

## 1.1.2 — 2026-11-02

- Blockaden aus 1.1.0 behoben: Vollständige Farbprüfungen bei Mausbewegungen und gewöhnlichen Textänderungen entfernt.
- Nur betroffene Teilbäume erneut prüfen; große Änderungen auf mehrere Animationsframes mit höchstens 200 Elementen pro Durchlauf verteilen.
- Messungen bündeln und identische Farbkombinationen in gemeinsamen CSS-Regeln wiederverwenden, statt für jedes Element eigene Regeln anzulegen.
- Weiße Schattenstreifen an Dialogkopf und Dialog-Schaltflächenleiste korrigiert: `--content-shadow` wird direkt auf `.dialog` dunkel gesetzt, damit dessen eigene weiße Definition die geerbte Farbe nicht wieder überschreibt. Die Schattenabmessungen bleiben erhalten.
- Dialogkopf, Schaltflächenleiste und ältere modale Dialogflächen bereits durch feste CSS-Regeln abdunkeln.
- Dunkle Basis, Ladeschutz und ursprünglichen FRITZ!Box-Aufbau beibehalten.
- Lokaler Belastungstest mit 12.000 Elementen: 19 Prüfungen bestanden. Im Leerlauf, bei 200 Mausereignissen und 20 laufenden Textänderungen keine Farbprüfungen; eine Einzeländerung las nur eine Elementdarstellung aus. Während des Aufbaus liefen Browser-Timer weiter.
- 14 lokale Dialogprüfungen bestanden: offene und geschlossene Shadow Roots, unveränderte Schattenabmessungen, ältere Dialogflächen, Hell-/Dunkel-Umschaltung und ersetzter Dialoginhalt.
- Am 2026-11-02 im echten FRITZ!Box-Neustartdialog geprüft: beide Schatten und ihre Hintergrundflächen verwenden `rgb(27, 29, 32)`; die weißen Streifen sind verschwunden. Dialog anschließend abgebrochen, kein Neustart ausgelöst.
- Bedienbarkeit der lokalen Testfassung auf der echten FRITZ!Box bestätigt. Der interne Performance-Teststand 1.1.1 ist in dieser Ausgabe enthalten und wurde nicht separat veröffentlicht.

## 1.1.0 — 2026-11-02

- Ruhigere Anthrazit- und Grautöne, blaue Akzente für Links und Auswahl. Aufbau und Abstände bleiben wie in der bisherigen FRITZ!Box-Ansicht.
- Farbkorrektur nach DOM-Änderungen vor dem nächsten Bildaufbau statt über einen verzögerten Timer. Verhindert den reproduzierten Ladeblitz beim Klassenwechsel einer zuvor transparenten Fläche.
- Änderungen an Textknoten von Stylesheets werden ebenfalls berücksichtigt.
- Zusätzliche frühe dunkle Dokumentbasis über ein konstruiertes Stylesheet; bleibt beim Austausch des Seitenkopfs erhalten und folgt dem Hell-/Dunkel-Schalter.
- 66 lokale Browserprüfungen bestanden, 76 Animationsframes ohne helle Testflächen. Die bisherige Version scheitert am reproduzierten Klassenwechsel.

## 1.0.0 — 2026-10-29

- Erste öffentliche Ausgabe auf GitHub und Greasy Fork.
- Dunkle Kopfzeile, Navigation, Karten, Tabellen, Eingabefelder und Reiter.
- Unterstützung für Shadow-DOM-Komponenten und nachgeladene Ansichten.
- Umschalter mit lokal gespeicherter Auswahl.
- Dunkle Basis bereits beim Seitenstart, kurzer Ladeschutz für neue Komponenten und schnellere Farbanpassung gegen weiße Ladeblitze.
- Weiße Querstreifen durch Feldüberschriften und helle Tabellen-Fußleisten korrigiert.
- Dunkle native Auswahlfelder und schraffierte Raster für fehlende WLAN-Messdaten.
- Canvas-Diagramme für lesbarere Achsen leicht aufgehellt.
- Statusfarben, Verbindungslinien und Gerätebilder bleiben erhalten.
- Lizenz, Anleitung, Support- und Updateadressen enthalten.
