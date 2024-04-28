const Product = require("../../models/product.model")
const filterHelper = require("../../helpers/filter.helper")
const paginationHelper = require("../../helpers/pagination.helpers")
const systemConfig = require("../../config/system")
module.exports.index = async (req, res) => {
    const find ={
        deleted: true
    }
    //fiter
    const filterStatus = filterHelper(req)
    
    if(req.query.status){
        find.status = req.query.status

    }
    // end fiflter

    //search
    if(req.query.keyword){
        const regex = new RegExp(req.query.keyword, "i")
        find.title = regex
    }

    // End search
    //Pagination
    const countRecords = await Product.countDocuments(find)
    const objectPagination = paginationHelper(req, countRecords)
    // End Pagination
    const products = await Product
        .find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)
    

    res.render("admin/pages/trash/index", {
        pageTitle : "Danh sach san pham",
        products: products,
        filterStatus: filterStatus,
        keyword: req.query.keyword,
        objectPagination: objectPagination
    }) 
}
//[pre-DELETE] /admin/product/recovery/:id
module.exports.recoveryitem= async (req,res) =>{
    
    res.send("oke")
    
}