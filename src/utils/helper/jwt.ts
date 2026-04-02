import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error('JWT secrets are not defined in environment variables');
}

//Access Token
export const signAccessToken = (payload: object): string => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
        algorithm: 'HS256'
    })
}

export const verifyAccessToken = (token: string): object => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as object;
}


//Refresh Token

export const signRefreshToken = (payload: object): string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: '3d',
        algorithm: 'HS256'
    })
}

export const verifyRefreshToken = (token: string): object => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as object;
}