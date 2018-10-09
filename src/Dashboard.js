import React from 'react';
import styled, { css } from 'styled-components';

import { CoinTile, CoinGrid, CoinHeaderGrid, CoinSymbol } from './CoinList';
import { fontSizeBig, fontSize3, subtleBoxShadow, lightBlueBackground } from './style';

const numberFormat = (number) => {
  return +(number + '').slice(0, 7);
};

const ChangePct = styled.div`
  color: green;
  ${props => props.red && css`
    color: red;
  `}
`;

const TickerPrice = styled.div`
  ${fontSizeBig};
`;

const CoinTileCompact = CoinTile.extend`
  ${fontSize3} 
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(3, 1fr);
  justify-items: right; 
`;

const PaddingBlue = styled.div`
  ${subtleBoxShadow} 
  ${lightBlueBackground}
	padding: 10px;
`;

const ChartGrid = styled.div`
  display: grid;
  margin-top: 20px;
  grid-gap: 15px;
  grid-template-columns: 1fr 3fr;
`;

export default function () {
  return [
    <CoinGrid>
      { this.state.prices.map((price, index) => {
        const sym = Object.keys(price)[0];
        const data = price[sym]['USD'];
        let tileProps = {
          key: sym,
          dashboardFavorite: sym === this.state.currentFavorite,
          onClick: () => {
            this.setState(
              {currentFavorite: sym, historical: null},
            );
            localStorage.setItem(
              'cryptoDash',
              JSON.stringify({
                ...JSON.parse(localStorage.getItem('cryptoDash')),
                currentFavorite: sym
              })
            );
          }
        };

        return index < 5 ? (
          <CoinTile
            key={ data.FROMSYMBOL }
            { ...tileProps }
          >
            <CoinHeaderGrid>
              <div>{ sym }</div>
              <CoinSymbol>
                <ChangePct red={ data.CHANGEPCT24HOUR < 0 }>
                  { numberFormat(data.CHANGEPCT24HOUR) }%
                </ChangePct>
              </CoinSymbol>
            </CoinHeaderGrid>
            <TickerPrice>${ numberFormat(data.PRICE) }</TickerPrice>
          </CoinTile>) : (
          <CoinTileCompact
            key={ data.FROMSYMBOL }
            { ...tileProps }
          >
            <div style={ {justifySelf: 'left'} }> { sym }</div>
            <CoinSymbol>
              <ChangePct red={ data.CHANGEPCT24HOUR < 0 }>
                { numberFormat(data.CHANGEPCT24HOUR) }%
              </ChangePct>
            </CoinSymbol>
            <div>${ numberFormat(data.PRICE) } </div>
          </CoinTileCompact>
        );
      }) }
    </CoinGrid>,
    <ChartGrid key={ 'chartgrid' }>
      { this.state.currentFavorite
      && <PaddingBlue>
        <h2 style={ {textAlign: 'center'} }>
          { this.state.coinList[this.state.currentFavorite].CoinName }
        </h2>
        <img
          alt={ this.state.currentFavorite }
          style={ {height: '200px', display: 'block', margin: 'auto'} }
          src={ `http://cryptocompare.com/${
            this.state.coinList[this.state.currentFavorite].ImageUrl
            }` }
        />
      </PaddingBlue> }
    </ChartGrid>
  ];
}