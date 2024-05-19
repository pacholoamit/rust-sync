import { DefaultMantineColor, Title, Space, Stack, Group, Badge, Text, Center } from "@mantine/core";
import { Disk } from "@/lib";

import Card from "@/components/card";
import formatBytes from "@/features/metrics/utils/format-bytes";
import DynamicProgress, { DynamicProgressRangeInput } from "@/components/dynamic-progress";

interface DiskInformationAnalyticsCardProps {
  disk: Disk;
}

const range: DynamicProgressRangeInput[] = [
  { from: 0, to: 50, color: "#47d6ab" },
  { from: 50, to: 80, color: "yellow" },
  { from: 80, to: 100, color: "red" },
];

const DiskInformationAnalyticsCard = (props: DiskInformationAnalyticsCardProps) => {
  const { disk } = props;

  const data: { label: string; value: string; color: DefaultMantineColor }[] = [
    {
      label: "Location",
      value: disk.mountPoint,
      color: "blue",
    },
    {
      label: "Disk Type",
      value: disk.diskType,
      color: "yellow",
    },
    {
      label: "File System",
      value: disk.fileSystem,
      color: "cyan",
    },
    {
      label: "Removable",
      value: disk.isRemovable ? "Yes" : "No",
      color: "lime",
    },
    {
      label: "Free Space",
      value: formatBytes(disk.free),
      color: "green",
    },
    {
      label: "Used Space",
      value: formatBytes(disk.used),
      color: "red",
    },
    {
      label: "Total Space",
      value: formatBytes(disk.total),
      color: "violet",
    },
  ];
  const sections = [
    {
      value: disk.usedPercentage,
      color: range.find((r) => disk.usedPercentage >= r.from && disk.usedPercentage <= r.to)?.color || "blue",
      label: disk.usedPercentage + "%",
    },
  ];

  return (
    <Card height="100%">
      <Title order={4}>Disk Information</Title>
      <Space h={8} />
      <Stack justify="space-between">
        <Stack spacing={3}>
          {data.map((d, i) => (
            <Group key={i} position="apart">
              <Text c="dimmed" size={"sm"}>
                {d.label}
              </Text>
              <Badge size="sm" variant="light" color={d.color}>
                {d.value}
              </Badge>
            </Group>
          ))}
        </Stack>
        <DynamicProgress size={34} range={range} sections={sections} />
      </Stack>
    </Card>
  );
};

export default DiskInformationAnalyticsCard;
