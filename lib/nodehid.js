/**
 * HID constructor
 * uses:
 * new HID(path);
 * new HID(vid, pid);
 * HID.devices();
 */

'use strict';

const EventEmitter = require('events');
const binding = require('loady')('HID', __dirname);

class HID extends EventEmitter {
  constructor() {
    super();
    this.closed = false;
    this.paued = false;

    // TODO: untangle this beast
    this.hid = new (Function.prototype.bind.apply(binding.HID,
      [null, ...arguments]))();
    for (const prop in binding.HID.prototype) {
      if (prop === 'close' || prop === 'read')
        continue;

      this[prop] = binding.HID.prototype[prop].bind(this.hid);
    }

    this.init();
  }
  init() {
    this.on('newListener', (name, listener) => {
      if (name === 'data')
        process.nextTick(() => this.resume());
    });
  }
  read(callback) {
    if (this.closed)
      throw new Error('Unable to read from a closed HID device');

    return this.hid.read(callback);
  }
  resume() {
    if (!this.paused || this.listeners('data').length === 0)
      return;

    this.paused = false;
    this.read(this.reader);
  }
  reader(err, data) {
    if (err) {
      this.paused = true;
      this.emit('error', err);
      return;
    }

    if (this.listeners('data').length <= 0)
      this.paused = true;

    // keep reading if not paused
    if (!this.paused)
      this.read(this.reader);

    this.emit('data', data);
  }
  close() {
    this.removeAllListeners();
    this.hid.close();
    this.closed = true;
  }
  pause() {
    this.pause = true;
  }

  static devices() {
    return binding.devices.apply(HID, arguments);
  }
}

module.exports = HID;
