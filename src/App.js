import React, { useState, useEffect } from "react";
import "./App.css";
import WaterBackground from "./WaterBackground";


const TIMEOUT_SECONDS = 3000; // 5 minutes timeout

const STATES = {
  OFF: "OFF",
  BATTERY: "Display Battery Level",
  MANUAL: "Manually Open",
  SLEEP: "Sleep",
  SELECTTHRESHOLD: "Select Opening Threshold",
  SELECTMULTIPLICATOR: "Select Multiplicator",
  CHANGETHRESHOLD: "Opening Threshold:",
  CHANGEMULTIPLICATOR: "Multiplicator:",
  SHOWSOILMOISTURE: "Display Current Soil Moisture",
  ERRORSTATE: "Error State",
  TRANSITION: "TRANSITION", // Special state for blocking animations during transitions
};

const TRANSITION = "TRANSITION";

// Move these above the App component:
const stateDescriptions = {
  OFF: { desc: 'Device is off. Valve is closed.' },
  BATTERY: {
    desc: 'The upper LED indicates the battery status: green for full, orange for medium, and red for low.',
    detailed: 'The battery indicator provides guidance for battery replacement: green indicates more than 3 months of operation remaining, orange indicates more than 1 month, and red indicates less than 1 month (device remains functional). For extended absences, replace the battery when the indicator turns red. If regular monitoring is possible, replacement can be delayed until the indicator blinks red, signaling the battery is depleted.'
  },
  MANUAL: { 
    desc: 'The valve has been manually opened by the user. It will remain open regardless of soil moisture until either a short button press occurs or 15 minutes have elapsed.',
    detailed: 'Manual mode allows immediate irrigation, independent of current soil moisture readings. This is useful for urgent watering needs, system testing, or verifying water flow. The valve will close automatically after 15 minutes or when the button is pressed again.'},
  SLEEP: { desc: 'OpenValve is in Sleep-Mode. The Valve opens/closes following the user settings. In Sleep-Mode OpenValve reacts slower to changes in the soil moisture to save battery. Every time OpenValve takes a new soil moisture measurement from the sensor, the blue LED blinks shortly.' },
  SELECTTHRESHOLD: { desc: 'Choose whether to adjust the opening threshold or the multiplicator setting.' },
  SELECTMULTIPLICATOR: { desc: 'Choose whether to adjust the opening threshold or the multiplicator setting.' },
  CHANGETHRESHOLD: { desc: 'The opening threshold, shown by the number of green LED blinks (1–8), defines how dry the soil must get before the next irrigation starts. If the measured soil moisture is at or below this threshold, the valve opens. If above, the valve closes immediately when the device is active (i.e., not in Sleep-Mode or Off), or after a delay (set by the multiplicator) in Sleep-Mode.' },
  CHANGEMULTIPLICATOR: { 
    desc: 'The current multiplicator setting is indicated by the number of orange LED blinks. The value can be between 1 and 5. This setting affects the valve closing behavior in Sleep-Mode. A value of 1 means the valve closes immediately when water reaches the soil moisture sensor and the soil moisture rises above the opening threshold. Each higher value increases the time the valve remains open by an additional 50% after the threshold is exceeded (when water reaches the sensor). ',
    detailed: 'For example, the sensor is placed in the soil at a depth of 10 cm. When the multiplicator is set to 1, the valve closes immediately when the water reaches the sensor, meaning that the first 10 cm of soil are watered. If the multiplicator is set to 3, the valve will remain open for an additional 100% (2x) the time it takes for the water to reach the sensor, allowing the water to penetrate 20 cm into the soil before closing. This is useful for deeper watering without needing to reposition the sensor.' },
  SHOWSOILMOISTURE: { desc: 'The current soil moisture level is indicated by the number of green LED blinks, ranging from 1 (extremely dry) to 9 (saturated). The valve will open whenever the measured soil moisture is less than or equal to the set "Opening Threshold".' },
  ERRORSTATE: { desc: 'An error has occurred. Please reset device.' },
  TRANSITION: { desc: '' },
};

const possibleActions = {
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




// Add this helper above the App component:
function getStateKeyByValue(val) {
  const stateKey = Object.keys(stateDescriptions).find(key => STATES[key] === val);
  return stateKey || "UNKNOWN_STATE";
}

// Expandable/collapsable detailed description component
function DetailedDescription({ text }) {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div style={{ margin: '8px 0 10px 0' }}>
      <button
        className="detailed-desc-toggle"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        {expanded ? 'Show less' : 'Show more'}
      </button>
      {expanded && (
        <div className="detailed-desc-content">
          {text}
        </div>
      )}
    </div>
  );
}

function App() {
  const [state, setState] = useState("Sleep");
  const [pressStart, setPressStart] = useState(null);
  const [blueLedBlink, setBlueLedBlink] = useState(false);
  const [rgbLedColor, setRgbLedColor] = useState("transparent");
  const [rgbLedBlink, setRgbLedBlink] = useState(false);
  const [blueLedColor, setBlueLedColor] = useState("transparent"); // New state for blue LED color
  const [batteryLevel, setBatteryLevel] = useState("moderate"); // New state for battery level: 'full', 'moderate', 'empty'
  const [soilMoisture, setSoilMoisture] = useState(5); // New state for soil moisture
  const [soilLevel, setSoilLevel] = useState(4); // New state for soilLevel
  const [multiplicator, setMultiplicator] = useState(1); // New state for multiplicator, initially 1
  const [isPressed, setIsPressed] = useState(false);
  const [timeoutCounter, setTimeoutCounter] = useState(TIMEOUT_SECONDS); // TIMEOUT_SECONDS seconds timeout
  const [sleepByTimeout, setSleepByTimeout] = useState(false); // Track if sleep was entered by timeout
  const [pressDuration, setPressDuration] = useState(0); // Track how long the button is pressed
  const [valveState, setValveState] = useState("CLOSED"); // New state: 'OPEN' or 'CLOSED'
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [buttonEverPressed, setButtonEverPressed] = useState(false); // New state to track if button was ever pressed
  const timeoutRef = React.useRef();
  const progressTimerRef = React.useRef();
  const pressStartRef = React.useRef(null);
  const isFirstValveState = React.useRef(true); // <-- Add this line

  useEffect(() => {
    let timers = [];
    let blinkCount = 0;
    let blinkOn = false;

    if (state === TRANSITION) {
      // Block all LED animations during transition
      setBlueLedBlink(false);
      setRgbLedBlink(false);
      setRgbLedColor("transparent");
      setBlueLedColor("transparent");
      return () => {};
    } else if (state === STATES.OFF) {
      setBlueLedBlink(false);
      setRgbLedBlink(false);
      setRgbLedColor("transparent");
      setBlueLedColor("transparent");
    } else if (state === STATES.BATTERY) {
      setRgbLedBlink(false); // No blink in battery state
      setBlueLedBlink(false);
      setBlueLedColor("transparent");
      setRgbLedColor("red");
      // Animation: red -> orange -> green
      timers.push(setTimeout(() => {
        setRgbLedColor("orange");
        // After orange, go to green
        timers.push(setTimeout(() => {
          setRgbLedColor("green");
          // After green, adjust based on batteryLevel
          if (batteryLevel === "moderate") {
            timers.push(setTimeout(() => {
              setRgbLedColor("orange");
            }, 765));
          } else if (batteryLevel === "empty") {
            timers.push(setTimeout(() => {
              setRgbLedColor("orange");
              timers.push(setTimeout(() => {
                setRgbLedColor("red");
              }, 765));
            }, 765));
          }
          // If full, stay green
        }, 765));
      }, 765));
    } else if (state === STATES.SELECTTHRESHOLD) {
      setBlueLedBlink(false);
      setBlueLedColor("transparent");
      setRgbLedBlink(false);
      // Blink green LED with 200ms pauses, continuously
      const blink = () => {
        setRgbLedColor(blinkOn ? "green" : "transparent");
        blinkOn = !blinkOn;
        timers.push(setTimeout(blink, 103));
      };
      blink();
    } else if (state === STATES.SELECTMULTIPLICATOR) {
      setBlueLedBlink(false);
      setBlueLedColor("transparent");
      setRgbLedBlink(false);
      // Blink orange LED with 200ms pauses, continuously
      const blink = () => {
        setRgbLedColor(blinkOn ? "orange" : "transparent");
        blinkOn = !blinkOn;
        timers.push(setTimeout(blink, 103));
      };
      blink();
    } else if (state === STATES.CHANGETHRESHOLD) {
      setBlueLedBlink(false);
      setBlueLedColor("transparent");
      setRgbLedBlink(false);
      // Blink green LED as often as soilLevel, then 2s pause, repeat
      const blink = () => {
        if (blinkCount < soilLevel * 2) { // 2 toggles per blink (on/off)
          setRgbLedColor(blinkOn ? "green" : "transparent");
          blinkOn = !blinkOn;
          blinkCount++;
          timers.push(setTimeout(blink, 230));
        } else {
          setRgbLedColor("transparent");
          blinkCount = 0;
          blinkOn = false;
          timers.push(setTimeout(blink, 1843));
        }
      };
      blink();
    } else if (state === STATES.CHANGEMULTIPLICATOR) {
      setBlueLedBlink(false);
      setBlueLedColor("transparent");
      setRgbLedBlink(false);
      // Blink orange LED as often as multiplicator, then 2s pause, repeat
      const blink = () => {
        if (blinkCount < multiplicator * 2) { // 2 toggles per blink (on/off)
          setRgbLedColor(blinkOn ? "orange" : "transparent");
          blinkOn = !blinkOn;
          blinkCount++;
          timers.push(setTimeout(blink, 240));
        } else {
          setRgbLedColor("transparent");
          blinkCount = 0;
          blinkOn = false;
          timers.push(setTimeout(blink, 1900));
        }
      };
      blink();
    } else if (state === STATES.SHOWSOILMOISTURE) {
      setBlueLedBlink(false);
      setBlueLedColor("transparent");
      setRgbLedBlink(false);
      // Start blinking rgb led according to soilMoisture
      const blink = () => {
        if (blinkCount < soilMoisture * 2) { // 2 toggles per blink (on/off)
          setRgbLedColor(blinkOn ? "green" : "transparent");
          blinkOn = !blinkOn;
          blinkCount++;
          timers.push(setTimeout(blink, 240)); // Fast blink (150ms per on/off)
        } else {
          setRgbLedColor("transparent");
          blinkCount = 0;
          blinkOn = false;
          timers.push(setTimeout(blink, 1900)); // 2s pause
        }
      };
      blink();
    } else if (state === STATES.MANUAL) {
      setBlueLedBlink(true);
      setBlueLedColor("blue");
      setRgbLedColor("transparent");
      setRgbLedBlink(false);
    } else if (state === STATES.SLEEP) {
      setRgbLedColor("transparent");
      setRgbLedBlink(false);
      setBlueLedBlink(false);
      setBlueLedColor("transparent");
      // Only blink 2x red if sleepByTimeout is true
      if (sleepByTimeout) {
        let blinkCount = 0;
        let blinkOn = false;
        const blink = () => {
          if (blinkCount < 4) { // 2 blinks (on/off)
            setRgbLedColor(blinkOn ? "red" : "transparent");
            blinkOn = !blinkOn;
            blinkCount++;
            timers.push(setTimeout(blink, 76));
          } else {
            setRgbLedColor("transparent");
          }
        };
        blink();
      }
    }
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [state, batteryLevel, soilMoisture, soilLevel, multiplicator, sleepByTimeout]);

  // Reset timeout on any button press
  const resetTimeout = () => {
    setTimeoutCounter(TIMEOUT_SECONDS
    );
  };

  // Add timeout effect
  useEffect(() => {
    if (state !== STATES.SLEEP && state !== STATES.OFF) {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
      timeoutRef.current = setInterval(() => {
        setTimeoutCounter(prev => {
          if (prev <= 1) {
            setSleepByTimeout(true); // Set flag for timeout-based sleep
            setState(STATES.SLEEP);
            return TIMEOUT_SECONDS;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimeoutCounter(TIMEOUT_SECONDS);
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    }
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [state]);

  // Update valveState whenever soilMoisture or soilLevel changes
  useEffect(() => {
    if (soilMoisture <= soilLevel) {
      setValveState("OPEN");
    } else {
      setValveState("CLOSED");
    }
  }, [soilMoisture, soilLevel]);

  // Print to console and show popup whenever valveState changes
  useEffect(() => {
    if (isFirstValveState.current) {
      isFirstValveState.current = false;
      return; // Skip popup on first render
    }
    console.log(`Valve state changed: ${valveState}`);
    if (valveState === "OPEN") {
      setPopupMessage("Valve opened");
      setShowPopup(true);
    } else if (valveState === "CLOSED") {
      setPopupMessage("Valve closed");
      setShowPopup(true);
    }
    if (valveState === "OPEN" || valveState === "CLOSED") {
      const timer = setTimeout(() => setShowPopup(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [valveState]);

  // Control blue LED based on valveState, except in MANUAL state
  useEffect(() => {
    // Only control blue LED for valveState if not in MANUAL, OFF, or SLEEP state
    if (state !== STATES.MANUAL && state !== STATES.OFF && state !== STATES.SLEEP) {
      if (valveState === "OPEN") {
        setBlueLedBlink(false);
        setBlueLedColor("blue");
      } else {
        setBlueLedBlink(false);
        setBlueLedColor("transparent");
      }
    }
  }, [valveState, state, soilLevel, soilMoisture]);

  // Ensure blue LED is off in OFF and SLEEP states
  useEffect(() => {
    if (state === STATES.OFF || state === STATES.SLEEP) {
      setBlueLedBlink(false);
      setBlueLedColor("transparent");
    }
  }, [state]);

  const getPressTypeLabel = () => {
    if (pressDuration < 1) return 'Short Press';
    if (pressDuration < 2) return 'Long Press';
    return 'Very Long Press';
  };

  const getProgressBarColor = () => {
    // Use green, orange, red for intuitive feedback
    if (pressDuration < 1) return '#4caf50'; // green
    if (pressDuration < 2) return '#ff9800'; // orange
    return '#f44336'; // red
  };

  const handleMouseDown = (...args) => {
    setButtonEverPressed(true); // Track that the button was pressed at least once
    resetTimeout();
    const now = Date.now();
    setPressStart(now);
    pressStartRef.current = now;
    setIsPressed(true);
    setPressDuration(0);
  };

  const handleMouseUp = (...args) => {
    resetTimeout();
    const duration = (Date.now() - (pressStartRef.current || Date.now())) / 1000;
    setPressDuration(0);
    if (duration < 1) {
      handleShortPress();
    } else if (duration < 2) {
      handleLongPress();
    } else {
      handleVeryLongPress();
    }
    setPressStart(null);
    pressStartRef.current = null;
    setIsPressed(false);
  };

  // Timer effect for live updating pressDuration
  useEffect(() => {
    let interval = null;
    if (isPressed && pressStartRef.current) {
      interval = setInterval(() => {
        setPressDuration(((Date.now() - pressStartRef.current) / 1000));
      }, 20);
    } else {
      setPressDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPressed]);

  const handleShortPress = () => {
    console.log("Short press in state:", state);
    if (state === STATES.BATTERY) {
      setState(STATES.SHOWSOILMOISTURE);
    } else if (state === STATES.SHOWSOILMOISTURE) {
      setState(STATES.BATTERY);
    } else if (state === STATES.MANUAL) {
      setState(STATES.SHOWSOILMOISTURE);
      setValveState("CLOSED"); // Close valve manually
    } else if (state === STATES.SLEEP) {
      setState(STATES.BATTERY);
    } else if (state === STATES.SELECTTHRESHOLD) {
      setState(STATES.SELECTMULTIPLICATOR);
    } else if (state === STATES.SELECTMULTIPLICATOR) {
      setState(STATES.SELECTTHRESHOLD);
    } else if (state === STATES.CHANGETHRESHOLD) {
      setSoilLevel(prev => prev === 8 ? 1 : prev + 1);
    } else if (state === STATES.CHANGEMULTIPLICATOR) {
      setMultiplicator(prev => prev === 5 ? 1 : prev + 1);
    } else if (state === STATES.SLEEP) {
      setState(STATES.BATTERY);
    }
  };

  // Helper: double green blink, then callback
  const doubleGreenBlink = (cb) => {
    setState(TRANSITION); // Set to a special state to block other animations
    setRgbLedBlink(false);
    setBlueLedBlink(false);
    setRgbLedColor("transparent");
    setBlueLedColor("transparent");
    let count = 0;
    let on = false;
    setTimeout(() => {
      const blink = () => {
        if (count < 4) {
          setRgbLedColor(on ? "green" : "transparent");
          on = !on;
          count++;
          setTimeout(blink, 76);
        } else {
          setRgbLedColor("transparent");
          setTimeout(() => { if (cb) cb(); }, 200);
        }
      };
      blink();
    }, 200);
  };

  const handleLongPress = () => {
    console.log("Long press in state:", state);
    if (state === STATES.BATTERY) {
      doubleGreenBlink(() => setState(STATES.SELECTTHRESHOLD));
    } else if (state === STATES.SHOWSOILMOISTURE) {
      if (valveState === "CLOSED") {
        setState(STATES.MANUAL); // Exception: no blink
        setValveState("OPEN"); // Open valve manually
      }
      // else do nothing if valve is OPEN
    } else if (state === STATES.SELECTTHRESHOLD) {
      doubleGreenBlink(() => setState(STATES.CHANGETHRESHOLD));
    } else if (state === STATES.SELECTMULTIPLICATOR) {
      doubleGreenBlink(() => setState(STATES.CHANGEMULTIPLICATOR));
    } else if (state === STATES.CHANGETHRESHOLD || state === STATES.CHANGEMULTIPLICATOR) {
      setSleepByTimeout(false); // Set flag for button-based sleep
      doubleGreenBlink(() => setState(STATES.SLEEP));
    }
  };

  const blinkRedThreeTimes = (cb) => {
    setState(TRANSITION); // Block other animations
    setRgbLedBlink(false);
    setBlueLedBlink(false);
    setRgbLedColor("transparent");
    setBlueLedColor("transparent");
    let count = 0;
    let on = false;
    const blink = () => {
      if (count < 6) { // 3 blinks (on/off)
        setRgbLedColor(on ? "red" : "transparent");
        on = !on;
        count++;
        setTimeout(blink, 300);
      } else {
        setRgbLedColor("transparent");
        setTimeout(() => { if (cb) cb(); }, 120);
      }
    };
    blink();
  };

  const handleVeryLongPress = () => {
    console.log("Very long press. Turning off.");
    if(state===STATES.OFF){
      setState(STATES.BATTERY);
    } else if (
      state === STATES.BATTERY ||
      state === STATES.SHOWSOILMOISTURE ||
      state === STATES.MANUAL ||
      state === STATES.SELECTTHRESHOLD ||
      state === STATES.SELECTMULTIPLICATOR
    ) {
      blinkRedThreeTimes(() => { setState(STATES.OFF); setValveState("CLOSED"); });
    }
  };

  return (
    <div className="App">
      <WaterBackground valveState={valveState} />
      {/* Valve state popup */}
      {showPopup && (
        <div className="valve-popup-message">
          {popupMessage}
        </div>
      )}
      <h1>OpenValve UI</h1>
      {/* Background image behind LEDs and button */}
      <div className="valve-bg-container">
        <img
          src={require('./images/OpenValve1.PNG')}
          alt="Valve background"
          className="valve-bg-img"
        />
        <div className="valve-bg-foreground">
          {/* Show the message and arrow until the button is pressed at least once */}
          {!buttonEverPressed && (
            <div className="press-to-start-message">
              <span className="press-to-start-text">
                Press Button to get started
              </span>
              <svg className="press-to-start-arrow" width="48" height="48" viewBox="0 0 48 48">
                <g>
                  <path d="M24 6v28M24 34l-8-8M24 34l8-8" stroke="#2196f3" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </g>
              </svg>
            </div>
          )}
          <div className="led-container">
            <div
              className={`led rgb-led ${rgbLedBlink ? "blink-rgb" : ""}`}
              style={{ backgroundColor: rgbLedBlink ? undefined : rgbLedColor }}
            />
            <div
              className={`led blue-led ${blueLedBlink ? "blink-blue" : ""}`}
              style={{ backgroundColor: blueLedColor }}
            />
          </div>
          {/* Always reserve space for the press type label above the button */}
          <div
            className="press-type-label"
            style={{ color: isPressed ? getProgressBarColor() : 'transparent', textShadow: isPressed ? '0 1px 4px rgba(0,0,0,0.18)' : 'none' }}
          >
            {isPressed ? getPressTypeLabel() : ''}
          </div>
          <button
            className={`button${isPressed ? " pressed" : ""}`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { setIsPressed(false); setPressDuration(0); pressStartRef.current = null; }}
            onTouchStart={e => { e.preventDefault(); if (!isPressed) handleMouseDown(); }}
            onTouchEnd={e => { e.preventDefault(); if (isPressed) handleMouseUp(); }}
            onTouchCancel={e => { e.preventDefault(); setIsPressed(false); setPressDuration(0); pressStartRef.current = null; }}
            onContextMenu={e => e.preventDefault()} // Prevent context menu on long press
            style={{ position: 'relative' }}
          >
            {/* SVG circular progress inside the white circle */}
            <span className="button-center-circle" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 2, background: '#222', border: 'none', width: 56, height: 56 }}>
              <svg width="56" height="56" viewBox="0 0 56 56" style={{ position: 'absolute', left: 0, top: 0, zIndex: 3, pointerEvents: 'none' }}>
                {/* Always show the white circle as background */}
                <circle
                  cx="28" cy="28" r="24"
                  stroke="white"
                  strokeWidth="5"
                  fill="none"
                />
                {/* Overlay the progress bar when pressed */}
                {isPressed && (
                  <circle
                    cx="28" cy="28" r="24"
                    stroke={getProgressBarColor()}
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 24}
                    strokeDashoffset={2 * Math.PI * 24 * (1 - Math.min(pressDuration / 2.5, 1))}
                    style={{ transition: 'stroke-dashoffset 0.02s linear, stroke 0.1s' }}
                  />
                )}
              </svg>
            </span>
          </button>
        </div>
      </div>
      {/* State Info Card: description and possible transitions */}
      {getStateKeyByValue(state) !== "TRANSITION" && (
        <div className="state-info-card">
          <div className="state-info-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {getStateKeyByValue(state) === "CHANGETHRESHOLD" ? (
              <>
                Opening Threshold:
                <span className="state-threshold-soillevel">{soilLevel}</span>
              </>
            ) : getStateKeyByValue(state) === "CHANGEMULTIPLICATOR" ? (
              <>
                Multiplicator:
                <span className="state-multiplicator-value">{multiplicator}</span>
              </>
            ) : (
              state
            )}
          </div>
          {/* Remove the duplicate soilLevel info below the title */}
          <div className="state-info-desc">{stateDescriptions[getStateKeyByValue(state)].desc}</div>
          {/* Expandable detailed description if available */}
          {stateDescriptions[getStateKeyByValue(state)].detailed && stateDescriptions[getStateKeyByValue(state)].detailed.trim() !== '' && (
            <DetailedDescription text={stateDescriptions[getStateKeyByValue(state)].detailed} />
          )}
          {/* Show soilMoisture slider only in SHOWSOILMOISTURE state */}
          {getStateKeyByValue(state) === "SHOWSOILMOISTURE" && (
            <>
              <div className="state-soilmoisture-slider-info">
                <img src={require('./images/soilSensorIcon.PNG')} alt="Soil sensor icon" className="state-soilmoisture-slider-icon" />
                <span>
                  Use the slider below to simulate the soil moisture sensor. Adjusting this value will open or close the valve based on the configured opening threshold. The current threshold is set to {soilLevel}; setting the slider to {soilLevel} or below will open the valve, while values above {soilLevel} will close it.
                </span>
              </div>
              <div className="state-soilmoisture-slider-row">
                <label htmlFor="soilMoistureSlider" className="state-soilmoisture-slider-label">
                  Soil Moisture:
                </label>
                <input
                  id="soilMoistureSlider"
                  type="range"
                  min={1}
                  max={9}
                  value={soilMoisture}
                  onChange={e => setSoilMoisture(Number(e.target.value))}
                  className="state-soilmoisture-slider-input"
                />
                <span className="state-soilmoisture-slider-value">{soilMoisture}</span>
              </div>
            </>
          )}
          {/* Separation line between description and actions */}
          <hr className="state-info-separator" />
          <div>
            {possibleActions[getStateKeyByValue(state)] && possibleActions[getStateKeyByValue(state)].map((action, idx) => {
              // Disable (gray out) the 'Long Press' to MANUAL if valveState is OPEN and current state is SHOWSOILMOISTURE
              const isManualLongPress =
                getStateKeyByValue(state) === "SHOWSOILMOISTURE" &&
                action.label === "Long Press" &&
                action.targetState === "MANUAL";
              const isDisabled = isManualLongPress && valveState === "OPEN";
              return (
                <div
                  key={idx}
                  className="state-action-row"
                  style={{ opacity: isDisabled ? 0.4 : 1, pointerEvents: isDisabled ? 'none' : undefined }}
                >
                  <span className="state-action-dot" style={{ background: action.color }} />
                  <span className="state-action-label">{action.label}</span>
                  <span className="state-action-arrow">→</span>
                  <span className="state-action-desc">{action.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Optionally, add a way to change batteryLevel for demo/testing:
      <div>
        <label>Battery Level: </label>
        <select value={batteryLevel} onChange={e => setBatteryLevel(e.target.value)}>
          <option value="full">Full</option>
          <option value="moderate">Moderate</option>
          <option value="empty">Empty</option>
        </select>
      </div> */}
    </div>
  );
}

export default App;
