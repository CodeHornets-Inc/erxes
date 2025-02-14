import { IOverallProductsData } from "./../../../models/definitions/overallWorks";
import { getRatio } from "../../../utils/utils";
import {
  sendCoreMessage,
  sendInventoriesMessage
} from "../../../messageBroker";

export const getProductsDataOnOwork = async (
  subdomain: string,
  productsData: IOverallProductsData[],
  branchId: string,
  departmentId: string
) => {
  if (!productsData.length) {
    return [];
  }

  const productIds = productsData.map(np => np.productId);

  const products = await sendCoreMessage({
    subdomain,
    action: "products.find",
    data: { query: { _id: { $in: productIds } }, limit: productIds.length },
    isRPC: true,
    defaultValue: []
  });

  const productById = {};
  for (const product of products) {
    productById[product._id] = product;
  }

  const reserveRems = await sendInventoriesMessage({
    subdomain,
    action: "reserveRemainders.find",
    data: {
      productIds,
      branchId,
      departmentId
    },
    isRPC: true,
    defaultValue: []
  });

  const reserveRemByProductId = {};
  for (const rem of reserveRems) {
    reserveRemByProductId[rem.productId] = rem.remainder;
  }

  const liveRems = await sendInventoriesMessage({
    subdomain,
    action: "remainders",
    data: {
      productIds,
      branchIds: [branchId],
      departmentIds: [departmentId]
    },
    isRPC: true,
    defaultValue: []
  });

  const liveRemByProductId = {};
  for (const rem of liveRems) {
    liveRemByProductId[rem.productId] = rem.count;
  }

  const result: any[] = [];
  for (const data of productsData) {
    const product = productById[data.productId];
    const ratio = getRatio(product, data.uom);
    const perData: any = {
      productId: data.productId,
      uom: data.uom,
      quantity: data.quantity,
      reserveRem: reserveRemByProductId[data.productId] || 0,
      liveRem: liveRemByProductId[data.productId] || 0,
      mainUom: product.uom,
      mainQuantity: ratio ? data.quantity / ratio : NaN,
      product
    };

    if (ratio && ratio !== 1) {
    }

    result.push(perData);
  }

  return result;
};
