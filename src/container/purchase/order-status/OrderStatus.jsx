import { useJsApiLoader } from "@react-google-maps/api";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { api } from "../../../api/server/API";
import Action from "../../../component/purchase/order-status/header/action/Action";
import StatusNavbar from "../../../component/purchase/order-status/header/status/StatusNavbar";
import { userInfoSelector } from "../../../redux/global/userInfoSlice";
import { getCartSelector } from "../../order/cartSlice";
import Order from "../order/Order";
import s from "./orderStatus.module.scss";

export default function OrderStatus() {
  const param = useParams();
  console.log(param);
  const [orders, setOrders] = useState();
  const userInfo = useSelector(userInfoSelector);
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
  });
  const lib = ["places"];
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_MAP_API}`,
    libraries: lib,
  });

  useEffect(() => {
    setDeliveryInfo({
      fullName: userInfo.info.fullName,
      phoneNumber: userInfo.info.phoneNumber,
      address: userInfo.info.address,
    });
  }, [userInfo]);

  const getOrders = async () => {
    try {
      const response = await api.get(`orders?packageOrderId=${param.id}`);
      console.log(response);
      const orders = await response.data;
      setOrders(orders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className={clsx(s.container)}>
      <div className={clsx(s.packageOrder)}>
        {orders ? (
          orders.map((order) => (
            <div className={clsx(s.order)}>
              <StatusNavbar />
              <Order order={order} />
              <Action />
            </div>
          ))
        ) : (
          <div>hi</div>
        )}
      </div>
    </div>
  );
}
