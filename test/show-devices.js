#!/usr/bin/env node

'use strict';

const HID = require('../lib/nodehid');
console.log('devices:', HID.devices());
