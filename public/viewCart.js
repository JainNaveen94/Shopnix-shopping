$(() => {

    function refreshCartList() {
        if (localStorage.getItem("userID") == null) {
            alert(" Please Login To View The Cart ");
            window.location = "http://localhost:9999/";
        } else {
            $.get('/cart/' + localStorage.getItem("userID"), (data) => {

                // Empty The Cart List If Exist
                $('#cart_list').empty();

                let total_price = 0;
                let count = 1;

                // Again Adding the Cart List on Page
                for (let cartitem of data) {
                    total_price = total_price + parseInt(cartitem.product.price) * parseInt(cartitem.quantity);
                    $('#cart_list').append(
                        `<tr>
                        <td><h3> ${cartitem.product.name} </h2></td>
                        <td><h3><b> ${cartitem.product.price} <b></h2></td>
                        <td><h3> ${cartitem.quantity} </h2></td>
                        <td><button class="btn btn-danger" id=${cartitem.id}>Delete Product</button></td>
                      </tr>`
                    )
                    $("button").click(function () {
                        jQuery.ajax({
                            url: '/cart/' + this.id,
                            type: 'DELETE',
                            success: function (result) {
                                if (result.success) {
                                    refreshCartList();
                                } else {
                                    alert("Some error Has Been Occured While Delete The Product")
                                }
                            }
                        });
                    })
                }
                $('#cart_list').append(
                    `<tr>
                    <td colspan = "3"><h1><b> Total Price <b></h2></td>
                    <td ><h1><b> ${total_price} <b></h2></td>
                  </tr>
                  <tr>
                    <td colspan = "4" align="center"></h2><button class="btn btn-success" id="check_out"}>Check Out</button></td>
                  </tr>`
                )
                $("#check_out").click(function () {
                    jQuery.ajax({
                        url: '/carts/' + localStorage.getItem("userID"),
                        type: 'DELETE',
                        success: function (result) {
                            if (result.success) {
                                alert("Checkout Successfully!");
                                window.location = "home.html";
                            } else {
                                alert("Some error Has Been Occured While checkout! Please Try Again After Some Time")
                            }
                        }
                    });
                })
            })
        }
    }

    refreshCartList();

})