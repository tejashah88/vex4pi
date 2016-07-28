// Import the needed modules and initialize the needed vars
var i2c = require('i2c-bus');
var bus; // the bridge to directly control the vex motors
var ready = false; // used to see if the PWM HAT is ready to send commands
var vex4pi = {};

var broadcastError = function(msg) {
	vex4pi.deinit();
	return new Error(msg);
}

vex4pi.init = function() {
	bus = i2c.openSync(1);
	bus.writeByteSync(0x40,0x00,0x10); // sleep mode
	bus.writeByteSync(0x40,0xFE,0x85); // set to ~49.5Hz
	bus.writeByteSync(0x40,0x00,0x00); // wake up
	bus.writeByteSync(0x40,0x01,0x04); // output enable
	
	ready = true; // mark the 'ready' flag to true to allow access
};

vex4pi.deinit = function() {
	for (var pin = 0; pin < 16; pin++) {
		vex4pi.setSpeed(pin, 0);
	}
	
	ready = false;	// we mark the 'ready' flag false first, in order to prevent
					// accidental access during the procedure
	bus.closeSync();
}

vex4pi.setSpeed = function(pin, speed) {
	if (!ready) {
		throw broadcastError("I2C bus connection is not initialized with vex4pi.init()");
	// check if the pin value given is within range
	} else if (pin < 0 || pin > 15) {
		throw broadcastError("Pin value " + pin + " is out of range.");
	// check if the speed value given is within range
	} else if (speed < -100 || speed > 100) {
		throw broadcastError("Speed value " + speed + " is out of range.");
	}
	
	//initial configuration
	bus.writeByteSync(0x40, 0x06 + (this.pin * 0x04), 0x00);
	bus.writeByteSync(0x40, 0x07 + (this.pin * 0x04), 0x00);
	
	// perform the calculations to convert the percentage into a PWM-ready number
	// 0x130 = neutral (speed = 0)
	speed += 0x130;
	var speedHSB = parseInt(speed / 0x100);
	var speedLSB = speed % 0x100;
	
	// set the actual speed
	bus.writeByteSync(0x40, 0x08 + (this.pin * 0x04), speedLSB); // low part of data
	bus.writeByteSync(0x40, 0x09 + (this.pin * 0x04), speedHSB); // high part of data
}

module.exports = vex4pi;