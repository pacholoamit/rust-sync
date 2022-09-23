import AreaChart, { DatasetOptions } from "@/components/area-chart";
import useGetMetrics from "@/hooks/useGetMetrics";
import { TauriCommand } from "@/lib";
import { GlobalCpu } from "@/lib/types";
import { ChartProps } from "@/features/metrics/utils/types";

interface GlobalCpuChartProps extends ChartProps {}

const GlobalCpuChart: React.FC<GlobalCpuChartProps> = ({ xAxisMin }) => {
  const [globalCpu] = useGetMetrics<GlobalCpu>(TauriCommand.GlobalCpu);
  const title = "CPU Usage";
  const labels = globalCpu.map((cpu) => cpu.timestamp);
  const datasets: DatasetOptions[] = [
    {
      label: `CPU Usage (%)`,
      data: globalCpu.map((cpu) => ({ x: cpu.timestamp, y: cpu.cpuUsage })),
      backgroundColor: "rgba(255, 99, 132, 0.45)",
      borderColor: "rgba(255, 99, 132, 1)",
      fill: true,
      yAxisId: "global-cpu-usage",
    },
  ];
  return (
    <AreaChart
      title={title}
      labels={labels}
      xAxisMin={xAxisMin}
      datasets={datasets}
    />
  );
};

export default GlobalCpuChart;