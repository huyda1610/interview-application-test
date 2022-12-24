import React, { Component } from 'react'
import "../Style/ModalContainer.css"
import { connect } from "react-redux";

class ModalContainer extends Component {
  render() {
    const isLoading = this.props.countryIsLoading;
    const countryData = this.props.countryData[0];

    if (isLoading || countryData === undefined) {
      return <div className='lds-dual-container'><div className="lds-dual-ring"><div></div><div></div><div></div><div></div></div></div>;
    }

    return (
      <div className='modalContainer'>
        <div className='box'>
          <div className='row'>
            <div className='infoBox'>
              <p>Name</p>
              <span>{countryData.name.common}</span>
            </div>
            <div className='infoBox'>
              <p>Flag</p>
              <img src={countryData.flags.png} alt="#" />
            </div>
          </div>

          <div className='row'>
            <div className='infoBox'>
              <p>Population</p>
              <span>{countryData.population.toLocaleString()}</span>
            </div>
            <div className='infoBox'>
              <p>Capital</p>
              <span>{countryData.capital}</span>
            </div>
          </div>

          <div className='row'>
            <div className='infoBox'>
              <p>Region</p>
              <span>{countryData.region}</span>
            </div>
            <div className='infoBox'>
              <p>SubRegion</p>
              <span>{countryData.subregion}</span>
            </div>
          </div>
        </div>
      </div>
      
    )
  }
}

const mapStateToProps = (state) => {
  return {
    countryData: state.dataSlice.countryData,
    countryIsLoading: state.dataSlice.countryIsLoading,
  };
};

export default connect(mapStateToProps)(ModalContainer);