import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: [],
  isLoading : false,
  countryData: [],
  countryIsLoading: false,
};

export const getCovidData = createAsyncThunk(
  "data/getCovidData",
  async () => {
    try {
      const {data} = await axios.get(
        `https://api.covid19api.com/summary`
      );
      return { data: data };
    } catch (error) {
      throw error
    }
  }
);

export const getCountryDetail = createAsyncThunk(
  "data/getCountryDetail",
  async (countryCode) => {
    try {
      const {data} = await axios.get(
        `https://restcountries.com/v3.1/alpha/${countryCode}`
      );
      return { data: data };
    } catch (error) {
      throw error
    }
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    // getAccount: (state , {payload}) => {
    //   state.account = payload;
    // }
  },
  extraReducers: (builder) => {
    builder.addCase(getCovidData.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCovidData.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.data = payload.data;
    });
    builder.addCase(getCovidData.rejected, (state, { error }) => {
      state.isLoading = true;
      state.data = error;
    });

    builder.addCase(getCountryDetail.pending, (state) => {
      state.countryIsLoading =  true;
    });
    builder.addCase(getCountryDetail.fulfilled, (state, { payload }) => {
      state.countryIsLoading =  false;
      state.countryData = payload.data;
    });
    builder.addCase(getCountryDetail.rejected, (state, { error }) => {
      state.countryIsLoading =  true;
      state.countryData = error;
    });
  },
});

// export actions
// export const {getAccount} = userSlice.actions;
// export reducer
export default dataSlice.reducer;