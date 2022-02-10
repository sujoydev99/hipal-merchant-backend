const { Op } = require("sequelize");
const { DEFAULT_EXCLUDE } = require("../common/constants/attributes");
const { POS_SYSTEM } = require("../common/constants/pos");
const dbConn = require("../models");

exports.createCartItem = (transaction, itemObj) => {
  return new Promise(async (resolve, reject) => {
    const { cartItems } = await dbConn();
    try {
      const item = await cartItems.create(itemObj, { transaction });
      resolve(item);
    } catch (error) {
      reject(error);
    }
  });
};
exports.updateCartItemByIdBusinessId = (transaction, id, businessId, itemObj) => {
  return new Promise(async (resolve, reject) => {
    const { cartItems } = await dbConn();
    try {
      const item = await cartItems.update(itemObj, {
        where: { id, businessId, status: { [Op.eq]: POS_SYSTEM.SELECTION } },
        transaction,
      });
      resolve(item);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getCartItem = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { cartItems } = await dbConn();
    try {
      const cartItem = await cartItems.findOne({ where: { uuid, businessId }, transaction });
      resolve(cartItem);
    } catch (error) {
      reject(error);
    }
  });
};
exports.createCartAddons = (transaction, addonsArray) => {
  return new Promise(async (resolve, reject) => {
    const { cartAddons } = await dbConn();
    try {
      const item = await cartAddons.bulkCreate(addonsArray, { transaction });
      resolve(item);
    } catch (error) {
      reject(error);
    }
  });
};
exports.deleteCartAddonsByCartItemId = (transaction, cartItemId) => {
  return new Promise(async (resolve, reject) => {
    const { cartAddon } = await dbConn();
    try {
      const item = await cartAddon.destroy({ where: { cartItemId }, transaction });
      resolve(item);
    } catch (error) {
      reject(error);
    }
  });
};
// exports.updateItemByUuidBusinessId = (transaction, uuid, businessId, itemObj) => {
//   return new Promise(async (resolve, reject) => {
//     const { items } = await dbConn();
//     try {
//       await items.update(itemObj, {
//         where: { uuid, businessId },
//         transaction,
//       });
//       resolve();
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// exports.getItemByUuidBusinessId = (uuid, businessId, transaction) => {
//   return new Promise(async (resolve, reject) => {
//     const { items, portions, categories, addons } = await dbConn();
//     try {
//       const item = await items.findOne({
//         where: { uuid, businessId },
//         attributes: { exclude: DEFAULT_EXCLUDE },
//         transaction,
//         include: [
//           {
//             model: portions,
//             as: "portions",
//             attributes: { exclude: DEFAULT_EXCLUDE },
//           },
//           {
//             model: categories,
//             as: "category",
//             attributes: { exclude: DEFAULT_EXCLUDE },
//           },
//           {
//             model: addons,
//             as: "addons",
//             attributes: { exclude: DEFAULT_EXCLUDE },
//           },
//         ],
//       });
//       resolve(item);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// exports.getAllItemsByBusinessIdAndOrCategoryId = (businessId, categoryId, transaction) => {
//   return new Promise(async (resolve, reject) => {
//     const { items, portions, categories, addons } = await dbConn();
//     try {
//       let whereFilter = { businessId };
//       if (categoryId !== undefined) whereFilter.categoryId = categoryId;
//       const itemsArr = await items.findAll({
//         where: whereFilter,
//         attributes: { exclude: DEFAULT_EXCLUDE },
//         transaction,
//         include: [
//           {
//             model: portions,
//             as: "portions",
//             attributes: { exclude: DEFAULT_EXCLUDE },
//           },
//           {
//             model: categories,
//             as: "category",
//             attributes: { exclude: DEFAULT_EXCLUDE },
//           },
//           {
//             model: addons,
//             as: "addons",
//             attributes: { exclude: DEFAULT_EXCLUDE },
//           },
//         ],
//       });
//       resolve(itemsArr);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// exports.deleteItemByUuidBusinessId = (transaction, uuid, businessId) => {
//   return new Promise(async (resolve, reject) => {
//     const { items } = await dbConn();
//     try {
//       const item = await items.destroy({
//         where: { uuid, businessId },
//         transaction,
//       });
//       resolve(item);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// exports.getItemMetaByUuid = (uuid, businessId, transaction) => {
//   return new Promise(async (resolve, reject) => {
//     const { items } = await dbConn();
//     try {
//       const item = await items.findOne({
//         where: { uuid, businessId },
//         transaction,
//       });
//       resolve(item);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };
// exports.getPortionMetaByUuid = (uuid, businessId, transaction) => {
//   return new Promise(async (resolve, reject) => {
//     const { portions } = await dbConn();
//     try {
//       const portion = await portions.findOne({
//         where: { uuid, businessId },
//         transaction,
//       });
//       resolve(portion);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// exports.createPortion = (transaction, portionObj) => {
//   return new Promise(async (resolve, reject) => {
//     const { portions } = await dbConn();
//     try {
//       const portion = await portions.create(portionObj, { transaction });
//       resolve(portion);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// exports.updatePortionByUuidBusinessId = (transaction, uuid, businessId, portionObj) => {
//   return new Promise(async (resolve, reject) => {
//     const { portions } = await dbConn();
//     try {
//       await portions.update(portionObj, {
//         where: { uuid, businessId },
//         transaction,
//       });
//       resolve();
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// exports.deletePortionByUuidBusinessId = (transaction, uuid, businessId) => {
//   return new Promise(async (resolve, reject) => {
//     const { portions } = await dbConn();
//     try {
//       const portion = await portions.destroy({
//         where: { uuid, businessId },
//         transaction,
//       });
//       resolve(portion);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// exports.createAddon = (transaction, addonObj) => {
//   return new Promise(async (resolve, reject) => {
//     const { addons } = await dbConn();
//     try {
//       const addon = await addons.create(addonObj, { transaction });
//       resolve(addon);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// exports.deleteAddonByUuidBusinessId = (transaction, uuid, businessId) => {
//   return new Promise(async (resolve, reject) => {
//     const { addons } = await dbConn();
//     try {
//       const addon = await addons.destroy({
//         where: { uuid, businessId },
//         transaction,
//       });
//       resolve(addon);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// exports.getAllItemsByBusinessIdAndOrCategoryIdForPos = (businessId, categoryId, transaction) => {
//   return new Promise(async (resolve, reject) => {
//     const { items, portions, categories, addons } = await dbConn();
//     try {
//       let whereFilter = { businessId };
//       if (categoryId !== undefined) whereFilter.categoryId = categoryId;
//       console.log(whereFilter);
//       const itemsArr = await items.findAll({
//         where: whereFilter,
//         attributes: { exclude: DEFAULT_EXCLUDE },
//         transaction,
//         include: [
//           {
//             model: portions,
//             as: "portions",
//             attributes: { exclude: DEFAULT_EXCLUDE },
//             required: true,
//           },
//           {
//             model: addons,
//             as: "addons",
//             attributes: { exclude: DEFAULT_EXCLUDE },
//           },
//         ],
//       });
//       resolve(itemsArr);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// exports.getAddonMetaByUuidArrays = (uuid, businessId, transaction) => {
//   return new Promise(async (resolve, reject) => {
//     const { addons } = await dbConn();
//     try {
//       const addon = await addons.findOne({
//         where: { uuid, businessId },
//         transaction,
//       });
//       resolve(addon);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };
