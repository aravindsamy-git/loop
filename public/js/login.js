function togglePasswordVisibility(inputId, iconId) {
    var input = document.getElementById(inputId);
    var icon = document.getElementById(iconId);

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    }
}

function showError(message) {
    var errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    var errorContainer = document.getElementById('error-container');
    errorContainer.style.display = 'block';
    errorContainer.style.right = 5 + "px"

    setTimeout(function () {
        hideError();
    }, 5000);
}

function hideError() {
    var errorContainer = document.getElementById('error-container');
    errorContainer.style.right = '-350px';
    errorContainer.style.display = 'none';
}

document.getElementById('close-error-btn').addEventListener('click', function () {
    hideError();
});

document.addEventListener("DOMContentLoaded", function () {

    var loginbtn = document.getElementById("register")
    loginbtn.addEventListener("click", function () {

        var password = document.getElementById("password-input").value;
        var number = document.getElementById("useremail-input").value;


        if (!password || !number) {
            showError("Please Fill all the fields")
            return false;
        }

        var userData = {
            phoneNumber: number,
            password: password
        };

        fetch('/Userlogin', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (response.ok) {
                    document.getElementById("password-input").value = " "
                    document.getElementById("useremail-input").value = " "
                    window.location.href = "/home"
                } else {
                    document.getElementById("password-input").value = " "
                    document.getElementById("useremail-input").value = " "
                    showError("Invalid login credentials")
                }
            })
            .catch(error => {
                showError("Login failed try again later")
            })
    })
})

document.addEventListener('DOMContentLoaded', function () {

    const Forgotpassword = document.getElementById("Forgot-password")
    const closebtn = document.getElementById("close-btn")

    Forgotpassword.addEventListener('click', function () {
        phonenumbercontaineropen()
    })

    closebtn.addEventListener('click', function () {
        phonenumbercontainerclose()
    })
})

function activeotpcontainer() {
    const otppopup = document.getElementById("otp-popup");
    otppopup.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function deactivateotpcontainer() {
    const otppopup = document.getElementById("otp-popup");
    otppopup.style.display = "none";
    document.body.style.overflow = "auto";
}

function phonenumbercontaineropen() {
    const phonenumber = document.getElementById("phonenumber-popup");
    phonenumber.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function phonenumbercontainerclose() {
    const phonenumber = document.getElementById("phonenumber-popup");
    phonenumber.style.display = "none";
    document.body.style.overflow = "auto";
}

document.getElementById('useremail-input').addEventListener('input', function (e) {
    var input = e.target;
    var value = input.value;
    value = value.replace(/\D/g, '');

    if (value.length > 10) {
        value = value.slice(0, 10);
    }

    input.value = value;
});

document.getElementById('phonenumberotp').addEventListener('input', function (e) {
    var input = e.target;
    var value = input.value;
    value = value.replace(/\D/g, '');

    if (value.length > 10) {
        value = value.slice(0, 10);
    }

    input.value = value;
});

const phonenumberbtn = document.getElementById('phonenumber-btn')

phonenumberbtn.addEventListener('click', function () {
    const number = document.getElementById('phonenumberotp').value

    if (!number) {
        showError("Please Enter the Phoenumber")
        return false;
    }

    fetch('/forgotpassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber: number })
    })
        .then(async response => {
            if (response.ok) {
                phonenumbercontainerclose()
                activeotpcontainer()
                localStorage.setItem('pn', number);
            } else {
                const data = await response.json();
                showError(data.message);
            }
        })
        .then(data => {
        })
        .catch(error => {
            console.error('Error:', error);
            showError("Error while sending OTP. Please try again.");
        });
})

const otpbtn = document.getElementById('otp-btn').addEventListener('click', function () {
    for (let i = 1; i <= 4; i++) {
        const inputField = document.getElementById('otp-input-' + i);
        if (!inputField.value) {
            showError('All OTP fields must be filled');
            return;
        }
    }

    const phoneNumber = localStorage.getItem('pn');

    let otp = '';
    for (let i = 1; i <= 4; i++) {
        const inputField = document.getElementById('otp-input-' + i);
        otp += inputField.value;
    }

    const otpData = {
        phoneNumber: phoneNumber,
        otp: otp
    };

    fetch('/forgototpverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(otpData)
    })
        .then(response => {
            if (response.ok) {
                deactivateotpcontainer()
                activenewpassword()
            } else {
                return response.json().then(data => {
                    showError(data.message)
                    deactivateotpcontainer()
                });
            }
        })
        .catch(error => {
            showError("Error while verifying OTP. Please try again")
            deactivateotpcontainer()
        })
        .finally(() => {
            for (let i = 1; i <= 4; i++) {
                const inputField = document.getElementById('otp-input-' + i);
                inputField.value = '';
            }
        });
})

const resendotp = document.getElementById('resend-otp').addEventListener('click', function () {
    const phoneNumber = localStorage.getItem('pn');

    fetch('/forgotresendotp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber: phoneNumber })
    })
        .then(async response => {
            if (response.ok) {
                showError("New otp is sended")
            } else {
                deactivateotpcontainer()
                showError("Maximum OTP attempts reached")
            }
        })
        .then(data => {
        })
        .catch(error => {
            console.error('Error:', error);
            showError("Error while sending OTP. Please try again.");
        });
})

document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.otp-input');

    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^0-9]/g, '');
            if (input.value.length === 1) {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            }
            if (input.value.length > 1) {
                input.value = input.value.slice(0, 1);
            }
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Backspace' && input.value === '' && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });
});


function activenewpassword() {
    const phonenumber = document.getElementById("newphonenumber-popup");
    phonenumber.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function deactivenewpassword() {
    const phonenumber = document.getElementById("newphonenumber-popup");
    phonenumber.style.display = "none";
    document.body.style.overflow = "auto";
}

const newphonenumberbtn = document.getElementById('newphonenumber-btn').addEventListener('click', function () {

    const newpassword = document.getElementById('newphonenumberotp').value
    const pn = localStorage.getItem('pn')

    fetch('/changepassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Password: newpassword, phoneNumber: pn })
    })
        .then(async response => {
            if (response.ok) {
                deactivenewpassword()
                showError("Password is updated")
                localStorage.removeItem('pn')
                window.location.href = '/home'
            } else {
                showError("Password is not updated , try again later")
            }
        })
        .then(data => {
        })
        .catch(error => {
            console.error('Error:', error);
            showError("Error while Updating Password");
        });
})

function scrolltotop() {
    const targetPixelPosition = 1;
    window.scroll({ top: targetPixelPosition, left: 0, behavior: 'smooth' });
  }