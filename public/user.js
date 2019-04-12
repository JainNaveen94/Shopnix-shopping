$(() => {

    function refreshList() {
        $.get('/users', (data) => {

            // Empty The User List
            $('#user_list').empty();

            let count = 1;

            // Add The User List On The Page
            for (let users of data) {
                $('#user_list').append(
                    `<tr>
                    <th scope="row">${count++}</th>
                    <td><h2> ${users.name} </h2></td>
                    <td><h2> ${users.email} </h2></td>
                    <td><h2> ${users.password} </h2></td>
                    <td> <button class="btn btn-danger" id=${users.id} " > Delete </button></td>
                  </tr>`
                )
                $("button").click(function () {
                    jQuery.ajax({
                        url: '/user/' + this.id,
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

    $('#login_user').click( () => {
        if($('#username').val() == "") {
            alert("Username Required For Login");
        } else if($('#password').val() == "") {
            alert("Password Required For Login");
        } else {
            $.get(
                '/user',
                {
                    username: $('#username').val(),
                    password: $('#password').val()
                },
                (data) => {
                    if(data.success){
                        localStorage.setItem("userID", data.Validuser.id);
                        window.location = "home.html";
                    } else {
                        alert($('#username').val() + " Is Not Exist in the System");
                        window.location = "register.html";
                    }
                }
            )
        }
    })



    $('#register_user').click(() => {
        if ($('#name').val() == "") {
            alert("Username Required For Register");
        } else if ($('#email').val() == "") {
            alert("Email Required For Register");
        } else if ($('#password').val() == "") {
            alert("Password Required For Register");
        } else {
            $.post(
                '/user',
                {
                    name: $('#name').val(),
                    email: $('#email').val(),
                    password: $('#password').val()
                },
                (data) => {
                    if (data.success) {
                        alert($('#name').val() + " Registered Successfully")
                        window.location = "index.html";
                    } else {
                        alert(data.err);
                    }
                }
            )
        }
    })

})