import { usersCollection } from "../db/model/user.js";
import bcrypt from "bcrypt"
import createHttpError from "http-errors";
import { sessionsCollection } from "../db/model/session.js";
import { FIFTEEN_MINUTES, ONE_DAY, SMTP } from "../constants/index.js";
import { randomBytes } from 'crypto';
import { createSession } from "../utils/createSession.js";
import jwt from "jsonwebtoken"
import { sendEmail } from "../utils/sendEmail.js";
import { getEnvVar } from "../utils/getEnvVar.js";



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

    await sessionsCollection.deleteOne({ _id: sessionId });

}



export const resetEmail = async ( email ) => {

    const user = await usersCollection.findOne({ email });
    
    if (user === null) {
        throw createHttpError(404, "User not found!")
    }


    const resetToken = jwt.sign(
        {
            sub: user._id,
            email,
        },
        getEnvVar('JWT_SECRET'),
        {
            expiresIn: '5m',
        },
    );

    // console.log(resetToken);

    try {

        await sendEmail({
            from: getEnvVar(SMTP.SMTP_FROM),
            to: email,
            subject: 'Reset your password',
            html: `<p>Click <a href="${getEnvVar('APP_DOMAIN')}/reset-password?${resetToken}">here</a> to reset your password!</p>`,
        });
        
    } catch (error) {
        console.error("Failed to send email:", error.message);
        throw createHttpError(500, "Failed to send the email, please try again later.");
    }
    


}



export const resetPassword = async ( token, password ) => {

    
    try {
        const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));

        const user = await usersCollection.findById(decoded.sub);
    
            if (user === null) {
                throw createHttpError(404, "User not found!");
        }
        
            // if ()

        const hashedPassword = await bcrypt.hash(password, 10);

        await usersCollection.findByIdAndUpdate(user._id, { password: hashedPassword });
        await sessionsCollection.deleteOne({ userId: user._id });

    } catch (error) {

        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            throw createHttpError(401, "Token is expired or invalid.");
        }
     
        throw error;
    }
    

}