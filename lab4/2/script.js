function validate_fname(fname) {
    const error_text = "The first name input isn't valid!";

    if (fname.value == "") {
        return error_text;
    }

    if (!(fname.value[0] >= 'A' && fname.value[0] <= 'Z')) {
        return error_text;
    }

    for (let i = 1; i < fname.length; i++) {
        if (!(fname.value[i] >= 'a' && fname.value[i] <= 'z')) {
            // Checking if the current character is a hyphen or a space.
            if (fname.value[i] == ' ' || fname.value[i] == '-') {
                // Checking if the next character exists and if it is a capital letter.
                if (!(fname.value[i] >= 'A' && fname.value[i] <= 'Z')) {
                    return error_text;
                }
                i++;
            }
        }
    }

    return "";
}

function validate_lname(lname) {
    const error_text = "The last name input isn't valid!";

    if (lname.value == "") {
        return error_text;
    }

    if (!(lname.value[0] >= 'A' && lname.value[0] <= 'Z')) {
        return error_text;
    }

    for (let i = 1; i < lname.length; i++) {
        if (!(lname.value[i] >= 'a' && lname.value[i] <= 'z')) {
            // Checking if the current character is a hyphen or a space.
            if (lname.value[i] == ' ' || lname.value[i] == '-') {
                // Checking if the next character exists and if it is a capital letter.
                if (i + 1 >= lname.length && !(lname.value[i + 1] >= 'A' && lname[i + 1] <= 'Z')) {
                    return error_text;
                }
                i++;
            }
        }
    }

    return "";
}

function validate_age_and_bdate(age, bdate) {
    const error_text = "The birth date and age do not correspond!";
    const curr_date = new Date(Date.now());
    const passed_date = new Date(bdate.value);

    const years_difference = curr_date.getFullYear() - passed_date.getFullYear();
    const is_month_passed = curr_date.getMonth() < passed_date.getMonth();
    const is_day_passed_in_month = curr_date.getMonth() == passed_date.getMonth() && curr_date.getDate() < passed_date.getDate();

    if (is_month_passed || is_day_passed_in_month) {
        years_difference--;
    }

    if (years_difference != age.value) {
        console.log(age)
        return error_text;
    }

    return "";
}

function validate_email(email) {
    const error_text = "The email isn't valid!";

    const fields = email.value.split("@");
    if (fields.length != 2) {
        return error_text;
    }

    if (fields[1].split(".") < 2) {
        return error_text;
    }

    return ""
}

const submit_button = document.getElementById("submit-button");
submit_button.addEventListener("click", function () {
    const _fname_input = document.getElementById("first-name-input");
    const _lname_input = document.getElementById("last-name-input");
    const _bdate_input = document.getElementById("birth-date-input");
    const _age_input = document.getElementById("age-input");
    const _email_input = document.getElementById("email-input");

    const fname_err = validate_fname(_fname_input);
    const lname_err = validate_lname(_lname_input);
    const age_bdate_err = validate_age_and_bdate(_age_input, _bdate_input);
    const email_err = validate_email(_email_input);

    let err = ""
    if (fname_err != "") {
        err += fname_err + "\n";
    }
    if (lname_err != "") {
        err += lname_err + "\n";
    }
    if (age_bdate_err != "") {
        err += age_bdate_err + "\n";
    }
    if (email_err != "") {
        err += email_err + "\n";
    }

    if (err != "") {
        const err_border = "5px solid red";
        const ok_border = "1px solid black";

        if (fname_err != "") {
            _fname_input.style.border = err_border;
        } else {
            _fname_input.style.border = ok_border;
        }

        if (lname_err != "") {
            _lname_input.style.border = err_border;
        } else {
            _lname_input.style.border = ok_border;
        }

        if (age_bdate_err != "") {
            _age_input.style.border = err_border;
            _bdate_input.style.border = err_border;
        } else {
            _age_input.style.border = ok_border;
            _bdate_input.style.border = ok_border;
        }

        if (email_err != "") {
            _email_input.style.border = err_border;
        } else {
            _email_input.style.border = ok_border;
        }

        alert(err);
    } else {
        alert("All good!");
    }
}); 
