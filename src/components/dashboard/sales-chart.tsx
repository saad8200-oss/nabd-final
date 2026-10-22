"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SalesChartProps {
  data: { date: string; total: number }[];
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6"
    >
      <h3 className="mb-6 text-lg font-semibold text-foreground">المبيعات — آخر 7 أيام</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#ffffff50"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#ffffff50"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value} ج.م`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid rgba(34, 211, 238, 0.2)",
                borderRadius: "8px",
                backdropFilter: "blur(12px)",
                color: "#fff",
              }}
              itemStyle={{ color: "#22d3ee" }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#22d3ee"
              strokeWidth={3}
              fill="url(#salesGradient)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}