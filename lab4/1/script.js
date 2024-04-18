const shop_select = document.getElementById("shop-select");
const basket_select = document.getElementById("basket-select");

shop_select.ondblclick = () => {
    if (shop_select.selectedIndex == -1) {
        return;
    } 

    // Retrieving the option from shop select element.
    const shop_select_index = shop_select.selectedIndex;
    const shop_select_option = shop_select.options[shop_select_index];

    // Creating a new option element for the basket select.
    const basket_option = document.createElement("option");
    basket_option.value = shop_select_option.value;
    basket_option.text = shop_select_option.text;

    // Removing the option from the shop and adding it to the basket.
    shop_select.options.remove(shop_select_index);
    basket_select.appendChild(basket_option);

    alert(`${basket_option.text} moved in basket!`);
};

basket_select.ondblclick = () => {
    if (basket_select.selectedIndex == -1) {
        return;
    } 

    // Retrieving the option from basket select element.
    const basket_select_index = basket_select.selectedIndex;
    const basket_select_option = basket_select.options[basket_select_index];

    // Creating a new option element for the shop select.
    const shop_option = document.createElement("option");
    shop_option.value = basket_select_option.value;
    shop_option.text = basket_select_option.text;

    // Removing the option from the basket and adding it to the shop.
    basket_select.options.remove(basket_select_index);
    shop_select.appendChild(shop_option);

    alert(`${shop_option.text} returned in shop!`);
};