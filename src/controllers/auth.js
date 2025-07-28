import { loginUser, logouthUser, refreshUser, registerUser } from "../services/auth.js";
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
