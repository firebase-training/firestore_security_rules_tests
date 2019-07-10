import * as firebase from '@firebase/testing'

const projectId = 'my-project';

export async function setup(data: {[key: string]: object}) {
    const app = firebase.initializeAdminApp({
        projectId: projectId
    });
    const db = app.firestore();
    for(const path in data) {
        await db.doc(path).set(data[path]);
    }
}

export function testDatabase(loggedInUid: string): firebase.firestore.Firestore {
    const app = firebase.initializeTestApp({
        projectId: projectId,
        auth: { uid: loggedInUid, email: 'someone@example.com' }
    });
    return app.firestore();
}

export async function teardown() {
    await Promise.all(firebase.apps().map(app => app.delete()));
}

