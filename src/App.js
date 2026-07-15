import React, { useEffect, useState } from "react";
import WaterBackground from "./WaterBackground";
import "./App.css";
import OpenValveLogo from './images/openvalve_logo_dark_turned_withText_Montserrat.svg';

// Language loader
function getLangModule(lang) {
  const l = (lang || navigator.language || navigator.userLanguage || "en").slice(0, 2).toLowerCase();
  try {
    switch (l) {
      case "de":
        return require("./lang/de.js");
      case "ro":
        return require("./lang/ro.js");
      default:
        return require("./lang/en.js");
    }
  } catch (e) {
    return require("./lang/en.js");
  }
}

const TIMEOUT_SECONDS = 3000; // 5 minutes timeout
const LONG_PRESS_MS = 1000;
const VERY_LONG_PRESS_MS = 3000;
const PRESS_PROGRESS_INTERVAL_MS = 20;
const CONFIRMATION_PULSE_MS = 300;
const CONFIRMATION_DISPLAY_MS = 700;
const CONFIRMATION_FADE_MS = 180;

const PRESS_TYPES = Object.freeze({
  SHORT: "SHORT",
  LONG: "LONG",
  VERY_LONG: "VERY_LONG"
});

const PRESS_COLORS = Object.freeze({
  [PRESS_TYPES.SHORT]: "#4caf50",
  [PRESS_TYPES.LONG]: "#ff9800",
  [PRESS_TYPES.VERY_LONG]: "#f44336"
});

const STATES = Object.freeze({
  OFF: "OFF",
  BATTERY: "BATTERY",
  MANUAL: "MANUAL",
  SLEEP: "SLEEP",
  SELECTTHRESHOLD: "SELECTTHRESHOLD",
  SELECTMULTIPLICATOR: "SELECTMULTIPLICATOR",
  CHANGETHRESHOLD: "CHANGETHRESHOLD",
  CHANGEMULTIPLICATOR: "CHANGEMULTIPLICATOR",
  SHOWSOILMOISTURE: "SHOWSOILMOISTURE",
  ERRORSTATE: "ERRORSTATE",
  TRANSITION: "TRANSITION" // Special state for blocking animations during transitions
});

function DetailedDescription({ text, uiText }) {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div style={{ margin: '8px 0 10px 0' }}>
      <button
        className="detailed-desc-toggle"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        {expanded ? uiText.detailedShowLess : uiText.detailedShowMore}
      </button>
      {expanded && (
        <div className="detailed-desc-content">
          {text}
        </div>
      )}
    </div>
  );
}

function InfoAdmonition({ label, value, accentClass = "" }) {
  return (
    <div className={`info-admonition ${accentClass}`.trim()}>
      <div className="info-admonition-icon" aria-hidden="true">i</div>
      <div className="info-admonition-body">
        <span className="info-admonition-label">{label}</span>
        <span className="info-admonition-value">{value}</span>
      </div>
    </div>
  );
}

function LanguageDropdown({ currentLang, onChange }) {
  const [open, setOpen] = React.useState(false);
  const languages = [
    { code: "de", label: "DE" },
    { code: "en", label: "EN" },
    { code: "ro", label: "RO" }
  ];
  const handleSelect = (code) => {
    setOpen(false);
    if (code !== currentLang) onChange(code);
  };
  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);
  return (
    <div className="lang-dropdown-container" onClick={e => e.stopPropagation()}>
      <button
        className="lang-dropdown-toggle"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        onTouchEnd={e => { e.preventDefault(); setOpen(o => !o); }}
      >
        {languages.find(l => l.code === currentLang)?.label || currentLang.toUpperCase()}
        <span className="lang-dropdown-arrow" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ display: 'block' }}>
            <polyline points="5,7 9,11 13,7" fill="none" stroke="#888" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {open && (
        <ul className="lang-dropdown-list" role="listbox">
          {languages.map(l => (
            <li
              key={l.code}
              className={`lang-dropdown-item${l.code === currentLang ? " selected" : ""}`}
              onClick={() => handleSelect(l.code)}
              role="option"
              aria-selected={l.code === currentLang}
            >
              {l.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LogoTopLeft() {
  return (
    <div className="logo-top-left">
      <a href="https://open-valve.com">
        <img
        src={OpenValveLogo}
        alt="OpenValve Logo"
        className="logo-img"
        draggable="false"
        />
      </a>
    </div>
  );
}

function App() {
  const [state, setState] = useState(STATES.SLEEP);
  const [blueLedBlink, setBlueLedBlink] = useState(false);
  const [rgbLedColor, setRgbLedColor] = useState("transparent");
  const [rgbLedBlink, setRgbLedBlink] = useState(false);
  const [blueLedColor, setBlueLedColor] = useState("transparent"); // New state for blue LED color
  const [batteryLevel, setBatteryLevel] = useState("moderate"); // New state for battery level: 'full', 'moderate', 'empty'
  const [soilMoisture, setSoilMoisture] = useState(4); // New state for soil moisture
  const [soilLevel, setSoilLevel] = useState(1); // New state for soilLevel
  const [multiplicator, setMultiplicator] = useState(1); // New state for multiplicator, initially 1
  const [isPressed, setIsPressed] = useState(false);
  const [timeoutCounter, setTimeoutCounter] = useState(TIMEOUT_SECONDS); // TIMEOUT_SECONDS seconds timeout
  const [sleepByTimeout, setSleepByTimeout] = useState(false); // Track if sleep was entered by timeout
  const [pressDuration, setPressDuration] = useState(0); // Track how long the button is pressed
  const [pressConfirmation, setPressConfirmation] = useState(null);
  const [valveState, setValveState] = useState("CLOSED"); // New state: 'OPEN' or 'CLOSED'
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [buttonEverPressed, setButtonEverPressed] = useState(false); // New state to track if button was ever pressed
  const timeoutRef = React.useRef();
  const progressTimerRef = React.useRef();
  const longPressTimerRef = React.useRef();
  const veryLongPressTimerRef = React.useRef();
  const confirmationFadeTimerRef = React.useRef();
  const confirmationClearTimerRef = React.useRef();
  const pressStartRef = React.useRef(null);
  const activePointerRef = React.useRef(null);
  const longPressTriggeredRef = React.useRef(false);
  const veryLongPressTriggeredRef = React.useRef(false);
  const pressConfirmationRef = React.useRef(null);
  const confirmationSequenceRef = React.useRef(0);
  const stateRef = React.useRef(state);
  const valveStateRef = React.useRef(valveState);
  const isFirstValveState = React.useRef(true); // <-- Add this line

  stateRef.current = state;
  valveStateRef.current = valveState;

  // Track language for dropdown (default: browser or en)
  const [lang, setLang] = React.useState((window.location.search.match(/lang=([a-z]{2})/)?.[1] || (navigator.language || "en").slice(0,2).toLowerCase()));
  const langModule = React.useMemo(() => getLangModule(lang), [lang]);
  const stateDescriptions = langModule.stateDescriptions;
  const possibleActions = langModule.possibleActions;
  const uiText = langModule.uiText;

  useEffect(() => {
    let timers = [];
    let blinkCount = 0;
    let blinkOn = false;

    if (state === STATES.TRANSITION) {
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
      setPopupMessage(uiText.valveOpened);
      setShowPopup(true);
    } else if (valveState === "CLOSED") {
      setPopupMessage(uiText.valveClosed);
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

  const getPressType = (duration) => {
    if (duration < LONG_PRESS_MS / 1000) return PRESS_TYPES.SHORT;
    if (duration < VERY_LONG_PRESS_MS / 1000) return PRESS_TYPES.LONG;
    return PRESS_TYPES.VERY_LONG;
  };

  const getPressTypeLabel = (pressType) => {
    if (pressType === PRESS_TYPES.LONG) return uiText.pressTypeLong;
    if (pressType === PRESS_TYPES.VERY_LONG) return uiText.pressTypeVeryLong;
    return uiText.pressTypeShort;
  };

  const handleShortPress = () => {
    const currentState = stateRef.current;
    console.log("Short press in state:", currentState);
    if (currentState === STATES.BATTERY) {
      setState(STATES.SHOWSOILMOISTURE);
    } else if (currentState === STATES.SHOWSOILMOISTURE) {
      setState(STATES.BATTERY);
    } else if (currentState === STATES.MANUAL) {
      setState(STATES.SHOWSOILMOISTURE);
      setValveState("CLOSED"); // Close valve manually
    } else if (currentState === STATES.SLEEP) {
      setState(STATES.BATTERY);
    } else if (currentState === STATES.SELECTTHRESHOLD) {
      setState(STATES.SELECTMULTIPLICATOR);
    } else if (currentState === STATES.SELECTMULTIPLICATOR) {
      setState(STATES.SELECTTHRESHOLD);
    } else if (currentState === STATES.CHANGETHRESHOLD) {
      setSoilLevel(prev => prev === 8 ? 1 : prev + 1);
    } else if (currentState === STATES.CHANGEMULTIPLICATOR) {
      setMultiplicator(prev => prev === 5 ? 1 : prev + 1);
    } else {
      return false;
    }
    return true;
  };

  // Helper: double green blink, then callback
  const doubleGreenBlink = (cb) => {
    setState(STATES.TRANSITION); // Set to a special state to block other animations
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
    const currentState = stateRef.current;
    console.log("Long press in state:", currentState);
    if (currentState === STATES.BATTERY) {
      doubleGreenBlink(() => setState(STATES.SELECTTHRESHOLD));
      return { executed: true, stopSampling: false };
    } else if (currentState === STATES.SHOWSOILMOISTURE) {
      if (valveStateRef.current === "CLOSED") {
        setState(STATES.MANUAL); // Exception: no blink
        setValveState("OPEN"); // Open valve manually
        return { executed: true, stopSampling: false };
      }
    } else if (currentState === STATES.SELECTTHRESHOLD) {
      doubleGreenBlink(() => setState(STATES.CHANGETHRESHOLD));
      return { executed: true, stopSampling: false };
    } else if (currentState === STATES.SELECTMULTIPLICATOR) {
      doubleGreenBlink(() => setState(STATES.CHANGEMULTIPLICATOR));
      return { executed: true, stopSampling: false };
    } else if (currentState === STATES.CHANGETHRESHOLD || currentState === STATES.CHANGEMULTIPLICATOR) {
      setSleepByTimeout(false); // Set flag for button-based sleep
      doubleGreenBlink(() => setState(STATES.SLEEP));
      return { executed: true, stopSampling: true };
    }
    return { executed: false, stopSampling: false };
  };

  const blinkRedThreeTimes = (cb) => {
    setState(STATES.TRANSITION); // Block other animations
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
    const currentState = stateRef.current;
    console.log("Very long press. Turning off.");
    if(currentState === STATES.OFF){
      setState(STATES.BATTERY);
      return true;
    } else if (
      currentState === STATES.BATTERY ||
      currentState === STATES.SHOWSOILMOISTURE ||
      currentState === STATES.MANUAL ||
      currentState === STATES.SELECTTHRESHOLD ||
      currentState === STATES.SELECTMULTIPLICATOR
    ) {
      blinkRedThreeTimes(() => { setState(STATES.OFF); setValveState("CLOSED"); });
      return true;
    }
    return false;
  };

  const clearPressTimers = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    if (veryLongPressTimerRef.current) clearTimeout(veryLongPressTimerRef.current);
    progressTimerRef.current = null;
    longPressTimerRef.current = null;
    veryLongPressTimerRef.current = null;
  };

  const clearConfirmationTimers = () => {
    if (confirmationFadeTimerRef.current) clearTimeout(confirmationFadeTimerRef.current);
    if (confirmationClearTimerRef.current) clearTimeout(confirmationClearTimerRef.current);
    confirmationFadeTimerRef.current = null;
    confirmationClearTimerRef.current = null;
  };

  const clearPressConfirmation = () => {
    clearConfirmationTimers();
    pressConfirmationRef.current = null;
    setPressConfirmation(null);
  };

  const showPressConfirmation = (type, duration) => {
    clearConfirmationTimers();
    const confirmation = {
      id: ++confirmationSequenceRef.current,
      type,
      duration,
      fading: false
    };
    pressConfirmationRef.current = confirmation;
    setPressConfirmation(confirmation);
  };

  const scheduleConfirmationDismissal = () => {
    if (!pressConfirmationRef.current) return;
    clearConfirmationTimers();
    confirmationFadeTimerRef.current = setTimeout(() => {
      const fadingConfirmation = pressConfirmationRef.current
        ? { ...pressConfirmationRef.current, fading: true }
        : null;
      pressConfirmationRef.current = fadingConfirmation;
      setPressConfirmation(fadingConfirmation);
    }, CONFIRMATION_DISPLAY_MS);
    confirmationClearTimerRef.current = setTimeout(() => {
      pressConfirmationRef.current = null;
      setPressConfirmation(null);
      setPressDuration(0);
    }, CONFIRMATION_DISPLAY_MS + CONFIRMATION_FADE_MS);
  };

  const stopPressSampling = (duration, preserveConfirmation = true) => {
    clearPressTimers();
    pressStartRef.current = null;
    activePointerRef.current = null;
    setIsPressed(false);

    if (preserveConfirmation && pressConfirmationRef.current) {
      const retainedConfirmation = {
        ...pressConfirmationRef.current,
        duration
      };
      pressConfirmationRef.current = retainedConfirmation;
      setPressConfirmation(retainedConfirmation);
      setPressDuration(duration);
      scheduleConfirmationDismissal();
    } else {
      setPressDuration(0);
      clearPressConfirmation();
    }
  };

  const triggerLongPress = () => {
    if (longPressTriggeredRef.current) return;
    longPressTriggeredRef.current = true;
    setPressDuration(LONG_PRESS_MS / 1000);
    const result = handleLongPress();
    if (!result.executed) return;

    showPressConfirmation(PRESS_TYPES.LONG, LONG_PRESS_MS / 1000);
    if (result.stopSampling) {
      stopPressSampling(LONG_PRESS_MS / 1000, true);
    }
  };

  const triggerVeryLongPress = () => {
    if (veryLongPressTriggeredRef.current || pressStartRef.current === null) return;
    veryLongPressTriggeredRef.current = true;
    setPressDuration(VERY_LONG_PRESS_MS / 1000);
    if (handleVeryLongPress()) {
      showPressConfirmation(PRESS_TYPES.VERY_LONG, VERY_LONG_PRESS_MS / 1000);
    }
  };

  const handlePointerDown = (event) => {
    if (activePointerRef.current !== null) return;
    event.preventDefault();
    setButtonEverPressed(true);
    resetTimeout();
    clearPressConfirmation();

    const pointerId = event.pointerId ?? "primary";
    activePointerRef.current = pointerId;
    longPressTriggeredRef.current = false;
    veryLongPressTriggeredRef.current = false;
    pressStartRef.current = Date.now();
    setIsPressed(true);
    setPressDuration(0);

    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch (error) {
      // Pointer capture is an enhancement; timing still works without it.
    }

    progressTimerRef.current = setInterval(() => {
      if (pressStartRef.current !== null) {
        setPressDuration((Date.now() - pressStartRef.current) / 1000);
      }
    }, PRESS_PROGRESS_INTERVAL_MS);
    longPressTimerRef.current = setTimeout(triggerLongPress, LONG_PRESS_MS);
    veryLongPressTimerRef.current = setTimeout(triggerVeryLongPress, VERY_LONG_PRESS_MS);
  };

  const releasePointerCapture = (event) => {
    try {
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch (error) {
      // The browser releases capture automatically when the pointer ends.
    }
  };

  const handlePointerUp = (event) => {
    if (activePointerRef.current === null || activePointerRef.current !== (event.pointerId ?? "primary")) return;
    event.preventDefault();
    releasePointerCapture(event);
    resetTimeout();

    const duration = Math.max(0, (Date.now() - pressStartRef.current) / 1000);
    if (duration < LONG_PRESS_MS / 1000 && !longPressTriggeredRef.current) {
      if (handleShortPress()) {
        showPressConfirmation(PRESS_TYPES.SHORT, duration);
      }
    } else {
      triggerLongPress();
      if (pressStartRef.current !== null && duration >= VERY_LONG_PRESS_MS / 1000) {
        triggerVeryLongPress();
      }
    }

    if (pressStartRef.current !== null) {
      stopPressSampling(duration, true);
    }
  };

  const handlePointerCancel = (event) => {
    if (activePointerRef.current === null || activePointerRef.current !== (event.pointerId ?? "primary")) return;
    releasePointerCapture(event);
    const duration = pressStartRef.current === null
      ? 0
      : Math.max(0, (Date.now() - pressStartRef.current) / 1000);
    stopPressSampling(duration, Boolean(pressConfirmationRef.current));
  };

  useEffect(() => () => {
    clearPressTimers();
    clearConfirmationTimers();
  }, []);

  const displayedPressDuration = isPressed
    ? pressDuration
    : (pressConfirmation?.duration ?? 0);
  const displayedPressType = pressConfirmation?.type ?? getPressType(displayedPressDuration);
  const displayedPressLabel = getPressTypeLabel(displayedPressType);
  const displayedPressColor = PRESS_COLORS[displayedPressType];
  const showPressFeedback = isPressed || Boolean(pressConfirmation);
  const pressFeedbackConfirmed = Boolean(pressConfirmation);

  return (
    <div className="App">
      <LogoTopLeft />
      <LanguageDropdown currentLang={lang} onChange={setLang} />
      <WaterBackground valveState={valveState} />
      {/* Valve state popup */}
      {showPopup && (
        <div className="valve-popup-message">
          {popupMessage}
        </div>
      )}
      <h1 className={!buttonEverPressed ? "main-heading-large" : "main-heading-small"}>{uiText.mainHeading}</h1>
      {/* Background image behind LEDs and button */}
      <div className="valve-bg-container">
        <img
          src={require('./images/OpenValve_scaledDown.PNG')}
          alt="Valve background"
          className="valve-bg-img"
        />
        <div
          className="valve-bg-foreground"
          style={{ '--press-confirmation-pulse-duration': `${CONFIRMATION_PULSE_MS}ms` }}
        >
          {/* Show the message and arrow until the button is pressed at least once */}
          {!buttonEverPressed && (
            <div className="press-to-start-message">
              <span className="press-to-start-text">
                {uiText.pressToStart}
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
            className={`press-type-label${showPressFeedback ? ' visible' : ''}${pressConfirmation?.fading ? ' fading' : ''}`}
            style={{ color: showPressFeedback ? displayedPressColor : 'transparent' }}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {showPressFeedback && (
              <span
                key={pressConfirmation?.id ?? 'active-press'}
                className={`press-type-feedback${pressFeedbackConfirmed ? ' confirmed' : ''}`}
                aria-label={pressFeedbackConfirmed
                  ? `${displayedPressLabel}, ${uiText.pressConfirmed}`
                  : displayedPressLabel}
              >
                {pressFeedbackConfirmed && <span aria-hidden="true">✓ </span>}
                {displayedPressLabel}
              </span>
            )}
          </div>
          <button
            className={`button${isPressed ? " pressed" : ""}`}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onContextMenu={e => e.preventDefault()} // Prevent context menu on long press
            aria-label={uiText.pressToStart}
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
                {showPressFeedback && (
                  <circle
                    key={pressConfirmation?.id ?? 'active-progress'}
                    className={pressFeedbackConfirmed ? 'press-progress-confirmed' : ''}
                    cx="28" cy="28" r="24"
                    stroke={displayedPressColor}
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 24}
                    strokeDashoffset={2 * Math.PI * 24 * (1 - Math.min(displayedPressDuration / (VERY_LONG_PRESS_MS / 1000), 1))}
                    style={{ transition: 'stroke-dashoffset 0.02s linear, stroke 0.1s', color: displayedPressColor }}
                  />
                )}
              </svg>
            </span>
          </button>
        </div>
      </div>
      {/* State Info Card: description and possible transitions */}
      {state !== STATES.TRANSITION && (
        <div className="state-info-card">
          <div className="state-info-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {state === STATES.CHANGETHRESHOLD ? (
              <>
                {stateDescriptions[state]?.uiLabel}
                <span className="state-threshold-soillevel">{soilLevel}</span>
              </>
            ) : state === STATES.CHANGEMULTIPLICATOR ? (
              <>
                {stateDescriptions[state]?.uiLabel}
                <span className="state-multiplicator-value">{multiplicator}</span>
              </>
            ) : (
              stateDescriptions[state]?.uiLabel || state
            )}
          </div>
          <div className="state-info-desc">{stateDescriptions[state]?.desc || ''}</div>
          {state === STATES.SHOWSOILMOISTURE && (
            <>
              <InfoAdmonition
                label={uiText.openingThresholdLabel || 'Current Opening Threshold:'}
                value={soilLevel}
                accentClass="info-admonition-blue"
              />
            </>
          )}
          {state === STATES.CHANGETHRESHOLD && (
            <>
              <InfoAdmonition
                label={uiText.currentSoilMoistureLabel || 'Current Soil Moisture:'}
                value={soilMoisture}
                accentClass="info-admonition-blue"
              />
            </>
          )}
          {stateDescriptions[state]?.detailed && stateDescriptions[state]?.detailed.trim() !== '' && (
            <DetailedDescription text={stateDescriptions[state].detailed} uiText={uiText} />
          )}
          {state === "SHOWSOILMOISTURE" && (
            <>
              <div className="state-soilmoisture-slider-info">
                <img src={require('./images/soilSensorIcon.PNG')} alt="Soil sensor icon" className="state-soilmoisture-slider-icon" />
                <span>
                  {uiText.sliderInfoText(soilLevel)}
                </span>
              </div>
              <div className="state-soilmoisture-slider-row">
                <label htmlFor="soilMoistureSlider" className="state-soilmoisture-slider-label">
                  {uiText.sliderLabel}
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
          <hr className="state-info-separator" />
          <div>
            {possibleActions[state] && possibleActions[state].map((action, idx) => {
              // Disable 'Open Valve manually' (Long Press to MANUAL) if valve is already open
              const isManualLongPress =
                state === "SHOWSOILMOISTURE" &&
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
