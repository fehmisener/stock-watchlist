import React, { useState, useEffect } from 'react';

import {
  alpha,
  Box,
  Container,
  Typography,
  Autocomplete,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Button,
  ButtonGroup,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { fetchStocksAutoComplete, fetchStockDetails } from '../api/finance';
import {
  saveWatchlist,
  getWatchlist,
  deleteItemFromWatchlist,
} from '../api/user';
import { currencyFormatter } from '../utils/format';

/**
 * React component for managing a watchlist of stocks.
 * Allows users to search and add stocks to their watchlist,
 * view details of the added stocks, and save the watchlist.
 * @component
 */
export default function Watchlist() {
  /**
   * State to store the user's search query.
   * @type {string}
   */
  const [query, setQuery] = useState('');
  /**
   * State to store the user's watchlist.
   * @type {Array}
   */
  const [watchlist, setWatchlist] = useState([]);
  /**
   * State to store the autocomplete suggestions based on the user's query.
   * @type {Array}
   */
  const [suggestions, setSuggestions] = useState([]);
  /**
   * State to store the debounced query to prevent rapid API calls.
   * @type {string}
   */
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  /**
   * State to track whether the previous request has been completed. According to this value
   * Initialized to true indicating that there is no pending request initially.
   * @type {boolean}
   */
  const [prevRequestCompleted, setPrevRequestCompleted] = useState(true);
  /**
   * State to track the previous prices of stocks in the watchlist.
   * @type {Object<string, number>}
   */
  const [previousPrices, setPreviousPrices] = useState({});
  /**
   * State to store the fetched watchlist updated data.
   * @type {Array<Object>}
   */
  const [fetchedWatchlist, setFetchedWatchlist] = useState([]);

  /**
   * Effect to store the watchlist in local storage when it changes.
   */
  useEffect(() => {
    if (watchlist.length > 0) {
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }
  }, [watchlist]);

  /**
   * Effect to debounce the user's search query. This prevents rapid API calls with 300ms delay.
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  /**
   * Effect to fetch autocomplete suggestions based on the debounced query.
   */
  useEffect(() => {
    const fetchData = async () => {
      if (debouncedQuery) {
        const suggestions = await fetchStocksAutoComplete(debouncedQuery);
        setSuggestions(suggestions);
      } else {
        setSuggestions([]);
      }
    };

    fetchData();
  }, [debouncedQuery]);

  /**
   * Effect to update stock details in the watchlist periodically.
   * This effect runs every 5 seconds if the previous request has been completed
   * and the market is open for the stock.
   */
  useEffect(() => {
    if (watchlist.length > 0 && prevRequestCompleted) {
      const timeoutId = setTimeout(() => {
        console.log(
          'Previous request completed and 5 seconds have passed.',
          new Date()
        );
        const symbols = watchlist.map((stock) => stock.symbol);

        fetchStockDetails(symbols).then((data) => {
          const newPreviousPrices = {};

          data.forEach((stock) => {
            const previousPrice =
              watchlist.find((item) => item.symbol === stock.symbol)
                ?.regularMarketPrice || 0;
            newPreviousPrices[stock.symbol] = previousPrice;
          });

          setPreviousPrices(newPreviousPrices);
          setFetchedWatchlist(data);
          setPrevRequestCompleted(true);
        });

        setPrevRequestCompleted(false);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  });

  /**
   * Effect to merge fetched watchlist data with the current watchlist.
   * This effect runs whenever `fetchedWatchlist` changes.
   *
   */
  useEffect(() => {
    if (fetchedWatchlist.length > 0) {
      const fetchedStockMap = fetchedWatchlist.reduce((map, stock) => {
        map[stock.symbol] = stock;
        return map;
      }, {});

      const mergedWatchlist = watchlist.map(
        (stock) => fetchedStockMap[stock.symbol] || stock
      );

      setWatchlist(mergedWatchlist);
    }
  }, [fetchedWatchlist]);

  /**
   * Effect to initialize the watchlist from the database and local storage. It merges the watchlist from both sources.
   */
  useEffect(() => {
    const initializeWatchlist = async () => {
      try {
        const response = await getWatchlist();
        const symbols = response.flatMap((item) =>
          item.watchlistItems.map((stock) => stock.symbol)
        );
        let watchlistFromDatabase = [];
        if (symbols.length > 0) {
          const stockDetails = await fetchStockDetails(symbols);
          watchlistFromDatabase = stockDetails;
        }

        const cachedWatchlist = localStorage.getItem('watchlist');
        let watchlistFromCache = [];
        if (cachedWatchlist) {
          watchlistFromCache = JSON.parse(cachedWatchlist);
        }

        const mergedWatchlist = mergeWatchlists(
          watchlistFromCache,
          watchlistFromDatabase
        );
        setWatchlist(mergedWatchlist);
      } catch (error) {
        console.error('Error initializing watchlist:', error);
      }
    };

    initializeWatchlist();
  }, []);

  /**
   * Function to merge watchlists from cache and database.
   * @param {Array} watchlistFromCache - Watchlist from local storage.
   * @param {Array} watchlistFromDatabase - Watchlist from database.
   * @returns {Array} Merged watchlist.
   */
  const mergeWatchlists = (watchlistFromCache, watchlistFromDatabase) => {
    const mergedWatchlist = [...watchlistFromCache];
    for (const stock of watchlistFromDatabase) {
      if (!watchlistFromCache.find((item) => item.symbol === stock.symbol)) {
        mergedWatchlist.push(stock);
      }
    }
    return mergedWatchlist;
  };

  const handleSearchChange = (event, value, reason) => {
    if (reason === 'input') {
      setQuery(value);
    }
  };

  const handleSelectionChange = (event, value) => {
    const selectedStock = suggestions.find((stock) => {
      const stockText = `${stock.symbol} - ${stock.longname || stock.shortname} <> ${stock.exchange} - ${stock.quoteType}`;
      return stockText === value;
    });

    if (selectedStock) {
      addStockToWatchlist(selectedStock);
      setQuery('');
    }
  };

  const addStockToWatchlist = async (stock) => {
    if (!watchlist.find((item) => item.symbol === stock.symbol)) {
      const stockDetails = await fetchStockDetails([stock.symbol]);
      setWatchlist([...watchlist, ...stockDetails]);
    }
  };

  const removeStockFromWatchlist = async (symbol) => {
    try {
      await deleteItemFromWatchlist(symbol);

      setWatchlist(watchlist.filter((stock) => stock.symbol !== symbol));

      const cachedWatchlist = localStorage.getItem('watchlist');
      if (cachedWatchlist) {
        const updatedWatchlist = JSON.parse(cachedWatchlist).filter(
          (stock) => stock.symbol !== symbol
        );
        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSaveWatchlist = async () => {
    const watchlistItems = watchlist.map((item) => ({ symbol: item.symbol }));

    const data = {
      watchlistItems,
    };

    await saveWatchlist(data);
  };

  return (
    <Box
      id="primary-watchlist"
      sx={{
        pt: { xs: 4, sm: 4 },
        pb: { xs: 8, sm: 4 },
        color: 'white',
        bgcolor: '#06090a',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 3 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h4">
            My Watch List 💸
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
            Search your favorite stocks and add them to your watch list.
          </Typography>
        </Box>
        <Autocomplete
          id="mywatchlist-searchbar"
          sx={{ width: '70%' }}
          freeSolo
          value={query}
          onInputChange={handleSearchChange}
          onChange={handleSelectionChange}
          options={suggestions.map(
            (option) =>
              `${option.symbol} - ${option.longname || option.shortname} <> ${option.exchange} - ${option.quoteType}`
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search for stocks"
              variant="outlined"
            />
          )}
        />
        {watchlist.length !== 0 && (
          <Box
            sx={(theme) => ({
              width: '70%',
              borderRadius: '10px',
              outline: '1px solid',
              outlineColor:
                theme.palette.mode === 'light'
                  ? alpha('#BFCCD9', 0.5)
                  : alpha('#9CCCFC', 0.2),
              boxShadow:
                theme.palette.mode === 'light'
                  ? `0 0 12px 8px ${alpha('#9CCCFC', 0.2)}`
                  : `0 0 24px 12px ${alpha('#033363', 0.3)}`,
              pb: { sm: 2 },
            })}
          >
            <List>
              {watchlist.map((stock) => {
                const previousPrice = previousPrices[stock.symbol];
                const currentPrice = stock.regularMarketPrice;
                const priceChange = currentPrice - previousPrice;
                const priceChangeIndicator =
                  priceChange > 0 ? (
                    <ArrowUpwardIcon
                      sx={{ color: 'green', fontSize: 'inherit' }}
                    />
                  ) : priceChange < 0 ? (
                    <ArrowDownwardIcon
                      sx={{ color: 'red', fontSize: 'inherit' }}
                    />
                  ) : null;

                return (
                  <React.Fragment key={stock.symbol}>
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => removeStockFromWatchlist(stock.symbol)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={`${stock.symbol} - ${stock.shortName} - ${stock.exchange}`}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              sx={{
                                color: priceChange
                                  ? priceChange > 0
                                    ? 'green'
                                    : 'red'
                                  : 'inherit',
                                animation: priceChange
                                  ? 'fadeHighlight 1s forwards' // Apply animation only when there's a change
                                  : 'none', // No animation when no change
                              }}
                            >
                              Last Price:{' '}
                              {currencyFormatter(stock.currency).format(
                                stock.regularMarketPrice
                              )}
                            </Typography>
                            {priceChangeIndicator}
                            <br />
                            <Typography component="span">
                              Change:{' '}
                              {stock.regularMarketChangePercent.toFixed(2)}%
                            </Typography>
                            <br />
                            <Typography component="span">
                              Volume:{' '}
                              {currencyFormatter(stock.currency).format(
                                stock.regularMarketVolume
                              )}
                            </Typography>
                            <br />
                            <Typography component="span">
                              Market Cap:{' '}
                              {currencyFormatter(stock.currency).format(
                                stock.marketCap
                              )}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="middle" component="li" />
                  </React.Fragment>
                );
              })}
            </List>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ButtonGroup
                variant="outlined"
                size="large"
                aria-label="data-input-options-button-group"
              >
                <Button onClick={handleSaveWatchlist}>Save Watchlist</Button>
                <Button
                  onClick={() => {
                    window.print();
                  }}
                >
                  Print Watchlist
                </Button>
              </ButtonGroup>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
