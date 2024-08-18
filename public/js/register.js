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

document.getElementById("register").addEventListener("click", handleRegister);

function handleRegister() {
    var password = document.getElementById("password-input").value;
    var confirmPassword = document.getElementById("confirm-password-input").value;
    var number = document.getElementById("useremail-input").value;

    if (!password || !confirmPassword || !number) {
        showError("Please Fill all the fields")
        return false;
    }

    if (password === confirmPassword) {

        var userData = {
            phoneNumber: number,
            password: password,
        };

        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (response.ok) {
                    localStorage.setItem('pn', number);
                    activeotpcontainer()
                } else {
                    response.json().then(data => {
                        showError(data.message)
                    });
                }
            })
            .catch(error => {
                showError("Registration failed try again later")
            });
    } else {
        showError("Passwords do not match");
    }
}

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

function verifyotp() {
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

    fetch('/verifyotp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(otpData)
    })
        .then(async response => {
            if (response.ok) {
                localStorage.removeItem('pn')
                window.location.href = `/personalinfo?userNumber=${encodeURIComponent(phoneNumber)}`;
            } else {
                const data = await response.json();
                showError(data.message);
                deactivateotpcontainer();
            }
        })
        .catch(error => {
            showError("Error while verifying OTP. Please try again")
            deactivateotpcontainer();
        })
        .finally(() => {
            for (let i = 1; i <= 4; i++) {
                const inputField = document.getElementById('otp-input-' + i);
                inputField.value = '';
            }
        });
}

document.getElementById("otp-btn").addEventListener("click", verifyotp);

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

document.getElementById("resend-otp").addEventListener("click", resendotp)

function resendotp() {
    const phoneNumber = localStorage.getItem('pn');

    const userdata = {
        phoneNumber: phoneNumber
    }

    fetch('/resendotp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userdata)
    })
        .then(response => {
            if (response.ok) {
                showError("New otp is sended")
            } else {
                deactivateotpcontainer()
                showError("Maximum OTP attempts reached")
            }
        })
        .catch(error => {
            showError("Error while resending otp")
        });
}
function scrolltotop() {
    const targetPixelPosition = 1;
    window.scroll({ top: targetPixelPosition, left: 0, behavior: 'smooth' });
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