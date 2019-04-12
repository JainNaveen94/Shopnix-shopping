$(() => {

    function refreshProductList() {
        $.get('/product', (data) => {

            // Empty The List Of Product
            $('#product_list').empty();

            // Again Add The List To The Page
            for (let prod of data) {
                $('#product_list').append(
                    `<div class = "col-4 card ">
                    <h4 class="product-name">${prod.name}</h4>
                     <div class = "product-manufacture">${prod.vendor.name}</div>
                     <div class="row">
                         <div class="col m-3 p-3">
                         <b>Qty::</b>${prod.quantity}
                         </div>
                         <div class="col m-3 p-3">
                           <b>Rs.${prod.price}</b>
                         </div>
                         <button class="col btn btn-dark m-3" id=${prod.id}>Add To Cart</button>
                     </div>
                 </div>`
                )
            }
            $("button").click(function () {
                if(localStorage.getItem("userID") == null){
                    alert("please Login First To Add The Data Into The Your Cart");
                    window.location = "index.html";
                }
                jQuery.ajax({
                    url: '/cart',
                    type: 'POST',
                    data: {
                        userid: localStorage.getItem("userID"),
                        prodid: this.id
                    },
                    success: function (result) {
                        if (result.success) {
                            alert("Product Is Added To The Cart");
                        } else {
                            alert("Some error Has Been Occured While Adding The Product To The Cart");
                        }
                    }
                });
            })
        })
    }

    refreshProductList();
})