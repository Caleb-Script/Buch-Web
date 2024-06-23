'use server'

import { Form } from "react-bootstrap";
import Breadcrumbs from "../../../components/breadcrumbs";
import CreateCustomerFormular from "../../../components/create-form";



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
