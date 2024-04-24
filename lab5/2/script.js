function validate_fname(fname) {
    const error_text = "The first name input isn't valid!";
    const fname_val = $(fname).val();

    if (fname_val == "") {
        return error_text;
    }

    if (!(fname_val[0] >= 'A' && fname_val[0] <= 'Z')) {
        return error_text;
    }

    for (let i = 1; i < fname_val.length; i++) {
        if (!(fname_val[i] >= 'a' && fname_val[i] <= 'z')) {
            // Checking if the current character is a hyphen or a space.
            if (fname_val[i] == ' ' || fname_val[i] == '-') {
                // Checking if the next character exists and if it is a capital letter.
                if ((i + 1) >= fname_val.length || !(fname_val[i + 1] >= 'A' && fname_val[i + 1] <= 'Z')) {
                    return error_text;
                }
                i++;
            } else {
                return error_text;
            }
        }
    }

    return "";
}

function validate_lname(lname) {
    const error_text = "The last name input isn't valid!";
    const lname_val = $(lname).val();

    if (lname_val == "") {
        return error_text;
    }

    if (!(lname_val[0] >= 'A' && lname_val[0] <= 'Z')) {
        return error_text;
    }

    for (let i = 1; i < lname_val.length; i++) {
        if (!(lname_val[i] >= 'a' && lname_val[i] <= 'z')) {
            // Checking if the current character is a hyphen or a space.
            if (lname_val[i] == ' ' || lname_val[i] == '-') {
                // Checking if the next character exists and if it is a capital letter.
                if (i + 1 >= lname_val.length && !(lname_val[i + 1] >= 'A' && lname[i + 1] <= 'Z')) {
                    return error_text;
                }
                i++;
            } else {
                return error_text;
            }
        }
    }

    return "";
}

function validate_age_and_bdate(age, bdate) {
    const error_text = "The birth date and age do not correspond!";
    const curr_date = new Date(Date.now());
    const passed_date = new Date($(bdate).val());

    const years_difference = curr_date.getFullYear() - passed_date.getFullYear();
    const is_month_passed = curr_date.getMonth() < passed_date.getMonth();
    const is_day_passed_in_month = curr_date.getMonth() == passed_date.getMonth() && curr_date.getDate() < passed_date.getDate();

    if (is_month_passed || is_day_passed_in_month) {
        years_difference--;
    }

    if (years_difference != $(age).val()) {
        return error_text;
    }

    return "";
}

function validate_email(email) {
    const error_text = "The email isn't valid!";
    const email_val = $(email).val();

    const fields = email_val.split("@");
    if (fields.length != 2) {
        return error_text;
    }

    if (fields[1].split(".").length < 2) {
        return error_text;
    }

    return ""
}

const submit_button = $("#submit-button");
$(submit_button).click(() => {
    const _fname_input = $("#first-name-input");
    const _lname_input = $("#last-name-input");
    const _bdate_input = $("#birth-date-input");
    const _age_input = $("#age-input");
    const _email_input = $("#email-input");

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

    const err_border = "5px solid red";
    const ok_border = "1px solid black";

    if (fname_err != "") {
        $(_fname_input).css("border", err_border);
    } else {
        $(_fname_input).css("border", ok_border);
    }

    if (lname_err != "") {
        $(_lname_input).css("border", err_border);
    } else {
        $(_lname_input).css("border", ok_border);
    }

    if (age_bdate_err != "") {
        $(_age_input).css("border", err_border);
        $(_bdate_input).css("border", err_border);
    } else {
        $(_age_input).css("border", ok_border);
        $(_bdate_input).css("border", ok_border);
    }

    if (email_err != "") {
        $(_email_input).css("border", err_border);
    } else {
        $(_email_input).css("border", ok_border);
    }
    
    if (err != "") {
        setTimeout(() => alert(err));
    } else {
        setTimeout(() => alert("All good!"), 0);
    }
}); 
