// variables
const usernameContainer = document.getElementById("container-username");
const otpContainer = document.getElementById("container-otp");

const usernameForm = document.getElementById("form-username");
const getOtpButton = document.querySelector(".otp");

const otpForm = document.getElementById("form-otp");
const backArrow = document.getElementById("arrow");
const wrongMsg = document.querySelector(".wrong-message");
const resend = document.querySelector(".resend-otp");
const loginButton = document.querySelector(".login");

const email = document.getElementById("email");
const otpReceived = document.getElementById("otp");

const otpFormUsername = document.querySelector(".otpform-username");
const successBanner = document.getElementById("success-dialog");
const timer = document.querySelector(".timer");
const resendOtp = document.querySelector(".resend-otp");
//for toggle logic
const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const emailInputSignUp = document.getElementById("sign-up-email");
const emailInputSignIn = document.getElementById("email");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

document.getElementById("sign-up-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = emailInputSignUp.value;
  // Set the email in the sign-in form
  emailInputSignIn.value = email;
  container.classList.remove("active");
});
// toggle logic ends here

let intervalID;

// functions
const sendOtp = (userEmail) => {
  fetch("/send-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: userEmail }),
  })
    .then((response) => response.text())
    .then((data) => {
      // this alert showing up when clicking "send OTP" without anu data in data var
      //alert(data); // Show success or error message
      // receiving the data from the server into data variable
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to send OTP");
    });
};

function startTimer(duration, display) {
  // whenever timer starts "Resend OTP" should be blocked
  //  duration is in seconds, change it to ms
  resendOtp.disabled = true;
  setTimeout(() => {
    resendOtp.disabled = false;
  }, duration * 1000);

  let timer = duration,
    minutes,
    seconds;
  // console.log("mins: " + minutes + " secs: " + seconds);
  intervalID = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    if (minutes === 0 && seconds === 0) {
      // stopping the timer from looping
      clearInterval(intervalID);
      // resendOtp.style.color = "#efefef";
      resendOtp.style.color = "#efefef";
      resendOtp.style.textDecoration = "";
      resendOtp.style.cursor = "pointer";
    } else {
      // disable the resend button till timer not ends
      // change color to show the effect
      resendOtp.style.color = "#919191";
      resendOtp.style.textDecoration = "none";
      resendOtp.style.cursor = "none";
    }

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      timer = duration;
    }
  }, 1000);

  // if(minutes === 0 && seconds === 0) {
  //     clearInterval(intervalID);
  // }

  backArrow.addEventListener("click", function () {
    clearInterval(intervalID);
  });
}

// event listeners

// Ensure the OTP container is hidden initially
document.addEventListener("DOMContentLoaded", () => {
  otpContainer.style.display = "none"; // Hide OTP container initially
});

// ... Your existing code ...

getOtpButton.addEventListener("click", () => {
  console.log("Get OTP button clicked"); // Debugging
  usernameContainer.style.display = "none"; // Hide username form
  otpContainer.style.display = "block"; // Show OTP form
});

// Event listener for username form submission
usernameForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent page refresh
  let userEmail = email.value;
  sendOtp(userEmail); // Call your send OTP function
  usernameContainer.style.display = "none"; // Hide username form
  otpContainer.style.display = "inline-block"; // Show OTP form
  otpFormUsername.textContent = "Hi " + userEmail; // Update username display
  startTimer(30, timer); // Start timer
});

otpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let otpEntered = otpReceived.value;
  // gives effect of wrong msg is going and then using
  wrongMsg.style.display = "none";

  fetch("/check-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ otp: otpEntered }),
  })
    .then((response) => response.text())
    .then((data) => {
      // alert(data); // Show success or error message
      // receiving the data from the server into data variable

      if (data === "correct") {
        // window.location = "";
        // window.location.href = "";
        // replace() removes URL of curr doc from doc history, not possible to use "back" button
        // show success modal and close
        successBanner.showModal();
        setTimeout(() => {
          successBanner.close();
          window.location.replace("index copy.html");
        }, 1000);
        // window.location.replace("./index.html");
      } else if (data === "incorrect") {
        wrongMsg.style.display = "block";
        // to remove the wrong msg notif after 10 secs
        setTimeout(() => {
          wrongMsg.style.display = "none";
        }, 10000);
      }
    })
    .catch((error) => {
      // error var contains the error msg from server can use alert or a div to show it
      console.error("Error:", error);
      alert("OTP is incorrect!");
    });
});

backArrow.addEventListener("click", () => {
  clearInterval(intervalID);
  otpContainer.style.display = "none";
  usernameContainer.style.display = "block";
});

resendOtp.addEventListener("click", () => {
  let userEmail = email.value;
  clearInterval(intervalID);
  // remove wrong msg as soon as new otp generated
  wrongMsg.style.display = "none";
  // send the otp
  sendOtp(userEmail);
  // restart the timer to receive next otp
  startTimer(5, timer);
});

window.onload = () => {
  // Initially set the container to active to show the sign-up form
  container.classList.add("active");
  clearInterval(intervalID);
  otpForm.reset();
  usernameForm.reset();
};
