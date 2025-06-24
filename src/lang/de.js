// German language pack (full, descriptive translation)
export const stateDescriptions = {
  OFF: {
    uiLabel: "Ausgeschaltet",
    desc: 'Das Gerät ist ausgeschaltet. Das Ventil ist geschlossen.'
  },
  BATTERY: {
    uiLabel: "Batteriestand anzeigen",
    desc: 'Die obere LED zeigt den Batteriestatus an: Grün für voll, Orange für mittel und Rot für niedrig.',
    detailed: 'Die Batterieanzeige zeigt den aktuellen Ladestand der Batterie. Grün bedeutet, dass mehr als 3 Monate Betrieb verbleiben, Orange mehr als 1 Monat und Rot weniger als 1 Monat. Bei längerer Abwesenheit sollte die Batterie also gewechselt werden, sobald die Anzeige auf Rot steht. Wenn jedoch eine regelmäßige Kontrolle möglich ist, kann der Wechsel hinausgezögert werden, bis die Anzeige rot blinkt, was das vollständige Entladen der Batterie signalisiert.'
  },
  MANUAL: {
    uiLabel: "Manuell geöffnet",
    desc: 'Das Ventil wurde manuell vom Benutzer geöffnet. Es bleibt unabhängig von der Bodenfeuchte geöffnet, bis entweder ein kurzer Tastendruck erfolgt oder 15 Minuten vergangen sind.',
    detailed: 'Der manuelle Modus ermöglicht eine sofortige Bewässerung, unabhängig von den aktuellen Bodenfeuchtewerten. Die manuelle Bewässerung kann für dringende Bewässerungen, Systemtests oder zur Überprüfung des Wasserflusses nützlich sein. Das Ventil schließt automatisch nach 15 Minuten oder wenn die Taste erneut gedrückt wird.'
  },
  SLEEP: {
    uiLabel: "Schlafmodus",
    desc: 'OpenValve befindet sich im Schlafmodus. Das Ventil öffnet und schließt entsprechend den Benutzereinstellungen. Im Schlafmodus reagiert OpenValve langsamer auf Änderungen der Bodenfeuchte, um die Batterie zu schonen. Jedes Mal, wenn OpenValve eine neue Messung der Bodenfeuchte durchführt, blinkt die blaue LED kurz.'
  },
  SELECTTHRESHOLD: {
    uiLabel: "Öffnungsschwellwert wählen",
    desc: 'Wählen Sie, ob Sie den Öffnungsschwellwert oder die Multiplikatoreinstellung anpassen möchten.'
  },
  SELECTMULTIPLICATOR: {
    uiLabel: "Multiplikator wählen",
    desc: 'Wählen Sie, ob Sie den Öffnungsschwellwert oder die Multiplikatoreinstellung anpassen möchten.'
  },
  CHANGETHRESHOLD: {
    uiLabel: "Öffnungsschwellwert:",
    desc: 'Der Öffnungsschwellwert, angezeigt durch die Anzahl der grünen LED-Blinks (1–8), definiert, wie trocken der Boden sein muss, bevor die nächste Bewässerung startet. Wenn die gemessene Bodenfeuchte auf oder unter diesem Schwellenwert liegt, öffnet das Ventil. Liegt sie darüber, schließt das Ventil sofort, wenn das Gerät aktiv ist (d. h. nicht im Schlafmodus oder ausgeschaltet), oder nach einer Verzögerung (festgelegt durch den Multiplikator) im Schlafmodus.'
  },
  CHANGEMULTIPLICATOR: {
    uiLabel: "Multiplikator:",
    desc: 'Die aktuelle Multiplikatoreinstellung wird durch die Anzahl der orangefarbenen LED-Blinks angezeigt. Der Wert kann zwischen 1 und 5 liegen. Diese Einstellung beeinflusst das Schließverhalten des Ventils im Schlafmodus. Ein Wert von 1 bedeutet, dass das Ventil sofort schließt, sobald das Wasser den Bodenfeuchtesensor erreicht und die Bodenfeuchte über den Öffnungsschwellwert steigt. Jeder höhere Wert verlängert die Zeit, die das Ventil nach Überschreiten des Schwellenwerts (wenn das Wasser den Sensor erreicht) zusätzlich geöffnet bleibt, um jeweils 50 %.',
    detailed: 'Beispiel: Der Sensor ist in einer Tiefe von 10 cm im Boden platziert. Ist der Multiplikator auf 1 gesetzt, schließt das Ventil sofort, wenn das Wasser den Sensor erreicht, sodass die ersten 10 cm des Bodens bewässert werden. Ist der Multiplikator auf 3 gesetzt, bleibt das Ventil für zusätzliche 100 % (2x) der Zeit geöffnet, die das Wasser benötigt, um den Sensor zu erreichen. Dadurch kann das Wasser bis zu 20 cm tief in den Boden eindringen, bevor das Ventil schließt. Dies ist nützlich für eine tiefere Bewässerung, ohne den Sensor umsetzen zu müssen. Diese Einstellung ist nur wirksam wenn das Ventil im Schlafmodus ist.'
  },
  SHOWSOILMOISTURE: {
    uiLabel: "Aktuelle Bodenfeuchte anzeigen",
    desc: 'Der aktuelle Bodenfeuchtewert wird durch die Anzahl der grünen LED-Blinks angezeigt, von 1 (extrem trocken) bis 9 (gesättigt). Das Ventil öffnet, wenn die gemessene Bodenfeuchte kleiner oder gleich dem eingestellten Öffnungsschwellwert ist.'
  },
  ERRORSTATE: {
    uiLabel: "Fehlerzustand",
    desc: 'Es ist ein Fehler aufgetreten. Bitte das Gerät zurücksetzen.'
  },
  TRANSITION: {
    uiLabel: "",
    desc: ''
  },
};

export const possibleActions = {
  OFF: [
    { label: 'Sehr langer Tastendruck', color: '#f44336', targetState: 'BATTERY', desc: 'Gerät einschalten' },
  ],
  BATTERY: [
    { label: 'Kurzer Tastendruck', color: '#4caf50', targetState: 'SHOWSOILMOISTURE', desc: 'Aktuelle Bodenfeuchte anzeigen' },
    { label: 'Langer Tastendruck', color: '#ff9800', targetState: 'SELECTTHRESHOLD', desc: 'Bewässerungseinstellungen ändern' },
    { label: 'Sehr langer Tastendruck', color: '#f44336', targetState: 'OFF', desc: 'Gerät ausschalten' },
  ],
  MANUAL: [
    { label: 'Kurzer Tastendruck', color: '#4caf50', targetState: 'SHOWSOILMOISTURE', desc: 'Ventil schließen und Bodenfeuchte anzeigen' },
    { label: 'Sehr langer Tastendruck', color: '#f44336', targetState: 'OFF', desc: 'Gerät ausschalten' },
  ],
  SLEEP: [
    { label: 'Kurzer Tastendruck', color: '#4caf50', targetState: 'BATTERY', desc: 'Gerät aufwecken' },
  ],
  SELECTTHRESHOLD: [
    { label: 'Kurzer Tastendruck', color: '#4caf50', targetState: 'SELECTMULTIPLICATOR', desc: 'Zu Multiplikator wechseln' },
    { label: 'Langer Tastendruck', color: '#ff9800', targetState: 'CHANGETHRESHOLD', desc: 'Öffnungsschwellwert anpassen' },
    { label: 'Sehr langer Tastendruck', color: '#f44336', targetState: 'OFF', desc: 'Gerät ausschalten' },
  ],
  SELECTMULTIPLICATOR: [
    { label: 'Kurzer Tastendruck', color: '#4caf50', targetState: 'SELECTTHRESHOLD', desc: 'Zu Öffnungsschwellwert wechseln' },
    { label: 'Langer Tastendruck', color: '#ff9800', targetState: 'CHANGEMULTIPLICATOR', desc: 'Multiplikator anpassen' },
    { label: 'Sehr langer Tastendruck', color: '#f44336', targetState: 'OFF', desc: 'Gerät ausschalten' },
  ],
  CHANGETHRESHOLD: [
    { label: 'Kurzer Tastendruck', color: '#4caf50', targetState: 'CHANGETHRESHOLD', desc: 'Öffnungsschwellwert erhöhen' },
    { label: 'Langer Tastendruck', color: '#ff9800', targetState: 'SLEEP', desc: 'Einstellung speichern und in den Schlafmodus wechseln' },
  ],
  CHANGEMULTIPLICATOR: [
    { label: 'Kurzer Tastendruck', color: '#4caf50', targetState: 'CHANGEMULTIPLICATOR', desc: 'Multiplikator erhöhen' },
    { label: 'Langer Tastendruck', color: '#ff9800', targetState: 'SLEEP', desc: 'Einstellung speichern und in den Schlafmodus wechseln' },
  ],
  SHOWSOILMOISTURE: [
    { label: 'Kurzer Tastendruck', color: '#4caf50', targetState: 'BATTERY', desc: 'Batteriestand anzeigen' },
    { label: 'Langer Tastendruck', color: '#ff9800', targetState: 'MANUAL', desc: 'Ventil manuell öffnen' },
    { label: 'Sehr langer Tastendruck', color: '#f44336', targetState: 'OFF', desc: 'Gerät ausschalten' },
  ],
  ERRORSTATE: [
    { label: 'Sehr langer Tastendruck', color: '#f44336', targetState: 'OFF', desc: 'Gerät zurücksetzen' },
  ],
  TRANSITION: [],
};

export const uiText = {
  mainHeading: "OpenValve UI",
  pressToStart: "Zum Starten bitte die Taste drücken",
  sliderInfoText: (soilLevel) =>
    `Verwenden Sie den Schieberegler unten, um den Bodenfeuchtesensor zu simulieren. Durch das Anpassen dieses Wertes wird das Ventil entsprechend dem eingestellten Öffnungsschwellwert geöffnet oder geschlossen. Der aktuelle Schwellwert ist ${soilLevel}; wenn der Schieberegler auf ${soilLevel} oder weniger eingestellt ist, öffnet das Ventil, bei höheren Werten schließt es.`,
  sliderLabel: "Bodenfeuchte:",
  detailedShowMore: "Mehr anzeigen",
  detailedShowLess: "Weniger anzeigen",
  valveOpened: "Ventil geöffnet",
  valveClosed: "Ventil geschlossen",
  openingThresholdLabel: "Öffnungsschwellwert:",
  multiplicatorLabel: "Multiplikator:",
  pressTypeShort: "Kurzer Tastendruck",
  pressTypeLong: "Langer Tastendruck",
  pressTypeVeryLong: "Sehr langer Tastendruck",
};
