import { useEffect, useState } from "react";
import axios from "axios";

import Card from "./components/Card";
import Filter from "./components/Filter";

const fetchCarsData = async (URL) => {
  try {
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error.response);
  }
};

let selectedBrands = [];

function App() {
  const [isLoading, setLoading] = useState(true);
  const [carsData, setCarsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [enteredText, setEnteredText] = useState("");

  const filter = (currentPage = 1) => {
    let cars = [];
    let numbers = [];
    let count = 0;

    count = Math.ceil(filteredCars.length / 9);
    for (let i = 1; i <= count; i++) {
      numbers.push(i);
    }
    setPageCount(count);

    for (let index = 0; index < 9; index++) {
      const car = filteredCars[(currentPage - 1) * 9 + index];
      if (car) cars.push(car);
      else break;
    }
    setCurrentPage(currentPage);
    setPageNumbers([...numbers]);
    setFilteredData([...cars]);
  };

  const handleCarsChange = (brands) => {
    selectedBrands = [];
    for (const brand in brands) {
      if (brands[brand]) selectedBrands.push(brand);
    }
    if (selectedBrands.length) {
      const regex = new RegExp(selectedBrands.join("|"));
      filteredCars.length = 0;
      carsData.forEach((car) => {
        if (regex.test(car.brandName)) {
          filteredCars.push(car);
        }
      });
      setFilteredCars([...filteredCars]);
    } else {
      setFilteredCars([...carsData]);
    }
  };

  const inputTextHandler = (event) => {
    setEnteredText(event.target.value);
  };

  const formSubmissionHandler = (event) => {
    event.preventDefault();
    const searchText = enteredText.trim().replaceAll(" ", "+");
    const cars = [];

    filteredCars.length = 0;

    if (searchText === "") {
      if (selectedBrands.length) {
        const regex = new RegExp(selectedBrands.join("|"));
        filteredCars.length = 0;
        carsData.forEach((car) => {
          if (regex.test(car.brandName)) {
            filteredCars.push(car);
          }
        });
        setFilteredCars([...filteredCars]);
      } else {
        setFilteredCars([...carsData]);
      }
    } else {
      fetchCarsData(
        `https://www.cardekho.com/api/v1/search-new-cars/search-result?term=${searchText}`
      )
        .then((response) => {
          let data = response.data.data.searchResult.results;
          let modelSlug = "";
          let url = "";

          for (const car of data) {
            if (car.type === "Model") {
              modelSlug = car.key.replaceAll(" ", "_");
              url = car.url.substring(1).replaceAll("/", "%2F");
              cars.push({ modelSlug, url });
            }
          }

          cars.forEach((car) => {
            fetchCarsData(
              `https://www.cardekho.com/api/v1/model/pwamodeloverview?otherinfo=all&modelSlug=${car.modelSlug}&url=${car.url}`
            )
              .then((response) => {
                const name = response.data.data.overView.name;
                const image = response.data.data.overView.image;
                const brandName = response.data.data.overView.brandName;
                const minPrice =
                  response.data.data.dataLayer.min_price_segment_new;
                const maxPrice =
                  response.data.data.dataLayer.max_price_segment_new;
                const modelUrl = response.data.data.overView.modelUrl;
                const result = {
                  name,
                  image,
                  brandName,
                  minPrice,
                  maxPrice,
                  modelUrl,
                };
                filteredCars.push(result);
                setFilteredCars([...filteredCars]);
              })
              .catch((error) => {
                console.log(error.message);
              });
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };

  useEffect(() => {
    fetchCarsData(
      "https://www.cardekho.com/api/v1/model/latest?_format=json&pageSize=199"
    ).then((response) => {
      let data = response.data.data.items;

      for (const car of data) {
        carsData.push(car);
        filteredCars.push(car);
      }

      setLoading(false);
      filter();
    });
  }, []);

  useEffect(() => {
    filter();
  }, [filteredCars]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="text-center my-5">
        <h1>My Car World</h1>
        <p>Get the price of your dream car</p>
      </div>
      <div className="row mt-3">
        <div className="col-lg-3">
          <Filter carsData={carsData} onChangeHandler={handleCarsChange} />
        </div>
        <div className="col-lg-9 mt-5 mt-lg-0">
          <div className="container">
            <div className="row mb-4">
              <div className="col">
                <form className="form-group" onSubmit={formSubmissionHandler}>
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Search Cars or Brands eg. Fortuner, or Toyota"
                      onChange={inputTextHandler}
                    />
                    <button
                      type="submit"
                      class="btn btn-primary"
                      id="buttonAfter"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="row row-cols-1 row-cols-md-3">
              {filteredData.map((car) => {
                return <Card car={car} />;
              })}
            </div>
            <nav className="pagination-centered">
              <ul className="pagination pagination-sm flex-wrap justify-content-center">
                <li className="page-item">
                  <button
                    onClick={() => {
                      filter(1);
                    }}
                    className="page-link"
                  >
                    First
                  </button>
                </li>
                {pageNumbers.map((number) => {
                  return (
                    <li
                      className={
                        currentPage === number
                          ? "page-item active"
                          : "page-item"
                      }
                    >
                      <button
                        onClick={() => {
                          filter(number);
                        }}
                        className="page-link"
                      >
                        {number}
                      </button>
                    </li>
                  );
                })}
                <li className="page-item">
                  <button
                    onClick={() => {
                      filter(pageCount);
                    }}
                    className="page-link"
                  >
                    Last
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
