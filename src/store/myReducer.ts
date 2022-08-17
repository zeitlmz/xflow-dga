const myReducer = (state: boolean, action: string) => {
    const collapsed = localStorage.getItem('collapsed')
    if(collapsed==='true'){
        collapsed
    }
    switch (action) {
        case ('collapse'):
            return true
        case ('decollapse'):
            return false
        default:
            return state;
    }
}
export {
    myReducer
}