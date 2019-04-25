const HID = require('../lib/nodehid');
const REPL = require('repl');

const repl = REPL.start('node-hid> ');
const hid = new HID(1356, 616);

console.log('features', hid.getFeatureReport(0xf2, 17));

hid.gotData = function (err, data) {
    console.log('got ps3 data', data);
    this.read(this.gotData.bind(this));
}

hid.read(hid.gotData.bind(hid));

repl.context.hid = hid;
