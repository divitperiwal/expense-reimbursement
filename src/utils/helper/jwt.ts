import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET

if (!ACCESS_TOKEN_SECRET) {
    throw new Error('JWT secrets are not defined in environment variables');
}

//Access Token
export const signAccessToken = (payload: object): string => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: '12h',
        algorithm: 'HS256'
    })
}

export const verifyAccessToken = (token: string): object => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as object;
}
