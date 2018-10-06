import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import cc from 'cryptocompare';
import './App.css';
import AppBar from './AppBar';

const AppLayout = styled.div`
  padding: 40px;
`;

const Content = styled.div`
  
`;

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
    page: 'settings',
    coinList: {},
  };

  componentDidMount() {
    this.fetchCoins();
  }

  fetchCoins = async () => {
    let coinList = (await cc.coinList()).Data;
    this.setState({ coinList });
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
    localStorage.setItem('cryptoDash', 'test');
    this.setState({
      firstVisit: false,
      page: 'dashboard',
    });
  };

  loadingContent = () => {
    if (this.state.coinList) {
      return (
        <div>Loading Coins</div>
      )
    }
   };

  settingsContent = () => {
    return (
      <div>
        { this.firstVisitMessage() }
        <div onClick={ this.confirmFavorites }>
          Confirm Favorites
        </div>
      </div>
    );

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
