let interval_id = null, i = 0;
const list_items = $("#carousel-list").children("li");

function restart_interval(delay = 3000) {
    clearInterval(interval_id);
    interval_id = setInterval(change_image, delay);
}

function change_image(forward = true) {
    restart_interval();

    if (forward) {
        $(list_items[i++]).removeClass("visible");
        if (i >= list_items.length) {
            i = 0;
        }
        $(list_items[i]).addClass("visible");
        return;
    }
    $(list_items[i--]).removeClass("visible");
    if (i < 0) {
        i = list_items.length - 1;
    }

    $(list_items[i]).addClass("visible");
    restart_interval();
}

restart_interval();
$("#previous-button").click(() => change_image(false));
$("#next-button").click(() => change_image(true));

