const formatVND = (money: string) => {
  const number = Number(money);
  if (isNaN(number)) {
    return "Invalid number";
  }
  return number.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

const renderCategory = (category: string) => {
  let result = "";
  switch (category) {
    case "Plastic":
      result = "Ép Plastic";
      break;
    case "Frame":
      result = "Khung Ảnh";
      break;
    case "Album":
      result = "Album";
      break;
    default:
      break;
  }
  return result;
};

const renderColor = (color: string) => {
  let result = "";
  switch (color) {
    case "black":
      result = "bg-black";
      break;
    case "white":
      result = "bg-white";
      break;
    case "gold":
      result = "bg-yellow-500";
      break;
    case "silver":
      result = "bg-gray-200";
      break;
    case "wood":
      result = "bg-yellow-900";
      break;
    default:
      break;
  }
  return result;
};

const renderColorText = (color: string) => {
  let result = "";
  switch (color) {
    case "black":
      result = "Đen";
      break;
    case "white":
      result = "Trắng";
      break;
    case "gold":
      result = "Vàng";
      break;
    case "silver":
      result = "Bạc";
      break;
    case "wood":
      result = "Gỗ";
      break;
    default:
      break;
  }
  return result;
};

const renderTag = (tag: string) => {
  let result = "";
  switch (tag) {
    case "frame":
      result = "Khung ảnh";
      break;
    case "printing":
      result = "In ấn";
      break;
    case "album":
      result = "Album";
      break;
    case "photo-care":
      result = "Chia Sẽ";
      break;
    case "digital-frame":
      result = "Khung digital";
      break;
    default:
      break;
  }
  return result;
};

const renderStatus = (status: string) => {
  let result = "";
  switch (status) {
    case "waiting":
      result = "Đợi phản hồi";
      break;
    case "delivering":
      result = "Đang giao hàng";
      break;
    case "completed":
      result = "Hoàn thành";
      break;
    default:
      break;
  }
  return result;
};

const renderPayment = (method: string) => {
  let result = "";
  switch (method) {
    case "bank":
      result = "Ngân Hàng";
      break;
    case "cash":
      result = "Tiền Mặt";
      break;
    default:
      break;
  }
  return result;
};

export const HELPER = {
  formatVND,
  renderCategory,
  renderColor,
  renderColorText,
  renderTag,
  renderStatus,
  renderPayment,
};
