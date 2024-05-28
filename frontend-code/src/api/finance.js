const apiOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
    'X-RapidAPI-Host': import.meta.env.VITE_RAPIDAPI_HOST,
  },
};

export const fetchStocksAutoComplete = async (query) => {
  if (!query) return [];
  try {
    const response = await fetch(
      `https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete?q=${query}&region=US`,
      apiOptions
    );
    const result = await response.json();
    return result.quotes || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchStockDetails = async (symbols) => {
  if (!symbols) return [];
  try {
    const response = await fetch(
      `https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=${symbols.join('%2C')}`,
      apiOptions
    );
    const data = await response.json();
    return data.quoteResponse.result;
  } catch (error) {
    console.error(error);
    return [];
  }
};
