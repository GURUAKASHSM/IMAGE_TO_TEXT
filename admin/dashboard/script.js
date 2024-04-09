var adminData = localStorage.getItem('admindata');
if (adminData) {
    // Parse the JSON string to convert it into a JavaScript object
    var adminObject = JSON.parse(adminData);
    document.querySelector('.admin-name').innerHTML = ExtractUserName(adminObject.username)
    document.querySelector('.admin-target').innerHTML = `Congratulations ${ExtractUserName(adminObject.username)}`
} else {
    showToast('Please Login as admin', "Danger", 0);
}
const formData = {
    "token": adminObject.token
}



function DisplayData() {
    console.log(formData)
    fetch("http://localhost:8080/getdetailsforadmin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log(data)
                document.querySelector('.customer-count').innerHTML = `${data.message.usercount}k`
                document.querySelector('.image-count').innerHTML = `${data.message.imageinputcount}k`
                document.querySelector('.text-count').innerHTML = `${data.message.textinputcount}k`
                document.querySelector('.pdf-count').innerHTML = `${data.message.pdfinputcount}k`
                document.querySelector('.total-growth').innerHTML = `Total Useage : ${data.message.historycount} `
                document.querySelector('.total-sales-profit').innerHTML = `${data.message.historycount} <i class="tf-icons mdi mdi-arrow-up"></i> `
                document.querySelector('.target-persentage').innerHTML = `${calculatePercentage(10000, data.message.historycount)}% of target 🚀`
                document.querySelector('.profit').innerHTML = `<i class="tf-icons mdi mdi-history"></i> ${data.message.historycount}`
                document.querySelector('.profit-persent').innerHTML = `+${calculatePercentage(1000, data.message.historycount)}%`
            }

        })
        .catch(error => {
            showToast(error.message, "Danger", 0);
        });
}
DisplayData()



function ExtractUserName(name) {
    var adminname = "";
    for (let i = 0; i < name.length; i++) {
        if (name[i] == "@") {
            return adminname.toUpperCase();
        } else {
            adminname += name[i];
        }
    }
    return adminname.toUpperCase();
}


function LogOut() {
    localStorage.removeItem("admindata")
    localStorage.removeItem("adminsignindata")
    window.location.href = "/ecom/adminlogin"
}

function DisplayCustomerData() {
    let count = 0
    fetch("http://localhost:8080/getallcustomerforadmin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })

        .then(response => response.json())
        .then(data => {
            let html = ""
            if (data.message) {

                data.message.forEach((element, index) => {
                    count++
                    if (count == 3) {
                        document.querySelector('.js-seller-data').innerHTML = html
                        return
                    }
                    html += `<li class="d-flex mb-4 pb-md-2">
                    <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div class="me-2">
                        <h6 class="mb-0">${element.name}</h6>
                        <small>${element.email}</small>
                      </div>
                      <div>
                        <h6 class="mb-2">${element.phonenumber}</h6>
                    </div>
                  </li>`
                })
                document.querySelector('.js-seller-data').innerHTML = html
                return
            } else if (data.error) {
                showToast(data.error, "Error", 0)
            }

        })
        .catch(error => {
            showToast(error.message, "Danger", 0);
        });
}
DisplayCustomerData();






function calculatePercentage(totalAmount, receivedAmount) {
    if (totalAmount <= 0) {
        showToast("Total amount should be greater than zero.", "Info", 1);
        return null;
    }

    const percentage = (receivedAmount / totalAmount) * 100;
    return percentage.toFixed(2); // Round to two decimal places
}

function DisplayFeedBack() {
    let count = 0;
    fetch("http://localhost:8080/listfeedback", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            let html = ""
            if (data.message) {

                data.message.forEach((element, index) => {
                    count++
                    if (count == 3) {
                        document.querySelector('.js-feedback-data').innerHTML = html
                        return
                    }
                    html += `<li class="d-flex mb-4 pb-md-2">
                    <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div class="me-2">
                        <h6 class="mb-0">${element.email}</h6>
                        <small>${element.feedback}</small>
                      </div>
                      <img src="./images/success.png" height="17px" style="cursor:pointer" alt="Delete" class="delete-icon" onclick="deleteFeedback('${element.email}','${element.feedback}')">
                    </div>
                  </li>`
                })
                document.querySelector('.js-feedback-data').innerHTML = html

            } else if (data.error) {
                showToast(data.error, "Error", 0)
            }

        })
        .catch(error => {
            showToast(error.message, "Danger", 0);
        });
}
DisplayFeedBack()

function deleteFeedback(email, feedback) {
    fetch("http://localhost:8080/deletefeedback", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, feedback, token: formData.token })
    })
        .then(response => response.json())
        .then(data => {
            if (data === 1) {
                showToast("FeedBack Deleted Successfully", "Success", 3);
                DisplayFeedBack()
            } else {
                showToast("Error deleting feedback", "Danger", 0);
            }
        })
        .catch(error => {
            showToast(error, "Error", 0);
        });
}

function DisplayHistory() {
    fetch("http://localhost:8080/listhistoryforadmin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            let html = ""
            if (data.message) {

                data.message.forEach((element, index) => {
                    if (element.type == "PDF") {
                        html += `<tr>
                            <td>
                            <div class="d-flex align-items-center">
                                <div class="avatar avatar-sm me-3">
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAk1BMVEX////LBgbygYHKAADcfHzPMTHUU1PXZWXfiorMFxfHAAD0hobUKyvknZ3gT0/kn5/WXl7jk5PxeXn71tbgj4/UQED54+P719fWTU366en++Pjwy8vzjIz2r6/329v87+/wxMTccHDVV1fuvLzpqKjiYWHbRUXXNjblXV3iVVXRIiLudHTihobrsrLSOTnfe3vNEhKAWPopAAAE6ElEQVR4nO3daXuaQBSGYfC4UoghcSUtuCRdbGL8/7+uKhBBiAxmPDND3+cbF2q9AziDVLUshBBCCCGEEEIIIYQQQggh0wu91bYjoZfvh6aqOYXWrkNyumsdenhULcoXzRyy5UR33zQkPm5k+U7C1oNGO2pI8oAnoUbEwJYIzAj12VHvZQKzQl2ITzL30bxQkx1V7ibMC7XYipHcTXgm1IG4cKQCz4Ua7Ki+3E1YEKontm8tVL6j3l6omsggVLyjcgjVbkUWoVIij1AlkUmo8FjkEqrbimxCZUQ+oaodlVGoaCtyCtUQWYVKiLxCFURmoQIit5CfyC5kJ/ILuYkKhMxEFUJeohIhK1GNkJMoXfhTSMhIVCXkI0oXbgWFbETpwoEgkI0oW2iTsJCJKF/4ohlRvvCX6IHIRJQutOlBXMhBvIGw1kb8YaDQpt/iREOF9CJMNFO4N/5pic5sDBXatPn9t/VNoJapwv2eSoONW93m1VRhjBSobbBQ7M8AIYQQQgghhBBCCCGEl4TnM+RPV1Xcr+QmeghpM/xo1F7tMs+TqJ+s8EbLcUE/Gp7Vv0RUKPTyN4veZukTpfvcmtDbZghnK4+t9BT6hVsuBvQJYu2eNrDJQmseQ0oQwTL9TIPZQmty3B3LENa7Y6owmO8L0hv7OeE8Ck6P0/1sF7asmdbC3uHDs24vjJeOHyFKEW/7FSsvSh5nTrld+G3WTRtrOlokwsPf/zAgTOLFTkbox4PdOnmgfk7YFhsONREeFlfx4ntOeFzjJMR57iAVnSrpI9zEi15BaJOdHI3dpgpt5zleHpotHMeLryXCdN1TXihyFGokTLfTrERoO/HyJPtCOxJ7odFAeHd8kk46ylGpMB4xguxKa5I072n+WurvNgN3mY4I6+yOeBKGRf6poebCXIF7hdAzSdjODeonYTIdMF/YjmfXRWE8IEam76WTdAJdGC0oXg6zu3Dw9Bg37RohDKK37sf3uxSEy3h5kRsPnTTdR4vn5XLZ67qUeaKFOc0iXu6bOafZFkft83lpMqWxxmYKS07uzs4t0hOr0NBzi0vCw8mxM54nD7Q8Oz9sgHDhdrrtRfo4ITVPaAWZt2ksN/8+TTOE2dJRr6nC6GNYb6jweVd4z9sA4UhUOPU3JdctDBDao31+2Vqitj+Ke+1t97MdKq68eL1JD6F94S0IoeuHYkBcA4YQQgghhBBCCCGE8L8Xln7C5Yq0FVJn1ZWStu95U1B9X6Hedb1uQbL+AW2vPUkTanv9EELhmi/U9ziU9Vp6eUqhcjwc96RU8aX2mNPcUsgThBBC+H8Lb/TiqY+QVqP+VQ1qEU2cta0bL6z3sy4QSgjC2jVf+GSMcF5939Lq/byS0v+LMbguY0b8q+c0tYCYl0IIIYTNFpJTmYy/jcIRv1d9Vxk/nahQ+Fx913rzM+2EQwgh1F7Y/OPQq76r4ULyvapco0cLoZOnrwMxa4MQQgghhBBCCOUk40T9K8Kyb4mRW71LRdJLv1TjhkVSppfXRhRVP8Wvdvmbqm4tFHjD68tNFW5EIpbfJVO4EVk2oWUFO1VE2sn6b7oVhYr2U6KQB7gnyng/oj5wM+UCHr65Q8pFiFo+Z8YwUGRad5xrL2tfleOuq5+U5MLh/bbD03blsR2BCCGEEEIIIYQQQgghhBBCN+sfypGbO0fYqnMAAAAASUVORK5CYII=" alt="Avatar" class="rounded-circle" />
                                </div>
                            </div>
                            </td>
                            <td class="text-truncate">${element.customerid}</td>

                            <td class="text-truncate">${element.type}</td>
                            <td><span class="badge bg-label-warning rounded-pill"onclick="Viewdata('${element.historyid}','history')"><i class="fas fa-eye"></i></span></td>
                        </tr>`
                    } else if (element.type == "TEXT") {
                        html += `<tr>
                        <td>
                          <div class="d-flex align-items-center">
                            <div class="avatar avatar-sm me-3">
                              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAV8AAACPCAMAAABqIigoAAABLFBMVEUAAAD///+enp6kpKQsRXgAABIAAEf8/f/559grEgDM1OhuRhO0tLR+akahoaKDfm1FRUXqzbSYs8m0kn5fd5PgyLuoj30AACb5//+mh2wAACMZAADs+f////r///ZHUmlwVk4bJUtWOBYdMUqWlI92f5FNRDeLeXTg9P8pQ181XYIQAAC90epqTjClwdrLrpZQKQD/9ulHZY1Rep2MakmUdFYIMEksAABGFABggaGzm4QFNFpTLxCnvNPw38okP2HTv6uHnrYAABvQ5PIzUG6Sq8c+GQBJJQ1Raol/Ylk+MBvNwrOeioMAADoAEjNlOQAAHEva19FxlLLKsJIyNTguJyGKbFZSORoxDgCcgGCpqrN2Zlq8k3CGpLZpQyU6GwCfc0pkRzhRRC1GLQzpk+TMAAAE8ElEQVR4nO2caXsURRRGC2J04hJFhAgxAyHEPepoXNFhosimibiLu/L//4N0z3R3LfetrgHik2dyzsd09c3tk0nNraXLOQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHiUXFg6+WAsXWxjbM4V41J9z9aqefGyznTbvmPp5Sra/PlPWX3lcPW65088KKfbGI/Ndd8z9T1rr9pXz6lEX3vRvmGwfv/iC3Pm3nFmQf261+2rozdEom+KcDsOvwEzv+4t+/Lbdp7vimjT5vjtaPyef8m+/o6Zp+hORuv4jWj8qo/kKSvN90SwXYffiNav6iHeT7NcE19uzd8Cvx2d3w/sHmL0YWmWGx/hN6Hz6z62W3wSJ3lFfHzbYg6/HZ7fZbvoGn4aJfmZHWncNsBvh+fXXbU/mJMwR1EqT0vfGvx2+H7dnt1m12/zuRhaeJUyfjsCv+e/MNuM1702opcerODXIvDrrtk9hDcNIf4EQRmH347Qr/vSbDS63jb4zg4TiMFvR+RXTKRNmuuboki+4QfBb0fk1920m+3kEzwbxDi6frefTrDSGKXNbrUxTL/jZwW34xTs6nZW3Ir+OfgCdO5Cmt4T1m1fJc2+Ply9BvtWZoP1zB2mX3OaxuTA7iHu1hft2mxjpyemc09a931TnNTh8bjpdyVzx0P6FZNjoxV5KR6AGCybfp8qT+rQ+P/9ig9pNX6wazOvulDg1+OO3cneU7WZMYMZg18fe4h2xtm12aQgIn4D7H7gW/OnQ3sFKQS/AWr13eJ0fzj8xoie1kqlKB5+Q9QsTsqfRfHwG3GtUO/3ZeEW3+8Pz1n8KKOUzYSMfil7ioX3Kzgro4hhcsRPhU+B3wQxkRYwKX0K/KaIZWKP0c+lT4HfFDGV7pHsjJDg10CsZLaM1ebVFPxaqE2+My6WPwV+LcSOtBmFpW8Nfk1yw+TS0rcGvzaZIvjuPE+BXxO11ezEvCu9+LVYzszy9H3yo0j4NcjNQQzLJs5m4NdAbHZocsjtEYjBb0rfHHD56A2/Fns99xbsKmnBb4LYzO5nUd5DLLzfwa/pnrD7/Caj5GqHhknxUyy833nXh8pWOHf740zBb8RW0Qp9uO03A34jeqbOGiaF4fAbUrz/oXAWAr8BZb1DxbCsh8BvQGHvUDHuj+bwG9K3MBTwe0lE/Hrs273D8A9bcMlED349xEEQ58Rse8kOP/x2iJcsxnLLiTijxwe/LQdiUbOazRGf7P5dUvhtEdt26tXiO+Ltzb/6guK3QfQBs3eERGXRuxi38H4HJ1dN6vMMPdRBfk0XICpjec7fjIX3K4nePxa9w6S5LtaM+nb64XeKWJAfdvr27BY9wzj81hyISXVvqW2tv4kBfmvs0zXChSDxBTjMrsbht0ItyN8K4osuOrsah98K8a8/CePviwFIbhiHXye/upLX49X0WmY1Dr/6lbd0iUIUwfIwZvxWiN7BqLyuiFh6kIhf+V8fnz5ZoZbn/lY54XdT1A52XStG0XI1Dr+iTx2kp/9WqL5aDeOOvd+eE78TxEhETfQcd7+qd5DfWPuih9j4x2x+3P2K3iFz9os6o89+6fAI+7USe9R+VT2Qm9ZVeyQmVuOj63dtdSnlcm6sv2XcoPm3umXbvpZ9e2BTRbQWi5bN33DvYcQAAAAAAAAAAAAAAAAAAAAAAAAAABxL/gPLoo54/v22zAAAAABJRU5ErkJggg==" alt="Avatar" class="rounded-circle" />
                            </div>
                          </div>
                        </td>
                        <td class="text-truncate">${element.customerid}</td>
                        <td class="text-truncate">${element.type}</td>
                        <td><span class="badge bg-label-warning rounded-pill"onclick="Viewdata('${element.historyid}','history')"><i class="fas fa-eye"></i></span></td>
                      </tr>`
                    } else {
                        html += `<tr>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="avatar avatar-sm me-3">
                          <img src="data:image/jpeg;base64,${element.file}" alt="Avatar" class="rounded-circle" />
                        </div>
                      </div>
                    </td>
                    <td class="text-truncate">${element.customerid}</td>

                    <td class="text-truncate">${element.type}</td>
                    <td><span class="badge bg-label-warning rounded-pill" onclick="Viewdata('${element.historyid}','history')"><i class="fas fa-eye"></i></span></td>
                  </tr>`
                    }
                })
                document.querySelector('.js-workers').innerHTML = html

            }

        })
        .catch(error => {
            showToast(error.message, "Danger", 0);
        });
}
DisplayHistory()

function showToast(str, war, no) {
    const toastContainer = document.querySelector('.toast-container');
    const title = document.querySelector('.js-toast-title');
    const content = document.querySelector('.js-toast-content');
    const image = document.querySelector('.js-toast-img');

    // Reset classes, width, and height
    toastContainer.className = 'toast-container';
    toastContainer.style.width = 'auto';
    toastContainer.style.height = 'auto';

    if (no == 0) {
        image.src = './images/danger.webp';
        toastContainer.classList.add('danger-color');
    } else if (no == 1) {
        image.src = './images/info.svg';
        toastContainer.classList.add('info-color');
    } else if (no == 2) {
        image.src = './images/warning.jpg';
        toastContainer.classList.add('warning-color');
    } else if (no == 3) {
        image.src = './images/success.png';
        toastContainer.classList.add('success-color');
    }
    title.innerHTML = `${war}`;
    content.innerHTML = `${str}`;

    // Calculate and set the container width and height

    const containerWidth = title.length + content.length + 500; // Add some padding

    toastContainer.style.width = `${containerWidth}px`;


    // Add transition effect
    toastContainer.style.transition = 'all 0.5s ease-in-out';

    toastContainer.style.display = 'block';
    setTimeout(() => {
        toastContainer.style.opacity = 1;
    }, 1);

    // Hide the toast container after 5 seconds
    setTimeout(() => {
        toastContainer.style.opacity = 0;
        setTimeout(() => {
            toastContainer.style.display = 'none';
        }, transitionDuration * 1000);
    }, 3000);
}


function PrintContent() {

    var printableElement = document.getElementById('printableContent');

    // Open a new window for printing
    var printWindow = window.open('', '_blank');

    // Write the printable content to the new window
    printWindow.document.write('<html><head><title>Print</title></head><body>');
    printWindow.document.write(printableElement.innerHTML);
    printWindow.document.write('</body></html>');

    // Close the document stream and trigger the print dialog
    printWindow.document.close();
    printWindow.print();
}




function DisplayListUsers() {
    console.log("Displaylist")
    document.getElementById("shutdown-form-container").style.display = 'none';
    document.querySelector('.container-p-y').style.display = 'none';
    document.getElementById("clear-form-container").style.display = 'none'
    document.getElementById("clearbuttons-container").style.display = 'none';
    document.querySelector('.outer-container').style.display = 'none';
    document.getElementById('single-order-container').style.display = 'none';
    document.getElementById('sellersnip').style.display = 'none';
    document.getElementById("orders-container").style.display = 'none';
    document.getElementById('admin-wrapper').style.display = 'none';
    document.getElementById('feedbacksnip').style.display = 'none';
    document.getElementById("calendar").style.display = 'none';
    document.getElementById("block-form-container").style.display = 'none';
    document.getElementById("event-wrapper").style.display = 'none';
    document.querySelector('.display-view').style.display = 'none';
    document.getElementById('update-form-admin-container').style.display = 'none';
    document.getElementById('snippetContent').style.display = 'block';
    document.querySelector('.user-list-body').innerHTML = ""
    fetch('http://localhost:8080/getallcustomerforadmin', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            let html = ""
            if(data.message){
            data.message.forEach(customer => {

                html += `
            <tr class="candidates-list customer-list">
            <td class="title">
              <div class="thumb"> <img class="img-fluid"
                  src="${customer.image}" alt="">
              </div>
              <div class="candidate-list-details">
                <div class="candidate-list-info">
                  <div class="candidate-list-title customer">
                    <h5 class="mb-0"><a href="#">${customer.name.toUpperCase()}</a></h5>
                  </div>
                  <div class="candidate-list-option">
                    <ul class="list-unstyled">
                      <li><i class="fas fa-filter pr-1"></i>${customer.email}
                      </li>
                      <li><i class="fas fa-map-marker-alt pr-1"></i>${customer.customerid}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </td>
            <td class="candidate-list-favourite-time text-center"> <a
                class="candidate-list-favourite order-2 text-danger" href="#"></a>
              <span class="candidate-list-time order-1">${customer.phonenumber}</span></td>
            <td>
              <ul class="list-unstyled mb-0 d-flex justify-content-end">
              <li style="cursor:pointer;" onclick="ViewData('${customer.customerid}','customer');recentPage = 'customer';"><a  class="text-info" data-toggle="tooltip" title="" data-original-title="Edit"><i
              class="fas fa-eye"></i></a>
              </li>
              <li style="cursor:pointer;" onclick="EditData('${customer.customerid}','customer');recentPage = 'customer';"><a class="text-info" data-toggle="tooltip" title="" data-original-title="Edit"><i
              class="fas fa-pencil-alt"></i></a>
              </li>
                <li  style="cursor:pointer;" onclick="showConfirmation(DeleteUser,'Are You sure want to Delete User with ID ${customer.customerid}','Yes','No','${customer.customerid}');DisplayListUsers();recentPage = 'customer';"><a class="text-danger" data-toggle="tooltip" title=""
                    data-original-title="Delete"><i class="far fa-trash-alt"></i></a></li>
                <li  style="cursor:pointer;" onclick="showConfirmation(BlockUser,'Are You sure want to Block/UnBlock User with ID ${customer.customerid}','Yes','No','${customer.customerid}');recentPage = 'customer';"><a class="text-danger" data-toggle="tooltip" title=""
                    data-original-title="Delete"><i class="fas fa-ban"></i></a></li>
              </ul>
            </td>
          </tr>`;

            });
            document.querySelector('.user-list-body').innerHTML = html;
        }else if(data.error){
         showToast(data.error,"Error",0)
        }
        })
        .catch(error => {
            showToast(error, "Error", 0);
        });
}

function DeleteUser(id) {
    const requestData = {
        token: formData.token,
        id: id
    };

    // Send a DELETE request to your server to delete the data
    fetch("http://localhost:8080/deleteuserbyadmin", {
        method: "POST", // Use DELETE method to delete data
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            if (data === true) {
                showToast("Deleted Sucessfull", "Success", 3)
                

            } else {
                showToast("Error in Deleting", "Danger", 0)
            }
        })
        .catch(error => {
            showToast(error.message, "Error", 0);
        });
}

function DeleteHistory(id) {
    const requestData = {
        token: formData.token,
        id: id
    };
    
    // Send a DELETE request to your server to delete the data
    fetch("http://localhost:8080/deletehistorybyadmin", {
        method: "POST", // Use DELETE method to delete data
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            if (data === true) {
                showToast("Deleted Sucessfull", "Success", 3)
                

            } else {
                showToast("Error in Deleting", "Danger", 0)
            }
        })
        .catch(error => {
            showToast(error.message, "Error", 0);
        });
}



function DisplayListHistory() {
    console.log("Displaylist")
    document.getElementById("shutdown-form-container").style.display = 'none';
    document.querySelector('.container-p-y').style.display = 'none';
    document.getElementById("clear-form-container").style.display = 'none'
    document.getElementById('snippetContent').style.display = 'none';
    document.getElementById("clearbuttons-container").style.display = 'none';
    document.querySelector('.outer-container').style.display = 'none';
    document.getElementById("orders-container").style.display = 'none';
    document.getElementById('single-order-container').style.display = 'none';
    document.getElementById("block-form-container").style.display = 'none';
    document.getElementById('admin-wrapper').style.display = 'none';
    document.getElementById('feedbacksnip').style.display = 'none';
    document.getElementById('sellersnip').style.display = 'block';
    document.querySelector('.display-view').style.display = 'none';
    document.getElementById("calendar").style.display = 'none';
    document.getElementById("event-wrapper").style.display = 'none';
    document.getElementById('update-form-admin-container').style.display = 'none';
    document.querySelector('.seller-list-body').innerHTML = "";
    fetch("http://localhost:8080/listhistoryforadmin", {
        method: "POST", // Use DELETE method to delete data
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })

        .then(response => response.json())
        .then(data => {
            let html = ""
            console.log(data)
            if(data.message){
            data.message.forEach(history => {
                if (history.type == "PDF") {
                    html += `
                <tr class="candidates-list seller-list">
                <td class="title">
                  <div class="thumb"> <img class="img-fluid"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAk1BMVEX////LBgbygYHKAADcfHzPMTHUU1PXZWXfiorMFxfHAAD0hobUKyvknZ3gT0/kn5/WXl7jk5PxeXn71tbgj4/UQED54+P719fWTU366en++Pjwy8vzjIz2r6/329v87+/wxMTccHDVV1fuvLzpqKjiYWHbRUXXNjblXV3iVVXRIiLudHTihobrsrLSOTnfe3vNEhKAWPopAAAE6ElEQVR4nO3daXuaQBSGYfC4UoghcSUtuCRdbGL8/7+uKhBBiAxmPDND3+cbF2q9AziDVLUshBBCCCGEEEIIIYQQQggh0wu91bYjoZfvh6aqOYXWrkNyumsdenhULcoXzRyy5UR33zQkPm5k+U7C1oNGO2pI8oAnoUbEwJYIzAj12VHvZQKzQl2ITzL30bxQkx1V7ibMC7XYipHcTXgm1IG4cKQCz4Ua7Ki+3E1YEKontm8tVL6j3l6omsggVLyjcgjVbkUWoVIij1AlkUmo8FjkEqrbimxCZUQ+oaodlVGoaCtyCtUQWYVKiLxCFURmoQIit5CfyC5kJ/ILuYkKhMxEFUJeohIhK1GNkJMoXfhTSMhIVCXkI0oXbgWFbETpwoEgkI0oW2iTsJCJKF/4ohlRvvCX6IHIRJQutOlBXMhBvIGw1kb8YaDQpt/iREOF9CJMNFO4N/5pic5sDBXatPn9t/VNoJapwv2eSoONW93m1VRhjBSobbBQ7M8AIYQQQgghhBBCCCGEl4TnM+RPV1Xcr+QmeghpM/xo1F7tMs+TqJ+s8EbLcUE/Gp7Vv0RUKPTyN4veZukTpfvcmtDbZghnK4+t9BT6hVsuBvQJYu2eNrDJQmseQ0oQwTL9TIPZQmty3B3LENa7Y6owmO8L0hv7OeE8Ck6P0/1sF7asmdbC3uHDs24vjJeOHyFKEW/7FSsvSh5nTrld+G3WTRtrOlokwsPf/zAgTOLFTkbox4PdOnmgfk7YFhsONREeFlfx4ntOeFzjJMR57iAVnSrpI9zEi15BaJOdHI3dpgpt5zleHpotHMeLryXCdN1TXihyFGokTLfTrERoO/HyJPtCOxJ7odFAeHd8kk46ylGpMB4xguxKa5I072n+WurvNgN3mY4I6+yOeBKGRf6poebCXIF7hdAzSdjODeonYTIdMF/YjmfXRWE8IEam76WTdAJdGC0oXg6zu3Dw9Bg37RohDKK37sf3uxSEy3h5kRsPnTTdR4vn5XLZ67qUeaKFOc0iXu6bOafZFkft83lpMqWxxmYKS07uzs4t0hOr0NBzi0vCw8mxM54nD7Q8Oz9sgHDhdrrtRfo4ITVPaAWZt2ksN/8+TTOE2dJRr6nC6GNYb6jweVd4z9sA4UhUOPU3JdctDBDao31+2Vqitj+Ke+1t97MdKq68eL1JD6F94S0IoeuHYkBcA4YQQgghhBBCCCGE8L8Xln7C5Yq0FVJn1ZWStu95U1B9X6Hedb1uQbL+AW2vPUkTanv9EELhmi/U9ziU9Vp6eUqhcjwc96RU8aX2mNPcUsgThBBC+H8Lb/TiqY+QVqP+VQ1qEU2cta0bL6z3sy4QSgjC2jVf+GSMcF5939Lq/byS0v+LMbguY0b8q+c0tYCYl0IIIYTNFpJTmYy/jcIRv1d9Vxk/nahQ+Fx913rzM+2EQwgh1F7Y/OPQq76r4ULyvapco0cLoZOnrwMxa4MQQgghhBBCCOUk40T9K8Kyb4mRW71LRdJLv1TjhkVSppfXRhRVP8Wvdvmbqm4tFHjD68tNFW5EIpbfJVO4EVk2oWUFO1VE2sn6b7oVhYr2U6KQB7gnyng/oj5wM+UCHr65Q8pFiFo+Z8YwUGRad5xrL2tfleOuq5+U5MLh/bbD03blsR2BCCGEEEIIIYQQQgghhBBCN+sfypGbO0fYqnMAAAAASUVORK5CYII=" alt="">
                  </div>
                  <div class="candidate-list-details">
                    <div class="candidate-list-info">
                      <div class="candidate-list-title seller">
                        <h5 class="mb-0"><a href="#">${history.historyid}</a></h5>
                      </div>
                      <div class="candidate-list-option">
                        <ul class="list-unstyled">
                          <li><i class="fas fa-filter pr-1"></i>${history.customerid}
                          </li>
                          <li><i class="fas fa-map-marker-alt pr-1"></i>${history.savedtime}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="candidate-list-favourite-time text-center"> <a
                    class="candidate-list-favourite order-2 text-danger" href="#"></a>
                  <span class="candidate-list-time order-1">${history.type}</span></td>
                <td>
                  <ul class="list-unstyled mb-0 d-flex justify-content-end">
                  <li  style="cursor:pointer;" onclick="ViewData('${history.historyid}','history');recentPage = 'inventory';"><a  class="text-info" data-toggle="tooltip" title="" data-original-title="Edit"><i
                  class="fas fa-eye"></i></a>
                  </li>
                  <li  style="cursor:pointer;" onclick="EditData('${history.historyid}','history');recentPage = 'inventory';"><a  class="text-info" data-toggle="tooltip" title="" data-original-title="Edit"><i
                  class="fas fa-pencil-alt"></i></a>
                  </li>
                    <li style="cursor:pointer;"  onclick="showConfirmation(DeleteHistory,'Are You sure want to Delete History with ID ${history.historyid}','Yes','No','${history.historyid}');DisplayListHistory();recentPage = 'inventory';"><a class="text-danger" data-toggle="tooltip" title=""
                        data-original-title="Delete"><i class="far fa-trash-alt"></i></a></li>
                  </ul>
                </td>
              </tr>`;
                } else if (history.type == "IMAGE") {
                    html += `
                <tr class="candidates-list seller-list">
                <td class="title">
                  <div class="thumb"> <img class="img-fluid"
                      src="data:image/jpeg;base64,${history.file}" alt="">
                  </div>
                  <div class="candidate-list-details">
                    <div class="candidate-list-info">
                      <div class="candidate-list-title seller">
                        <h5 class="mb-0"><a href="#">${history.historyid}</a></h5>
                      </div>
                      <div class="candidate-list-option">
                        <ul class="list-unstyled">
                          <li><i class="fas fa-filter pr-1"></i>${history.customerid}
                          </li>
                          <li><i class="fas fa-map-marker-alt pr-1"></i>${history.savedtime}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="candidate-list-favourite-time text-center"> <a
                    class="candidate-list-favourite order-2 text-danger" href="#"></a>
                  <span class="candidate-list-time order-1">${history.type}</span></td>
                <td>
                  <ul class="list-unstyled mb-0 d-flex justify-content-end">
                  <li style="cursor:pointer;" onclick="ViewData('${history.historyid}','history');recentPage = 'inventory';"><a  class="text-info" data-toggle="tooltip" title="" data-original-title="Edit"><i
                  class="fas fa-eye"></i></a>
                  </li>

                  <li  style="cursor:pointer;" onclick="EditData('${history.historyid}','history');recentPage = 'inventory';"><a  class="text-info" data-toggle="tooltip" title="" data-original-title="Edit"><i
                  class="fas fa-pencil-alt"></i></a>
                  </li>
                    <li style="cursor:pointer;" onclick="showConfirmation(DeleteHistory,'Are You sure want to Delete History with ID ${history.historyid}','Yes','No','${history.historyid}');DisplayListHistory();recentPage = 'inventory';"><a class="text-danger" data-toggle="tooltip" title=""
                        data-original-title="Delete"><i class="far fa-trash-alt"></i></a></li>
                  </ul>
                </td>
              </tr>`;
                } else {
                    html += `
                <tr class="candidates-list seller-list">
                <td class="title">
                  <div class="thumb"> <img class="img-fluid"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9MF0C9AA7WQjCJUpJcKfW-_IAuNB75aAUpisBizH48N8xo6TWb0ORRCENA-NaYr89Wfw&usqp=CAU" alt="">
                  </div>
                  <div class="candidate-list-details">
                    <div class="candidate-list-info">
                      <div class="candidate-list-title seller">
                        <h5 class="mb-0"><a href="#">${history.historyid}</a></h5>
                      </div>
                      <div class="candidate-list-option">
                        <ul class="list-unstyled">
                          <li><i class="fas fa-filter pr-1"></i>${history.customerid}
                          </li>
                          <li><i class="fas fa-map-marker-alt pr-1"></i>${history.savedtime}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="candidate-list-favourite-time text-center"> <a
                    class="candidate-list-favourite order-2 text-danger" href="#"></a>
                  <span class="candidate-list-time order-1">${history.type}</span></td>
                <td>
                  <ul class="list-unstyled mb-0 d-flex justify-content-end">
                  <li style="cursor:pointer;" onclick="ViewData('${history.historyid}','history');recentPage = 'inventory';"><a  class="text-info" data-toggle="tooltip" title="" data-original-title="Edit"><i
                  class="fas fa-eye"></i></a>
                  </li>
                  <li  style="cursor:pointer;" onclick="EditData('${history.historyid}','history');recentPage = 'inventory';"><a  class="text-info" data-toggle="tooltip" title="" data-original-title="Edit"><i
                  class="fas fa-pencil-alt"></i></a>
                  </li>
                    <li style="cursor:pointer;"  onclick="showConfirmation(DeleteHistory,'Are You sure want to Delete History with ID ${history.historyid}','Yes','No','${history.historyid}');DisplayListHistory();recentPage = 'inventory';"><a class="text-danger" data-toggle="tooltip" title=""
                        data-original-title="Delete"><i class="far fa-trash-alt"></i></a></li>
                  </ul>
                </td>
              </tr>`;
                }


            });
            document.querySelector('.seller-list-body').innerHTML = html;
        }else if(data.error){
            showToast(data.error,"Error",0)
        }
        })
        .catch(error => {
            showToast(error, "Error", 0);
        });
}



function EditData(id, coll) {
    document.getElementById("updatecollection").value = coll;
    document.getElementById("idname").value = id;
    populateFieldOptions();
    DisplayEdit();
}



function Deletedata() {
    document.getElementById("shutdown-form-container").style.display = 'none';
    document.querySelector('.outer-container').style.display = 'block';
    document.querySelector('.container-p-y').style.display = 'none';
    document.getElementById("orders-container").style.display = 'none';
    document.getElementById('snippetContent').style.display = 'none';
    document.getElementById('single-order-container').style.display = 'none';
    document.getElementById("clear-form-container").style.display = 'none'
    document.getElementById('feedbacksnip').style.display = 'none';
    document.getElementById("clearbuttons-container").style.display = 'none';
    document.getElementById('admin-wrapper').style.display = 'none';
    document.querySelector('.display-view').style.display = 'none';
    document.getElementById("calendar").style.display = 'none';
    document.getElementById("block-form-container").style.display = 'none';
    document.getElementById("event-wrapper").style.display = 'none';
    document.getElementById('update-form-admin-container').style.display = 'none';
}



function DisplayEdit() {
    document.getElementById("shutdown-form-container").style.display = 'none';
    document.getElementById("block-form-container").style.display = 'none';
    document.querySelector('.outer-container').style.display = 'none';
    document.getElementById("orders-container").style.display = 'none';
    document.querySelector('.container-p-y').style.display = 'none';
    document.getElementById('snippetContent').style.display = 'none';
    document.getElementById('single-order-container').style.display = 'none';
    document.getElementById('sellersnip').style.display = 'none';
    document.getElementById("clearbuttons-container").style.display = 'none';
    document.getElementById("clear-form-container").style.display = 'none'
    document.getElementById('feedbacksnip').style.display = 'none';
    document.getElementById('admin-wrapper').style.display = 'none';
    document.querySelector('.display-view').style.display = 'none';
    document.getElementById("calendar").style.display = 'none';
    document.getElementById("event-wrapper").style.display = 'none';
    document.getElementById('update-form-admin-container').style.display = 'block';
}

const updateFormElement = document.getElementById("update-form-admin");
const collectionSelectElement = document.getElementById("updatecollection");
const fieldSelectElement = document.getElementById("field");

const collectionselectOptions = {
    customer: ["name", "email", "phonenumber", "password","wronginput","image","createddate","pdfcount","aicount","ocrcount","imagecount","textcount","totalcount"],
    history: ["type", "file", "customerid","ocrtext","aitext","ocraudio","aiaudio"],
};
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function populateFieldOptions() {
    const selectedCollection = collectionSelectElement.value || customer;
    const options = collectionselectOptions[selectedCollection] || [];

    // Clear existing options
    fieldSelectElement.innerHTML = "";

    // Add new options
    options.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.textContent = capitalizeFirstLetter(option);
        fieldSelectElement.appendChild(optionElement);
    });
}
populateFieldOptions()



document.getElementById("update-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const updatecollection = document.getElementById("updatecollection").value;
    const idname = document.getElementById("idname").value;
    const field = document.getElementById("field").value;
    const newvalue = document.getElementById("newvalue").value;

    const requestData = {
        token: formData.token,
        collection: updatecollection,
        id: idname,
        field: field,
        newvalue: newvalue
    };
    console.log(requestData)

    fetch("http://localhost:8080/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {

            if (data.message) {
                showToast(data.message, "Success", 3)
                document.getElementById("update-form").reset();
            } else {
                showToast(data.error, "Danger", 0)
                document.getElementById("update-form").reset();
            }
        })
        .catch(error => {
           console.log(error)
        });
});







function DisplayDrashBord() {
    document.getElementById("shutdown-form-container").style.display = 'none';
    document.querySelector('.outer-container').style.display = 'none';
    document.querySelector('.container-p-y').style.display = 'block';
    document.getElementById("clearbuttons-container").style.display = 'none';
    document.getElementById("block-form-container").style.display = 'none';
    document.getElementById('snippetContent').style.display = 'none';
    document.getElementById('single-order-container').style.display = 'none';
    document.getElementById("orders-container").style.display = 'none';
    document.getElementById("clear-form-container").style.display = 'none'
    document.getElementById('update-form-admin-container').style.display = 'none';
    document.getElementById('feedbacksnip').style.display = 'none';
    document.querySelector('.display-view').style.display = 'none';
    document.getElementById("calendar").style.display = 'none';
    document.getElementById("event-wrapper").style.display = 'none';
    document.getElementById('admin-wrapper').style.display = 'none';
}


function DisplayCreateAdmin() {
    document.getElementById("shutdown-form-container").style.display = 'none';
    document.getElementById("clear-form-container").style.display = 'none'
    document.querySelector('.outer-container').style.display = 'none';
    document.getElementById('single-order-container').style.display = 'none';
    document.querySelector('.container-p-y').style.display = 'none';
    document.getElementById('snippetContent').style.display = 'none';
    document.getElementById("block-form-container").style.display = 'none';
    document.getElementById('update-form-admin-container').style.display = 'none';
    document.getElementById('admin-wrapper').style.display = 'block';
    document.getElementById("clearbuttons-container").style.display = 'none';
    document.getElementById("qr-code").style.display = 'none';
    document.querySelector('.display-view').style.display = 'none';
    document.getElementById("orders-container").style.display = 'none';
    document.getElementById('feedbacksnip').style.display = 'none';
    document.getElementById("calendar").style.display = 'none';
    document.getElementById("event-wrapper").style.display = 'none';
    document.getElementById("admin-input").style.display = 'block';
}

document.getElementById("admin-wrapper").addEventListener("submit", function (event) {
    event.preventDefault();

    const adminsignupdata = {
        token:formData.token,
        name: document.getElementById('admin-name').value,
        email: document.getElementById('admin-email').value,
        password: document.getElementById('admin-password').value,
        ip: document.getElementById('admin-ip').value,
        confirmpassword: document.getElementById('admin-confirmpassword').value
    }
    if (formData.email == "" || formData.password == "" || formData.ip == "") {
        showToast("Please Enter all Feilds", "Info", 1)
        return
    }
    if (formData.confirmpassword != formData.password) {
        showToast("Passoword Mismatch", "Danger", 0)
        return
    }
    console.log(formData)

    // Send a POST request to your Go backend
    fetch("http://localhost:8080/createadmin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(adminsignupdata),
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showToast(data.error, "info", 1)
                return
            }
            showToast("Created Successfully", "info", 1)
            var totpKey = data.result;

            // Generate QR code
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                text: totpKey,
                width: 128,
                height: 128,
            });
            document.getElementById("admin-form").reset()
            document.getElementById("qr-code").style.display = 'block';
            document.getElementById("admin-input").style.display = 'none';
            document.querySelector('.totp').innerHTML = `<br> Please Scan this QR to Get TOTP (or) <br> Use this Key : ${totpKey}`


        })
        .catch(error => {
            // Handle errors, e.g., display an error message
            showToast(error.message, "Error", 0);
        });



});

function CreateEmailandPassword() {
    const name = document.getElementById('admin-name').value
    const email = document.getElementById('admin-email')
    if (name == "") {
        email.value = ""
        return
    }
    email.value = (name.toLowerCase()).replace(/\s/g, '') + '@gmail.com'
}

function search() {
    const searchInput = document.getElementById('Search').value.toLowerCase();
    const doctorRows = document.querySelectorAll(`.candidates-list`);

    doctorRows.forEach(row => {
        const Name = row.querySelector(`.candidate-list-title h5 a`).innerText.toLowerCase();
        if (Name.includes(searchInput)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function DisplayFeedBacks() {
    console.log("Displaylist")
    document.getElementById("shutdown-form-container").style.display = 'none';
    document.querySelector('.container-p-y').style.display = 'none';
    document.getElementById("orders-container").style.display = 'none';
    document.querySelector('.outer-container').style.display = 'none';
    document.getElementById("block-form-container").style.display = 'none';
    document.getElementById("clearbuttons-container").style.display = 'none';
    document.getElementById('feedbacksnip').style.display = 'block';
    document.getElementById('single-order-container').style.display = 'none';
    document.getElementById("clear-form-container").style.display = 'none'
    document.getElementById('admin-wrapper').style.display = 'none';
    document.getElementById('update-form-admin-container').style.display = 'none';
    document.getElementById('snippetContent').style.display = 'none';
    document.querySelector('.display-view').style.display = 'none';
    document.getElementById("calendar").style.display = 'none';
    document.getElementById("event-wrapper").style.display = 'none';
    fetch("http://localhost:8080/listfeedback", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            let html = ""
            console.log(data.result)
            data.message.forEach(feedback => {

                html += `

            <tr class="candidates-list">
            <td class="title">
              <div class="thumb"> <img class="img-fluid"
                  src="https://previews.123rf.com/images/jenjawin/jenjawin1904/jenjawin190400251/120265520-account-icon-outline-vector-eps10-user-profile-sign-web-icon-with-check-mark-glyph-user-authorized.jpg" alt="">
              </div>
              <div class="candidate-list-details">
                <div class="candidate-list-info">
                  <div class="candidate-list-title customer">
                    <h5 class="mb-0"><a href="#">${feedback.email}</a></h5>
                  </div>
                  <div class="candidate-list-option">
                    <ul class="list-unstyled">
                      <li><i class="fas fa-filter pr-1"></i>${feedback.name}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </td>
            <td class="candidate-list-favourite-time text-center"> <a
                class="candidate-list-favourite order-2 text-danger" href="#"></a>
              <span class="candidate-list-time order-1">${feedback.feedback}</span></td>
            <td>
              <ul class="list-unstyled mb-0 d-flex justify-content-end">

     

                <li  onclick="deleteFeedback('${feedback.email}','${feedback.feedback}');DisplayFeedBacks()" style="cursor:pointer"><a class="text-danger" data-toggle="tooltip" title=""
                    data-original-title="Delete"><i class="far fa-trash-alt"></i></a></li>
              </ul>
            </td>
          </tr>`;

            });
            document.querySelector('.feedback-list-body').innerHTML = html;
        })
        .catch(error => {
            showToast(error, "Error", 0);
        });
}




function ViewData(id, profession) {
    document.getElementById("shutdown-form-container").style.display = 'none';
    document.querySelector('.container-p-y').style.display = 'none';
    document.querySelector('.outer-container').style.display = 'none';
    document.getElementById("clearbuttons-container").style.display = 'none';
    document.getElementById("clear-form-container").style.display = 'none'
    document.getElementById("orders-container").style.display = 'none';
    document.getElementById('feedbacksnip').style.display = 'none';
    document.getElementById('single-order-container').style.display = 'none';
    document.getElementById("block-form-container").style.display = 'none';
    document.getElementById('admin-wrapper').style.display = 'none';
    document.getElementById('update-form-admin-container').style.display = 'none';
    document.getElementById('snippetContent').style.display = 'none';
    document.getElementById("calendar").style.display = 'none';
    document.getElementById('sellersnip').style.display = 'none';
    document.getElementById("event-wrapper").style.display = 'none';

    fetch("http://localhost:8080/getdataforadmin", {
        method: "POST", // Use DELETE method to delete data
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id, collection: profession, token: formData.token })
    })

        .then(response => response.json())
        .then(data => {
            console.log(data.message)

            let html = ""
            if (profession == 'history') {
                if (data.message.type == "PDF") {
                    html = `
                    <div class="container" style="width:1500px;max-width:1500px; margin-left:300px">
                    <i class="fas fa-arrow-left back-icon" onclick="BackButton()"></i>
                    <div class="row">
                    <div class="col-sm-8 col-sm-offset-2">
                    <div class="panel panel-white profile-widget">
                    <div class="row">
                    <div class="col-sm-12">
                    <div class="image-container bg2">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAk1BMVEX////LBgbygYHKAADcfHzPMTHUU1PXZWXfiorMFxfHAAD0hobUKyvknZ3gT0/kn5/WXl7jk5PxeXn71tbgj4/UQED54+P719fWTU366en++Pjwy8vzjIz2r6/329v87+/wxMTccHDVV1fuvLzpqKjiYWHbRUXXNjblXV3iVVXRIiLudHTihobrsrLSOTnfe3vNEhKAWPopAAAE6ElEQVR4nO3daXuaQBSGYfC4UoghcSUtuCRdbGL8/7+uKhBBiAxmPDND3+cbF2q9AziDVLUshBBCCCGEEEIIIYQQQggh0wu91bYjoZfvh6aqOYXWrkNyumsdenhULcoXzRyy5UR33zQkPm5k+U7C1oNGO2pI8oAnoUbEwJYIzAj12VHvZQKzQl2ITzL30bxQkx1V7ibMC7XYipHcTXgm1IG4cKQCz4Ua7Ki+3E1YEKontm8tVL6j3l6omsggVLyjcgjVbkUWoVIij1AlkUmo8FjkEqrbimxCZUQ+oaodlVGoaCtyCtUQWYVKiLxCFURmoQIit5CfyC5kJ/ILuYkKhMxEFUJeohIhK1GNkJMoXfhTSMhIVCXkI0oXbgWFbETpwoEgkI0oW2iTsJCJKF/4ohlRvvCX6IHIRJQutOlBXMhBvIGw1kb8YaDQpt/iREOF9CJMNFO4N/5pic5sDBXatPn9t/VNoJapwv2eSoONW93m1VRhjBSobbBQ7M8AIYQQQgghhBBCCCGEl4TnM+RPV1Xcr+QmeghpM/xo1F7tMs+TqJ+s8EbLcUE/Gp7Vv0RUKPTyN4veZukTpfvcmtDbZghnK4+t9BT6hVsuBvQJYu2eNrDJQmseQ0oQwTL9TIPZQmty3B3LENa7Y6owmO8L0hv7OeE8Ck6P0/1sF7asmdbC3uHDs24vjJeOHyFKEW/7FSsvSh5nTrld+G3WTRtrOlokwsPf/zAgTOLFTkbox4PdOnmgfk7YFhsONREeFlfx4ntOeFzjJMR57iAVnSrpI9zEi15BaJOdHI3dpgpt5zleHpotHMeLryXCdN1TXihyFGokTLfTrERoO/HyJPtCOxJ7odFAeHd8kk46ylGpMB4xguxKa5I072n+WurvNgN3mY4I6+yOeBKGRf6poebCXIF7hdAzSdjODeonYTIdMF/YjmfXRWE8IEam76WTdAJdGC0oXg6zu3Dw9Bg37RohDKK37sf3uxSEy3h5kRsPnTTdR4vn5XLZ67qUeaKFOc0iXu6bOafZFkft83lpMqWxxmYKS07uzs4t0hOr0NBzi0vCw8mxM54nD7Q8Oz9sgHDhdrrtRfo4ITVPaAWZt2ksN/8+TTOE2dJRr6nC6GNYb6jweVd4z9sA4UhUOPU3JdctDBDao31+2Vqitj+Ke+1t97MdKq68eL1JD6F94S0IoeuHYkBcA4YQQgghhBBCCCGE8L8Xln7C5Yq0FVJn1ZWStu95U1B9X6Hedb1uQbL+AW2vPUkTanv9EELhmi/U9ziU9Vp6eUqhcjwc96RU8aX2mNPcUsgThBBC+H8Lb/TiqY+QVqP+VQ1qEU2cta0bL6z3sy4QSgjC2jVf+GSMcF5939Lq/byS0v+LMbguY0b8q+c0tYCYl0IIIYTNFpJTmYy/jcIRv1d9Vxk/nahQ+Fx913rzM+2EQwgh1F7Y/OPQq76r4ULyvapco0cLoZOnrwMxa4MQQgghhBBCCOUk40T9K8Kyb4mRW71LRdJLv1TjhkVSppfXRhRVP8Wvdvmbqm4tFHjD68tNFW5EIpbfJVO4EVk2oWUFO1VE2sn6b7oVhYr2U6KQB7gnyng/oj5wM+UCHr65Q8pFiFo+Z8YwUGRad5xrL2tfleOuq5+U5MLh/bbD03blsR2BCCGEEEIIIYQQQgghhBBCN+sfypGbO0fYqnMAAAAASUVORK5CYII=" class="avatar" alt="avatar" height="100px" >
                    </div>
                    </div>
                    <div class="col-sm-12">
                    <div class="details">
                    <h4>${data.message.type} <i class="fa fa-sheild"></i></h4>
                    <h5 style="padding:10px">View PDF : <span  onclick="window.open('${data.message.file}', '_blank')" style="cursor:pointer;" >&nbsp;&nbsp;<i class="fas fa-eye"></i></span></h5>
                    <h9>${data.message.historyid} <i class="fa fa-sheild"></i></h9>
                    <br>
                    <h9>${data.message.savedtime} <i class="fa fa-sheild"></i></h9>
                    <div class="mg-top-10">
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
    
                    <div class="row">
                        <div class="col-sm-6"   >
                            <div class="panel panel-white border-top-purple">
                                <div class="panel-heading">
                                <h3 class="panel-title" style="height:30px;">Extracted Text</h3>
                                </div>
                                <div class="panel-body" style="padding:30px; border-radius:5px">
                                <div class="body-section">
                                <h5 class="section-heading"> <span class="message">${data.message.ocrtext}</span></h5>
                                </div>
                                <div class="body-section">
                                <audio controls style="width: 90%;" id="tesseractaudio">
                                <source src="${data.message.ocraudio}" type="audio/mpeg"  id="tesseractaudiosource">
                                Your browser does not support the audio element.
                                </audio>
                                </div>
                                <div class="body-section">
                                <!-- <a href="#" class="btn btn-purple btn-sm">Edit</a> -->
                                </div>
                            </div>
                        </div>
                    </div>
                  
                    
            
                   
                    <div class="col-sm-6">
                    <div class="panel panel-white border-top-green">
                    <div class="panel-heading">
                    <h3 class="panel-title">AI Text</h3>
                   
                    </div>
                    <div class="panel-body" style="padding:30px">
        
        
                    <div class="body-section">
                    <h5 class="section-heading"><span class="message">${data.message.aitext}</span></h5>
                    </div>
                    <div class="body-section">
                    <audio controls style="width: 90%;" id="tesseractaudio">
                    <source src="${data.message.aiaudio}" type="audio/mpeg"  id="tesseractaudiosource">
                    Your browser does not support the audio element.
                    </audio>
                    </div>
    
                
                    </div>
                    </div>
                    
    
                        
                    
                    <div class="panel ">
        
                    </div>
          
        
                    
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                `;
                } else if (data.message.type == "IMAGE") {
                    html = `
                    <div class="container" style="width:1500px;max-width:1500px; margin-left:300px">
                    <i class="fas fa-arrow-left back-icon" onclick="BackButton()"></i>
                    <div class="row">
                    <div class="col-sm-8 col-sm-offset-2">
                    <div class="panel panel-white profile-widget">
                    <div class="row">
                    <div class="col-sm-12">
                    <div class="image-container bg2">
                    <img src="data:image/jpeg;base64,${data.message.file}" class="avatar" alt="avatar" height="100px" >
                    </div>
                    </div>
                    <div class="col-sm-12">
                    <div class="details">
                    <h4>${data.message.type} <i class="fa fa-sheild"></i></h4>
                    <h9>${data.message.historyid} <i class="fa fa-sheild"></i></h9>
                    <br>
                    <h9>${data.message.savedtime} <i class="fa fa-sheild"></i></h9>
                    <div class="mg-top-10">
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
    
                    <div class="row">
                        <div class="col-sm-6"   >
                            <div class="panel panel-white border-top-purple">
                                <div class="panel-heading">
                                <h3 class="panel-title" style="height:30px;">Extracted Text</h3>
                                </div>
                                <div class="panel-body" style="padding:30px; border-radius:5px">
                                <div class="body-section">
                                <h5 class="section-heading"> <span class="message">${data.message.ocrtext}</span></h5>
                                </div>
                                <div class="body-section">
                                <audio controls style="width: 90%;" id="tesseractaudio">
                                <source src="${data.message.ocraudio}" type="audio/mpeg"  id="tesseractaudiosource">
                                Your browser does not support the audio element.
                                </audio>
                                </div>
                                <div class="body-section">
                                <!-- <a href="#" class="btn btn-purple btn-sm">Edit</a> -->
                                </div>
                            </div>
                        </div>
                    </div>
                  
                    
            
                   
                    <div class="col-sm-6">
                    <div class="panel panel-white border-top-green">
                    <div class="panel-heading">
                    <h3 class="panel-title">AI Text</h3>
                   
                    </div>
                    <div class="panel-body" style="padding:30px">
        
        
                    <div class="body-section">
                    <h5 class="section-heading"><span class="message">${data.message.aitext}</span></h5>
                    </div>
                    <div class="body-section">
                    <audio controls style="width: 90%;" id="tesseractaudio">
                    <source src="${data.message.aiaudio}" type="audio/mpeg"  id="tesseractaudiosource">
                    Your browser does not support the audio element.
                    </audio>
                    </div>
    
                
                    </div>
                    </div>
                    
    
                        
                    
                    <div class="panel ">
        
                    </div>
          
        
                    
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                `;
                } else {
                    html = `
                    <div class="container" style="width:1500px;max-width:1500px; margin-left:300px">
                    <i class="fas fa-arrow-left back-icon" onclick="BackButton()"></i>
                    <div class="row">
                    <div class="col-sm-8 col-sm-offset-2">
                    <div class="panel panel-white profile-widget">
                    <div class="row">
                    <div class="col-sm-12">
                    <div class="image-container bg2">
                    <p style="text-align:center;color:white;font-size:18px">${data.message.file}</p>
                    </div>
                    </div>
                    <div class="col-sm-12">
                    <div class="details">
                    <h4>${data.message.type} <i class="fa fa-sheild"></i></h4>
                    <h9>${data.message.historyid} <i class="fa fa-sheild"></i></h9>
                    <br>
                    <h9>${data.message.savedtime} <i class="fa fa-sheild"></i></h9>
                    <div class="mg-top-10">
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
    
                    <div class="row">
                        <div class="col-sm-6"   >
                            <div class="panel panel-white border-top-purple">
                                <div class="panel-heading">
                                <h3 class="panel-title" style="height:30px;">Extracted Text</h3>
                                </div>
                                <div class="panel-body" style="padding:30px; border-radius:5px">
                                <div class="body-section">
                                <h5 class="section-heading"> <span class="message">${data.message.ocrtext}</span></h5>
                                </div>
                                <div class="body-section">
                                <audio controls style="width: 90%;" id="tesseractaudio">
                                <source src="${data.message.ocraudio}" type="audio/mpeg"  id="tesseractaudiosource">
                                Your browser does not support the audio element.
                                </audio>
                                </div>
                                <div class="body-section">
                                <!-- <a href="#" class="btn btn-purple btn-sm">Edit</a> -->
                                </div>
                            </div>
                        </div>
                    </div>
                  
                    
            
                   
                    <div class="col-sm-6">
                    <div class="panel panel-white border-top-green">
                    <div class="panel-heading">
                    <h3 class="panel-title">AI Text</h3>
                   
                    </div>
                    <div class="panel-body" style="padding:30px">
        
        
                    <div class="body-section">
                    <h5 class="section-heading"><span class="message">${data.message.aitext}</span></h5>
                    </div>
                    <div class="body-section">
                    <audio controls style="width: 90%;" id="tesseractaudio">
                    <source src="${data.message.aiaudio}" type="audio/mpeg"  id="tesseractaudiosource">
                    Your browser does not support the audio element.
                    </audio>
                    </div>
    
                
                    </div>
                    </div>
                    
    
                        
                    
                    <div class="panel ">
        
                    </div>
          
        
                    
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                `;
                }


            } else if (profession == 'customer') {
                html = `
                <div class="container" style="width:1500px;max-width:1500px; margin-left:300px">
                <i class="fas fa-arrow-left back-icon" onclick="BackButton()"></i>
                <div class="row">
                <div class="col-sm-8 col-sm-offset-2">
                <div class="panel panel-white profile-widget">
                <div class="row">
                <div class="col-sm-12">
                <div class="image-container bg2">
                <img src="${data.message.image}" class="avatar" alt="avatar" height="100px" >
                </div>
                </div>
                <div class="col-sm-12">
                <div class="details">
                <h4>${data.message.name} <i class="fa fa-sheild"></i></h4>
                <div class="mg-top-10">
                </div>
                </div>
                </div>
                </div>
                </div>

                <div class="row">
                    <div class="col-sm-6"   >
                        <div class="panel panel-white border-top-purple">
                            <div class="panel-heading">
                            <h3 class="panel-title" style="height:30px;">Account Info</h3>
                            </div>
                            <div class="panel-body" style="padding:30px; border-radius:5px">
                            <div class="body-section">
                            <h5 class="section-heading">Account Name : <span class="message">${data.message.name}</span></h5>
                            </div>
                            <div class="body-section">
                            <h5 class="section-heading">Password :
                            <span class="message" style="display:none" id="passwordText">${data.message.password}</span>
                            <a class="text-info" data-toggle="tooltip" title="Toggle Password" onclick="togglePasswordVisibility()">
                                <i class="far fa-eye" id="eyeIcon"></i>
                            </a>
                            </h5>
                            </div>
                            <div class="body-section">
                            <h5 class="section-heading">ID : <span class="message" >${data.message.customerid}  </span> </h5>
                            </div>
                            <div class="body-section">
                            <h5 class="section-heading">EmailVerified : <span class="message" >${data.message.isemailverified}  </span> </h5>
                            </div>
                            <div class="body-section">
                            <h5 class="section-heading">Blocked : <span class="message" >${data.message.blockeduser}  </span> </h5>
                            </div>
                            <div class="body-section">
                            <h5 class="section-heading">Wrong Attempts : <span class="message" >${data.message.wronginput} (today)</span> </h5>
                            </div>
                            <div class="body-section">
                            <!-- <a href="#" class="btn btn-purple btn-sm">Edit</a> -->
                            </div>
                        </div>
                    </div>
                </div>
              
                
        
               
                <div class="col-sm-6">
                <div class="panel panel-white border-top-green">
                <div class="panel-heading">
                <h3 class="panel-title">User Info</h3>
               
                </div>
                <div class="panel-body" style="padding:30px">
    
    
                <div class="body-section">
                <h5 class="section-heading">Name : <span class="message">${data.message.name}</span></h5>
                </div>
    
                <div class="body-section">
                <h5 class="section-heading">Telephone:  <span class="message">${data.message.phonenumber}</span></h5>
                </div>
                <div class="body-section">
                <h5 class="section-heading">Email : <span class="message">${data.message.email}</span></h5>
                </div>
                <div class="body-section">
                <h5 class="section-heading">Created Date : <span class="message">${data.message.createddate}</span></h5>
                </div>
            
                </div>
                </div>
                
                <div class="panel panel-white border-top-purple">
                            <div class="panel-heading">
                            <h3 class="panel-title" style="height:30px;">Useage Info</h3>
                            </div>
                            <div class="panel-body" style="padding:30px; border-radius:5px">
                            <div class="body-section">
                            <h5 class="section-heading">PDF Count : <span class="message">${data.message.pdfcount}</span></h5>
                            </div>
                            <div class="body-section">
                            <h5 class="section-heading">Image Count : <span class="message" >${data.message.imagecount}  </span> </h5>
                            </div>
                            <div class="body-section">
                            <h5 class="section-heading">Text Count : <span class="message" >${data.message.textcount}  </span> </h5>
                            </div>
                            <div class="body-section">
                            <h5 class="section-heading">AI Count : <span class="message" >${data.message.aicount}  </span> </h5>
                            </div>
                            <div class="body-section">
                            <h5 class="section-heading">Ocr Count : <span class="message" >${data.message.ocrcount} </span> </h5>
                            </div>
                            <div class="body-section">
                            <h5 class="section-heading">Total Count : <span class="message" >${data.message.totalcount} </span> </h5>
                            </div>
                            <div class="body-section">
                            <!-- <a href="#" class="btn btn-purple btn-sm">Edit</a> -->
                            </div>
                        </div>
                    
                
                <div class="panel ">
    
                </div>
      
    
                
                </div>
                </div>
                </div>
                </div>
                </div>
                </div>
            `;
            }

            document.querySelector('.display-view').innerHTML = html;
            document.querySelector('.display-view').style.display = 'block';
        })
        .catch(error => {
            console.log(error)
        });

}




function togglePasswordVisibility() {
    var passwordText = document.getElementById('passwordText');
    var eyeIcon = document.getElementById('eyeIcon');

    // Toggle password visibility
    if (passwordText.style.display === 'none') {
        passwordText.style.display = 'inline';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    } else {
        passwordText.style.display = 'none';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    }
}
var recentPage = ''
function BackButton() {
    if (recentPage == 'inventory') {
        DisplayListInventory()
    } else if (recentPage == 'seller') {
        DisplayListSeller()
    } else if (recentPage == 'customer') {
        DisplayListUsers()
    }
}





function BlockUser(id) {
    const blockdata = {
        id,
        token:formData.token,
    }
    fetch("http://localhost:8080/block", {
        method: "POST", // Use DELETE method to delete data
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(blockdata)
    })
        .then(response => response.json())
        .then(data => {

            if (data.message) {
                showToast(data.message, "Success", 3)
            } else if (data.error) {
                showToast(data.error, "Warning", 0)
            }
        })
        .catch(error => {
            showToast(data.error, "Warning", 0)
        });
}

function DisplayShutDown() {
    document.getElementById("shutdown-form-container").style.display = 'block';
    document.getElementById("clear-form-container").style.display = 'none'
    document.querySelector('.outer-container').style.display = 'none';
    document.getElementById('single-order-container').style.display = 'none';
    document.querySelector('.container-p-y').style.display = 'none';
    document.getElementById('snippetContent').style.display = 'none';
    document.getElementById("block-form-container").style.display = 'none';
    document.getElementById('feedbacksnip').style.display = 'none';
    document.querySelector('.display-view').style.display = 'none';
    document.getElementById("orders-container").style.display = 'none';
    document.getElementById('admin-wrapper').style.display = 'none';
    document.getElementById("calendar").style.display = 'block';
    document.getElementById('update-form-admin-container').style.display = 'none';
    document.getElementById("calendar").style.display = 'none';
    document.getElementById("event-wrapper").style.display = 'none';
    document.getElementById("clearbuttons-container").style.display = 'none';
}

document.getElementById("shutdown-form").addEventListener("submit", () => {
    var adminData = localStorage.getItem('admindata');
    var adminObject = JSON.parse(adminData);
    const shutdownData = {
        token: formData.token,
        password: (document.getElementById("secretkey").value).trim()
    }
    if (formData.password == "") {
        showToast("Key Required to ShutDown", "Danger", 0)
        return
    }

    fetch("http://localhost:8080/shutdown", {
        method: "POST", // Use DELETE method to delete data
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(shutdownData)
    })
        .then(response => response.json())
        .then(data => {

            if (data.message) {
                showToast(data.message, "Success", 3)
            } else if (data.error) {
                showToast(data.error, "Warning", 0)
            }
        })
        .catch(error => {
            showToast(data.error, "Warning", 0)
        });
})

function DisplayClearForm() {
    document.getElementById("shutdown-form-container").style.display = 'none'
    document.getElementById("clear-form-container").style.display = 'none'
    document.querySelector('.outer-container').style.display = 'none';
    document.querySelector('.container-p-y').style.display = 'none';
    document.getElementById('snippetContent').style.display = 'none';
    document.getElementById("block-form-container").style.display = 'none';
    document.getElementById('feedbacksnip').style.display = 'none';
    document.querySelector('.display-view').style.display = 'none';
    document.getElementById('single-order-container').style.display = 'none';
    document.getElementById('admin-wrapper').style.display = 'none';
    document.getElementById("calendar").style.display = 'none';
    document.getElementById("orders-container").style.display = 'none';
    document.getElementById('update-form-admin-container').style.display = 'none';
    document.getElementById("calendar").style.display = 'none';
    document.getElementById("event-wrapper").style.display = 'none';
    document.getElementById("clear-form-container").style.display = 'none'
    document.getElementById("clearbuttons-container").style.display = 'none';
    document.getElementById("clear-form-container").style.display = 'block'
}

document.getElementById("cleardb-form").addEventListener("submit", () => {

    const password = (document.getElementById("dbsecretkey").value).trim()
    if (password == "technoclear") {
        DisplayClearData()
    } else {
        showToast("Invalid Key", "Error", 3)
    }
})

function DisplayClearData(){
    document.getElementById("shutdown-form-container").style.display = 'none';
    document.getElementById("clear-form-container").style.display = 'none'
    document.querySelector('.outer-container').style.display = 'none';
    document.getElementById('single-order-container').style.display = 'none';
    document.querySelector('.container-p-y').style.display = 'none';
    document.getElementById('snippetContent').style.display = 'none';
    document.getElementById("block-form-container").style.display = 'none';
    document.getElementById('feedbacksnip').style.display = 'none';
    document.querySelector('.display-view').style.display = 'none';
    document.getElementById("orders-container").style.display = 'none';
    document.getElementById('admin-wrapper').style.display = 'none';
    document.getElementById('update-form-admin-container').style.display = 'none';
    document.getElementById("event-wrapper").style.display = 'none';
    document.getElementById("clearbuttons-container").style.display = 'none';
    document.getElementById("clearbuttons-container").style.display = 'block';
}


function DisplayBlock() {
    document.getElementById("shutdown-form-container").style.display = 'none';
    document.getElementById("clear-form-container").style.display = 'none'
    document.querySelector('.outer-container').style.display = 'none';
    document.querySelector('.container-p-y').style.display = 'none';
    document.getElementById('snippetContent').style.display = 'none';
    document.getElementById("block-form-container").style.display = 'block';
    document.getElementById('feedbacksnip').style.display = 'none';
    document.querySelector('.display-view').style.display = 'none';
    document.getElementById('admin-wrapper').style.display = 'none';
    document.getElementById("calendar").style.display = 'none';
    document.getElementById('single-order-container').style.display = 'none';
    document.getElementById('update-form-admin-container').style.display = 'none';
    document.getElementById("calendar").style.display = 'none';
    document.getElementById("event-wrapper").style.display = 'none';
    document.getElementById("clear-form-container").style.display = 'none'
    document.getElementById("clearbuttons-container").style.display = 'none';
    document.getElementById("orders-container").style.display = 'none';
}

function BLockbyemail(event) {
    event.preventDefault();
    let email = (document.getElementById("blockemail").value).trim()
    let collection = document.getElementById("blockcollection").value;
    console.log(email, collection)
    BlockUser(email, collection)
    document.getElementById("blockemail").value = ""
}


// Conformation Box
function showConfirmation(function_name, question, option1, option2, id) {
    console.log("In Conformation")
    document.getElementById("conformationoverlay").classList.add("conformationactive");
    document.getElementById("confirmationDialog").classList.add("conformationactive");
    document.querySelector(".conformation-question").innerHTML = question;
    document.getElementById("conformationtrue").innerHTML = option1;
    document.getElementById("confirmationfalse").innerHTML = option2;

    document.getElementById("conformationtrue").addEventListener("click", function () {
        function_name(id);
        hideConfirmationDialog();
    });
    document.getElementById("confirmationfalse").addEventListener("click", function () {
        hideConfirmationDialog();
    });
}

function hideConfirmationDialog() {
    document.getElementById("conformationoverlay").classList.remove("conformationactive");
    document.getElementById("confirmationDialog").classList.remove("conformationactive");
}

function ClearDB(collection) {
   
    const cleardb = {
        token: formData.token,
        collection,
    }
    fetch("http://localhost:8080/cleardb", {
        method: "POST", // Use DELETE method to delete data
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cleardb)
    })
        .then(response => response.json())
        .then(data => {

            if (data.message) {
                showToast(data.message, "Success", 3)
            } else if (data.error) {
                showToast(data.error, "Warning", 0)
            }
        })
        .catch(error => {
            showToast(data.error, "Warning", 0)
        });
}