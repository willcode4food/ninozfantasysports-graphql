import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { Storage } from '@google-cloud/storage'
import * as dotenv from 'dotenv'
import * as fireorm from 'fireorm'

export function initialize() {
    const storage = new Storage()
    const config = {
        apiKey: process.env.APIKEY,
        authDomain: process.env.AUTHDOMAIN,
        databaseURL: process.env.DATABASEURL,
        projectId: process.env.PROJECTID,
        storageBucket: process.env.STORAGEBUCKET,
        messagingSenderId: process.env.MESSAGINGSENDERID,
    }
    admin.initializeApp(functions.config().firebase)

    const firestore = admin.firestore()
    const settings = { timestampsInSnapshots: true }
    const storageBucket = process.env.STORAGEBUCKET

    firestore.settings(settings)
    fireorm.initialize(firestore)
}
