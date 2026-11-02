FRITZ!Box Dark Mode 1.1.2 behebt die Blockaden aus 1.1.0 und entfernt weiße Schattenstreifen in Dialogen.

[Auf Greasy Fork installieren](https://greasyfork.org/de/scripts/602848-fritz-box-dark-mode-shadow-dom). Code und Beschreibung werden dort automatisch aus GitHub synchronisiert.

- Gezielte Prüfungen geänderter Bereiche; Mausbewegungen und laufende Textanzeigen lösen keine vollständige Seitenprüfung mehr aus.
- Gebündelte Messungen, gemeinsame Farbregeln und begrenzte Arbeit pro Animationsframe halten die Oberfläche bedienbar.
- Dunkle Dialogköpfe, Schaltflächenleisten und Schatten ohne weiße Streifen, einschließlich der inneren Schattenvariablen moderner FRITZ!OS-Dialoge.
- Anthrazit-/Grautöne, ursprünglicher FRITZ!Box-Aufbau und dunkle Ladeflächen bleiben erhalten.
- Statusfarben, Verbindungsgrafiken und Hell-/Dunkel-Schalter bleiben erhalten.
- Keine zusätzlichen Berechtigungen, externen Bibliotheken oder Netzwerkanfragen.

Geprüft mit 19 lokalen Belastungsprüfungen bei 12.000 Elementen und 14 Dialogprüfungen. Die Bedienbarkeit und die korrigierten Dialogschatten wurden zusätzlich auf einer FRITZ!Box 7590 AX mit Chrome/Tampermonkey bestätigt. Die Testseiten sind im Repository enthalten.

Der interne Teststand 1.1.1 ist enthalten und wurde nicht separat veröffentlicht. Bereits installierte lokale 1.1.2-Testkopien mit der abschließenden Dialogkorrektur entsprechen dieser Ausgabe.

Ein Browserbild vor dem Start des Userscripts kann das Script weiterhin nicht verhindern. Andere FRITZ!OS-Versionen und Script-Manager können abweichen.
