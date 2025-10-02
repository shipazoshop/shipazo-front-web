import { brands } from "@/shared/constants/filterOptions";
import React, { useState } from "react";

export default function FilterOptions({ allProps }) {
  const [priceRange, setPriceRange] = useState([null, null]); // [min, max]

  const handleInputChange = (e, index) => {
    const value = e.target.value === "" ? null : Number(e.target.value);
    const newPriceRange = [...priceRange];
    newPriceRange[index] = value;
    setPriceRange(newPriceRange);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // You might want to validate that min <= max here
    if (
      priceRange[0] !== null &&
      priceRange[1] !== null &&
      priceRange[0] < priceRange[1]
    ) {
      allProps.setPrice(priceRange);
    }
    // Proceed with your filtering logic
  };

  return (
    <>
      <div className="facet-categories">
        <h6 className="title fw-medium">Show all categories</h6>
        <ul>
          <li>
            <a href="#">
              Consumer Electronics <i className="icon-arrow-right" />
            </a>
          </li>
          <li>
            <a href="#">
              Home products <i className="icon-arrow-right" />
            </a>
          </li>
          <li>
            <a href="#">
              Tool &amp; hardware <i className="icon-arrow-right" />
            </a>
          </li>
          <li>
            <a href="#">
              Computers &amp; Accessories
              <i className="icon-arrow-right" />
            </a>
          </li>
          <li>
            <a href="#">
              Gaming accessories <i className="icon-arrow-right" />
            </a>
          </li>
          <li>
            <a href="#">
              Electronics <i className="icon-arrow-right" />
            </a>
          </li>
        </ul>
      </div>
      <div className="widget-facet facet-fieldset has-loadmore">
        <p className="facet-title title-sidebar fw-semibold">Brand</p>
        <div className="box-fieldset-item">
          {brands.map((brand) => (
            <fieldset
              key={brand.id}
              onClick={() => allProps.setBrands(brand.label)}
              className="fieldset-item"
            >
              <input
                type="checkbox"
                className="tf-check"
                readOnly
                checked={allProps.brands.includes(brand.label)}
              />
              <label>{brand.label}</label>
            </fieldset>
          ))}
        </div>
        <div className="btn-loadmore">
          See more <i className="icon-arrow-down" />
        </div>
      </div>
      <div className="widget-facet facet-price">
        <p className="facet-title title-sidebar fw-semibold">Price</p>
        <div className="box-fieldset-item">
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setPrice([0, 9])}
          >
            <input
              type="radio"
              checked={allProps.price[1] <= 9}
              readOnly
              className="tf-check"
            />
            <label>Under $10</label>
          </fieldset>
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setPrice([10, 15])}
          >
            <input
              checked={allProps.price[1] > 9 && allProps.price[1] <= 15}
              type="radio"
              readOnly
              className="tf-check"
            />
            <label>$10 to $15</label>
          </fieldset>
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setPrice([15, 25])}
          >
            <input
              type="radio"
              checked={allProps.price[1] > 15 && allProps.price[1] <= 25}
              className="tf-check"
              readOnly
            />
            <label>$15 to $25</label>
          </fieldset>
          <fieldset
            className="fieldset-item "
            onClick={() => allProps.setPrice([26, 60])}
          >
            <input
              type="radio"
              checked={allProps.price[0] > 25}
              className="tf-check"
              readOnly
            />
            <label>$25 &amp; Above</label>
          </fieldset>
        </div>
        <div className="box-price-product">
          <form onSubmit={handleSubmit} className="w-100 form-filter-price">
            <div className="cols w-100">
              <fieldset className="box-price-item">
                <input
                  type="number"
                  className="min-price price-input"
                  value={priceRange[0] ?? ""}
                  onChange={(e) => handleInputChange(e, 0)}
                  min={0}
                  max={100}
                  placeholder="$ Min"
                />
              </fieldset>
              <span className="br-line" />
              <fieldset className="box-price-item">
                <input
                  type="number"
                  className="max-price price-input"
                  value={priceRange[1] ?? ""}
                  onChange={(e) => handleInputChange(e, 1)}
                  placeholder="$ Max"
                  min={0}
                  max={100}
                />
              </fieldset>
            </div>
            <button type="submit" className="btn-filter-price cs-pointer link">
              <span className="title-sidebar fw-bold">Go</span>
            </button>
          </form>
        </div>
      </div>
      <div className="widget-facet facet-vote">
        <p className="facet-title title-sidebar fw-semibold">Customer Review</p>
        <div className="box-fieldset-item">
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setRating(5)}
          >
            <input
              type="radio"
              className="tf-check"
              readOnly
              checked={allProps.rating == 5}
            />
            <label>
              <span className="list-star">
                <i className="icon-star" />
                <i className="icon-star" />
                <i className="icon-star" />
                <i className="icon-star" />
                <i className="icon-star" />
              </span>
            </label>
          </fieldset>
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setRating(4)}
          >
            <input
              type="radio"
              className="tf-check"
              readOnly
              checked={allProps.rating == 4}
            />
            <label htmlFor="fourStar">
              <span className="list-star">
                <i className="icon-star" />
                <i className="icon-star" />
                <i className="icon-star" />
                <i className="icon-star" />
                <i className="icon-star text-main-4" />
              </span>
              <span className="body-text-3">&amp; Up</span>
            </label>
          </fieldset>
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setRating(3)}
          >
            <input
              type="radio"
              className="tf-check"
              readOnly
              checked={allProps.rating == 3}
            />
            <label htmlFor="threeStar">
              <span className="list-star">
                <i className="icon-star" />
                <i className="icon-star" />
                <i className="icon-star" />
                <i className="icon-star text-main-4" />
                <i className="icon-star text-main-4" />
              </span>
              <span className="body-text-3">&amp; Up</span>
            </label>
          </fieldset>
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setRating(2)}
          >
            <input
              type="radio"
              className="tf-check"
              readOnly
              checked={allProps.rating == 2}
            />
            <label htmlFor="twoStar">
              <span className="list-star">
                <i className="icon-star" />
                <i className="icon-star" />
                <i className="icon-star text-main-4" />
                <i className="icon-star text-main-4" />
                <i className="icon-star text-main-4" />
              </span>
              <span className="body-text-3">&amp; Up</span>
            </label>
          </fieldset>
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setRating(1)}
          >
            <input
              type="radio"
              className="tf-check"
              readOnly
              checked={allProps.rating == 1}
            />
            <label htmlFor="oneStar">
              <span className="list-star">
                <i className="icon-star" />
                <i className="icon-star text-main-4" />
                <i className="icon-star text-main-4" />
                <i className="icon-star text-main-4" />
                <i className="icon-star text-main-4" />
              </span>
              <span className="body-text-3">&amp; Up</span>
            </label>
          </fieldset>
        </div>
      </div>
      <div className="widget-facet facet-fieldset">
        <p className="facet-title title-sidebar fw-semibold">Condition</p>
        <div className="box-fieldset-item">
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setIsNew(true)}
          >
            <input
              type="radio"
              className="tf-check"
              readOnly
              checked={allProps.isNew == true}
            />
            <label>New</label>
          </fieldset>
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setIsNew(false)}
          >
            <input
              type="radio"
              className="tf-check"
              readOnly
              checked={allProps.isNew == false}
            />
            <label>Used</label>
          </fieldset>
        </div>
      </div>
      <div className="widget-facet facet-fieldset">
        <p className="facet-title title-sidebar fw-semibold">
          Deals & Discounts
        </p>
        <div className="box-fieldset-item">
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setDeals("All Discounts")}
          >
            <input
              type="radio"
              checked={allProps.deals == "All Discounts"}
              readOnly
              className="tf-check"
            />
            <label>All Discounts</label>
          </fieldset>
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setDeals("Today’s Deals")}
          >
            <input
              type="radio"
              className="tf-check"
              checked={allProps.deals == "Today’s Deals"}
              readOnly
            />
            <label>Today’s Deals</label>
          </fieldset>
        </div>
      </div>
    </>
  );
}

