let interval_id = null;

function restart_interval(delay = 3000) {
    clearInterval(interval_id);
    setTimeout(() => {
        change_image(true);
        interval_id = setInterval(change_image, 3000);
    }, delay);
}

function change_image(forward = true) {
    if (forward) {
        list_items[i++].classList.remove("visible");
        if (i >= list_items.length) {
            i = 0;
        }
        list_items[i].classList.add("visible");
        return;
    }
    list_items[i--].classList.remove("visible");
    if (i < 0) {
        i = list_items.length - 1;
    }

    list_items[i].classList.add("visible");
}

const list_items = document.querySelector("#carousel-list")
    .querySelectorAll("li");
const prev_button = document.querySelector("#previous-button");
const next_button = document.querySelector("#next-button");

let i = 0;

restart_interval();

prev_button.addEventListener("click", (event) => {
    change_image(false);
    restart_interval();
    event.stopPropagation();
});

next_button.addEventListener("click", (event) => {
    change_image(true);
    restart_interval();
    event.stopPropagation();
});

