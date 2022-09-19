import useMediaQuery from "@/hooks/useMediaQuery";
import { IconAlertCircle, IconLayoutDashboard } from "@tabler/icons";
import {
  UnstyledButton,
  Group,
  ThemeIcon,
  Text,
  MediaQuery,
  MantineTheme,
  Tooltip,
} from "@mantine/core";

interface NavbarOptionProps {
  icon: React.ReactNode;
  label: string;
}

const NavbarOption: React.FC<NavbarOptionProps> = ({ icon, label }) => {
  const { isSmallerThanLg } = useMediaQuery();
  const position = isSmallerThanLg ? "center" : "left";

  const sx = (theme: MantineTheme) => ({
    display: "block",
    width: "100%",
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    color: theme.colors.dark[0],
    "&:hover": {
      backgroundColor: theme.colors.dark[6],
    },
  });

  return (
    <UnstyledButton sx={sx}>
      <Group position={position}>
        <ThemeIcon variant="gradient">{icon}</ThemeIcon>
        <MediaQuery smallerThan={"lg"} styles={{ display: "none" }}>
          <Text>{label}</Text>
        </MediaQuery>
      </Group>
    </UnstyledButton>
  );
};

const NavbarOptions = () => {
  const options = [
    {
      icon: <IconLayoutDashboard size={16} />,
      label: "Dashboard",
    },
    {
      icon: <IconAlertCircle size={16} />,
      label: "Processes",
    },
  ];

  const navbarOptions = options.map((option) => (
    <NavbarOption {...option} key={option.label} />
  ));
  return <>{navbarOptions}</>;
};

export default NavbarOptions;
