import React, { Component } from 'react';
import styled from 'styled-components';
import cc from 'cryptocompare';
import _ from 'lodash';
import fuzzy from 'fuzzy';

import './App.css';
import AppBar from './AppBar';
import CoinList from './CoinList';
import Search from './Search';
import Dashboard from './Dashboard';
import { ConfirmButton } from './Button';

const AppLayout = styled.div`
  padding: 40px;
`;

const Content = styled.div`
`;

export const CenterDiv = styled.div`
  display: grid;
  justify-content: center;
`;

const MAX_FAVORITES = 10;

const checkFirstVisit = () => {
  const cryptoDashData = JSON.parse(localStorage.getItem('cryptoDash'));
  if (!cryptoDashData) {
    return {
      firstVisit: true,
      page: 'settings',
    };
  }
  return {
    favorites: cryptoDashData.favorites
  };
};

class App extends Component {
  state = {
    favorites: ['ETH', 'BTC', 'DOGE', 'ZEC'],
    ...checkFirstVisit(),
    page: 'dashboard',
    coinList: {},
    fetched: false,
    prices: null,
  };

  componentDidMount() {
    this.fetchCoins();
    this.fetchPrices();
  }

  fetchCoins = async () => {
    let coinList = (await cc.coinList()).Data;
    this.setState({
      coinList,
      fetched: true,
    });
  };

  fetchPrices = async () => {
    let prices;
    try {
      prices = await this.prices();
    } catch (e) {
      this.setState({ error: true });
    }
    this.setState({ prices });
  }

  prices = () => {
    let promises = [];
    this.state.favorites.forEach(sym => {
      promises.push(cc.priceFull(sym, 'USD'));
    });
    return Promise.all(promises);
  }

  displayDashboard = () => this.state.page === 'dashboard';

  displaySettings = () => this.state.page === 'settings';

  changeActivePage = (name) => {
    this.setState({
      page: name,
    });
  };

  firstVisitMessage = () => {
    if (this.state.firstVisit) {
      return (
        <div>
          Welcome to CryptoDash, please select your favorite coins to begin.
        </div>
      );
    }
  };

  confirmFavorites = () => {
    localStorage.setItem('cryptoDash', JSON.stringify({
      favorites: this.state.favorites,
    }));
    this.setState({
      firstVisit: false,
      page: 'dashboard',
      prices: null,
    });
    this.fetchPrices();
  };

  loadingContent = () => {
    if (!this.state.coinList) {
      return (
        <div>Loading Coins</div>
      );
    }
    if(!this.state.prices) {
      return (<div>Loading Prices</div>)
    }
  };

  settingsContent = () => {
    const { fetched } = this.state;
    return (
      <div>
        {this.firstVisitMessage()}
        <div>
          {CoinList.call(this, true, fetched)}
          <CenterDiv>
            <ConfirmButton onClick={this.confirmFavorites}>
              Confirm Favorites
            </ConfirmButton>
          </CenterDiv>
          {Search.call(this)}
          {CoinList.call(this, false, fetched)}
        </div>
      </div>
    );
  };

  isInFavorites = (key) => {
    return _.includes(this.state.favorites, key);
  };

  addCoinToFavorites = (coinKey) => {
    const favorites = [...this.state.favorites];
    if (favorites.length < MAX_FAVORITES && !this.isInFavorites(coinKey)) {
      favorites.push(coinKey);
      this.setState({favorites});
    }
  };

  removeCoinFromFavorites = (coinKey) => {
    const favorites = [...this.state.favorites];
    this.setState({
      favorites: _.pull(favorites, coinKey),
    });
  };

  handleFilter = _.debounce(inputValue => {
    // Get all the coin symbols
    let coinSymbols = Object.keys(this.state.coinList);

    // Get all the coin names, maps symbol to name
    let coinNames = coinSymbols.map(sym => this.state.coinList[sym].CoinName);
    let allStringsToSearch = coinSymbols.concat(coinNames);
    let fuzzyResults = fuzzy
      .filter(inputValue, allStringsToSearch, {})
      .map(result => result.string);

    let filteredCoins = _.pickBy(this.state.coinList, (result, symKey) => {
      let coinName = result.CoinName;
      // If our fuzzy results contains this symbol OR the coinName, include it (return true).
      return (
        _.includes(fuzzyResults, symKey) || _.includes(fuzzyResults, coinName)
      );
    });

    this.setState({ filteredCoins });
  }, 500);

  filterCoins = (e) => {
    let inputValue = _.get(e, 'target.value');
    if (!inputValue) {
      this.setState({
        filteredCoins: null
      });
      return;
    }
    this.handleFilter(inputValue);
  };

  render() {
    const {page} = this.state;

    return (
      <AppLayout>
        { AppBar.call(this) }
        { this.loadingContent() || <Content>
          { this.displaySettings() && this.settingsContent() }
          { this.displayDashboard() && Dashboard.call(this) }
        </Content> }
      </AppLayout>
    );
  }
}

export default App;
