import React, { Component } from 'react'
import "../Style/Home.css";
import { connect } from "react-redux";
import { getCovidData, getCountryDetail } from '../Redux/dataSlice';
import dayjs from 'dayjs';
import ModalContainer from './ModalContainer';
import { useRef } from 'react';

class Home extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.state = {
      searchValue: "",
    };
  }

  componentDidMount() {
    this.props.getCovidData();
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount(){
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleOpenModal (countryCode) {
    document.getElementById("myModal").style.display = "block";
    this.props.getCountryDetail(countryCode);
  }

  handleCloseModal () {
    document.getElementById("myModal").style.display = "none";
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      document.getElementById("myModal").style.display = "none";
    }
  }

  handleSearch(event) {
    this.setState({searchValue : event.target.value})
  }

  render() {
    const isLoading = this.props.isLoading;
    const {Global,Countries} = this.props.data;

    if (isLoading) {
      return <div className='lds-container'><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>;
    } else if (Global === undefined || Countries === undefined) {
      return (
        <h3 className='i-name'>
          CACHING IN PROGRESS. PLEASE TRY AGAIN LATER
        </h3>
      );
    }

    const sortCountries = [...Countries].sort(function (a, b) {
      return b.TotalConfirmed - a.TotalConfirmed || b.TotalDeaths - a.TotalDeaths || a.TotalRecovered - b.TotalRecovered;
    })


    const searchCountries = sortCountries.filter((val) => {
      if(this.state.searchValue === "") {
          return val;
      } else if (val.Country.toLowerCase().includes(this.state.searchValue.toLocaleLowerCase())) {
          return val;
      }
    })
    return (
      <div className='container'>
        <div ref={this.wrapperRef}>{this.props.children}</div>
        <div>
          <h3 className='i-name'>
            COVID-19 TRACKER ({dayjs(Global.Date).format("DD/MM/YYYY")})
          </h3>
        </div>

        <div className='values'>
          <div className='val-box box1'>
            <i className="fas fa-check"></i>
            <div>
              <h3>New Confirmed</h3>
              <span>{Global.NewConfirmed.toLocaleString()}</span>
            </div>
          </div>
          <div className='val-box box2'>
            <i className="fas fa-check-double"></i>
            <div>
              <h3>Total Confirmed</h3>
              <span>{Global.TotalConfirmed.toLocaleString()}</span>
            </div>
          </div>
          <div className='val-box box3'>
            <i className="fas fa-times"></i>
            <div>
              <h3>New Deaths</h3>
              <span>{Global.NewDeaths.toLocaleString()}</span>
            </div>
          </div>
          <div className='val-box box4'>
            <i className="fas fa-book-dead"></i>
            <div>
              <h3>Total Deaths</h3>
              <span>{Global.TotalDeaths.toLocaleString()}</span>
            </div>
          </div>
          <div className='val-box box5'>
            <i className="fas fa-plus"></i>
            <div>
              <h3>New Recovered</h3>
              <span>{Global.NewRecovered.toLocaleString()}</span>
            </div>
          </div>
          <div className='val-box box6'>
            <i className="fas fa-plus-square"></i>
            <div>
              <h3>Total Recovered</h3>
              <span>{Global.TotalRecovered.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className='searchBox'>
          <input type="text" placeholder="Search" onChange={(event) => this.handleSearch(event)}/>
        </div>
        <div className='board'>
          <table width={"100%"}>
            <thead>
              <tr>
                <td>Country</td>
                <td>New Confirmed</td>
                <td>Total Confirmed</td>
                <td>New Deaths</td>
                <td>Total Deaths</td>
                <td>New Recovered</td>
                <td>Total Recovered</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {searchCountries.map((item) => {
                return (
                  <tr key={item.ID}>
                    <td>
                      <h5>{item.Country}</h5>
                    </td>
                    <td className='active active-primary'>
                      <p>{item.NewConfirmed.toLocaleString()}</p>
                    </td>
                    <td className='active active-primary'>
                      <p>{item.TotalConfirmed.toLocaleString()}</p>
                    </td>
                    <td className='active active-danger'>
                      <p>{item.NewDeaths.toLocaleString()}</p>
                    </td>
                    <td className='active active-danger'>
                      <p>{item.TotalDeaths.toLocaleString()}</p>
                    </td>
                    <td className='active active-success'>
                      <p>{item.NewRecovered.toLocaleString()}</p>
                    </td>
                    <td className='active active-success'>
                      <p>{item.TotalRecovered.toLocaleString()}</p>
                    </td>
                    <td className='details'>
                      <button id="myBtn" onClick={() => this.handleOpenModal(item.CountryCode)}>Country Details</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
        </div>
        <div id="myModal" className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <span className="close" onClick={() => this.handleCloseModal()}>&times;</span>
              <h2>Country Details</h2>
            </div>
            <div className="modal-body">
              <ModalContainer/>
            </div>
          </div>
        </div>        
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.dataSlice.data,
    isLoading: state.dataSlice.isLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCovidData: () => {
      dispatch(getCovidData());
    },
    getCountryDetail: (country) => {
      dispatch(getCountryDetail(country));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);