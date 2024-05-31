import { FooterSimple } from "@/components/FooterSimple";
import { HeaderSearch } from "@/components/HeaderSearch";
import { Grid, Container, Text } from "@mantine/core";
import { GridCol } from "@mantine/core";
import { BadgeCard } from "@/components/BadgeCard";
import HeroClasses from "@/components/HeroTitle.module.css";

export default function Page(props: any) {
  return (
    <>
      <HeaderSearch />
      <Container>
        <h1 className={HeroClasses.title}>
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            inherit>
            Upcoming Events
          </Text>
        </h1>

        <Text className={HeroClasses.description} color="dimmed">
          Discover the latest events in your area and beyond. Browse our curated
          selection and secure your tickets today.
        </Text>
      </Container>
      <Container>
        <p>Views Tabs (Gallery, Calendar, Map view)</p>
        <span>Filter, Sort Events</span>
        <Grid>
          <GridCol span={{ base: 12, md: 6, lg: 4 }}>
            <BadgeCard />
          </GridCol>
          <GridCol span={{ base: 12, md: 6, lg: 4 }}>
            <BadgeCard />
          </GridCol>
          <GridCol span={{ base: 12, md: 6, lg: 4 }}>
            <BadgeCard />
          </GridCol>
          <GridCol span={{ base: 12, md: 6, lg: 4 }}>
            <BadgeCard />
          </GridCol>
        </Grid>
      </Container>
      <FooterSimple />
    </>
  );
}
