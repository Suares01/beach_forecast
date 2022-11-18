import React from "react";

import Container from "../../components/Container";
import { useBeaches } from "../../contexts/beaches";
import BeachesTable from "./BeachesTable";
import RegisterBeachForm from "./RegisterBeachForm";

const Beaches: React.FC = () => {
  const { beaches, isLoading } = useBeaches();

  return (
    <Container>
      <RegisterBeachForm />
      {isLoading ? <h4>loading...</h4> : <BeachesTable beaches={beaches} />}
    </Container>
  );
};

export default Beaches;
