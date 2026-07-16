import { Anchor, Text, Title } from "@mantine/core";
import classes from "./Welcome.module.css";

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to{" "}
        <Text
          inherit
          variant="gradient"
          component="span"
          gradient={{ from: "pink", to: "yellow" }}
        >
          Mantine
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        This is a React Router single-page app (Vite + Mantine). Routes are
        declared in{" "}
        <Anchor href="https://reactrouter.com/" size="lg">
          React Router
        </Anchor>{" "}
        via <code>app/router.tsx</code> and rendered client-side — there is no
        server-side rendering. To learn more about Mantine + Vite follow{" "}
        <Anchor href="https://mantine.dev/guides/vite/" size="lg">
          this guide
        </Anchor>
        . To get started edit <code>app/page.tsx</code>.
      </Text>
    </>
  );
}
