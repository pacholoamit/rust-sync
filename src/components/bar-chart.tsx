import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { useMantineTheme } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';

export interface BarChartStatePropsInitialState extends Highcharts.Options {
  custom?: {
    title: string;
    yAxisMax: number;
    yaAxisFormatter: Highcharts.AxisLabelsFormatterCallbackFunction | undefined;
    tooltipPointFomatter: Highcharts.FormatterCallbackFunction<Highcharts.Point> | undefined;
  };
}

export const useBarChartState = (
  props: BarChartStatePropsInitialState
): [BarChartStatePropsInitialState, Dispatch<SetStateAction<BarChartStatePropsInitialState>>] => {
  const { other } = useMantineTheme();

  const [chartOptions, setChartOptions] = useState<BarChartStatePropsInitialState>({
    ...props,
    chart: {
      type: "column",
      backgroundColor: "transparent",
      style: {
        fontFamily: "Geist Variable, Roboto, Arial, sans-serif",
      },
    },

    title: {
      text: props.custom?.title || "",

      style: {
        fontFamily: "Geist Variable, Roboto, Arial, sans-serif",
        fontWeight: "bold",
        fontSize: "16px",
        color: "#dce1e8",
        
      },
    },
    yAxis: {
      max: props.custom?.yAxisMax,
      title: {
        text: null,
      },
      startOnTick: true,
      gridLineColor: other.charts.area.default.gridLineColor,
      lineColor: other.charts.area.default.lineColor,
      labels: {
        formatter: props.custom?.yaAxisFormatter,
        style: {
          color: "white",
        },
      },
    },
    tooltip: {
      pointFormatter: props.custom?.tooltipPointFomatter,
    },

    legend: {
      enabled: false,
      backgroundColor: "transparent",
    },

    credits: {
      enabled: false,
    },

    boost: {
      enabled: true,
      useGPUTranslations: true,
      allowForce: true,
    },
  });

  return [chartOptions, setChartOptions];
};

const BarChart: React.FC<HighchartsReact.Props> = (props) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const { width } = useViewportSize();
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

export default BarChart;
