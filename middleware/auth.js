import jwt from 'jsonwebtoken'

const auth = async (req,res,next)=>{
    try{
        const token = req.headers.Authorization.split(" ")[1]
        const isCustomAuth = token.length < 500 // si pasa esto, el token es nuestro, o sea no de Google Auth (en este caso)
        let decodedData;
        if(token && isCustomAuth){
            decodedData= jwt.verify(token,'test')
            req.userId = decodedData?.id
        }else{
            decodedData= jwt.decode(token)
            req.userId= decodedData?.sub //sub: ID de google
        }
    // si mandas una req o res? como en este caso con el req.userId en un middleware, la función 'next' tiene acceso a ella.
        next()
    }catch (error){
        console.log(error)
    }
}

export default auth

//wants to like a post (clickea):
//  - auth middleware (confirma o no si puede hacer esa acción)
//  - likea
