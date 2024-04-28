const Product = require("../../models/product.model")
const filterHelper = require("../../helpers/filter.helper")
const paginationHelper = require("../../helpers/pagination.helpers")
const systemConfig = require("../../config/system")
//[GET] /admin/product
module.exports.dash = async (req, res) => {
    const find ={
        deleted: false
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
        .sort({ position: "desc"})
    

    res.render("admin/pages/products/index", {
        pageTitle : "Danh sach san pham",
        products: products,
        filterStatus: filterStatus,
        keyword: req.query.keyword,
        objectPagination: objectPagination
    }) 
}
//[PATCH] /admin/product/:status/:id
module.exports.changeStatus = async (req,res) =>{
    const status = req.params.status
    const id = req.params.id

    await Product.updateOne({
        _id: id
    }, {
        status: status

    })
    const infoProduct = await Product.findOne({
        _id: id
    })
    req.flash('succes', `Cập nhật trạng thái sản phẩm ${infoProduct.title} thành công!`)
    res.redirect(`back`)

}
//[PATCH] /admin/product/multi
module.exports.changeMulti= async (req,res) =>{
    console.log(req.body)
    const type = req.body.type
    let ids = req.body.ids
    ids = ids.split(", ")

    

    switch(type){
        case "active":
        case "inactive":
            await Product.updateMany({
                _id: {$in: ids}
            }, {
                status: type
        
            })
            req.flash('succes', 'Cập nhật trạng thái thành công!')
            break
        case"delete-all":
            await Product.updateMany({
                _id: {$in: ids}
            }, {
                delete: true
        
            })
            req.flash('succes', 'Xóa sản phẩm thành công!')
            break
        case"change-position":
            for (const item of ids) {
                let [id, position] = item.split("-")
                position = parseInt(position)
                await Product.updateOne({
                    _id: id
                }, {
                    position: position
            
                })
                
            }
            req.flash('succes', 'Thay đổi vị trí thành công!')
            break    
        default:
            break    
    }
    
    
    res.redirect("back")

}

//[DELETE] /admin/product/delete/:id
module.exports.deleteItem= async (req,res) =>{
    const id = req.params.id;
    await Product.updateOne({
        _id: id
    },{
        deleted: true


    })
    req.flash('succes', 'Xóa sản phẩm thành công!')
    res.redirect("back")
    
}

//[GET] /admin/product/create
module.exports.create= async (req,res) =>{
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm"
    })
    
    
}
//[POST] /admin/product/createPost
module.exports.createPost= async (req,res) =>{
    
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.delete = false
    if(req.body.position){
        req.body.position = parseInt(req.body.position)
    }
    else{
        const countPro = await Product.countDocuments()
        req.body.position = countPro + 1
        
    }
    if(req.file){
        req.body.thumbnail =`/uploads/${req.file.filename}`

    }
    
    
    

    const record = new Product(req.body)
    await record.save()
    req.flash("succes", "Thêm mới sản phẩm thành công!")
    res.redirect(`/${systemConfig.prefixAdmin}/products`)
    
}

//[GET] /admin/product/edit/:id
module.exports.edit= async (req,res) =>{
    const id = req.params.id;
    const product = await Product.findOne({
        _id: id,
        deleted: false
    })
    console.log(product)

    res.render("admin/pages/products/edit", {
        pageTitle: "Chỉnh sản sản phẩm",
        product: product
    })
    
    
}
// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
  
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);
  
    if(req.file) {
      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
  
    await Product.updateOne({
      _id: id,
      deleted: false
    }, req.body);
  
    req.flash("succes", "Cập nhật sản phẩm thành công!");
    res.redirect(`back`);
  }
  // [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id
  
    const product = await Product.findOne({
      _id: id,
      deleted: false
    })
  
    res.render("admin/pages/products/detail", {
      pageTitle: `Sản phẩm: ${product.title}`,
      product: product
    })
}    