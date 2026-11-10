FRITZ!Box Dark Mode 1.1.4 hält die Mesh-Geräte beim Live-Update sichtbar und korrigiert die hellen Linienartefakte.

[Auf Greasy Fork installieren](https://greasyfork.org/de/scripts/602848-fritz-box-dark-mode-shadow-dom) oder die angehängte `fritzbox-dark.user.js` verwenden.

- Bereits sichtbare Bereiche verschwinden beim Nachfärben, nachgeladenem CSS oder Größenänderungen nicht mehr. Auch vom Live-Update ersetzte Mesh-Geräte bleiben sichtbar; Verbindungswerte werden weiterhin aktualisiert.
- Weiße Balken an Mesh-Linienenden passen jetzt zum dunklen Hintergrund. Klassische WLAN-Verbindungen erscheinen als ruhigere grüne Striche mit transparenten Lücken; horizontale und vertikale Verbindungen sind berücksichtigt.
- Mesh-Tooltips werden direkt abgedunkelt. LAN-Linien und Geräteanordnung bleiben erhalten.
- Unveränderte Attribute lösen keine Farbprüfung aus. Kleine Änderungen werden vor dem nächsten Bild nachgefärbt; größere Änderungen behalten die begrenzten Animationsframe-Portionen. Der Ausblendschutz ist auf höchstens eine Sekunde begrenzt.
- Keine zusätzlichen Berechtigungen, externen Bibliotheken oder Netzwerkanfragen.

Validierung: 45 lokale Prüfungen bestanden (19 Belastungsprüfungen mit 12.000 Elementen, 10 Prüfungen laufender Aktualisierungen und 16 Mesh-Prüfungen). Die Vergleichsfassung 1.1.3 reproduziert den verbleibenden Ausblendfehler bei ersetzten Mesh-Geräten. Die installierte 1.1.4 mit dunklen Abdeckungen und neuen WLAN-Linien wurde zusätzlich im Original auf einer FRITZ!Box 7590 AX mit FRITZ!OS 8.51, Chrome und Tampermonkey geprüft und vom Nutzer freigegeben.

Der interne Teststand 1.1.3 ist enthalten und wurde nicht separat veröffentlicht. Die freigegebene lokale Datei `fritzbox-dark-v1.1.4-mesh-test.user.js` entspricht unverändert dem veröffentlichten Script; erneutes Installieren ist für diese Tester nicht nötig.

Ein Browserbild vor dem Start des Userscripts kann das Script weiterhin nicht verhindern. Andere FRITZ!OS-Versionen und Script-Manager können abweichen.
