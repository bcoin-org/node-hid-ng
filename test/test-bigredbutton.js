/**
 * Interface with the Dream Cheeky Big Red button
 * http://dreamcheeky.com/big-red-button
 *
 * Uses info gleened from:
 * http://ddurdle.blogspot.com/2013/12/using-usb-big-red-button-panic-button.html
 *
 * @author Tod Kurt (https://github.com/todbot)
 */

/*jslint node: true */
'use strict';

const HID = require('../lib/nodehid');

const device = new HID(7476, 13);
const buttonGetDataCmd = [0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02];

device.on('data', function(data) {
  let msg = '';
  const buttonState = data[0];
  if (buttonState === 0x17) {
    msg = "Lid opened!";
  } else if (buttonState === 0x16) {
    msg = "Button pushed!";
  } else if (buttonState === 0x15) {
    msg = "waiting...";
  }

  console.log('button data', data, msg);
});

setInterval(() => {
  device.write(buttonGetDataCmd);
}, 100);
