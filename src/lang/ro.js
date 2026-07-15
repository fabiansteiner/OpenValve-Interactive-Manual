// Romanian language pack (full, descriptive translation)
export const stateDescriptions = {
  OFF: {
    uiLabel: "Oprit",
    desc: 'Dispozitivul este oprit. Supapa este închisă.'
  },
  BATTERY: {
    uiLabel: "Afișare nivel baterie",
    desc: 'LED-ul superior indică starea bateriei: verde pentru plină, portocaliu pentru medie, roșu pentru scăzută, roșu intermitent pentru foarte scăzută.',
    detailed: 'Indicatorul bateriei oferă informații despre autonomia rămasă: verde indică peste 2 luni de funcționare rămase, portocaliu peste 1 lună, roșu sub 1 lună, iar roșu intermitent indică faptul că bateria este aproape descărcată. Înaintea absențelor mai lungi, înlocuiți bateria când indicatorul clipește roșu. Dacă monitorizarea regulată este posibilă, înlocuirea poate fi amânată până la descărcarea completă (OpenValve se oprește și trece în stare de eroare).'
  },
  MANUAL: {
    uiLabel: "Deschidere manuală",
    desc: 'Supapa a fost deschisă manual de utilizator. LED-ul albastru clipește lent. Va rămâne deschisă indiferent de umiditatea actuală a solului până la o apăsare scurtă sau până la trecerea a 15 minute.',
    detailed: 'Modul manual permite irigarea imediată, indiferent de valorile actuale ale umidității solului. Acest lucru este util pentru udări urgente, testarea sistemului sau verificarea fluxului de apă. Supapa se va închide automat după 15 minute sau la o nouă apăsare a butonului.'
  },
  SLEEP: {
    uiLabel: "Mod repaus",
    desc: 'În această stare, OpenValve udă normal conform setărilor configurate de utilizator. Se numește „mod repaus” deoarece reacționează foarte lent la schimbările de umiditate a solului pentru a economisi bateria. De fiecare dată când OpenValve preia o nouă măsurătoare de umiditate de la senzor, LED-ul albastru clipește scurt.',
    detailed: 'Când supapa este închisă, OpenValve efectuează o nouă măsurătoare a umidității solului la fiecare oră. Când supapa este deschisă, OpenValve măsoară la fiecare 4 secunde în primele 3 minute, la fiecare 16 secunde până la 10 minute și la fiecare 60 de secunde după aceea.'
  },
  SELECTTHRESHOLD: {
    uiLabel: "Selectează pragul de deschidere",
    desc: 'Alegeți între Pragul de deschidere și setarea Timp suplimentar.'
  },
  SELECTMULTIPLICATOR: {
    uiLabel: "Selectează Timp suplimentar",
    desc: 'Alegeți între Pragul de deschidere și setarea Timp suplimentar.'
  },
  CHANGETHRESHOLD: {
    uiLabel: "Modifică Pragul de deschidere:",
    desc: 'Pragul de deschidere determină când începe udarea: valoare mai mică = mai târziu (mai uscat), valoare mai mare = mai devreme (mai umed). Valoarea este indicată de numărul de clipiri verzi ale LED-ului superior. Supapa se deschide când umiditatea curentă a solului este la sau sub Pragul de deschidere și se închide când umiditatea solului este peste acest prag.',
    detailed: 'Valorile Pragului de deschidere sunt între 1 și 8 și definesc cât de devreme începe udarea: valorile mici udă mai târziu (sol mai uscat), valorile mari udă mai devreme (sol mai umed). În practică, valoarea 1 așteaptă până când solul este foarte uscat, iar valoarea 8 începe udarea mult mai devreme. Exemplu: cu pragul setat la 4, supapa se deschide la umiditate 4 sau mai mică și se închide peste 4. Modificările se aplică imediat, fără pas suplimentar de salvare.'
  },
  CHANGEMULTIPLICATOR: {
    uiLabel: "Modifică Timpul suplimentar:",
    desc: 'Timpul suplimentar controlează cât timp rămâne supapa deschisă după ce apa ajunge la senzor. Valoarea este între 1 și 5 și afectează udarea doar în modul repaus. 1 = fără timp suplimentar, 2 = +50% timp suplimentar, 3 = +100% timp suplimentar, 4 = +150% timp suplimentar, 5 = +200% timp suplimentar.',
    detailed: 'Când OpenValve se deschide, începe să măsoare cât timp durează până când umiditatea solului la senzor crește peste Pragul de deschidere. Apoi adaugă timp suplimentar de udare pe baza acestei setări. Exemplu: dacă apa ajunge la senzor după 10 minute de udare, timpul total de udare devine 10 min (fără timp suplimentar) cu Timp suplimentar 1, 15 min (+50%) cu 2, 20 min (+100%) cu 3, 25 min (+150%) cu 4 și 30 min (+200%) cu 5. Valorile mai mici udă mai puțin, iar valorile mai mari udă mai mult și mai profund.'
  },
  SHOWSOILMOISTURE: {
    uiLabel: "Afișează umiditatea solului",
    desc: 'Umiditatea curentă a solului este indicată de numărul de clipiri verzi ale LED-ului superior, de la 1 (extrem de uscat) la 9 (saturat). Supapa se deschide ori de câte ori umiditatea curentă a solului este mai mică sau egală cu "Pragul de deschidere" setat.'
  },
  ERRORSTATE: {
    uiLabel: "Stare de eroare",
    desc: 'A apărut o eroare. Vă rugăm să resetați Dispozitivul.'
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
    { label: 'Apăsare scurtă', color: '#4caf50', targetState: 'SHOWSOILMOISTURE', desc: 'Afișează Umiditatea curentă a solului' },
    { label: 'Apăsare lungă', color: '#ff9800', targetState: 'SELECTTHRESHOLD', desc: 'Modifică Setările de irigare' },
    { label: 'Apăsare foarte lungă', color: '#f44336', targetState: 'OFF', desc: 'Oprește' },
  ],
  MANUAL: [
    { label: 'Apăsare scurtă', color: '#4caf50', targetState: 'SHOWSOILMOISTURE', desc: 'Închide supapa și Afișează Umiditatea curentă a solului' },
    { label: 'Apăsare foarte lungă', color: '#f44336', targetState: 'OFF', desc: 'Oprește' },
  ],
  SLEEP: [
    { label: 'Apăsare scurtă', color: '#4caf50', targetState: 'BATTERY', desc: 'Afișează Nivelul bateriei' },
  ],
  SELECTTHRESHOLD: [
    { label: 'Apăsare scurtă', color: '#4caf50', targetState: 'SELECTMULTIPLICATOR', desc: 'Selectează Timp suplimentar' },
    { label: 'Apăsare lungă', color: '#ff9800', targetState: 'CHANGETHRESHOLD', desc: 'Modifică Pragul de deschidere' },
    { label: 'Apăsare foarte lungă', color: '#f44336', targetState: 'OFF', desc: 'Oprește' },
  ],
  SELECTMULTIPLICATOR: [
    { label: 'Apăsare scurtă', color: '#4caf50', targetState: 'SELECTTHRESHOLD', desc: 'Selectează Pragul de deschidere' },
    { label: 'Apăsare lungă', color: '#ff9800', targetState: 'CHANGEMULTIPLICATOR', desc: 'Modifică Timpul suplimentar' },
    { label: 'Apăsare foarte lungă', color: '#f44336', targetState: 'OFF', desc: 'Oprește' },
  ],
  CHANGETHRESHOLD: [
    { label: 'Apăsare scurtă', color: '#4caf50', targetState: 'CHANGETHRESHOLD', desc: 'Creșteți pragul de deschidere' },
    { label: 'Apăsare lungă', color: '#ff9800', targetState: 'SLEEP', desc: 'Mod repaus' },
  ],
  CHANGEMULTIPLICATOR: [
    { label: 'Apăsare scurtă', color: '#4caf50', targetState: 'CHANGEMULTIPLICATOR', desc: 'Crește Timpul suplimentar' },
    { label: 'Apăsare lungă', color: '#ff9800', targetState: 'SLEEP', desc: 'Mod repaus' },
  ],
  SHOWSOILMOISTURE: [
    { label: 'Apăsare scurtă', color: '#4caf50', targetState: 'BATTERY', desc: 'Afișează Nivelul bateriei' },
    { label: 'Apăsare lungă', color: '#ff9800', targetState: 'MANUAL', desc: 'Deschide supapa manual' },
    { label: 'Apăsare foarte lungă', color: '#f44336', targetState: 'OFF', desc: 'Oprește' },
  ],
  ERRORSTATE: [
    { label: 'Apăsare foarte lungă', color: '#f44336', targetState: 'OFF', desc: 'Resetează Dispozitivul' },
  ],
  TRANSITION: [],
};

export const uiText = {
  mainHeading: "Manual Interactiv",
  pressToStart: "Apăsați butonul pentru a începe",
  sliderInfoText: (soilLevel) =>
    `Folosiți sliderul de mai jos pentru a simula umiditatea curentă a solului. Ajustarea sliderului are același efect ca introducerea și scoaterea senzorului de umiditate într-un pahar plin cu apă pe dispozitivul real. Ajustarea acestei valori va deschide sau închide supapa în funcție de Pragul de deschidere configurat. Pragul de deschidere este setat în prezent la ${soilLevel}: Asta înseamnă că setarea sliderului la ${soilLevel} sau mai puțin va deschide supapa, iar valorile peste ${soilLevel} o vor închide.`,
  sliderLabel: "Umiditate sol:",
  detailedShowMore: "Afișează mai mult",
  detailedShowLess: "Afișează mai puțin",
  valveOpened: "Supapa a fost deschisă",
  valveClosed: "Supapa a fost închisă",
  openingThresholdLabel: "Pragul curent de deschidere:",
  currentSoilMoistureLabel: "Umiditatea curentă a solului:",
  pressTypeShort: "Apăsare scurtă",
  pressTypeLong: "Apăsare lungă",
  pressTypeVeryLong: "Apăsare foarte lungă",
  pressConfirmed: "confirmată",
};
