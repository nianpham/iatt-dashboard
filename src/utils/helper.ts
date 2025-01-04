const formatVND = (money: string) => {
    const number = Number(money);
    if (isNaN(number)) {
        return "Invalid number";
    }
    return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

const renderCategory = (category: string) => {
    let result = ''
    switch (category) {
        case "plastic":
            result = 'Ép Plastic'
            break;
        case "frame":
            result = 'Khung Ảnh'
            break;
        case "album":
            result = 'Album'
            break;
        default:
            break;
    }
    return result
}

const renderColor = (color: string) => {
    let result = ''
    switch (color) {
        case "black":
            result = 'bg-black'
            break;
        case "white":
            result = 'bg-white'
        case "gold":
            result = 'bg-yellow-500'
            break;
        case "silver":
            result = 'bg-gray-200'
        case "wood":
            result = 'bg-yellow-900'
            break;
        default:
            break;
    }
    return result
}

const renderTag = (tag: string) => {
    let result = ''
    switch (tag) {
        case "guide":
            result = 'Hướng Dẫn'
            break;
        case "share":
            result = 'Chia Sẽ'
            break;
        default:
            break;
    }
    return result
}

export const HELPER = {
    formatVND,
    renderCategory,
    renderColor,
    renderTag,
}