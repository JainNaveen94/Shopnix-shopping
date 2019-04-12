$(() => {

    function refreshList() {
        $.get('/vendor', (data) => {

            // Make List Empty Here
            $('#vendor_list').empty();

            let count = 1;
            // Again Add The List To The Page
            for (let vendor of data) {
                $('#vendor_list').append(
                    `<tr>
                    <th scope="row">${count++}</th>
                    <td><h2> ${vendor.name} </h2></td>
                    <td><h2> ${vendor.address} </h2></td>
                    <td> <button class="btn btn-danger"  id=${vendor.id} " > Delete </button></td>
                  </tr>`
                )
                $("button").click(function () {
                    jQuery.ajax({
                        url: '/vendor/' + this.id,
                        type: 'DELETE',
                        success: function (result) {
                            if (result.success) {
                                refreshList()
                            } else {
                                alert("Some error Has Been Occured While Delete The Vendor")
                            }
                        }
                    });
                })
            }
        })
    }

    refreshList()


    $('#add_vendor').click(() => {
        if ($('#name').val() == "") {
            alert("Vendor Name Should be Enter");
        } else if ($('#address').val() == "") {
            alert("Vendor Address Should be Enter");
        } else {
            $.post(
                '/vendor',
                {
                    name: $('#name').val(),
                    address: $('#address').val()
                },
                (data) => {
                    if (data.success) {
                        alert("Vendor Added Successfully!!(@_@)")
                        refreshList()
                    } else {
                        alert(data.err)
                    }
                }
            )
        }
    })

    $('#delete_vendor').click(() => {
        console.log("I am in Delete Vendor Hit");
        let id = document.getElementById("#delete_vendor").value;
        console.log("Value Of Vendor ID" + id);

    })

})