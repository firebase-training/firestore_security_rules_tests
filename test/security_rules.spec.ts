/* tslint:disable */
import * as firebase from '@firebase/testing'
import {setup, teardown, testDatabase} from './helpers'

describe('security rules', () => {
    beforeEach(async () => {
        const data = {
            ['users/joe']: { name: 'joe' },
            ['users/mary']: { name: 'mary' }
        }
        await setup(data)
    });
    afterEach(async () => {
        await teardown()
    });

    it('allows users to read own documents', async () => {
        await firebase.assertSucceeds(
            testDatabase('joe')
                .collection('users')
                .doc('joe')
                .get()
            );
    });

    it('denes users to read other documents', async () => {
        await firebase.assertFails(
            testDatabase('joe')
                .collection('users')
                .doc('mary')
                .get()
        );
    });
});