const Trade = require('../models/Trade');

exports.getStats = async (req, res) => {
  try {
    const trades = await Trade.findAll({ order: [['timestamp', 'ASC']] });
    if (trades.length < 2) {
      return res.json({ win_rate: 0, net_profit_loss: 0, capital_growth: [] });
    }

    let wins = 0, losses = 0, netProfitLoss = 0;
    const capitalGrowth = [trades[0].capital];

    for (let i = 1; i < trades.length; i++) {
      const profitLoss = trades[i].capital - trades[i - 1].capital;
      netProfitLoss += profitLoss;
      profitLoss > 0 ? wins++ : losses++;
      capitalGrowth.push(trades[i].capital);
    }

    const winRate = (wins / (wins + losses)) * 100;

    res.json({
      win_rate: winRate,
      net_profit_loss: netProfitLoss,
      capital_growth: capitalGrowth
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
};

exports.getTrades = async (req, res) => {
  try {
    const trades = await Trade.findAll({ order: [['timestamp', 'ASC']] });
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve trades' });
  }
};

exports.addTrade = async (req, res) => {
  try {
    const { capital } = req.body;
    const newTrade = await Trade.create({ capital });
    res.json(newTrade);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add trade' });
  }
};
