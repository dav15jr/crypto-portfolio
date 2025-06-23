'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useCryptoContext } from '../../Context/context';
import { Ledger, ChartData } from '../../types';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export default function PortfolioChart() {
  const { portfolio } = useCryptoContext();

  const chartConfig = {
    usd: {
      label: 'USD Value',
      color: 'hsl(var(--chart-1))',
    },
    eur: {
      label: 'EUR Value',
      color: 'hsl(var(--chart-2))',
    },
    gbp: {
      label: 'GBP Value',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig;

  // Format the date to show only month and year
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('default', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  // Process data from portfolio entries
  const processChartData = (): ChartData[] => {
    // Group portfolio entries by date
    const dataByDate = portfolio.reduce(
      (acc: Record<string, ChartData>, entry: Ledger) => {
        if (!entry.purchaseDate) return acc;

        const date = new Date(entry.purchaseDate).toISOString().split('T')[0];

        if (!acc[date]) {
          acc[date] = {
            date: formatDate(date),
            usd: 0,
            eur: 0,
            gbp: 0,
          };
        }

        const currency = entry.currency.name.toLowerCase();
        if (currency === 'usd' || currency === 'eur' || currency === 'gbp') {
          acc[date][currency as keyof Omit<ChartData, 'date'>] +=
            entry.currentValue;
        }

        return acc;
      },
      {}
    );

    // Convert to array and sort by date
    const sortedData = Object.values(dataByDate).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate running totals
    const runningTotals = { usd: 0, eur: 0, gbp: 0 };
    return sortedData.map((entry) => {
      const newEntry = {
        date: entry.date,
        usd: entry.usd + runningTotals.usd,
        eur: entry.eur + runningTotals.eur,
        gbp: entry.gbp + runningTotals.gbp,
      };
      runningTotals.usd = newEntry.usd;
      runningTotals.eur = newEntry.eur;
      runningTotals.gbp = newEntry.gbp;
      return newEntry;
    });
  };

  const chartData = processChartData();

  return (
    <Card className="bg-purple-50 shadow-sm border border-border m-3 w-full max-h-[800px] sm:w-3/4 max-w-[800px]">
      <CardHeader className="space-y-1 text-center text-lg text-black">
        <CardTitle>Portfolio Value Over Time</CardTitle>
        <CardDescription>
          Historical view of your portfolio value across currencies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={400} maxHeight={700}>
            <AreaChart
              data={chartData}
              margin={{
                left: 2,
                right: 5,
                top: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatDate}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Legend />
              <Area
                dataKey="usd"
                name="USD"
                type="monotone"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.4}
                stroke="hsl(var(--chart-1))"
                stackId="1"
              />
              <Area
                dataKey="eur"
                name="EUR"
                type="monotone"
                fill="hsl(var(--chart-2))"
                fillOpacity={0.5}
                stroke="hsl(var(--chart-2))"
                stackId="2"
              />
              <Area
                dataKey="gbp"
                name="GBP"
                type="monotone"
                fill="hsl(var(--chart-3))"
                fillOpacity={0.3}
                stroke="hsl(var(--chart-3))"
                stackId="3"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
