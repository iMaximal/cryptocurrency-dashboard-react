import React from 'react';
import styled, { css } from 'styled-components';

import { subtleBoxShadow, lightBlueBackground, greenBoxShadow, redBoxShadow } from './style';

const CoinGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 15px;
  margin-top: 40px;
`;

const CoinTile = styled.div`
  ${subtleBoxShadow}
  ${lightBlueBackground}
  padding: 10px;
  &:hover {
    cursor: pointer;
    ${greenBoxShadow}
  }
  ${props => props.favorite && css`
  &:hover {
    cursor: pointer;
    ${redBoxShadow}
     }
  `}
  ${props => props.chosen && !props.favorite && css`
    pointer-events: none;
    opacity: 0.4;
  `}
`;

const CoinHeaderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const CoinSymbol = styled.div`
  justify-self: right;
`;

export default function (favorites = false, fetched) {
  const coinKeys = favorites ? this.state.favorites : Object.keys(this.state.coinList).slice(0, 100);
  return (
    <CoinGrid>
      { coinKeys && coinKeys.map(coinKey => {
        return (
          fetched && <CoinTile
            key={ coinKey }
            favorite={favorites}
            onClick={
              favorites
              ? () => this.removeCoinFromFavorites(coinKey)
              : () => this.addCoinToFavorites(coinKey)
            }
            chosen={this.isInFavorites(coinKey)}
          >
            <CoinHeaderGrid>
              <div>{ this.state.coinList[coinKey].CoinName }</div>
              <CoinSymbol> { this.state.coinList[coinKey].Symbol }</CoinSymbol>
            </CoinHeaderGrid>
            { <img style={ {height: '50px'} }
                   src={ `http://cryptocompare.com/${this.state.coinList[coinKey].ImageUrl}` }/> }
          </CoinTile>
        );
      }) }
    </CoinGrid>
  );
}