"use client";
import { testimonials } from "@/shared/constants/testimonials";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Pagination } from "swiper/modules";

export default function Testimonials() {
  return (
    <div className="testimonials-section" style={{ width: "100%", padding: "0 8px" }}>
      <Swiper
        className="swiper tf-sw-products"
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 12 },
          576: { slidesPerView: 1, spaceBetween: 15 },
          768: { slidesPerView: 2, spaceBetween: 16 },
          992: { slidesPerView: 3, spaceBetween: 20 },
        }}
        spaceBetween={15}
        modules={[Pagination]}
        pagination={{
          clickable: true,
          el: ".spd69",
        }}
      >
        {testimonials.map((item, index) => (
          <SwiperSlide key={index} style={{ height: "auto" }}>
            <div className="wg-testimonial">
              <div className="entry_image">
                <Image
                  src={item.imgSrc}
                  alt={item.name}
                  className="lazyload"
                  width={100}
                  height={100}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
              <div className="content">
                <div className="box-title">
                  <span className="entry_name product-title fw-semibold">
                    {item.name}
                  </span>
                  <ul className="entry_meta">
                    <li>
                      <p className="body-small text-main-2">
                        Color: {item.color}
                      </p>
                    </li>
                    <li className="br-line" />
                    <li>
                      <p className="body-small text-main-2 fw-semibold">
                        {item.verified ? "Verified Purchase" : ""}
                      </p>
                    </li>
                  </ul>
                  <ul className="list-star">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <li key={i}>
                        <i className="icon-star" />
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="entry_text">{item.text}</p>
                <p className="entry_date body-small">{item.date}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="sw-dot-default sw-pagination-products justify-content-center spd69" style={{ display: "flex", marginTop: "20px" }} />
      </Swiper>
    </div>
  );
}

