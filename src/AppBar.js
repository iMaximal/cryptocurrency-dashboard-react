import React from 'react';
import styled, { css } from 'styled-components';

const Logo = styled.div`
  font-size: 1.5em;
`;

const ControlButton = styled.div`
  cursor: pointer;
  ${props =>
  props.active &&
  css`
      text-shadow: 0px 0px 60px #03ff03;
    `};
`;

const Bar = styled.div`
  display: grid;
  margin-bottom: 40px;
  grid-template-columns: 180px auto 100px 100px;
`;

export default function(props) {
  return (
    <Bar>
      <Logo>CryptoDash</Logo>
      <div />
      {!props.firstVisit && (
        <ControlButton
          onClick={() => {
            props.onChangeActivePage('dashboard');
          }}
          active={props.onDisplaingDashboard()}
        >
          Dashboard
        </ControlButton>
      )}
      <ControlButton
        onClick={() => {
          props.onChangeActivePage('settings');
        }}
        active={props.onDisplaingSettings()}
      >
        Settings
      </ControlButton>
    </Bar>
  );
}