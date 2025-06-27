import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function BTCChart({ actualData, predictedData }) {
  // Step 1: Collect all timestamps (actual + predicted)
  const timestampsSet = new Set();
  actualData.forEach((d) => timestampsSet.add(d.timestamp));
  predictedData.forEach((d) => timestampsSet.add(d.timestamp));
  let allTimestamps = Array.from(timestampsSet).sort();

  // Step 2: Create maps for quick lookup
  const actualMap = new Map(actualData.map((d) => [d.timestamp, d.close_price]));
  const predictedMap = new Map(predictedData.map((d) => [d.timestamp, d.predicted_price]));

  // Step 3: Build combined data array with actualPrice and predictedPrice
  let combinedData = allTimestamps.map((ts) => ({
    timestamp: ts,
    actualPrice: actualMap.get(ts) ?? null,
    predictedPrice: predictedMap.get(ts) ?? null,
  }));

  // Step 4: Add 1 day padding to X axis with a dummy data point
  const lastTimestamp = new Date(allTimestamps[allTimestamps.length - 1]).getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const paddedTimestamp = new Date(lastTimestamp + oneDayMs).toISOString();

  combinedData.push({
    timestamp: paddedTimestamp,
    actualPrice: null,
    predictedPrice: null,
  });

  // Step 5: Calculate min and max for Y axis padding
  const allPrices = combinedData.flatMap(d => [d.actualPrice, d.predictedPrice]).filter(p => p !== null);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);

  // Format X axis tick
  const formatXAxis = (tick) => {
    const dt = new Date(tick);
    return dt.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={combinedData}
        margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={formatXAxis}
          minTickGap={20}
          interval="preserveStartEnd"
          tick={{ fontSize: 12 }}
          allowDuplicatedCategory={false}
          domain={['dataMin', 'dataMax']}
        />
        <YAxis
          domain={[minPrice, maxPrice + 3000]} 
          tickFormatter={(value) => value.toFixed(3)}
          tick={{ fontSize: 12 }}
          width={70}
        />
        <Tooltip
          labelFormatter={(label) => `Time: ${label}`}
          formatter={(value, name, props) => {
            if (value === null || value === undefined) return ['-', name];
            return [value.toFixed(3), name];
          }}
        />
        <Legend verticalAlign="top" />
        <Line
          type="monotone"
          dataKey="actualPrice"
          stroke="#1976d2"
          strokeWidth={2}
          dot={false}
          name="Actual Price"
          connectNulls
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="predictedPrice"
          stroke="#ff7300"
          strokeWidth={2}
          dot={false}
          name="Predicted Price"
          connectNulls
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
