// English language pack
export const stateDescriptions = {
  OFF: {
    uiLabel: "Off",
    desc: 'Device is off. Valve is closed.'
  },
  BATTERY: {
    uiLabel: "Display Battery Level",
    desc: 'The upper LED indicates the battery status: green for full, orange for medium, and red for low.',
    detailed: 'The battery indicator provides guidance for battery replacement: green indicates more than 3 months of operation remaining, orange indicates more than 1 month, and red indicates less than 1 month (device remains functional). For extended absences, replace the battery when the indicator turns red. If regular monitoring is possible, replacement can be delayed until the indicator blinks red, signaling the battery is depleted.'
  },
  MANUAL: {
    uiLabel: "Manually Open",
    desc: 'The valve has been manually opened by the user. It will remain open regardless of soil moisture until either a short button press occurs or 15 minutes have elapsed.',
    detailed: 'Manual mode allows immediate irrigation, independent of current soil moisture readings. This is useful for urgent watering needs, system testing, or verifying water flow. The valve will close automatically after 15 minutes or when the button is pressed again.'
  },
  SLEEP: {
    uiLabel: "Sleep",
    desc: 'OpenValve is in Sleep-Mode. The Valve opens/closes following the user settings. In Sleep-Mode OpenValve reacts slower to changes in the soil moisture to save battery. Every time OpenValve takes a new soil moisture measurement from the sensor, the blue LED blinks shortly.',
    detailed: 'When the valve is closed, OpenValve will take a new soil moisture measurement every hour. When the valve is openend, OpenValve will take measurements every 4 seconds the first 3 minutes, every 16 seconds until 10 minutes and every 60 seconds after that. The blue LED will blink shortly every time a new measurement is taken.'
  },
  SELECTTHRESHOLD: {
    uiLabel: "Select Opening Threshold",
    desc: 'Choose whether to adjust the opening threshold or the multiplicator setting.'
  },
  SELECTMULTIPLICATOR: {
    uiLabel: "Select Multiplicator",
    desc: 'Choose whether to adjust the opening threshold or the multiplicator setting.'
  },
  CHANGETHRESHOLD: {
    uiLabel: "Opening Threshold:",
    desc: 'The opening threshold, shown by the number of green LED blinks (1–8), defines how dry the soil must get before the next irrigation starts. If the measured soil moisture is at or below this threshold, the valve opens. If above, the valve closes immediately when the device is active (i.e., not in Sleep-Mode or Off), or after an optional delay (set by the multiplicator) in Sleep-Mode.'
  },
  CHANGEMULTIPLICATOR: {
    uiLabel: "Multiplicator:",
    desc: 'The current multiplicator setting is indicated by the number of orange LED blinks. The value can be between 1 and 5. This setting affects the valve closing behavior in Sleep-Mode. A value of 1 means the valve closes immediately when water reaches the soil moisture sensor and the soil moisture rises above the opening threshold. Each higher value increases the time the valve remains open by an additional 50% after the threshold is exceeded (when water reaches the sensor). ',
    detailed: 'For example, the sensor is placed in the soil at a depth of 10 cm. When the multiplicator is set to 1, the valve closes immediately when the water reaches the sensor, meaning that the first 10 cm of soil are watered. If the multiplicator is set to 3, the valve will remain open for an additional 100% (2x) the time it takes for the water to reach the sensor, allowing the water to penetrate 20 cm into the soil before closing. This is useful for deeper watering without needing to reposition the sensor.'
  },
  SHOWSOILMOISTURE: {
    uiLabel: "Display Current Soil Moisture",
    desc: 'The current soil moisture level is indicated by the number of green LED blinks, ranging from 1 (extremely dry) to 9 (saturated). The valve will open whenever the measured soil moisture is less than or equal to the set "Opening Threshold".'
  },
  ERRORSTATE: {
    uiLabel: "Error State",
    desc: 'An error has occurred. Please reset device.'
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
    { label: 'Short Press', color: '#4caf50', targetState: 'SHOWSOILMOISTURE', desc: 'Display current soil moisture' },
    { label: 'Long Press', color: '#ff9800', targetState: 'SELECTTHRESHOLD', desc: 'Change irrigation settings' },
    { label: 'Very Long Press', color: '#f44336', targetState: 'OFF', desc: 'Turn off' },
  ],
  MANUAL: [
    { label: 'Short Press', color: '#4caf50', targetState: 'SHOWSOILMOISTURE', desc: 'Close valve and display current soil moisture' },
    { label: 'Very Long Press', color: '#f44336', targetState: 'OFF', desc: 'Turn off' },
  ],
  SLEEP: [
    { label: 'Short Press', color: '#4caf50', targetState: 'BATTERY', desc: 'Wake up' },
  ],
  SELECTTHRESHOLD: [
    { label: 'Short Press', color: '#4caf50', targetState: 'SELECTMULTIPLICATOR', desc: 'Switch to multiplicator' },
    { label: 'Long Press', color: '#ff9800', targetState: 'CHANGETHRESHOLD', desc: 'Adjust opening treshold' },
    { label: 'Very Long Press', color: '#f44336', targetState: 'OFF', desc: 'Turn off' },
  ],
  SELECTMULTIPLICATOR: [
    { label: 'Short Press', color: '#4caf50', targetState: 'SELECTTHRESHOLD', desc: 'Switch to opening threshold' },
    { label: 'Long Press', color: '#ff9800', targetState: 'CHANGEMULTIPLICATOR', desc: 'Adjust multiplicator' },
    { label: 'Very Long Press', color: '#f44336', targetState: 'OFF', desc: 'Turn off' },
  ],
  CHANGETHRESHOLD: [
    { label: 'Short Press', color: '#4caf50', targetState: 'CHANGETHRESHOLD', desc: 'Increase opening threshold' },
    { label: 'Long Press', color: '#ff9800', targetState: 'SLEEP', desc: 'Save setting and sleep' },
  ],
  CHANGEMULTIPLICATOR: [
    { label: 'Short Press', color: '#4caf50', targetState: 'CHANGEMULTIPLICATOR', desc: 'Increase multiplicator' },
    { label: 'Long Press', color: '#ff9800', targetState: 'SLEEP', desc: 'Save setting and sleep' },
  ],
  SHOWSOILMOISTURE: [
    { label: 'Short Press', color: '#4caf50', targetState: 'BATTERY', desc: 'Display battery level' },
    { label: 'Long Press', color: '#ff9800', targetState: 'MANUAL', desc: 'Open Valve manually' },
    { label: 'Very Long Press', color: '#f44336', targetState: 'OFF', desc: 'Turn off' },
  ],
  ERRORSTATE: [
    { label: 'Very Long Press', color: '#f44336', targetState: 'OFF', desc: 'Reset device' },
  ],
  TRANSITION: [],
};

export const uiText = {
  mainHeading: "Interactive Manual",
  pressToStart: "Press Button to get started",
  sliderInfoText: (soilLevel) =>
    `Use the slider below to simulate the soil moisture sensor. Adjusting this value will open or close the valve based on the configured opening threshold. The current threshold is set to ${soilLevel}; setting the slider to ${soilLevel} or below will open the valve, while values above ${soilLevel} will close it.`,
  sliderLabel: "Soil Moisture:",
  detailedShowMore: "Show more",
  detailedShowLess: "Show less",
  valveOpened: "Valve opened",
  valveClosed: "Valve closed",
  openingThresholdLabel: "Opening Threshold:",
  multiplicatorLabel: "Multiplicator:",
  pressTypeShort: "Short Press",
  pressTypeLong: "Long Press",
  pressTypeVeryLong: "Very Long Press",
};
