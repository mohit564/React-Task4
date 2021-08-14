function Card(props) {
  const car = props.car;

  return (
    <div className="cols mb-4">
      <div className="card mx-2 h-100">
        <img className="card-img-top" src={car.image} alt="car" />
        <div className="card-body">
          <h4 className="card-title">{car.name}</h4>
          <p className="card-text">
            <b>Brand : </b>
            {car.brandName}
          </p>
          <p className="card-text">
            <b>Price : </b>
            {car.minPrice} - {car.maxPrice}
          </p>
        </div>
        <div className="card-footer">
          <a
            href={"https://cardekho.com" + car.modelUrl}
            className="btn btn-primary btn-sm float-end"
            target="_blank"
            rel="noreferrer"
          >
            More Info
          </a>
        </div>
      </div>
    </div>
  );
}

export default Card;
