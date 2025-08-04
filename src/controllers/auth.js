import { loginUser, logouthUser, refreshUser, registerUser, resetEmail, resetPassword } from "../services/auth.js";
import { ONE_DAY } from "../constants/index.js";



export async function registerUserController(req, res) {
    
    const user = await registerUser(req.body);

        res.status(201).json({
		    status: 201,
		    message: "Successfully registered a user!",
		    data: user,
        });
};



export async function loginUserController(req, res) {
    
    const session = await loginUser(req.body);

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    
    });


        res.status(200).json({
		    status: 200,
		    message: "Successfully logged in an user!",
            data: {
                accessToken: session.accessToken,
            },
        });
};



export async function refreshUserController(req, res) {
    const session = await refreshUser({ sessionId: req.cookies.sessionId, refreshToken: req.cookies.refreshToken });
    
    res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
    
    res.status(200).json({
		    status: 200,
		    message: "Successfully refreshed a session!",
            data: {
                accessToken: session.accessToken,
            },
        });
    
};


export async function logoutUserController(req, res) {
    
    if (req.cookies.sessionId) {
        logouthUser( req.cookies.sessionId );     
    }
   
    
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');


    res.status(204).send();
}



export const resetEmailController = async (req, res ) => {

    await resetEmail(req.body.email);
    
       res.status(200).json({
       status: 200,
       message: "Reset password email has been successfully sent.",
       data: {}
   })


}



export const resetPasswordController = async (req, res ) => {

    const password = req.body.password;
    const token = req.body.token;


    await resetPassword( token, password );
    
       res.status(200).json({
       status: 200,
       message: "Password has been successfully reset.",
       data: {}
   
   })


}