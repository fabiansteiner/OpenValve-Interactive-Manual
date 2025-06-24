// Romanian language pack (full, descriptive translation)
export const stateDescriptions = {
  OFF: {
    uiLabel: "Oprit",
    desc: 'Dispozitivul este oprit. Supapa este închisă.'
  },
  BATTERY: {
    uiLabel: "Afișare nivel baterie",
    desc: 'LED-ul superior indică starea bateriei: verde pentru plin, portocaliu pentru mediu și roșu pentru descărcat.',
    detailed: 'Indicatorul de baterie oferă informații pentru înlocuirea bateriei: verde indică peste 3 luni de funcționare rămase, portocaliu peste 1 lună, iar roșu sub 1 lună (dispozitivul rămâne funcțional). Pentru absențe prelungite, înlocuiți bateria când indicatorul devine roșu. Dacă monitorizarea este regulată, înlocuirea poate fi amânată până când indicatorul clipește roșu, semnalând descărcarea completă a bateriei.'
  },
  MANUAL: {
    uiLabel: "Deschidere manuală",
    desc: 'Supapa a fost deschisă manual de utilizator. Va rămâne deschisă indiferent de umiditatea solului până la o apăsare scurtă sau după 15 minute.',
    detailed: 'Modul manual permite irigarea imediată, indiferent de valorile actuale ale umidității solului. Acest lucru este util pentru udări urgente, testarea sistemului sau verificarea fluxului de apă. Supapa se va închide automat după 15 minute sau la o nouă apăsare a butonului.'
  },
  SLEEP: {
    uiLabel: "Mod repaus",
    desc: 'OpenValve este în modul repaus. Supapa se deschide/închide conform setărilor utilizatorului. În modul repaus, OpenValve reacționează mai lent la schimbările de umiditate a solului pentru a economisi bateria. De fiecare dată când OpenValve efectuează o nouă măsurare a umidității solului, LED-ul albastru clipește scurt.'
  },
  SELECTTHRESHOLD: {
    uiLabel: "Selectează pragul de deschidere",
    desc: 'Alegeți dacă doriți să ajustați pragul de deschidere sau setarea multiplicatorului.'
  },
  SELECTMULTIPLICATOR: {
    uiLabel: "Selectează multiplicatorul",
    desc: 'Alegeți dacă doriți să ajustați pragul de deschidere sau setarea multiplicatorului.'
  },
  CHANGETHRESHOLD: {
    uiLabel: "Prag de deschidere:",
    desc: 'Pragul de deschidere, indicat de numărul de clipiri verzi ale LED-ului (1–8), definește cât de uscat trebuie să fie solul înainte de următoarea irigare. Dacă umiditatea măsurată este la sau sub acest prag, supapa se deschide. Dacă este peste, supapa se închide imediat când dispozitivul este activ (adică nu este în modul repaus sau oprit), sau după o întârziere (setată de multiplicator) în modul repaus.'
  },
  CHANGEMULTIPLICATOR: {
    uiLabel: "Multiplicator:",
    desc: 'Setarea curentă a multiplicatorului este indicată de numărul de clipiri portocalii ale LED-ului. Valoarea poate fi între 1 și 5. Această setare afectează comportamentul de închidere a supapei în modul repaus. O valoare de 1 înseamnă că supapa se închide imediat când apa ajunge la senzorul de umiditate și umiditatea solului crește peste pragul de deschidere. Fiecare valoare mai mare crește timpul în care supapa rămâne deschisă cu încă 50% după depășirea pragului (când apa ajunge la senzor).',
    detailed: 'De exemplu, senzorul este plasat în sol la o adâncime de 10 cm. Dacă multiplicatorul este setat la 1, supapa se închide imediat când apa ajunge la senzor, ceea ce înseamnă că primii 10 cm de sol sunt udați. Dacă multiplicatorul este setat la 3, supapa va rămâne deschisă pentru încă 100% (de două ori) din timpul necesar apei să ajungă la senzor, permițând apei să pătrundă până la 20 cm adâncime înainte de a se închide. Acest lucru este util pentru udarea mai profundă fără a repoziționa senzorul.'
  },
  SHOWSOILMOISTURE: {
    uiLabel: "Afișează umiditatea solului",
    desc: 'Nivelul actual al umidității solului este indicat de numărul de clipiri verzi ale LED-ului, de la 1 (extrem de uscat) la 9 (saturat). Supapa se va deschide ori de câte ori umiditatea măsurată este mai mică sau egală cu pragul de deschidere setat.'
  },
  ERRORSTATE: {
    uiLabel: "Stare de eroare",
    desc: 'A apărut o eroare. Vă rugăm să resetați dispozitivul.'
  },
  TRANSITION: {
    uiLabel: "",
    desc: ''
  },
};

export const possibleActions = {
  OFF: [
    { label: 'Apăsare foarte lungă', color: '#f44336', targetState: 'BATTERY', desc: 'Porniți dispozitivul' },
  ],
  BATTERY: [
    { label: 'Apăsare scurtă', color: '#4caf50', targetState: 'SHOWSOILMOISTURE', desc: 'Afișează umiditatea solului' },
    { label: 'Apăsare lungă', color: '#ff9800', targetState: 'SELECTTHRESHOLD', desc: 'Modificați setările de irigare' },
    { label: 'Apăsare foarte lungă', color: '#f44336', targetState: 'OFF', desc: 'Opriți dispozitivul' },
  ],
  MANUAL: [
    { label: 'Apăsare scurtă', color: '#4caf50', targetState: 'SHOWSOILMOISTURE', desc: 'Închideți supapa și afișați umiditatea solului' },
    { label: 'Apăsare foarte lungă', color: '#f44336', targetState: 'OFF', desc: 'Opriți dispozitivul' },
  ],
  SLEEP: [
    { label: 'Apăsare scurtă', color: '#4caf50', targetState: 'BATTERY', desc: 'Treziți dispozitivul' },
  ],
  SELECTTHRESHOLD: [
    { label: 'Apăsare scurtă', color: '#4caf50', targetState: 'SELECTMULTIPLICATOR', desc: 'Comutați la multiplicator' },
    { label: 'Apăsare lungă', color: '#ff9800', targetState: 'CHANGETHRESHOLD', desc: 'Ajustați pragul de deschidere' },
    { label: 'Apăsare foarte lungă', color: '#f44336', targetState: 'OFF', desc: 'Opriți dispozitivul' },
  ],
  SELECTMULTIPLICATOR: [
    { label: 'Apăsare scurtă', color: '#4caf50', targetState: 'SELECTTHRESHOLD', desc: 'Comutați la pragul de deschidere' },
    { label: 'Apăsare lungă', color: '#ff9800', targetState: 'CHANGEMULTIPLICATOR', desc: 'Ajustați multiplicatorul' },
    { label: 'Apăsare foarte lungă', color: '#f44336', targetState: 'OFF', desc: 'Opriți dispozitivul' },
  ],
  CHANGETHRESHOLD: [
    { label: 'Apăsare scurtă', color: '#4caf50', targetState: 'CHANGETHRESHOLD', desc: 'Creșteți pragul de deschidere' },
    { label: 'Apăsare lungă', color: '#ff9800', targetState: 'SLEEP', desc: 'Salvați setarea și treceți în modul repaus' },
  ],
  CHANGEMULTIPLICATOR: [
    { label: 'Apăsare scurtă', color: '#4caf50', targetState: 'CHANGEMULTIPLICATOR', desc: 'Creșteți multiplicatorul' },
    { label: 'Apăsare lungă', color: '#ff9800', targetState: 'SLEEP', desc: 'Salvați setarea și treceți în modul repaus' },
  ],
  SHOWSOILMOISTURE: [
    { label: 'Apăsare scurtă', color: '#4caf50', targetState: 'BATTERY', desc: 'Afișează nivelul bateriei' },
    { label: 'Apăsare lungă', color: '#ff9800', targetState: 'MANUAL', desc: 'Deschideți supapa manual' },
    { label: 'Apăsare foarte lungă', color: '#f44336', targetState: 'OFF', desc: 'Opriți dispozitivul' },
  ],
  ERRORSTATE: [
    { label: 'Apăsare foarte lungă', color: '#f44336', targetState: 'OFF', desc: 'Resetați dispozitivul' },
  ],
  TRANSITION: [],
};

export const uiText = {
  mainHeading: "OpenValve UI",
  pressToStart: "Apăsați butonul pentru a începe",
  sliderInfoText: (soilLevel) =>
    `Folosiți sliderul de mai jos pentru a simula senzorul de umiditate a solului. Ajustarea acestei valori va deschide sau închide supapa în funcție de pragul de deschidere configurat. Pragul curent este ${soilLevel}; setarea sliderului la ${soilLevel} sau mai puțin va deschide supapa, iar valorile peste ${soilLevel} o vor închide.`,
  sliderLabel: "Umiditate sol:",
  detailedShowMore: "Afișează mai mult",
  detailedShowLess: "Afișează mai puțin",
  valveOpened: "Supapa a fost deschisă",
  valveClosed: "Supapa a fost închisă",
  openingThresholdLabel: "Prag de deschidere:",
  multiplicatorLabel: "Multiplicator:",
  pressTypeShort: "Apăsare scurtă",
  pressTypeLong: "Apăsare lungă",
  pressTypeVeryLong: "Apăsare foarte lungă",
};
