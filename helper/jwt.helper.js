/**
 * Created by trungquandev.com's author on 16/10/2019.
 * src/controllers/auth.js
 */
const jwt = require("jsonwebtoken");
/**
 * private function generateToken
 * @param user 
 * @param secretSignature 
 * @param tokenLife 
 */

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-quylt";
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "100h";

let generateToken = (user, secretSignature = accessTokenSecret, tokenLife = accessTokenLife) => {
    return new Promise((resolve, reject) => {
        // Định nghĩa những thông tin của user mà bạn muốn lưu vào token ở đây

        const userData = {
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            phone : user.phone,
            role : user.role
        }

        // Thực hiện ký và tạo token
        jwt.sign(userData,
            secretSignature,
            {
                algorithm: "HS256",
                expiresIn: tokenLife,
            },
            (error, token) => {
                if (error) {
                    return reject(error);
                }
                resolve(token);
            });
    });
}
/**
 * This module used for verify jwt token
 * @param {*} token 
 * @param {*} secretKey 
 */
let verifyToken = (token, secretKey = accessTokenSecret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (error, decoded) => {
            if (error) {
                return reject(error);
            }
            resolve(decoded);
        });
    });
}
module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken,
};