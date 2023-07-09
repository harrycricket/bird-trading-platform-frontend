import { useDispatch, useSelector } from "react-redux";
import ProductsSlider from "./product-paging/ProductsSlider";
import Products from "./products/Products";
import s from "./productsPresentation.module.scss";

import React, { useEffect, useState } from "react";
import { filterByAll } from "./productsPresentationSlice";
import { getProducts } from "./productsSelector";

export default function ProductsPresentation() {
  const dispatch = useDispatch();
  const products = useSelector(getProducts);
  const { data, page } = products;
  useEffect(() => {
    const k = async () => {
      // await dispatch(callFirstPage());
      await dispatch(filterByAll());
    };
    k();
  }, []);
  return (
    <div className={s.container}>
      {data ? (
        <Products products={data} />
      ) : (
        <>
          <div className={s.itemNotFound}>
            <img
              src="https://bird-trading-platform.s3.ap-southeast-1.amazonaws.com/assetImage/asset/No_Product_Found.png"
              alt="item not found"
            />
          </div>
        </>
      )}
      <ProductsSlider pageNumber={page} />
    </div>
  );
}
