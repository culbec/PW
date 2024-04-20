function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    return arr;
}

function get_matrix(table_size) {
    let matrix = [], t = 0, nums = [];
    for (let i = 0; i < table_size * table_size / 2; i++) {
        nums.push(i + 1);
    }

    // Duplicating the array.
    nums = [...nums, ...nums];

    for (let i = 0; i < table_size; i++) {
        matrix[i] = [];
        for (let j = 0; j < table_size; j++) {
            matrix[i].push(nums[t++]);
        }
        // Shuffling the row.
        matrix[i] = shuffle(matrix[i]);
    }

    // Shuffling the matrix.
    return shuffle(matrix);
}

function build_number_table(table_container, table_size) {
    const matrix = get_matrix(table_size);

    // Creating a new table.
    const _table = document.createElement("table");
    _table.setAttribute("id", "number-table");
    _table.style.border = "1px solid black";

    for (let i = 0; i < table_size; i++) {
        // Creating a new row.
        const _row = document.createElement("tr");
        for (let j = 0; j < table_size; j++) {
            // Creating a new cell.
            const _cell = document.createElement("td");
            _cell.innerHTML = matrix[i][j];
            _cell.style.background = "black";

            _row.appendChild(_cell);
        }
        _table.appendChild(_row);
    }
    table_container.appendChild(_table);
    return _table;
}

function build_image_table(table_container, table_size) {
    const matrix = get_matrix(table_size);

    // Creating a new table.
    const _table = document.createElement("table");
    _table.setAttribute("id", "image-table");
    _table.style.border = "1px solid black";

    for (let i = 0; i < table_size; i++) {
        // Creating a new row.
        const _row = document.createElement("tr");
        for (let j = 0; j < table_size; j++) {
            // Creating a new image.
            const _img = document.createElement("img");
            _img.src = "./images/img" + matrix[i][j] + ".png";
            _img.alt = matrix[i][j];
            _img.style.opacity = 0;
            _img.style.width = "100px";
            _img.style.height = "100px";

            // Creating a new cell.
            const _cell = document.createElement("td");
            _cell.appendChild(_img);
            _cell.style.background = "black";

            _row.appendChild(_cell);
        }
        _table.appendChild(_row);
    }
    table_container.appendChild(_table);
    return _table;
}

function table_handler(table, table_size) {
    let app_count = [];
    for (let i = 0; i < table_size * table_size / 2; i++) {
        app_count.push(0);
    }

    let selected_cell = null;

    table.onclick = (event) => {
        setTimeout(() => {
            let sum = app_count.reduce((acc, val) => {
                return acc + val;
            }, 0);
            if (sum == table_size * table_size / 2) {
                alert("Done!");
                return;
            }

            // Retrieving the cell from the click event.
            const cell = event.target.closest('td');
            if (!cell) {
                return;
            }

            cell.style.background = "transparent";
            let cell_img = null, selected_cell_img = null;

            if (table.id == "image-table") {
                cell_img = cell.querySelector("img");
                cell_img.style.opacity = 1;

                if (selected_cell != null) {
                    selected_cell_img = selected_cell.querySelector("img");
                }
            }
            // Verifying if a cell with the same value has already been opened.
            if (selected_cell != null) {
                if (cell_img != null) {
                    if (cell_img.alt == selected_cell_img.alt) {
                        app_count[cell_img.alt] = 1;
                        selected_cell = null;
                    } else {
                        setTimeout(() => {
                            selected_cell.style.background = "black";
                            cell.style.background = "black";
    
                            if (cell_img != null) {
                                cell_img.style.opacity = 0;
                                selected_cell_img.style.opacity = 0;
                            }
    
                            selected_cell = null;
                        }, 1000)
                    }
                } else if (selected_cell.innerHTML == cell.innerHTML) {
                    app_count[cell.innerHTML] = 1;
                    selected_cell = null;
                } else {
                    setTimeout(() => {
                        selected_cell.style.background = "black";
                        cell.style.background = "black";

                        if (cell_img != null) {
                            cell_img.style.opacity = 0;
                            selected_cell_img.style.opacity = 0;
                        }

                        selected_cell = null;
                    }, 1000)
                }
            } else {
                selected_cell = cell;
            }
        }, 50);
    }
}

function handle_number_table(table_size) {
    const table_container = document.getElementById("table-container");

    let number_table = document.getElementById("number-table");
    if (number_table != null) {
        table_container.removeChild(number_table);
    }
    number_table = build_number_table(table_container, table_size);
    table_handler(number_table, table_size);
}

function handle_image_table(table_size) {
    const table_container = document.getElementById("table-container");

    let image_table = document.getElementById("image-table");
    if (image_table != null) {
        table_container.removeChild(image_table);
    }
    image_table = build_image_table(table_container, table_size);
    table_handler(image_table, table_size);
}

const select_input = document.getElementById("size-input");
select_input.onclick = async () => {
    const table_size = select_input.value;
    //handle_number_table(table_size);
    handle_image_table(table_size);
}