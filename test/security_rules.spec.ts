/* tslint:disable */
// Assertion library.
import { use } from 'chai';
// Extends Chai with assertions for the Sinon.JS 
import * as sinonChai from 'sinon-chai';

import * as firebase from '@firebase/testing'

use(sinonChai);

describe('security rules', () => {
    beforeEach(async () => {
        await setUp();
    });
    afterEach(async () => {
        await Promise.all(firebase.apps().map(app => app.delete()));
    });

    it('allows users to read own documents', async () => {
        const db = firestoreWithUser('joe')
        await firebase.assertSucceeds(
            db
                .collection('users')
                .doc('joe')
                .get()
            );
    });

    it('denes users to read other documents', async () => {
        const db = firestoreWithUser('joe');
        await firebase.assertFails(
            db
                .collection('users')
                .doc('mary')
                .get()
        );
    });
});

function firestoreWithUser(user: string): firebase.firestore.Firestore {
    const testApp = firebase.initializeTestApp({
        projectId: 'my-project',
        auth: { uid: user, email: 'someone@gmail.com' }
    })
    return testApp.firestore();
}

async function setUp() {
    const adminApp = firebase.initializeAdminApp({
        projectId: 'my-project'
    });
    const db = adminApp.firestore();
    await createUser(db, 'joe', 'Basel');
    await createUser(db, 'daniel', 'Brig');
    await createUser(db, 'mary', 'Zurich');
    await createUser(db, 'alice', 'Zurich');
    await createUser(db, 'yves', 'Bern');
}

function createUser(
    db: firebase.firestore.Firestore, 
    name: string, 
    city: string): Promise<void> {
    return db.collection('users').doc(name).set({
        name: name,
        city: city
    });
}