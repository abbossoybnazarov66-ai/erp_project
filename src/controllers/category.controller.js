import categoryService from "../service/category.service.js"
class categoryController {


    async getCategories(req, res, next) {
        try {
            const resData = await categoryService.getCategories(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {

            return (error)
        }
    }

    async createCategories(req, res, next) {

        try {
            const resData = await categoryService.createCategories(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData);

        } catch (error) {
            console.log(error)
            next(error);
        }
    }


    async deleteCategories(req, res, next) {

        try {
            const resData = await categoryService.deleteCategories(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {
            console.log(error.message)
            next(error)

        }
    }
    async updateCategories(req, res, next) {

        const resData = await categoryService.updateCategories(req, res, next)
        console.log(resData)
        if (!resData) return
        return res.status(resData.status).json(resData)
    }
}

let categorycontroller = new categoryController()
export default categorycontroller