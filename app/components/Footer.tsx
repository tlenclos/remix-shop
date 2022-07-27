import { Box, Icon, Link, Stack } from "@chakra-ui/react";
import { SiInstagram, SiKofi, SiTwitch } from "react-icons/si";

const ICON_SIZE = 8;

const Footer = () => {
  return (
    <Stack
      as="footer"
      px={4}
      py={3}
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={5}
    >
      <Box>
        <Link href="#" color="primary.500">
          <Icon as={SiInstagram} w={ICON_SIZE} h={ICON_SIZE} />
        </Link>
      </Box>
      <Box>
        <Link href="#" color="primary.500">
          <Icon as={SiTwitch} w={ICON_SIZE} h={ICON_SIZE} />
        </Link>
      </Box>
      <Box>
        <Link href="#" color="primary.500">
          <Icon as={SiKofi} w={ICON_SIZE} h={ICON_SIZE} />
        </Link>
      </Box>
    </Stack>
  );
};

export default Footer;
