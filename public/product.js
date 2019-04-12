$(() => {

    function refreshVendorList() {
        $.get('/vendor', (data) => {
            console.log("I m In Refresh Vendor List");
            for (let vendo of data) {
                console.log(`${vendo.id}`);
                $('#vendor_list').append(
                    `<option value= ${vendo.id}> ${vendo.name} </option>`
                )
            }
        })
    }

    refreshVendorList()

    function refreshList() {
        $.get('/product', (data) => {

            // Empty The List Of Product
            $('#product_list').empty();

            console.log("I am In the Product List Display in Product.js")

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
                         <button class="col btn btn-danger m-3" id=${prod.id}>Delete</button>
                     </div>
                 </div>`
                )
                $("button").click(function () {
                    jQuery.ajax({
                        url: '/product/' + this.id,
                        type: 'DELETE',
                        success: function (result) {
                            if (result.success) {
                                refreshList()
                            } else {
                                alert("Some error Has Been Occured While Delete The Product")
                            }
                        }
                    });
                })
            }
        })
    }

    refreshList()

    $('#add_product').click(() => {
        if ($('#product_name').val() === "") {
            alert("Product Name is Required");
        } else if ($('#quantity').val() === "") {
            alert("Product Quantity is Minimum 1");
        } else if ($('#price').val() === "") {
            alert("Product Price is Required");
        } else {
            $.post(
                '/product',
                {
                    product_name: $('#product_name').val(),
                    quantity: $('#quantity').val(),
                    price: $('#price').val(),
                    vendor_id: $('#vendor_list').val()
                },
                (data) => {
                    if (data.success) {
                        alert("Product Added Successfully !! @_@")
                        refreshList()
                    } else {
                        alert(data.err)
                    }
                }
            )
        }
    })
})