// [GET] /admin/dashboard/
module.exports.dash =  (req, res) => {
    res.render("admin/pages/dashboard/index", {
        pageTitle : "Trang tổng quan"
    }) 
}