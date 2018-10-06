import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import './App.css';

const Logo = styled.div`
  font-size: 1.5em;
`;

const ControlButton = styled.div`
  cursor: pointer;
  ${props => props.active && css`
    text-shadow: 0px 0px 60px #03FF03
  `}
`;

const AppLayout = styled.div`
  padding: 40px;
`;

const Bar = styled.div`
  display: grid;
  grid-template-columns: 180px auto 100px 100px;
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
    page: 'dashboard',
    ...checkFirstVisit(),
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
    localStorage.setItem('cryptoDash', 'test');
    this.setState({
      firstVisit: false,
      page: 'dashboard',
    });
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
        <Bar>
          <Logo>
            CryptoDash
          </Logo>
          <div>

          </div>
          {this.state.firstVisit
          &&  <ControlButton
            onClick={ () => this.changeActivePage('dashboard') }
            active={ this.displayDashboard() }
          >
            Dashboard
          </ControlButton>}
          <ControlButton
            onClick={ () => this.changeActivePage('settings') }
            active={ this.displaySettings() }
          >
            Settings
          </ControlButton>
          <Content>
            { this.displaySettings() && this.settingsContent() }
          </Content>
        </Bar>
      </AppLayout>
    );
  }
}

export default App;
