/*
 * A JavaScript library allowing the raspberry pi to control VEX motors
 * via the Adafruit Servo/PWM HAT!
 */

// Import the needed modules and initialize the needed vars
var i2c = require('i2c-bus');
var bus; // the bridge to directly control the vex motors
var pins = []; // used to maintain active list of pins used up; range = 0-15
var ready = false; // used to see if the PWM HAT is ready to send commands

// Utility methods

//checks if the variable being checked is a legit integer
function isInteger(n){
  return ((typeof n == "number") && !isNaN(n) && (parseFloat(n) == parseInt(n)));
}

// used for checking if an array has a certain value
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

// Main class to manipulate the vex motors
function VexMotor(pin) {
	// check if the i2c-bus is ready
	if (!ready) {
		throw new Error("I2C bus connection is not initialized with VexMotor.init()");
	// do some type checking
	} else if (!isInteger(pin)) {
		throw new Error("Pin value " + pin + " is invalid! Use an integer.");
	} else if (pin < 0 || pin > 15) { // check if the pin value given is within range
		throw new Error("Pin value " + pin + " is out of range of 0 to 15!");
	// check if the pin specified is not used
	} else if (pins.contains(pin)) {
		throw new Error("Pin value " + pin + " is already in use!");
	// we are good to go
	} else {
		this.pin = pin;
		pins.push(pin);
		this.setSpeed(0);
	}
}

VexMotor.init = function() {
	bus = i2c.openSync(1);
	bus.writeByteSync(0x40,0x00,0x10); // sleep mode
	bus.writeByteSync(0x40,0xFE,0x85); // set to ~49.5Hz
	bus.writeByteSync(0x40,0x00,0x00); // wake up
	bus.writeByteSync(0x40,0x01,0x04); // output enable
	
	ready = true; // mark the 'ready' flag to true to allow access
};

VexMotor.deinit = function() {
	if (pins.length > 0) {
		throw new Error("Warning: there are still VexMotor objects that haven't been closed properly! Pins " + pins + " are still in use.");
	}
	
	ready = false;	// we mark the 'ready' flag false first, in order to prevent
					// accidental access during the procedure
	bus.closeSync();
}

VexMotor.prototype.setSpeed = function(speed) {
	if (!ready) {
		throw new Error("I2C bus connection is not initialized with VexMotor.init()");
	// do some type checking
	} else if (!isInteger(speed)) {
		throw new Error("Speed value " + pin + " is invalid! Use an integer.");
	} else if (speed < -100 || speed > 100) { // check if the pin value given is within range
		throw new Error("Speed value " + pin + " is out of range of -100 to 100!");
	// check if the pin specified is not used
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

VexMotor.prototype.detach = function() {
	this.setSpeed(0);
	pins = pins.filter(e => e !== this.pin);
}

exports.VexMotor = VexMotor;
