import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsTreemap from "highcharts/modules/treemap";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import { useMantineTheme } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

HighchartsTreemap(Highcharts);

export interface InitialTreemapChartStateInput {
  title: {
    text: string;
  };
  series?: Highcharts.SeriesOptionsType[];
  yAxis: {
    labels: {
      formatter: Highcharts.AxisLabelsFormatterCallbackFunction;
    };
    max?: number;
  };
  tooltip: {
    pointFormatter: Highcharts.FormatterCallbackFunction<Highcharts.Point>;
  };
  legend?: boolean;
}

export const useTreemapChartState = (
  opts: InitialTreemapChartStateInput
): [Highcharts.Options, Dispatch<SetStateAction<Highcharts.Options>>] => {
  const { other } = useMantineTheme();
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    accessibility: {
      enabled: true,
    },
    title: {
      text: opts.title.text,
      style: {
        fontFamily: "Geist Variable, Roboto, Arial, sans-serif",
        fontWeight: "bold",
        fontSize: "16px",
        color: "#dce1e8",
      },
    },
    credits: {
      enabled: false,
    },
  });

  return [chartOptions, setChartOptions];
};

const TreemapChart: React.FC<HighchartsReact.Props> = (props) => {
  const { width } = useViewportSize();
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  // Reflow chart on window resize
  useEffect(() => {
    chartComponentRef.current?.chart?.reflow();
  }, [width]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={props.options}
      ref={chartComponentRef}
      containerProps={{ style: { height: "100%", width: "100%" } }}
    />
  );
};

export default TreemapChart;
