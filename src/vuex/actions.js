function toggle(store) {
    store.dispatch('TOGGLE')
}
function pop({dispatch},para) {
	para.btn1 = para.btn1||'确定'
    dispatch('POP',para)
}
function bgToggle({dispatch},bg) {
    dispatch('BGTOGGLE',bg)
}
export {
    toggle,pop,bgToggle
}