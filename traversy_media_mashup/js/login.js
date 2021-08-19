const background = document.getElementById('background')
const loginForm = document.getElementById('login-form')
const loginForm_password = document.getElementById('login-password')
const loginFormToggler = document.getElementById('login-form-toggler')
const registerFormToggler = document.getElementById('register-form-toggler')

loginForm_password.addEventListener('input', (e) => {
  const input = e.target.value
  const length = input.length
  const blurValue = 20 - length * 2
  background.style.filter = `blur(${blurValue}px)`
})

const registerForm = document.getElementById('register-form');
const username = document.getElementById('register-username');
const email = document.getElementById('register-email');
const password = document.getElementById('register-password');
const password2 = document.getElementById('register-password2');

// Show input error message
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = 'form-control error';
  const small = formControl.querySelector('small');
  small.innerText = message;
}

// Show success outline
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = 'form-control success';
}

// Check email is valid
function checkEmail(input) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(input.value.trim())) {
    showSuccess(input);
  } else {
    showError(input, 'Email is not valid');
  }
}

// Check required fields
function checkRequired(inputArr) {
  let isRequired = false;
  inputArr.forEach(function(input) {
    if (input.value.trim() === '') {
      showError(input, `${getFieldName(input)} is required`);
      isRequired = true;
    } else {
      showSuccess(input);
    }
  });

  return isRequired;
}

// Check input length
function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} must be at least ${min} characters`
    );
  } else if (input.value.length > max) {
    showError(
      input,
      `${getFieldName(input)} must be less than ${max} characters`
    );
  } else {
    showSuccess(input);
  }
}

// Check passwords match
function checkPasswordsMatch(input1, input2) {
  if (input1.value !== input2.value) {
    showError(input2, 'Passwords do not match');
  }
}

// Get fieldname
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// Event listeners
registerForm.addEventListener('submit', function(e) {
  e.preventDefault();

  if(!checkRequired([username, email, password, password2])){
    checkLength(username, 3, 15);
    checkLength(password, 6, 25);
    checkEmail(email);
    checkPasswordsMatch(password, password2);
  }

});

[registerFormToggler, loginFormToggler].forEach(toggler=>{
	toggler.addEventListener('click', function(e) {
		e.preventDefault();
		let targetElem = e.target
		console.log(targetElem.id)
		if(targetElem.id === "login-form-toggler"){
			registerForm.parentElement.classList.remove('active')
			loginForm.parentElement.classList.add('active')
		} else if(targetElem.id === "register-form-toggler"){
			loginForm.parentElement.classList.remove('active')
			registerForm.parentElement.classList.add('active')
		}
	});
});

