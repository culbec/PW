function sortTableOnRows(n) {
    let table, rows, x, y, notSorted;
    table = document.getElementsByClassName("header-row-table")[0];
    rows = table.rows;

    let sorted = true;
    while (sorted) {
        sorted = false;
        for (let i = 1; i < (rows.length - 1); i++) {
            x = rows[i].cells[n].textContent;
            y = rows[i + 1].cells[n].textContent;

            if (!Number.isNaN(Number.parseFloat(x))) {
                x = parseFloat(x);
                y = parseFloat(y);
            }
            notSorted = (x > y);

            if (notSorted) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                sorted = true;
            }
        }
    }
}

function sortTableOnColumns(n) {
    let table, rows, x, y, notSorted;
    table = document.getElementsByClassName("header-column-table")[0];
    rows = table.rows;

    let sorted = true;
    while (sorted) {
        sorted = false;
        for (let i = 0; i < (rows.length - 1); i++) {
            x = rows[i].cells[n + 1].textContent;
            y = rows[i + 1].cells[n + 1].textContent;

            if (!Number.isNaN(Number.parseFloat(x))) {
                x = parseFloat(x);
                y = parseFloat(y);
            }
            notSorted = (x > y);

            if (notSorted) {
                for (let j = 1; j < rows[0].cells.length; j++) {
                    const temp = rows[i].cells[j].textContent;
                    rows[i].cells[j].textContent = rows[i + 1].cells[j].textContent;
                    rows[i + 1].cells[j].textContent = temp;
                }
                sorted = true;
            }
        }
    }
}