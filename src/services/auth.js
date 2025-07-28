import { usersCollection } from "../db/model/user.js";
import bcrypt from "bcrypt"
import createHttpError from "http-errors";
import { sessionsCollection } from "../db/model/session.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/index.js";
import { randomBytes } from 'crypto';
import { createSession } from "../utils/createSession.js";



export const registerUser = async (payload) => {

    const user = await usersCollection.findOne({ email: payload.email });
    
    if (user) {
        throw createHttpError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const newUser = await usersCollection.create({
        ...payload,
        password: hashedPassword,
    });
    return newUser;
};



export const loginUser = async ({email, password}) => {

    const user = await usersCollection.findOne({ email });
    
    if (user === null) {
        throw createHttpError(401, "Email or password is incorrect");
    }

    
    const correctPassword = await bcrypt.compare(password, user.password);

    if (correctPassword !== true) {
        throw createHttpError(401, "Email or password is incorrect");
    }

    await sessionsCollection.deleteOne({ userId: user._id });

        const accessToken = randomBytes(30).toString('base64');
        const refreshToken = randomBytes(30).toString('base64');

            return await sessionsCollection.create({
                userId: user._id,
                accessToken,
                refreshToken,
                accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
                refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
            });



};



export const refreshUser = async ({ sessionId, refreshToken }) => {

    const session = await sessionsCollection.findOne({ _id: sessionId, refreshToken });
        
    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

        const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) {
        throw createHttpError(401, 'Session token expired');
    }
        
        const newSession = createSession();

    await sessionsCollection.deleteOne({ _id: sessionId, refreshToken });


    return await sessionsCollection.create({
       userId: session.userId,
        ...newSession,
    });
};




export const logouthUser = async ( sessionId ) => {

    await sessionsCollection.deleteOne({ _id: sessionId})

}