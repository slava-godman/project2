import { set_to_storage, get_from_storage, id_element } from "../js/utils.js"
let CU = get_from_storage("currentUser")
let users = get_from_storage('users')
let UD = users.find(user => user.username === CU)
let index = users.findIndex(user => user.username === CU)
id_element("user").innerText = `${CU} Information`
let image
document.getElementById("picture").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        image = URL.createObjectURL(file);
    }
})


id_element("submit").addEventListener("click", () => {
    function PD(event) {
        event.preventDefault()
    }
    let Wapi = false
    let Fapi = false
    if (id_element("weather").checked) {
        Wapi = true
    }
    if (id_element("forex").checked) {
        Fapi = true
    }
    UD.port = {
        age: id_element("age").value,
        address: id_element("address").value,
        about: id_element("about").value,
        linkedin:id_element("linkedin").value ,
        github:id_element("github").value ,
        picture: image,
        Wapi: Wapi,
        Fapi: Fapi
    }
    users[index] = UD
    set_to_storage("users", users)
    window.location.href="./home.html"
})