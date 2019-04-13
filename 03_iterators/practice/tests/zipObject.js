import test from 'tape-catch';
import _zipObject from 'lodash.zipobject';
import zipObject from '../exercises/zipObject';

const props = ['studentsCount', 'coachesCount'];
const values = [15, 2, 15, 16];

test('zipObject', t => {
  t.equal(typeof zipObject, 'function');

  t.test('zipObject corresponding values', tt => {
    tt.deepEqual(zipObject(props, values), _zipObject(props, values));
    tt.end();
  });

  t.test('zipObject with props and values with different length', tt => {
    const props5 = ['cats', 'dogs', 'mouses', 'spiders', 'UFO'];
    const values4 = ['cute', 'funny', 'white', 'omg'];
    const zeroLengthArray = [];

    tt.deepEqual(zipObject(props5, values4), _zipObject(props5, values4));
    tt.deepEqual(zipObject(props5, zeroLengthArray), _zipObject(props5, zeroLengthArray));
    tt.deepEqual(zipObject(zeroLengthArray, props5), _zipObject(zeroLengthArray, props5));
    tt.end();
  });

  t.end();
});
