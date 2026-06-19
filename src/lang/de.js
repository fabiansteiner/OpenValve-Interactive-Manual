// German language pack (full, descriptive translation)
export const stateDescriptions = {
  OFF: {
    uiLabel: "Ausgeschaltet",
    desc: 'Das Gerät ist ausgeschaltet. Das Ventil ist geschlossen.'
  },
  BATTERY: {
    uiLabel: "Batteriestand anzeigen",
    desc: 'Die obere LED zeigt den Batteriestatus an: Grün für voll, Orange für mittel, Rot für niedrig, rot blinkend für sehr niedrig.',
    detailed: 'Die Batterieanzeige gibt Auskunft über die verbleibende Batterielaufzeit: Grün bedeutet mehr als 2 Monate Restlaufzeit, Orange mehr als 1 Monat, Rot weniger als 1 Monat und rot blinkend bedeutet, dass die Batterie fast leer ist. Bei längerer Abwesenheit sollte die Batterie gewechselt werden, wenn die Anzeige rot blinkt. Bei regelmäßiger Kontrolle kann der Wechsel bis zur vollständigen Entladung hinausgezögert werden (OpenValve hört auf zu arbeiten und wechselt in einen Fehlerzustand).'
  },
  MANUAL: {
    uiLabel: "Manuell geöffnet",
    desc: 'Das Ventil wurde manuell vom Benutzer geöffnet. Die blaue LED blinkt langsam. Es bleibt unabhängig von der aktuellen Bodenfeuchte geöffnet, bis entweder ein kurzer Tastendruck erfolgt oder 15 Minuten vergangen sind.',
    detailed: 'Der manuelle Modus ermöglicht eine sofortige Bewässerung, unabhängig von den aktuellen Bodenfeuchtewerten. Die manuelle Bewässerung kann für dringende Bewässerungen, Systemtests oder zur Überprüfung des Wasserflusses nützlich sein. Das Ventil schließt automatisch nach 15 Minuten oder wenn die Taste erneut gedrückt wird.'
  },
  SLEEP: {
    uiLabel: "Schlafmodus",
    desc: 'In diesem Zustand bewässert OpenValve normal gemäß den konfigurierten Benutzereinstellungen. Er heißt "Schlafmodus", weil OpenValve sehr langsam auf Änderungen der Bodenfeuchte reagiert, um die Batterie zu schonen. Jedes Mal, wenn OpenValve eine neue Bodenfeuchtemessung vom Sensor aufnimmt, blinkt die blaue LED kurz.',
    detailed: 'Wenn das Ventil geschlossen ist, führt OpenValve jede Stunde eine neue Bodenfeuchtemessung durch. Wenn das Ventil geöffnet ist, misst OpenValve in den ersten 3 Minuten alle 4 Sekunden, bis zu 10 Minuten alle 16 Sekunden und danach alle 60 Sekunden.'
  },
  SELECTTHRESHOLD: {
    uiLabel: "Öffnungsschwellenwert wählen",
    desc: 'Wählen Sie zwischen dem Öffnungsschwellenwert und der Einstellung für Zusätzliche Zeit.'
  },
  SELECTMULTIPLICATOR: {
    uiLabel: "Zusätzliche Zeit wählen",
    desc: 'Wählen Sie zwischen dem Öffnungsschwellenwert und der Einstellung für Zusätzliche Zeit.'
  },
  CHANGETHRESHOLD: {
    uiLabel: "Öffnungsschwellenwert ändern:",
    desc: 'Der Öffnungsschwellenwert bestimmt, wann die Bewässerung startet: niedriger Wert = später (trockener), höherer Wert = früher (feuchter). Der Wert wird durch die Anzahl grüner LED-Blinks der oberen LED angezeigt. Das Ventil öffnet, wenn die aktuelle Bodenfeuchte auf oder unter dem Öffnungsschwellenwert liegt, und schließt, wenn die Bodenfeuchte darüber liegt.',
    detailed: 'Die Werte des Öffnungsschwellenwerts reichen von 1 bis 8 und bestimmen, wie früh die Bewässerung startet: niedrige Werte bewässern später (trockenerer Boden), hohe Werte früher (feuchterer Boden). In der Praxis wartet Wert 1, bis der Boden sehr trocken ist, während Wert 8 deutlich früher bewässert. Beispiel: Bei Schwellenwert 4 öffnet das Ventil bei Bodenfeuchte 4 oder darunter und schließt oberhalb von 4. Änderungen werden sofort angewendet, ein zusätzlicher Speicherschritt ist nicht nötig.'
  },
  CHANGEMULTIPLICATOR: {
    uiLabel: "Zusätzliche Zeit ändern:",
    desc: 'Zusätzliche Zeit steuert, wie lange das Ventil nach Erreichen des Sensors durch Wasser weiter geöffnet bleibt. Der Wert reicht von 1 bis 5 und wirkt sich nur im Schlafmodus auf die Bewässerung aus. 1 = keine zusätzliche Zeit, 2 = +50% zusätzliche Zeit, 3 = +100% zusätzliche Zeit, 4 = +150% zusätzliche Zeit, 5 = +200% zusätzliche Zeit.',
    detailed: 'Wenn OpenValve öffnet, misst es zunächst, wie lange es dauert, bis die Bodenfeuchte am Sensor über den Öffnungsschwellenwert steigt. Anschließend wird basierend auf dieser Einstellung zusätzliche Bewässerungszeit hinzugefügt. Beispiel: Erreicht Wasser den Sensor nach 10 Minuten Bewässerung, beträgt die gesamte Bewässerungszeit 10 Min. (keine Zusatzzeit) bei Zusätzliche Zeit 1, 15 Min. (+50%) bei 2, 20 Min. (+100%) bei 3, 25 Min. (+150%) bei 4 und 30 Min. (+200%) bei 5. Niedrige Werte bewässern kürzer, höhere Werte länger und gründlicher.'
  },
  SHOWSOILMOISTURE: {
    uiLabel: "Aktuelle Bodenfeuchte anzeigen",
    desc: 'Die aktuelle Bodenfeuchte wird durch die Anzahl grüner LED-Blinks der oberen LED angezeigt, von 1 (extrem trocken) bis 9 (gesättigt). Das Ventil öffnet, wenn die aktuelle Bodenfeuchte kleiner oder gleich dem eingestellten "Öffnungsschwellenwert" ist.'
  },
  ERRORSTATE: {
    uiLabel: "Fehlerzustand",
    desc: 'Es ist ein Fehler aufgetreten. Bitte Gerät zurücksetzen.'
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
    { label: 'Sehr langer Tastendruck', color: '#f44336', targetState: 'OFF', desc: 'Ausschalten' },
  ],
  MANUAL: [
    { label: 'Kurzer Tastendruck', color: '#4caf50', targetState: 'SHOWSOILMOISTURE', desc: 'Ventil schließen und aktuelle Bodenfeuchte anzeigen' },
    { label: 'Sehr langer Tastendruck', color: '#f44336', targetState: 'OFF', desc: 'Ausschalten' },
  ],
  SLEEP: [
    { label: 'Kurzer Tastendruck', color: '#4caf50', targetState: 'BATTERY', desc: 'Batteriestand anzeigen' },
  ],
  SELECTTHRESHOLD: [
    { label: 'Kurzer Tastendruck', color: '#4caf50', targetState: 'SELECTMULTIPLICATOR', desc: 'Zusätzliche Zeit auswählen' },
    { label: 'Langer Tastendruck', color: '#ff9800', targetState: 'CHANGETHRESHOLD', desc: 'Öffnungsschwellenwert ändern' },
    { label: 'Sehr langer Tastendruck', color: '#f44336', targetState: 'OFF', desc: 'Ausschalten' },
  ],
  SELECTMULTIPLICATOR: [
    { label: 'Kurzer Tastendruck', color: '#4caf50', targetState: 'SELECTTHRESHOLD', desc: 'Öffnungsschwellenwert auswählen' },
    { label: 'Langer Tastendruck', color: '#ff9800', targetState: 'CHANGEMULTIPLICATOR', desc: 'Zusätzliche Zeit ändern' },
    { label: 'Sehr langer Tastendruck', color: '#f44336', targetState: 'OFF', desc: 'Ausschalten' },
  ],
  CHANGETHRESHOLD: [
    { label: 'Kurzer Tastendruck', color: '#4caf50', targetState: 'CHANGETHRESHOLD', desc: 'Öffnungsschwellenwert erhöhen' },
    { label: 'Langer Tastendruck', color: '#ff9800', targetState: 'SLEEP', desc: 'Schlafmodus' },
  ],
  CHANGEMULTIPLICATOR: [
    { label: 'Kurzer Tastendruck', color: '#4caf50', targetState: 'CHANGEMULTIPLICATOR', desc: 'Zusätzliche Zeit erhöhen' },
    { label: 'Langer Tastendruck', color: '#ff9800', targetState: 'SLEEP', desc: 'Schlafmodus' },
  ],
  SHOWSOILMOISTURE: [
    { label: 'Kurzer Tastendruck', color: '#4caf50', targetState: 'BATTERY', desc: 'Batteriestand anzeigen' },
    { label: 'Langer Tastendruck', color: '#ff9800', targetState: 'MANUAL', desc: 'Ventil manuell öffnen' },
    { label: 'Sehr langer Tastendruck', color: '#f44336', targetState: 'OFF', desc: 'Ausschalten' },
  ],
  ERRORSTATE: [
    { label: 'Sehr langer Tastendruck', color: '#f44336', targetState: 'OFF', desc: 'Gerät zurücksetzen' },
  ],
  TRANSITION: [],
};

export const uiText = {
  mainHeading: "Interaktives Handbuch",
  pressToStart: "Zum Starten Taste drücken",
  sliderInfoText: (soilLevel) =>
    `Verwenden Sie den Schieberegler unten, um die aktuelle Bodenfeuchte zu simulieren. Das Verstellen des Schiebereglers hat denselben Effekt wie das Hinein- und Herausbewegen des Bodenfeuchtesensors in ein volles Glas Wasser am realen Gerät. Das Anpassen dieses Werts öffnet oder schließt das Ventil abhängig vom konfigurierten Öffnungsschwellenwert. Der Öffnungsschwellenwert ist aktuell auf ${soilLevel} gesetzt: Das bedeutet, dass das Ventil bei ${soilLevel} oder darunter öffnet, bei Werten darüber schließt es.`,
  sliderLabel: "Bodenfeuchte:",
  detailedShowMore: "Mehr anzeigen",
  detailedShowLess: "Weniger anzeigen",
  valveOpened: "Ventil geöffnet",
  valveClosed: "Ventil geschlossen",
  openingThresholdLabel: "Aktueller Öffnungsschwellenwert:",
  currentSoilMoistureLabel: "Aktuelle Bodenfeuchte:",
  pressTypeShort: "Kurzer Tastendruck",
  pressTypeLong: "Langer Tastendruck",
  pressTypeVeryLong: "Sehr langer Tastendruck",
};
