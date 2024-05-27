

import React, { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Card from '@/components/card';
import PageWrapper from '@/components/page-wrapper';
import TreemapChart, { useTreemapChartState } from '@/components/treemap-chart';
import DiskDirectoryTreeView from '@/features/metrics/components/disks/disk.directory-treeview';
import DiskInformationAnalyticsCard from '@/features/metrics/components/disks/disk.information-analytics';
import useDisksStore from '@/features/metrics/stores/disk.store';
import formatBytes from '@/features/metrics/utils/format-bytes';
import { commands, DiskAnalysisProgress, DiskItem, streams } from '@/lib';
import {
    Box, Grid, LoadingOverlay, Progress, Stack, Text, Title, useMantineTheme
} from '@mantine/core';

interface AnalysisProgressIndicatorProps {
  enableStatus?: boolean;
  progress: DiskAnalysisProgress;
  pt: string;
}
const AnalysisIndicator: React.FC<AnalysisProgressIndicatorProps> = (props) => {
  const { progress, enableStatus = false } = props;
  const isShowProgress = progress.total > 0 && progress.scanned > 0 && enableStatus;

  if (isShowProgress) {
    const percentage = (props.progress.scanned / props.progress.total) * 100;
    const isScanningCompleted = props.progress.scanned === props.progress.total;
    const scanningProgress = `Scanned ${formatBytes(props.progress.scanned)} of ${formatBytes(props.progress.total)}`;
    const serializingProgress = `Scanning completed, serializing data...`;
    return (
      <Stack align="center" justify="center" spacing="xs" pt={props.pt}>
        <Title order={3}>{isScanningCompleted ? serializingProgress : scanningProgress}</Title>
        <Box style={{ width: "300px" }}>
          <Progress value={percentage} size={"lg"} />
        </Box>
      </Stack>
    );
  }
  return (
    <Stack align="center" justify="center" spacing="xs" pt={props.pt}>
      <Title
        order={1}
        style={{
          textAlign: "center",
          fontWeight: 600,
          fontSize: "3rem",
        }}
      >
        No Data
      </Title>
      <Text c="dimmed" size="md" ta="center">
        Click on "Start Disk Analysis" to start analyzing the disk.
      </Text>
    </Stack>
  );
};

interface DiskAnalyticsPageProps {}

const MemoTreemapChart = React.memo(TreemapChart);

const MemoDiskDirectoryTreeView = React.memo(DiskDirectoryTreeView);

// TODO: Desperately needs refactoring
const DiskAnalyticsPage: React.FC<DiskAnalyticsPageProps> = () => {
  const { id = "" } = useParams();
  const disk = useDisksStore.use.selectedDisk();
  const { colors } = useMantineTheme();
  const [diskAnalysis, setDiskAnalysis] = React.useState<DiskItem[]>([]);
  const [progress, setProgress] = React.useState<DiskAnalysisProgress>({ scanned: 0, total: 0 });
  const [isLoading, setIsLoading] = React.useState(false);
  const isDiskAnalysisEmpty = diskAnalysis.length === 0;

  const [chartOptions, setChartOptions] = useTreemapChartState({
    title: {
      text: `Largest Files in ${disk.mountPoint}`,
    },
    yAxis: {
      labels: {
        formatter: (x) => formatBytes(x.value as number),
      },
    },
  });

  const populateFileExplorer = useCallback(async () => {
    if (disk.mountPoint) {
      streams.diskAnalysisProgress((stream) => setProgress(stream));
      const rootFsTree = await commands.disk_analysis({ path: disk.mountPoint });
      setDiskAnalysis(rootFsTree.children as DiskItem[]);
    }
  }, [disk.mountPoint]);

  const populateTreemap = useCallback(async () => {
    if (disk.mountPoint) {
      const flattened = await commands.disk_analysis_flattened({ path: disk.mountPoint });

      const flattenedTreemapData = flattened.map((item) => {
        return {
          id: item.id,
          name: item.name,
          value: item.size,
        };
      });

      setChartOptions((prev) => ({
        series: [
          {
            type: "treemap",
            layoutAlgorithm: "squarified",
            animationLimit: 1000,
            allowTraversingTree: true,
            allowPointSelect: true,
            accessibility: {
              exposeAsGroupOnly: true,
            },
            dataLabels: {
              enabled: false,
            },
            levels: [
              {
                level: 1,
                colorVariation: {
                  key: "brightness",
                  to: 0.5,
                },
                dataLabels: {
                  enabled: true,
                  style: {
                    fontFamily: "Geist Variable, Roboto, Arial, sans-serif",
                  },
                },
                borderWidth: 0.5,
                layoutAlgorithm: "squarified",
                color: colors.dark[6], // TODO: Create own color for this
                borderColor: colors.dark[3], // TODO: Create own color for this
              },
            ],
            data: flattenedTreemapData, //TODO: Crutch fix this later
          },
        ],
      }));
    }
  }, [disk.mountPoint]);

  const startDiskAnalysis = useCallback(async () => {
    setIsLoading(true);
    await populateFileExplorer();
    setIsLoading(false);
    await populateTreemap();
  }, [disk.mountPoint]);

  return (
    <PageWrapper name={id}>
      <Grid>
        <Grid.Col md={12} lg={4} xl={3}>
          <DiskInformationAnalyticsCard startDiskAnalysis={startDiskAnalysis} />
        </Grid.Col>
        <Grid.Col md={12} lg={8} xl={9}>
          <Card height="350px">
            <Title order={4}>File Explorer</Title>
            {isDiskAnalysisEmpty ? (
              <AnalysisIndicator progress={progress} enableStatus={true} pt="86px" />
            ) : (
              <MemoDiskDirectoryTreeView data={diskAnalysis} />
            )}
          </Card>
        </Grid.Col>
        <Grid.Col xl={12}>
          <Card height="560px">
            <LoadingOverlay visible={isLoading} overlayBlur={3} />
            {isDiskAnalysisEmpty ? (
              <AnalysisIndicator progress={progress} pt="188px" />
            ) : (
              <MemoTreemapChart options={chartOptions} />
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </PageWrapper>
  );
};

export default DiskAnalyticsPage;
