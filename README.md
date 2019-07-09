# vex4pi

[![NPM Version](https://img.shields.io/npm/v/vex4pi.svg)](https://www.npmjs.com/package/vex4pi)

A JavaScript library allowing the Raspberry Pi to control VEX motors via the [Adafruit Servo/PWM HAT](https://www.adafruit.com/product/2327)!

# Disclaimer
* This library is intended to work only for the Raspberry Pi, and has **NOT** been tested with other hardware platforms.
* This library requires a [Adafruit Servo/PWM HAT](https://www.adafruit.com/product/2327), and will **NOT** work on direct GPIO.
* This library only supports VEX Motors at of this release, and has not been tested with other VEX hardware, such as the VEX Servos.

# Features
* Fail-safe error handling (will reset all pin speed values to 0 and close the connection to the PWM/Servo HAT before throwing an error)
* Full access to all 16 pin outputs on the PWM/Servo HAT
* Easy to use speed values compared to RobotC code (range from -100 to 100)

# Code Example
Let's say we made a simple robot with two motors, one motor controlling the right side of the wheels, and one motor controlling the left side. This code would make the robot go foward at full speed for 5 seconds before stopping. In this example, pin 0 refers to the right motor and pin 1 to the left motor.

```javascript
const { Vex4Pi } = require('vex4pi');
const { sleep } = require('sleep');

let robot = new Vex4Pi();

// initialize the pins on the robot
robot.init();

// make the robot go full speed ahead
robot.setSpeed(0, 100);
robot.setSpeed(1, -100);

// wait for 5 seconds
sleep(5);

// stop the robot
robot.setSpeed(0, 0);
robot.setSpeed(1, 0);

// free up the pins
robot.deinit();
```

# API Reference
```javascript
/*
 * Initializes the connection to the PWM/Servo HAT at address `0x40` at `/dev/i2c-1`, and
 * resets all of the pin speed values to 0.
 */
Vex4Pi.init();

/*
 * Resets all of the pin speed values to 0 before gracefully closing the connection with
 * the PWM/Servo HAT.
 */
Vex4Pi.deinit();

/*
 * Sets the `speed` of a motor at the designated `pin` value. Note that the accepted speed
 * values are between -100 and 100, and any value outside that range will be confined into
 * that range (ex. -150 => -100 or 420 => 100). If the init() function has not been called
 * before, or the pin value is not an integer/out of range, this module will throw an error.
 */
Vex4Pi.setSpeed(Integer pin, Integer speed);
```