const i2c = require('i2c-bus');
let bus;            // the bridge to directly control the vex motors
let ready = false;  // used to see if the PWM HAT is ready to send commands
let vex4pi = {};

function broadcastError(msg) {
  // always deinitialize the bus before throwing an error
  vex4pi.deinit();
  throw new Error(msg);
}

function resetAllPins() {
  for (let pin = 0; pin < 16; pin++)
    vex4pi.setSpeed(pin, 0);
}

vex4pi.init = function init() {
  bus = i2c.openSync(1);
  bus.writeByteSync(0x40,0x00,0x10); // sleep mode
  bus.writeByteSync(0x40,0xFE,0x85); // set to ~49.5Hz
  bus.writeByteSync(0x40,0x00,0x00); // wake up
  bus.writeByteSync(0x40,0x01,0x04); // output enable

  // reset the pins to avoid surprises from the motors
  resetAllPins();

  ready = true; // mark the 'ready' flag to true to allow access
};

vex4pi.deinit = function deinit() {
  // we mark the 'ready' flag false first, in order to prevent accidental access during the procedure
  ready = false;

  // reset the motor speed to neutral before closing the connection with the bus
  resetAllPins();

  // close the connection with the bus
  bus.closeSync();
}

vex4pi.setSpeed = function(pin, speed) {
  if (!ready) {
    broadcastError("I2C bus connection is not initialized with vex4pi.init()");
  } else if (pin < 0 || pin > 15) { // check if the pin value given is within range
    broadcastError("Pin value " + pin + " is out of range.");
  } else {
    // check if the speed value given is within range
    if (speed < -100)
      speed = -100;
    if (speed > 100)
      speed = 100;
  }

  //initial configuration
  bus.writeByteSync(0x40, 0x06 + (this.pin * 0x04), 0x00);
  bus.writeByteSync(0x40, 0x07 + (this.pin * 0x04), 0x00);

  // perform the calculations to convert the percentage into a PWM-ready number
  // 0x130 = neutral (speed = 0)
  speed += 0x130;
  let speedHSB = parseInt(speed / 0x100);
  let speedLSB = speed % 0x100;

  // set the actual speed
  bus.writeByteSync(0x40, 0x08 + (this.pin * 0x04), speedLSB); // low part of data
  bus.writeByteSync(0x40, 0x09 + (this.pin * 0x04), speedHSB); // high part of data
}

module.exports = vex4pi;