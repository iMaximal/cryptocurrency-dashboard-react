import React from 'react';
import styled, { css } from 'styled-components';

import { CoinTile, CoinGrid, CoinHeaderGrid, CoinSymbol } from './CoinList';
import { fontSizeBig, fontSize3 } from './style';

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

export default function () {
  return (
    <CoinGrid>
      { this.state.prices.map((price, index) => {
        const sym = Object.keys(price)[0];
        const data = price[sym]['USD'];
        return index < 5 ? (
          <CoinTile key={ data.FROMSYMBOL }>
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
          <CoinTileCompact>
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
    </CoinGrid>
  );
}