export function set_to_storage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}
export function get_from_storage(key) {
    return JSON.parse(localStorage.getItem(key))
}
export function id_element(id) {
    return document.getElementById(id)
}
export function class_element(cls) {
    return document.getElementsByClassName(cls)
}