"use client";

import { priorityColors } from "@/lib/data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: Array<{ name: string; low: number; medium: number; high: number }>;
};

export default function DashboardChart({ data }: Props) {
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />

        <Tooltip
          content={
            <CustomTooltip
              active={false}
              label={""}
            />
          }
          cursor={{ fill: "#7f7f7f4f" }}
        />
        <Legend />

        <Bar
          fill={priorityColors.low}
          dataKey="low"
        />
        <Bar
          fill={priorityColors.medium}
          dataKey="medium"
        />
        <Bar
          fill={priorityColors.high}
          dataKey="high"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

type TooltipProps = {
  active: boolean;
  payload?: Array<{ name: string; value: number; fill: string }>;
  label: string;
};

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-white bg-black p-4">
        <h4 className="text-center text-lg font-bold underline">{label}</h4>

        <ul>
          {payload.map(({ name, value, fill }) => (
            <li
              className=""
              style={{ color: fill }}
            >{`${name} : ${value}`}</li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}
