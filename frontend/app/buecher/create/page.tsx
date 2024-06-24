'use server'

import { Form } from "react-bootstrap";
import Breadcrumbs from "../../../components/Breadcrumbs";
import CreateCustomerFormular from "../../../components/formulare/CreateFormular";



export default async function Page() {

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Bücher", href: "/buecher" },
          {
            label: "Buch anlegen",
            href: "/buecher/create",
            active: true,
          },
        ]}
      />
      <CreateCustomerFormular />
      <Form />
    </main>
  );
}
