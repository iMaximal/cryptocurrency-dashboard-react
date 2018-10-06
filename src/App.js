import React, { Component } from 'react';
import styled from 'styled-components';

import './App.css';

const Logo = styled.div`
  font-size: 1.5em;
`;

const ControlButton = styled.div`
`;


const AppLayout = styled.div`
  display: grid;
  grid-template-columns: 100px auto 100px 100px;
  padding: 40px;
`;

class App extends Component {
  render() {
    return (
      <AppLayout>
        <Logo>
          CryptoDash
        </Logo>
        <div>

        </div>
        <ControlButton>
          Dashboard
        </ControlButton>
        <ControlButton>
          Settings
        </ControlButton>
      </AppLayout>
    );
  }
}

export default App;
