let variable = ["U_id", "Email", "Name", "Psw"];
const User = {
    U_id: 0,
    Email: "",
    Name: "",
    Psw: ""
};
let userData = [];
var myId = [];

document.getElementById("add-user").addEventListener('click', (e) => {
    //e.target.classList.add("disable");
    document.getElementById("save").classList.remove("hide");
    document.querySelectorAll("#delete-btn").forEach((el, i) => {
        el.classList.add("disable");
    })
    document.querySelectorAll("#edit-btn").forEach((el, i) => {
        el.classList.add("disable");
    })
    var tbody = document.getElementById("add-row");
    let newRow = document.createElement("tr");
    let child = `
                    <th scope="row">#</th>
                    <td id="td-email"><input type="email" style="width:150px" class="form-control" name='Email'></td>
                    <td id="td-name"><input type="text" style="width:150px" class="form-control" name='Name'></td>
                    <td id="td-password"><input type="text" style="width:150px" class="form-control" name='Psw'></td>
                    <td><button class="btn btn-success" id="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button></td>
                    <td><button class="btn btn-danger" id="delete-btn"><i class="fa-solid fa-trash"></i></button></td>
                `;

    newRow.id = "unique";
    newRow.innerHTML = child;
    tbody.appendChild(newRow);


});

//==========================Paert 1.5 Cancel Insertion Operation==============================

document.getElementById("remove-form").addEventListener('click', (e) => {
    document.getElementById("unique").remove();
    document.getElementById("add-user").classList.remove("disable");
    if (document.querySelectorAll("#unique").length == 0) {
        document.querySelectorAll("#delete-btn").forEach((el, i) => {
            el.classList.remove("disable");
        });
        document.querySelectorAll("#edit-btn").forEach((el, i) => {
            el.classList.remove("disable");
        });
        document.getElementById("save").classList.add("hide");
        document.getElementById("add-user").classList.remove("disable");
    }

});

//==============Part2==========================

document.getElementById("save").addEventListener('click', (e1) => {
    document.querySelectorAll("#unique").forEach((e2, index) => {
        [...e2.children].forEach((el, index) => {
            if (el.id == "td-email" || el.id == "td-name" || el.id == "td-password") {
                User[el.children[0].name] = el.children[0].value;
                
            } else {
                console.log("Nanana")
            }
            
            
        })

        console.log(User);
        if (User.Email == "" || User.Name == "" || User.Psw=="") {

        } else {
            userData.push({ ...User });
        }
        

    });
    document.querySelectorAll("#unique").forEach((re, id) => {
        re.remove();
    })
    console.log(userData);
    $.ajax({
        type: 'POST',
        url: "/Home/Insert",
        data: JSON.stringify(userData),
        contentType: "application/json",
        success: function (resultData) {
            console.log(resultData);
            myId = [...resultData];
            sendAjaxData(myId);
        }
    });    
    
    
    
    
});
//==================================Next step after ajax call==============================
function sendAjaxData(param) {
    var targetLastRow = document.getElementById("add-row");
    let indx = 0;
    userData.forEach((data, dex) => {
        var result = { ...data };
        let insertedRow = document.createElement("tr");

        insertedRow.id = param[indx];
        insertedRow.innerHTML = `
                    <th scope="row">${param[indx]}</th>
                    <td>${result.Email}</td>
                    <td>${result.Name}</td>
                    <td>${result.Psw}</td>
                    <td><button class="btn btn-success" id="edit-btn" value="${param[indx]}"><i class="fa-solid fa-pen-to-square"></i></button></td>
                    <td><button class="btn btn-danger" id="delete-btn" value="${param[indx]}"><i class="fa-solid fa-trash"></i></button></td>
                `;
        targetLastRow.appendChild(insertedRow);
        const allEditBtn = document.querySelectorAll("#edit-btn");

        allEditBtn[allEditBtn.length - 1].addEventListener('click', updateRowFunction);
        const allDeletedBtn = document.querySelectorAll("#delete-btn");

        allDeletedBtn[allDeletedBtn.length - 1].addEventListener('click', deleteRowOperation);
        indx++;


    });
    while (userData.length > 0) {
        userData.pop();
    }
    console.log(userData);
    document.querySelectorAll("#delete-btn").forEach((el, i) => {
        el.classList.remove("disable");
    });
    document.querySelectorAll("#edit-btn").forEach((el, i) => {
        el.classList.remove("disable");
    });
    document.getElementById("save").classList.add("hide");
    document.getElementById("add-user").classList.remove("disable");
}

//==============Part3 Deleted Operation==========================

document.querySelectorAll("#delete-btn").forEach((el, i) => {
    el.addEventListener('click', deleteRowOperation);
});
function deleteRowOperation(e) {
    console.log(e.currentTarget.value);
    document.getElementById(e.currentTarget.value).remove();
    $.ajax({
        type: 'GET',
        url: "/Home/Delete/" + parseInt(e.currentTarget.value),
        success: function (resultData) { }
    });
}


//===========================Part4 Editiing==========================

document.querySelectorAll("#edit-btn").forEach((el, i) => {
    el.addEventListener('click', updateRowFunction);

});

function updateRowFunction(e) {
    console.log(e.currentTarget.value);
    let updatingRowProcess = document.getElementById(e.currentTarget.value);
    var childrens = [...updatingRowProcess.children];
    
    if (e.currentTarget.id == "edit-btn") {
        e.currentTarget.id = "cancel-btn";
        for (let j = 0; j < childrens.length; j++) {
            if (j == 0 || j == 1 || j == 2 || j == 3) {

                User[variable[j]] = childrens[j].innerText;
                if (j == 0) {
                    document.querySelectorAll("#edit-btn").forEach((el, i) => {
                        el.classList.add("disable");
                    });
                    document.querySelectorAll("#delete-btn").forEach((el, i) => {
                        el.classList.add("disable");
                    });
                    document.getElementById("add-user").classList.add("disable");
                    document.getElementById("update").classList.remove("hide");


                } else {
                    childrens[j].innerHTML = `<input type="text" style="width:150px" class="form-control" name='${variable[j]}' value='${childrens[j].innerText}'>`;

                }

            } else {

            }
        }
    } else {
        e.currentTarget.id = "edit-btn"

        for (let j = 0; j < childrens.length; j++) {
            if (j == 0 || j == 1 || j == 2 || j == 3) {

                //User[variable[j]] = childrens[j].innerText;
                if (j == 0) {
                    document.querySelectorAll("#edit-btn").forEach((el, i) => {
                        el.classList.remove("disable");
                    });
                    document.querySelectorAll("#delete-btn").forEach((el, i) => {
                        el.classList.remove("disable");
                    });
                    document.getElementById("add-user").classList.remove("disable");
                    document.getElementById("update").classList.add("hide");


                } else {
                    childrens[j].innerText = User[variable[j]];
                }

            } else {

            }
        }
    }
}

//========================================Part 5 Update Button Process===============================

document.getElementById("update").addEventListener('click', (e) => {
    let val = document.getElementById("cancel-btn").value;
    let el = document.getElementById(val);
    var updateRow = [...el.children];

    for (let k = 0; k < updateRow.length; k++) {
        if (k == 1 || k == 2 || k == 3) {
            User[updateRow[k].children[0].name] = updateRow[k].children[0].value;


        } else {

        }

    }
    let oneRow = [...el.children];
    for (let a = 0; a < oneRow.length; a++) {
        if (a == 1 || a == 2 || a == 3) {
            oneRow[a].innerText = User[variable[a]];

        } else {

        }

    }
    document.querySelectorAll("#edit-btn").forEach((el, i) => {
        el.classList.remove("disable");
    });
    document.querySelectorAll("#delete-btn").forEach((el, i) => {
        el.classList.remove("disable");
    });
    document.getElementById("add-user").classList.remove("disable");
    document.getElementById("update").classList.add("hide");
    document.getElementById("cancel-btn").id = "edit-btn";

    $.ajax({
        type: 'POST',
        url: "/Home/Update",
        data: JSON.stringify(User),
        contentType: "application/json",
        success: function (resultData) {
            console.log(resultData);
        }
    });
});