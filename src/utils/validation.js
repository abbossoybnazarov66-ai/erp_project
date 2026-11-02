import Joi from "joi"

export default {

    staffSchema: (data) => Joi.object({
        fullname: Joi.string().min(3).max(30).required(),
        phone: Joi.string().pattern(/^\+998(90|91|93|94|95|97|98|99|33|88|77|71)\d{7}$/).required(), role: Joi.string().required(),
        password : Joi.string().min(4).max(20).required(),
        role: Joi.string().required()
    }).validate(data)


}