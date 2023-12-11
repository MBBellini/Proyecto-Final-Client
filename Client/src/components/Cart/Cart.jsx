/* eslint-disable react/prop-types */
import s from "./Cart.module.css";
import { useNavigate } from "react-router-dom";
//import { useState } from 'react';
import Swal from "sweetalert2";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect } from "react";

//const URL = 'http://localhost:3001'
const URL = "https://quirkz.up.railway.app";

const Cart = ({
  cartItems,
  handleAddProduct,
  handleRemoveProduct,
  handleClearCart,
}) => {
  const access = useSelector((state) => state.access);
  const userCart = useSelector((state) => state.userCart);

  const totalPrice = (access ? userCart : cartItems).reduce(
    (price, item) => price + item.quantity * item.price,
    0
  );

  const navigate = useNavigate();

  const mercadoPago = async () => {
    console.log("entre al finishPurchase");
    if (access === false) {
      const Toast = Swal.mixin({
        toast: "true",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Primero debes iniciar sesion",
      });

      navigate("/login");
    } else {
      const response = await axios.post(`${URL}/purchase`, cartItems);
      window.location.href = response.data.init_point;
    }
  };

  useEffect(() => {}, [userCart]);

  return (
    <div className={s["cart-items"]}>
      <h2 className={s["cart-items-header"]}>Productos en el carrito: </h2>
      <div className={s["clear-cart"]}>
        {(access ? userCart.length : cartItems.length) >= 1 && (
          <button className={s["clear-cart-button"]} onClick={handleClearCart}>
            Limpiar carrito
          </button>
        )}
      </div>

      {(access ? userCart.length : cartItems.length) === 0 && (
        <div className={s["cart-items-empty"]}>Tu carrito esta vacio! ?? </div>
      )}

      <div>
        {(access ? userCart : cartItems).map((product) => (
          <div key={product.id} className={s["cart-items-list"]}>
            <img
              className={s["cart-items-img"]}
              src={product.image}
              alt={product.name}
            />
            <br />
            <div className={s["cart-items-name"]}>
              <h2>{product.name}</h2>
            </div>
            <div className={s["cart-items-function"]}>
              <button
                className={s["cart-items-add"]}
                onClick={() => handleAddProduct(product)}
              >
                +
              </button>

              <button
                className={s["cart-items-remove"]}
                onClick={() => handleRemoveProduct(product)}
              >
                -
              </button>
            </div>
            <div className={s["cart-items-price"]}>
              {product.quantity} * ${product.price}
            </div>
          </div>
        ))}
      </div>

      <div className={s["cart-items-total-price-name"]}>
        <br />
        <div className={s["cart-items-total-price"]}>
          <h2>Precio total: ${totalPrice}</h2>
        </div>
        <div>
          <br />
          <button disabled={totalPrice ? false : true} onClick={mercadoPago}>
            Completar compra
          </button>
        </div>
        <br />
      </div>
    </div>
  );
};

export default Cart;
