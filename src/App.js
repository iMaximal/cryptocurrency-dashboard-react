import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import cc from 'cryptocompare';
import _ from 'lodash';

import './App.css';
import AppBar from './AppBar';
import CoinList from './CoinList';
import Search from './Search';
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
  const cryptoDashData = localStorage.getItem('cryptoDash');
  if (!cryptoDashData) {
    return {
      firstVisit: true,
      page: 'settings',
    };
  }
  return {};
};

class App extends Component {
  state = {
    ...checkFirstVisit(),
    favorites: ['ETH', 'BTC', 'DOGE', 'ZEC'],
    page: 'settings',
    coinList: {},
    fetched: false,
  };

  componentDidMount() {
    this.fetchCoins();
  }

  fetchCoins = async () => {
    let coinList = (await cc.coinList()).Data;
    this.setState({
      coinList,
      fetched: true,
    });
  };

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
    });
  };

  loadingContent = () => {
    if (!this.state.coinList) {
      return (
        <div>Loading Coins</div>
      );
    }
  };

  settingsContent = () => {
    return (
      <div>
        { this.firstVisitMessage() }
        <CenterDiv>
          <ConfirmButton onClick={ this.confirmFavorites }>
            Confirm Favorites
          </ConfirmButton>
        </CenterDiv>
        { CoinList.call(this, true, this.state.fetched) }
        { Search.call(this) }
        { CoinList.call(this, false, this.state.fetched) }
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

  render() {
    const {page} = this.state;

    return (
      <AppLayout>
        { AppBar.call(this) }
        { this.loadingContent() || <Content>
          { this.displaySettings() && this.settingsContent() }
        </Content> }
      </AppLayout>
    );
  }
}

export default App;
