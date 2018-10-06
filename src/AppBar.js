import React from 'react';
import styled, { css } from 'styled-components';

const Bar = styled.div`
  display: grid;
  grid-template-columns: 180px auto 100px 100px;
  padding: 40px;
`;

const Logo = styled.div`
  font-size: 1.5em;
`;

const ControlButton = styled.div`
  cursor: pointer;
  ${props => props.active && css`
    text-shadow: 0px 0px 60px #03FF03
  `}
`;

export default function () {
  return (
    <Bar>
      <Logo>
        CryptoDash
      </Logo>
      <div>

      </div>
      { this.state.firstVisit
      && <ControlButton
        onClick={ () => this.changeActivePage('dashboard') }
        active={ this.displayDashboard() }
      >
        Dashboard
      </ControlButton> }
      <ControlButton
        onClick={ () => this.changeActivePage('settings') }
        active={ this.displaySettings() }
      >
        Settings
      </ControlButton>
    </Bar>);
};
