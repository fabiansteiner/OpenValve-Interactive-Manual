// English language pack
export const stateDescriptions = {
  OFF: {
    uiLabel: "Off",
    desc: 'Device is off. Valve is closed.'
  },
  BATTERY: {
    uiLabel: "Display Battery Level",
    desc: 'The upper LED indicates the battery status: green for full, orange for medium, red for low, red blinking for very low.',
    detailed: 'The battery indicator provides info regarding the remaining battery life: green indicates more than 2 months of operation remaining, orange indicates more than 1 month, red indicates less than 1 month and red blinking indicates that the battery is almost depleted. Before longer absences, replace the battery when the indicator is blinking red. If regular monitoring is possible, replacement can be delayed until the battery is fully depleted (OpenValve stops working and switches to an error state).'
  },
  MANUAL: {
    uiLabel: "Manually Open",
    desc: 'The valve has been manually opened by the user. The blue LED is slowly blinking. It will remain open regardless of the current soil moisture until either a short button press occurs or 15 minutes have elapsed.',
    detailed: 'Manual mode allows immediate irrigation, independent of current soil moisture readings. This is useful for urgent watering needs, system testing, or verifying water flow. The valve will close automatically after 15 minutes or when the button is pressed again.'
  },
  SLEEP: {
    uiLabel: "Sleep",
    desc: 'In this state OpenValve waters normally following the configured user settings. It is called "sleep" state because it reacts very slowly to changes in the soil moisture to save battery. Every time OpenValve takes a new soil moisture measurement from the sensor, the blue LED briefly blinks.',
    detailed: 'When the valve is closed, OpenValve will take a new soil moisture measurement every hour. When the valve is openend, OpenValve will take measurements every 4 seconds the first 3 minutes, every 16 seconds until 10 minutes and every 60 seconds after that.'
  },
  SELECTTHRESHOLD: {
    uiLabel: "Select Opening Threshold",
    desc: 'Choose between the Opening Threshold or the Additional Time setting.'
  },
  SELECTMULTIPLICATOR: {
    uiLabel: "Select Additional Time",
    desc: 'Choose between the Opening Threshold or the Additional Time setting.'
  },
  CHANGETHRESHOLD: {
    uiLabel: "Change Opening Threshold:",
    desc: 'The Opening Threshold determines when watering starts: lower value = later (drier), higher value = earlier (wetter). The value is shown by the number of green LED blinks on the upper LED. The valve opens when current soil moisture is at or below the Opening Threshold, and closes when soil moisture is above it.',
    detailed: 'Opening Threshold values run from 1 to 8 and define how early watering starts: low values water later (drier soil), high values water earlier (wetter soil). In practice, 1 waits until the soil is very dry, while 8 starts watering much earlier. Example: with threshold 4, the valve opens at soil moisture 4 or lower, and closes above 4. Changes are applied immediately, so no extra save step is needed.'
  },
  CHANGEMULTIPLICATOR: {
    uiLabel: "Change Additional Time:",
    desc: 'Additional Time controls how much longer the valve stays open after water reaches the sensor. It ranges from 1 to 5 and affects watering only in the sleep state. 1 = no extra time, 2 = +50% extra time, 3 = +100% extra time, 4 = +150% extra time, 5 = +200% extra time.',
    detailed: 'When OpenValve opens, it starts measuring how long it takes until the soil moisture at the sensor rises above the Opening Threshold. It then adds extra watering time based on this setting. Example: if water reaches the sensor after 10 minutes of watering, total watering time becomes 10 min (no extra time) with Additional Time 1, 15 min (+50%)  with 2, 20 min (+100%)  with 3, 25 min (+150%) with 4, and 30 min (+200%) with 5. Use lower values to water shorter; use higher values for longer and more thorough watering.'
  },
  SHOWSOILMOISTURE: {
    uiLabel: "Display Current Soil Moisture",
    desc: 'The Current Soil Moisture is indicated by the number of green LED blinks on the upper LED, ranging from 1 (extremely dry) to 9 (saturated). The valve will open whenever the current soil moisture is less than or equal to the set "Opening Threshold".'
  },
  ERRORSTATE: {
    uiLabel: "Error State",
    desc: 'An error has occurred. Please reset Device.'
  },
  TRANSITION: {
    uiLabel: "",
    desc: ''
  },
};

export const possibleActions = {
  OFF: [
    { label: 'Very Long Press', color: '#f44336', targetState: 'BATTERY', desc: 'Turn on device' },
  ],
  BATTERY: [
    { label: 'Short Press', color: '#4caf50', targetState: 'SHOWSOILMOISTURE', desc: 'Display Current Soil Moisture' },
    { label: 'Long Press', color: '#ff9800', targetState: 'SELECTTHRESHOLD', desc: 'Change Irrigation Settings' },
    { label: 'Very Long Press', color: '#f44336', targetState: 'OFF', desc: 'Turn Off' },
  ],
  MANUAL: [
    { label: 'Short Press', color: '#4caf50', targetState: 'SHOWSOILMOISTURE', desc: 'Close Valve and Display Current Soil Moisture' },
    { label: 'Very Long Press', color: '#f44336', targetState: 'OFF', desc: 'Turn Off' },
  ],
  SLEEP: [
    { label: 'Short Press', color: '#4caf50', targetState: 'BATTERY', desc: 'Display Battery Level' },
  ],
  SELECTTHRESHOLD: [
    { label: 'Short Press', color: '#4caf50', targetState: 'SELECTMULTIPLICATOR', desc: 'Select Additional Time' },
    { label: 'Long Press', color: '#ff9800', targetState: 'CHANGETHRESHOLD', desc: 'Change Opening Threshold' },
    { label: 'Very Long Press', color: '#f44336', targetState: 'OFF', desc: 'Turn Off' },
  ],
  SELECTMULTIPLICATOR: [
    { label: 'Short Press', color: '#4caf50', targetState: 'SELECTTHRESHOLD', desc: 'Select Opening Threshold' },
    { label: 'Long Press', color: '#ff9800', targetState: 'CHANGEMULTIPLICATOR', desc: 'Change Additional Time' },
    { label: 'Very Long Press', color: '#f44336', targetState: 'OFF', desc: 'Turn Off' },
  ],
  CHANGETHRESHOLD: [
    { label: 'Short Press', color: '#4caf50', targetState: 'CHANGETHRESHOLD', desc: 'Increase Opening Threshold' },
    { label: 'Long Press', color: '#ff9800', targetState: 'SLEEP', desc: 'Sleep' },
  ],
  CHANGEMULTIPLICATOR: [
    { label: 'Short Press', color: '#4caf50', targetState: 'CHANGEMULTIPLICATOR', desc: 'Increase Additional Time' },
    { label: 'Long Press', color: '#ff9800', targetState: 'SLEEP', desc: 'Sleep' },
  ],
  SHOWSOILMOISTURE: [
    { label: 'Short Press', color: '#4caf50', targetState: 'BATTERY', desc: 'Display Battery Level' },
    { label: 'Long Press', color: '#ff9800', targetState: 'MANUAL', desc: 'Manually opens the valve' },
    { label: 'Very Long Press', color: '#f44336', targetState: 'OFF', desc: 'Turn Off' },
  ],
  ERRORSTATE: [
    { label: 'Very Long Press', color: '#f44336', targetState: 'OFF', desc: 'Reset Device' },
  ],
  TRANSITION: [],
};

export const uiText = {
  mainHeading: "Interactive Manual",
  pressToStart: "Press Button to get started",
  sliderInfoText: (soilLevel) =>
    `Use the slider below to simulate the current soil moisture. Adjusting the slider has the same effect as dipping the soil moisture sensor in and out of a full glass of water on the real device. Adjusting this value will open or close the valve based on the configured Opening Threshold. The Opening Threshold is currently set to ${soilLevel}: That means setting the slider to ${soilLevel} or below will open the valve, while values above ${soilLevel} will close it.`,
  sliderLabel: "Soil Moisture:",
  detailedShowMore: "Show more",
  detailedShowLess: "Show less",
  valveOpened: "Valve opened",
  valveClosed: "Valve closed",
  pressTypeShort: "Short Press",
  pressTypeLong: "Long Press",
  pressTypeVeryLong: "Very Long Press",
  pressConfirmed: "confirmed",
};

