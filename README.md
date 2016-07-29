[![NPM Stats](https://nodei.co/npm/vex4pi.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/vex4pi/)

![NPM](https://img.shields.io/npm/dt/vex4pi.svg)
![DavidDM](https://david-dm.org/tejashah88/vex4pi.svg)
![NPM Version](https://img.shields.io/npm/v/vex4pi.svg)

# vex4pi
A JavaScript library allowing the raspberry pi to control VEX motors via the Adafruit Servo/PWM HAT!

# Disclaimer
* This library is intended to work only for the Raspberry PI, and has **NOT** been tested with other hardware platforms.
* This library requires a Adafruit Servo/PWM HAT, and will **NOT** work on direct GPIO.
* This library only supports VEX Motors at of this release, and has not been tested with other VEX hardware, such as the VEX Servos.
* This library only contains sync functions. Async may be implemented in a later version.


# Installation

```
npm install vex4pi --save
```

# Features
* Fail-safe error handling
* Full access to all 16 pin outputs on the PWM/Servo HAT
* Easy to use speed values compared to RobotC code

# Code Example

Let's say we made a simple robot with two motors, one motor controlling the right side of the wheels, and one motor controlling the left side. This code would make the robot go foward at full speed for 5 seconds before stopping. In this example, pin 0 refers to the right motor and pin 1 to the left motor.

```
var vex4pi = require('vex4pi');
var sleep = require('sleep').sleep;

vex4pi.init();
vex4pi.setSpeed(0, 100);
vex4pi.setSpeed(1, -100);

sleep(5);

vex4pi.setSpeed(0, 0);
vex4pi.setSpeed(1, 0);

vex4pi.deinit();
```

# API Reference
