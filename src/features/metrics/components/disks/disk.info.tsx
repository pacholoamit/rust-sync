import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Stack,
  Image,
  Text,
  createStyles,
  Button,
  Center,
  Title,
  Popover,
} from "@mantine/core";
import { Enumerable } from "@/hooks/useServerEventsEnumerableStore";
import { Disk, commands } from "@/lib";
import { IconAlertCircle, IconFolderOpen } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import DynamicProgress, { DynamicProgressRangeInput } from "@/components/dynamic-progress";
import drive from "/drive.png";
import formatBytes from "@/features/metrics/utils/format-bytes";

interface DiskInfoProps {
  disk: Enumerable<Disk>;
}

const useStyles = createStyles((theme) => ({
  section: {
    borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  folder: {
    width: "20px",
    height: "20px",
  },
  label: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));

const DiskDetailsSection: React.FC<{ disk?: Disk }> = ({ disk }) => {
  const range: DynamicProgressRangeInput[] = [
    { from: 0, to: 50, color: "green" },
    { from: 50, to: 80, color: "yellow" },
    { from: 80, to: 100, color: "red" },
  ];

  const free = formatBytes(disk?.free || 0);
  const used = formatBytes(disk?.used || 0);
  const total = formatBytes(disk?.total || 0);

  const tooltip = `Total: ${total}\nUsed: ${used}\nFree: ${free}`;

  return (
    <>
      <Center>
        <Title order={6}>{disk?.name}</Title>
      </Center>
      <Image src={drive} alt="Drive" withPlaceholder />
      <Group position="apart">
        <Text size={"sm"}>Free: {free}</Text>

        <Popover position="left-end" withArrow shadow="md">
          <Popover.Target>
            <ActionIcon variant="transparent">
              <IconAlertCircle size="1rem" />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="xs" style={{ whiteSpace: "pre-line" }}>
              {tooltip}
            </Text>
          </Popover.Dropdown>
        </Popover>
      </Group>
      <DynamicProgress value={disk?.usedPercentage || 0} range={range} />
    </>
  );
};

const DiskInfoSection: React.FC<{ disk?: Disk }> = ({ disk }) => {
  return (
    <Stack spacing={3}>
      <Group position="apart">
        <Text c="dimmed" size={"sm"}>
          Location
        </Text>
        <Badge size="sm" variant="light" color="indigo">
          {disk?.mountPoint}
        </Badge>
      </Group>
      <Group position="apart" align="center">
        <Text c="dimmed" size={"sm"}>
          Disk Type
        </Text>
        <Badge size="sm" variant="light" color="red">
          {disk?.diskType}
        </Badge>
      </Group>
      <Group position="apart">
        <Text c="dimmed" size={"sm"}>
          File System
        </Text>
        <Badge size="sm" variant="light" color="grape">
          {disk?.fileSystem}
        </Badge>
      </Group>
    </Stack>
  );
};

const DiskActionGroup: React.FC<{ disk?: Disk; id: string }> = ({ disk, id }) => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const showDirectory = async () => {
    if (!disk?.mountPoint) return;
    await commands.showInFolder(disk.mountPoint);
  };

  // Encode this id to avoid any issues with special characters
  const onShowDetailsClick = () => navigate(`/disks/${encodeURI(id)}`);

  return (
    <Group mt="xs">
      <Button radius="md" style={{ flex: 1 }} onClick={onShowDetailsClick}>
        Disk Analysis
      </Button>
      <ActionIcon variant="default" radius="md" size={36} onClick={showDirectory}>
        <IconFolderOpen className={classes.folder} stroke={1.5} />
      </ActionIcon>
    </Group>
  );
};

const DiskStatsCard: React.FC<DiskInfoProps> = ({ disk }) => {
  const id = disk?.id;
  const latest = disk.data.at(-1);
  const { classes } = useStyles();

  return (
    <Card shadow="xl" p="xs" radius={"md"} withBorder>
      <Card.Section className={classes.section}>
        <DiskDetailsSection disk={latest} />
      </Card.Section>
      <Card.Section className={classes.section}>
        <DiskInfoSection disk={latest} />
      </Card.Section>
      <DiskActionGroup disk={latest} id={id} />
    </Card>
  );
};

export default DiskStatsCard;
