function sortTableOnRows(n) {
    let rows, x, y;
    rows = $("#header-row-table tr");

    for (let i = 0; i < rows.length - 1; i++) {
        for (let j = i + 1; j < rows.length; j++) {
            x = rows.eq(i).children("td").eq(n).text();
            y = rows.eq(j).children("td").eq(n).text();

            if (!isNaN(parseFloat(x))) {
                x = parseFloat(x);
                y = parseFloat(y);
            }

            if (x > y) {
                rows.eq(i).before(rows.eq(j));
                rows = $("#header-row-table tr");
            }
        }
    }
}

function sortTableOnColumns(n) {
    let rows, x, y;
    rows = $("#header-column-table tr");

    for (let i = 0; i < rows.length - 1; i++) {
        for (let j = i + 1; j < rows.length; j++) {
            x = rows.eq(i).children("td").eq(n).text();
            y = rows.eq(j).children("td").eq(n).text();

            if (!isNaN(parseFloat(x))) {
                x = parseFloat(x);
                y = parseFloat(y);
            }

            if (x > y) {
                let cells = rows.eq(i).children("td");
                for (let k = 0; k < rows.eq(i).children("td").length; k++) {
                    const temp = rows.eq(i).children("td").eq(k).html();
                    rows.eq(i).children("td").eq(k).html(rows.eq(j).children("td").eq(k).html());
                    rows.eq(j).children("td").eq(k).html(temp);
                }

                rows = $("#header-column-table tr");
            }
        }
    }
}