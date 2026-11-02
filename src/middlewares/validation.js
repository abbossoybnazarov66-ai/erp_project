
import schema from "../utils/validation.js"
import { ValidationError } from "../utils/error.js"



export default {

    staffCreate: (req, res, next) => {
        try {
            let { error } = schema.staffSchema(req.body)

            if (error) {
                
                return next( new ValidationError(400,error.message)) 
                }
                
            }

           
        


        catch (error) {
             console.log("MIDDLEWARE XATO:", error);
            return res.status(500).json({
                status: 500,
                message : "server xatoligi boldiii"
            })
            

        }
        return next()
    
    }
}





