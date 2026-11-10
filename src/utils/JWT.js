import "dotenv/config"
import JWT from "jsonwebtoken"


export function genereteAccessToken(payload){

    return JWT.sign(payload,process.env.SECRET_KEY,{expiresIn:"30m"})

}


export function genereteRefreshToken(payload){
    return JWT.sign(payload,process.env.SECRET_KEY,{expiresIn:"24h"})
}
