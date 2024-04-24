$("#shop-select").dblclick(function () {
    const shop_select_option = $(this).find("option:selected");
    if (shop_select_option.length == 0) {
        alert("No products in shop!");
        return;
    }

    const opt_text = shop_select_option.text();
    const opt_val = shop_select_option.val();

    $("#basket-select").append($("<option></option>").val(opt_val).text(opt_text));
    shop_select_option.remove();

    setTimeout(() => alert(`${opt_text} moved in basket!`), 0);
});

$("#basket-select").dblclick(function () {
    const basket_select_option = $(this).find("option:selected");
    if (basket_select_option.length == 0) {
        alert("No products in basket!");
        return;
    }

    const opt_text = basket_select_option.text();
    const opt_val = basket_select_option.val();

    $("#shop-select").append($("<option></option>").val(opt_val).text(opt_text));
    basket_select_option.remove();

    setTimeout(() => alert(`${opt_text} moved back in shop!`), 0);
});