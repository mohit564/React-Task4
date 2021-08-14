import { useState } from "react";

function Filter(props) {
  const cars = props.carsData;
  const handleCarsChange = props.onChangeHandler;

  let brands = new Set();
  let brandsObj = {};
  cars.forEach((car) => {
    brands.add(car.brandName);
  });
  brands = [...brands].sort();
  brands.forEach((brand) => (brandsObj[brand] = false));

  const [selectedBrands, setSelectedBrands] = useState({ ...brandsObj });

  const changeHandler = (event) => {
    const { name, checked } = event.target;
    selectedBrands[name] = checked;
    setSelectedBrands({ ...selectedBrands });
  };

  return (
    <div className="card">
      <article className="card-group-item">
        <header className="card-header">
          <b>Brands</b>
        </header>
        <div className="filter-content">
          <div className="card-body">
            <form>
              {brands.map((brand) => {
                return (
                  <label className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name={brand}
                      id={brand}
                      onChange={(event) => {
                        changeHandler(event);
                        handleCarsChange(selectedBrands);
                      }}
                    />
                    <span className="form-check-label">{brand}</span>
                  </label>
                );
              })}
            </form>
          </div>
        </div>
      </article>
    </div>
  );
}

export default Filter;
