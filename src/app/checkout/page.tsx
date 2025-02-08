"use client";

import React from "react";
import { useCart } from "../context/CartContext";
import Image from "next/image";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const handleCheckout = async () => {
  const stripe = await stripePromise;

  const response = await fetch("/api/checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Product Name",
            },
            unit_amount: 2000, // Price in cents (20.00 USD)
          },
          quantity: 1,
        },
      ],
    }),
  });

  const session = await response.json();
  await stripe?.redirectToCheckout({ sessionId: session.id });
};

const CheckoutPage = () => {
  const { cart, total } = useCart();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-[#1D3178] my-6 text-center">
        Checkout
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side */}
        <div className="w-full lg:w-2/3 bg-[#F4F4FC] p-6 rounded-lg">
          <h2 className="text-lg font-bold text-[#1D3178] mb-4">
            Billing Details
          </h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Address"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="City"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Postal Code"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </form>
        </div>

        {/* Right Side  */}
        <div className="w-full lg:w-1/3 bg-[#F4F4FC] p-6 rounded-lg">
          <h2 className="text-lg font-bold text-[#1D3178] mb-4">
            Order Summary
          </h2>
          <div className="space-y-4">
            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                  <div>
                    <h3 className="text-sm font-medium">{item.title}</h3>
                    <p className="text-xs text-gray-500">
                      ${item.price} x {item.quantity}
                    </p>
                  </div>
                  <p className="ml-auto font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Total Price */}
          <div className="mt-4 border-t pt-4">
            <p className="flex justify-between font-medium">
              Total: <span>${total.toFixed(2)}</span>
            </p>
          </div>

          {/* Proceed to Payment Button */}
          <button className="w-full mt-4 px-4 py-2 bg-[#FB2E86] text-white font-bold rounded-md"
            onClick={handleCheckout}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
