import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProfitLossTracker = () => {
  const [capital, setCapital] = useState('');
  const [isCapitalSet, setIsCapitalSet] = useState(false);
  const [trades, setTrades] = useState([]);
  const [currentCapital, setCurrentCapital] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [view, setView] = useState('stats');
  const [isAddingTrade, setIsAddingTrade] = useState(false);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = () => {
    // Fetch trades from the backend API using the Fetch API
    fetch('/api/trades')
      .then(response => response.json())
      .then(data => {
        setTrades(data);
        setCurrentCapital(data.length > 0 ? data[data.length - 1].endingCapital : 0);
      })
      .catch(error => console.error('Error fetching trades:', error));
  };

  const addTrade = (tradeCapital) => {
    const previousCapital = trades.length > 0 ? trades[trades.length - 1].endingCapital : currentCapital;
    const profitLoss = tradeCapital - previousCapital;
    const newTrade = {
      startingCapital: previousCapital,
      endingCapital: tradeCapital,
      profitLoss: profitLoss,
      result: profitLoss >= 0,
      timestamp: new Date().toISOString()
    };

    // Send new trade to the backend API using the Fetch API
    fetch('/api/trades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTrade)
    })
      .then(response => response.json())
      .then(data => {
        setTrades([...trades, { ...newTrade, id: data.id }]);
        setCurrentCapital(tradeCapital);
      })
      .catch(error => console.error('Error adding trade:', error));

    setIsAddingTrade(false);
  };

  const handleSetCapital = () => {
    const capitalAmount = parseFloat(capital);
    if (capitalAmount > 0) {
      setIsCapitalSet(true);
      setCurrentCapital(capitalAmount);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleAddTrade = () => {
    setIsAddingTrade(true);
    setCurrentCapital(trades.length > 0 ? trades[trades.length - 1].endingCapital : currentCapital);
  };

  const calculateWinRate = () => {
    if (trades.length === 0) return 0;
    const wins = trades.filter(trade => trade.result).length;
    return ((wins / trades.length) * 100).toFixed(2);
  };

  const calculateTotalProfitLoss = () => {
    return trades.reduce((total, trade) => total + trade.profitLoss, 0);
  };

  const getCapitalGrowthData = () => {
    return trades.map((trade, index) => ({
      name: `Trade ${index + 1}`,
      capital: trade.endingCapital
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      {showAlert && (
        <Alert className="bg-green-100">
          <AlertDescription>
            Capital successfully set to ${parseFloat(capital).toLocaleString()}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Profit/Loss Tracker</CardTitle>
            <div className="space-x-2">
              <Button
                onClick={() => setView('stats')}
                className={`${view === 'stats' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Stats
              </Button>
              <Button
                onClick={() => setView('trades')}
                className={`${view === 'trades' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Trades
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {view === 'stats' ? (
            <div className="space-y-4">
              {!isCapitalSet ? (
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Enter your capital"
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    className="w-full"
                  />
                  <Button
                    onClick={handleSetCapital}
                    className="w-full"
                    disabled={!capital || parseFloat(capital) <= 0}
                  >
                    Set Capital
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center">
                    <div>Initial Capital: ${parseFloat(currentCapital).toLocaleString()}</div>
                    <div>Win Rate: {calculateWinRate()}%</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>Total P/L:
                      <span className={calculateTotalProfitLoss() >= 0 ? "text-green-600" : "text-red-600"}>
                        {' '}${calculateTotalProfitLoss().toLocaleString()}
                      </span>
                    </div>
                    <div>Total Trades: {trades.length}</div>
                  </div>
                  <div className="h-48 mt-4">
                    <ResponsiveContainer>
                      <LineChart data={getCapitalGrowthData()}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="capital" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {isAddingTrade ? (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Enter trade capital"
                    value={currentCapital}
                    onChange={(e) => setCurrentCapital(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => addTrade(currentCapital)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add Trade
                  </Button>
                </div>
              ) : (
                <Button onClick={handleAddTrade} className="w-full">
                  Add Trade
                </Button>
              )}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border text-left">Trade</th>
                      <th className="p-2 border text-left">Capital</th>
                      <th className="p-2 border text-left">P/L</th>
                      <th className="p-2 border text-left">Result</th>
                      <th className="p-2 border text-left">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((trade, index) => (
                      <tr key={trade.id} className={`${trade.result ? 'bg-green-100' : 'bg-red-100'}`}>
                        <td className="p-2 border">{index + 1}</td>
                        <td className="p-2 border">${trade.endingCapital.toLocaleString()}</td>
                        <td className="p-2 border" style={{ color: trade.profitLoss >= 0 ? 'green' : 'red' }}>
                          {trade.profitLoss >= 0 ? '+' : '-'}${Math.abs(trade.profitLoss).toLocaleString()}
                        </td>
                        <td className="p-2 border">{trade.result ? 'Win' : 'Loss'}</td>
                        <td className="p-2 border">{new Date(trade.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitLossTracker;