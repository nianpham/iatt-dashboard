const formatVND = (money: string) => {
  const number = Number(money);
  if (isNaN(number)) {
    return "Invalid number";
  }
  return number.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateTime = (isoDate: string) => {
  if (!isoDate) return "";

  let date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    const numeric = Number(isoDate);
    if (!Number.isNaN(numeric)) {
      const byNumber = new Date(numeric);
      if (!Number.isNaN(byNumber.getTime())) {
        date = byNumber;
      }
    }
  }

  if (Number.isNaN(date.getTime())) {
    const normalized = isoDate.replace(" ", "T");
    const byNormalized = new Date(normalized);
    if (!Number.isNaN(byNormalized.getTime())) {
      date = byNormalized;
    }
  }

  if (Number.isNaN(date.getTime())) return "";

  const timeStr = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);

  const dateStr = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);

  return `${timeStr} - ${dateStr}`;
};

const sanitizeContent = (html: string) => {
  return html.replace(/<img[^>]*>/g, "");
};

const renderCategory = (category: string) => {
  let result = "";
  switch (category) {
    case "Plastic":
      result = "In ảnh rời";
      break;
    case "Plastic-Frame":
      result = "In ảnh có khung viền";
      break;
    case "Frame":
      result = "Khung lẻ";
      break;
    case "Album":
      result = "Album/Photobook";
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
    case "pending":
      result = "Chuẩn bị đơn";
      break;
    case "delivering":
      result = "Vận chuyển";
      break;
    case "completed":
      result = "Hoàn thành";
      break;
    case "paid pending":
      result = "Chờ thanh toán";
      break;
    case "paid":
      result = "Đã thanh toán";
      break;
    case "cancelled":
      result = "Đã hủy đơn";
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
    case "momo":
      result = "Momo";
      break;
    case "cash":
      result = "Tiền Mặt";
      break;
    default:
      break;
  }
  return result;
};

const truncateText = (text: string, limit: number) => {
  if (text.length > limit) {
    return text.substring(0, limit) + "...";
  }
  return text;
};

const renderAlbumCover = (color: string) => {
  let result = "";
  switch (color) {
    case "bia-cung":
      result = "Bìa cứng";
      break;
    case "bia-da":
      result = "Bìa da";
      break;
    case "bia-goi":
      result = "Bìa gói";
      break;
    default:
      break;
  }
  return result;
};

const renderAlbumCore = (color: string) => {
  let result = "";
  switch (color) {
    case "can-mang":
      result = "Ruột cán màng";
      break;
    case "khong-can-mang":
      result = "Ruột không cán màng";
      break;
    case "trang-guong":
      result = "Ruột tráng gương";
      break;
    default:
      break;
  }
  return result;
};

const upPrice = (money: string) => {
  const number = Number(money);
  if (isNaN(number)) {
    return "Invalid number";
  }
  return (number + 50000).toString();
};

const calculateTotalNumber = (money: string, ship: any, voucher: any) => {
  const number = Number(money);
  if (ship || voucher) {
    const money = Number(ship);
    const discount = (number + money) * (Number(voucher) / 100);
    const result = number + money - discount;
    return result;
  }
  if (isNaN(number)) {
    return "Invalid number";
  }
  return number;
};

const calculateTotal = (money: string, ship: any, voucher: any) => {
  const number = Number(money);
  if (ship || voucher) {
    const money = Number(ship);
    const discount = (number + money) * (Number(voucher) / 100);
    const result = number + money - discount;
    return result.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }
  if (isNaN(number)) {
    return "Invalid number";
  }
  return number.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

const formatProvinceName = (name: string) => {
  if (name.startsWith("Tỉnh ")) {
    return name.substring(5);
  }
  return name;
};

const getNameForSorting = (name: string) => {
  const prefixes = [
    "Thành phố ",
    "Tỉnh ",
    "Quận ",
    "Huyện ",
    "Thị xã ",
    "Phường ",
    "Xã ",
    "Thị trấn ",
  ];

  for (const prefix of prefixes) {
    if (name.startsWith(prefix)) {
      return name.substring(prefix.length);
    }
  }
  return name;
};

const formatLocationName = (name: string) => {
  return getNameForSorting(name);
};

export const HELPER = {
  formatVND,
  renderCategory,
  renderColor,
  renderColorText,
  renderTag,
  renderStatus,
  renderPayment,
  formatDate,
  formatDateTime,
  truncateText,
  sanitizeContent,
  renderAlbumCover,
  renderAlbumCore,
  upPrice,
  calculateTotalNumber,
  calculateTotal,
  formatLocationName,
  formatProvinceName,
  getNameForSorting,
};
