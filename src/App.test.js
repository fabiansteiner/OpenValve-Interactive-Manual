import React, { act } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

jest.mock("./WaterBackground", () => () => null);

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("OpenValve button press timing", () => {
  let container;
  let root;
  let pointerId;

  const button = () => container.querySelector("button.button");
  const stateTitle = () => container.querySelector(".state-info-title")?.textContent.trim() ?? "";
  const feedback = () => container.querySelector(".press-type-feedback");

  const dispatchPointer = (type) => {
    const event = new MouseEvent(type, { bubbles: true, cancelable: true });
    Object.defineProperty(event, "pointerId", { value: pointerId });
    act(() => button().dispatchEvent(event));
  };

  const pointerDown = () => dispatchPointer("pointerdown");
  const pointerUp = () => dispatchPointer("pointerup");
  const pointerCancel = () => dispatchPointer("pointercancel");
  const advance = (milliseconds) => act(() => jest.advanceTimersByTime(milliseconds));

  const shortPress = (duration = 200) => {
    pointerDown();
    advance(duration);
    pointerUp();
    pointerId += 1;
  };

  const enterBattery = () => {
    shortPress();
    expect(stateTitle()).toBe("Display Battery Level");
  };

  const enterThresholdSelection = () => {
    enterBattery();
    pointerDown();
    advance(1100);
    pointerUp();
    advance(700);
    pointerId += 1;
    expect(stateTitle()).toBe("Select Opening Threshold");
  };

  beforeEach(() => {
    jest.useFakeTimers();
    window.history.replaceState({}, "", "/?lang=en");
    pointerId = 1;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => root.render(<App />));
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("a short press executes on release and retains its confirmation", () => {
    pointerDown();
    advance(500);

    expect(stateTitle()).toBe("Sleep");
    expect(feedback().textContent).toContain("Short Press");
    expect(feedback().classList.contains("confirmed")).toBe(false);

    pointerUp();

    expect(stateTitle()).toBe("Display Battery Level");
    expect(feedback().textContent).toContain("✓ Short Press");
    expect(feedback().classList.contains("confirmed")).toBe(true);

    advance(700);
    expect(container.querySelector(".press-type-label").classList.contains("fading")).toBe(true);
    advance(180);
    expect(feedback()).toBeNull();
  });

  test("a long press executes at one second and is not repeated on release", () => {
    enterBattery();
    pointerDown();
    advance(999);

    expect(stateTitle()).toBe("Display Battery Level");
    expect(feedback().classList.contains("confirmed")).toBe(false);

    advance(1);

    expect(container.querySelector(".state-info-card")).toBeNull();
    expect(feedback().textContent).toContain("✓ Long Press");

    advance(300);
    pointerUp();
    advance(500);

    expect(stateTitle()).toBe("Select Opening Threshold");
    expect(feedback().textContent).toContain("✓ Long Press");
  });

  test("a continuous hold from battery reaches very long press after the long transition", () => {
    enterBattery();
    pointerDown();

    advance(1000);
    expect(feedback().textContent).toContain("✓ Long Press");
    advance(800);
    expect(stateTitle()).toBe("Select Opening Threshold");

    advance(1200);
    expect(feedback().textContent).toContain("✓ Very Long Press");
    expect(container.querySelector(".press-progress-confirmed").getAttribute("stroke-dashoffset")).toBe("0");

    advance(2000);
    expect(stateTitle()).toBe("Off");
    pointerUp();
  });

  test("a hold starting in threshold selection can power off after entering threshold editing", () => {
    enterThresholdSelection();
    pointerDown();

    advance(1000);
    advance(800);
    expect(stateTitle()).toBe("Change Opening Threshold:1");

    advance(1200);
    expect(feedback().textContent).toContain("Very Long Press");
    advance(2000);
    expect(stateTitle()).toBe("Off");
    pointerUp();
  });

  test("a hold starting in additional-time selection can power off after entering additional-time editing", () => {
    enterThresholdSelection();
    shortPress();
    expect(stateTitle()).toBe("Select Additional Time");

    pointerDown();
    advance(1000);
    advance(800);
    expect(stateTitle()).toBe("Change Additional Time:1");

    advance(1200);
    expect(feedback().textContent).toContain("Very Long Press");
    advance(2000);
    expect(stateTitle()).toBe("Off");
    pointerUp();
  });

  test("saving an edited value stops sampling as soon as acknowledgement starts", () => {
    enterBattery();

    pointerDown();
    advance(1100);
    pointerUp();
    advance(700);
    expect(stateTitle()).toBe("Select Opening Threshold");
    pointerId += 1;

    pointerDown();
    advance(1100);
    pointerUp();
    advance(700);
    expect(stateTitle()).toBe("Change Opening Threshold:1");
    pointerId += 1;

    pointerDown();
    advance(1000);

    expect(button().classList.contains("pressed")).toBe(false);
    expect(feedback().textContent).toContain("✓ Long Press");
    expect(container.querySelector(".state-info-card")).toBeNull();

    advance(800);
    expect(stateTitle()).toBe("Sleep");
    advance(2200);
    expect(stateTitle()).toBe("Sleep");

    pointerUp();
    expect(stateTitle()).toBe("Sleep");
  });

  test("off powers on at three seconds without waiting for release", () => {
    enterBattery();
    pointerDown();
    advance(3000);
    advance(2000);
    expect(stateTitle()).toBe("Off");
    pointerUp();
    pointerId += 1;

    pointerDown();
    advance(1000);
    expect(stateTitle()).toBe("Off");
    expect(feedback().classList.contains("confirmed")).toBe(false);

    advance(2000);
    expect(stateTitle()).toBe("Display Battery Level");
    expect(feedback().textContent).toContain("✓ Very Long Press");
    pointerUp();
  });

  test("pointer cancellation produces no release action", () => {
    pointerDown();
    advance(500);
    pointerCancel();
    pointerUp();

    expect(stateTitle()).toBe("Sleep");
    expect(feedback()).toBeNull();
  });
});
