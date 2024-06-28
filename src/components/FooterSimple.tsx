"use client";

import { Container, Group, Anchor } from "@mantine/core";
import classes from "./FooterSimple.module.css";
import Image from "next/image";

const links = [
  { link: "/about-us", label: "About Us" },
  { link: "#", label: "Privacy" },
  { link: "#", label: "Careers" },
];

export function FooterSimple() {
  const items = links.map((link) => (
    <Anchor<"a">
      c="dimmed"
      key={link.label}
      href={link.link}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Image
          src="/logo.png"
          alt="Balance Studio logo"
          height={100}
          width={200}
        />
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
}
