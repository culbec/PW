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
    const _table = $("<table></table>").attr("id", "number-table")
                    .css("border", "1px solid black");

    for (let i = 0; i < table_size; i++) {
        // Creating a new row.
        const _row = $("<tr></tr>")
        for (let j = 0; j < table_size; j++) {
            // Creating a new cell.
            $(_row).append($("<td></td>").html(matrix[i][j]).css("background", "black"));
        }
        $(_table).append(_row);
    }
    $(table_container).append(_table);
    return _table;
}

function build_image_table(table_container, table_size) {
    const matrix = get_matrix(table_size);

    // Creating a new table.
    const _table = $("<table></table").attr("id", "image-table")
                        .css("border", "1px solid black");

    for (let i = 0; i < table_size; i++) {
        // Creating a new row.
        const _row = $("<tr></tr>")
        for (let j = 0; j < table_size; j++) {
            // Creating a new image.
            const _img = $("<img />").attr("src", "./images/img" + matrix[i][j] + ".png")
                            .attr("alt", matrix[i][j])
                            .css("opacity", "0")
                            .css("width", "100px")
                            .css("height", "100px");

            // Appeding a new cell.
            $(_row).append($("<td></td>").append(_img).css("background", "black"));
        }
        $(_table).append(_row);
    }
    $(table_container).append(_table);
    return _table;
}

function table_handler(table, table_size) {
    let app_count = [];
    for (let i = 0; i < table_size * table_size / 2; i++) {
        app_count.push(0);
    }

    let selected_cell = null;

    $(table).click((event) => {
        setTimeout(() => {
            let sum = app_count.reduce((acc, val) => {
                return acc + val;
            }, 0);
            if (sum == table_size * table_size / 2) {
                alert("Done!");
                return;
            }

            // Retrieving the cell from the click event.
            const cell = $(event.target).closest('td');
            if (!cell.length) {
                return;
            }

            cell.css("background", "transparent");
            let cell_img = null, selected_cell_img = null;

            if ($(table).attr("id") == "image-table") {
                cell_img = cell.find("img");
                cell_img.css("opacity", 1);

                if (selected_cell != null) {
                    selected_cell_img = selected_cell.find("img");
                }
            }
            // Verifying if a cell with the same value has already been opened.
            if (selected_cell != null) {
                if (cell_img != null) {
                    if (cell_img.attr("alt") == selected_cell_img.attr("alt")) {
                        app_count[cell_img.attr("alt")] = 1;
                        selected_cell = null;
                    } else {
                        setTimeout(() => {
                            selected_cell.css("background", "black");
                            cell.css("background", "black");
    
                            if (cell_img != null) {
                                cell_img.css("opacity", "0");
                                selected_cell_img.css("opacity", "0");
                            }
    
                            selected_cell = null;
                        }, 1000)
                    }
                } else if (selected_cell.text() == cell.text()) {
                    app_count[cell.text()] = 1;
                    selected_cell = null;
                } else {
                    setTimeout(() => {
                        selected_cell.css("background", "black");
                        cell.css("background", "black");

                        if (cell_img != null) {
                            cell_img.css("opacity", "0");
                            selected_cell_img.css("opacity", "0");
                        }

                        selected_cell = null;
                    }, 1000)
                }
            } else {
                selected_cell = cell;
            }
        }, 50);
    });
}

function handle_number_table(table_size) {
    const table_container = $("#table-container");

    let number_table = $("#number-table");
    if (number_table.length != 0) {
        table_container.empty();
    }
    number_table = build_number_table(table_container, table_size);
    table_handler(number_table, table_size);
}

function handle_image_table(table_size) {
    const table_container = $("#table-container");

    let image_table = $("#image-table")
    if (image_table.length != 0) {
        table_container.empty();
    }
    image_table = build_image_table(table_container, table_size);
    table_handler(image_table, table_size);
}

$("#size-input").click(() => {
    handle_number_table($("#size-input").val());
    handle_image_table($("#size-input").val());
});