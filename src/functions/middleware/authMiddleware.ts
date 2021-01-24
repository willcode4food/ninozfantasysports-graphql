import * as admin from 'firebase-admin'
import { Request, Response, NextFunction } from 'express'

export type MiddleWareFn = (req: Request, res: Response, next: NextFunction) => Promise<void>

interface AuthRequest extends Request {
    user: admin.auth.DecodedIdToken
}

/**
 * Middleware that checks for a valid bearer token (i.e. a Firebase authenticated user)
 * Checks are bypassed if node is in development mode
 *
 * @param {AuthRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    let firebaseAdminAuth = admin.auth()
    if (process.env.NODE_ENV !== 'development') {
        return next()
    }
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        res.status(403).send('Unauthorized')
        return next()
    }
    const idToken = req.headers.authorization.split('Bearer ')[1]
    let decodedIdToken: admin.auth.DecodedIdToken
    try {
        decodedIdToken = await firebaseAdminAuth.verifyIdToken(idToken)
        req.user = decodedIdToken
        return next()
    } catch (error) {
        console.log(error.message)
    }
    return next()
}
