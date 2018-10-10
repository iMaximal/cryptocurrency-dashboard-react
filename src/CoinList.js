import React from 'react';
import styled, { css } from 'styled-components';

import { subtleBoxShadow, lightBlueBackground, greenBoxShadow, redBoxShadow } from './style';

export const CoinGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  ${props =>
  props.count &&
  css`
      grid-template-columns: repeat(${props.count > 5 ? props.count : 5}, 1fr);
    `} 
  grid-gap: 15px;
  margin-top: 40px;
`;

export const CoinTile = styled.div`
	${subtleBoxShadow}
  ${lightBlueBackground}
	padding: 10px; 
	&:hover{
		cursor: pointer; 
		${greenBoxShadow}
	}
	${props => props.favorite && css`
      &:hover {
        cursor: pointer;
        ${redBoxShadow};
      }
    `}	
	
	${props => props.dashboardFavorite && css`
      ${greenBoxShadow} 
      &:hover {
        pointer-events: none;
      }
    `}
	
	${props => props.chosen && !props.favorite && css`
      pointer-events: none;
      opacity: 0.4;
    `}
`;

export const CoinHeaderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

export const CoinSymbol = styled.div`
  justify-self: right;
`;

const DeleteIcon = styled.div`
  justify-self: right;
  display: none;
  ${CoinTile}:hover & {
    display: block;
    color: red;
  }
`;

export default function (props) {
  const {coinList, favorites, fetched, filteredCoins, showFavorites} = props;

  const coinKeys = showFavorites
    ? favorites
    : (filteredCoins && Object.keys(filteredCoins)) ||
    Object.keys(coinList).slice(0, 100);
  return (
    <CoinGrid count={ showFavorites && favorites.length }>
      { coinKeys && coinKeys.map(coinKey => {
        return (
          fetched && <CoinTile
            key={ coinKey }
            favorite={ showFavorites }
            onClick={
              showFavorites
                ? () => props.onRemoveCoinFromFavorites(coinKey)
                : () => props.onAddCoinToFavorites(coinKey)
            }
            chosen={ props.onIsInFavorites(coinKey) }
          >
            <CoinHeaderGrid>
              <div>{ coinList[coinKey].CoinName }</div>
              { showFavorites
                ? <DeleteIcon>X</DeleteIcon>
                : <CoinSymbol> { coinList[coinKey].Symbol }</CoinSymbol> }
            </CoinHeaderGrid>
            { <img style={ {height: '50px'} }
                   src={ `http://cryptocompare.com/${coinList[coinKey].ImageUrl}` }
                   alt={ coinList[coinKey].CoinName }
            /> }
          </CoinTile>
        );
      }) }
    </CoinGrid>
  );
}