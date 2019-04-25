console.log('test-ci: Attempting to load node-hid library');
try {
    const HID = require('../lib/nodehid');
} catch(err){
    console.log('test-ci: This should error in CI: '+err);
}
console.log('test-ci: Done');
