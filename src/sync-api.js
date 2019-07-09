'use strict';

const i2c = require('i2c-bus');
const Vex4PiError = require('./vex-error');

class Vex4Pi {
  constructor() {
    this.ready = false; // used to see if the PWM HAT is ready to send commands
  }

  resetAllPins() {
    for (let pin = 0; pin < 16; pin++)
      this.setSpeed(pin, 0);
  }

  init() {
    this.bus = i2c.openSync(1); // the bridge to directly control the vex motors
    this.bus.writeByteSync(0x40, 0x00, 0x10); // sleep mode
    this.bus.writeByteSync(0x40, 0xFE, 0x85); // set to ~49.5Hz
    this.bus.writeByteSync(0x40, 0x00, 0x00); // wake up
    this.bus.writeByteSync(0x40, 0x01, 0x04); // output enable

    // reset the pins to avoid surprises from the motors
    this.resetAllPins();

    this.ready = true; // mark the 'ready' flag to true to allow access
  }

  deinit() {
    // we mark the 'ready' flag false first, in order to prevent accidental access during the procedure
    this.ready = false;

    // reset the motor speed to neutral before closing the connection with the bus
    this.resetAllPins();

    // close the connection with the bus
    this.bus.closeSync();
  }

  setSpeed(pin, speed) {
    if (!this.ready) {
      this.deinit();
      throw new Vex4PiError('I2C bus connection is not initialized with this.init()');
    }

    // check if the pin value given is within range
    if (pin < 0 || pin > 15) {
      this.deinit();
      throw new Vex4PiError(`Pin value ${pin} is out of range.`);
    }

    // check if the speed value given is within range
    if (speed < -100) speed = -100;
    if (speed > 100) speed = 100;

    //initial configuration
    this.bus.writeByteSync(0x40, 0x06 + (this.pin * 0x04), 0x00);
    this.bus.writeByteSync(0x40, 0x07 + (this.pin * 0x04), 0x00);

    // perform the calculations to convert the percentage into a PWM-ready number
    // 0x130 = neutral (speed = 0)
    speed += 0x130;
    const speedHSB = parseInt(speed / 0x100);
    const speedLSB = speed % 0x100;

    // set the actual speed
    this.bus.writeByteSync(0x40, 0x08 + (this.pin * 0x04), speedLSB); // low part of data
    this.bus.writeByteSync(0x40, 0x09 + (this.pin * 0x04), speedHSB); // high part of data
  }
}

module.exports = Vex4Pi;