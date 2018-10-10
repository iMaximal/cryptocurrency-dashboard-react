import React from 'react';
import styled, { css } from 'styled-components';
import ReactHighcharts from 'react-highcharts';

import { CoinTile, CoinGrid, CoinHeaderGrid, CoinSymbol } from './CoinList';
import { fontSizeBig, fontSize3, subtleBoxShadow, lightBlueBackground, backgroundColor2, fontSize2 } from './style';
import highchartsConfig from './HighchartsConfig';
import theme from './HighchartsTheme';

ReactHighcharts.Highcharts.setOptions(theme);

const numberFormat = (number) => {
  return +(number + '').slice(0, 7);
};

const ChangePct = styled.div`
  color: green;
  ${props => props.red && css`
    color: red;
  `}
`;

const ChartSelect = styled.select`
  ${backgroundColor2} 
  color: #1163c9;
  border: 1px solid;
  ${fontSize2} 
  margin: 5px;
  height: 25px;
  float: right;
`;

const TickerPrice = styled.div`
  ${fontSizeBig};
`;

const CoinTileCompact = styled(CoinTile)`
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
    <CoinGrid key="coingrid">
      { this.state.prices.map((price, index) => {
        const sym = Object.keys(price)[0];
        const data = price[sym]['USD'];
        let tileProps = {
          key: sym,
          dashboardFavorite: sym === this.state.currentFavorite,
          onClick: () => {
            this.setState(
              {currentFavorite: sym, historical: null},
              this.fetchHistorical
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

    <ChartGrid key="chartgrid">
      { this.state.currentFavorite && this.state.historical
      && <>
        <PaddingBlue>
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
        </PaddingBlue>
        <PaddingBlue>
          <ChartSelect
            defaultValue="months"
            onChange={ e => {
              this.setState({
                timeInterval: e.target.value,
                historical: null}, this.fetchHistorical
              );
            } }
          >
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
          </ChartSelect>
          { this.state.historical ? (
            <ReactHighcharts config={ highchartsConfig.call(this) }/>
          ) : (
            <div> Loading historical data </div>
          ) }
        </PaddingBlue>
      </>
      }
    </ChartGrid>
  ];
}