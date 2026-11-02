# Änderungen

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
