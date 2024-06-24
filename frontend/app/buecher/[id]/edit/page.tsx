import { notFound } from 'next/navigation';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import UpdateBuchFormular from '../../../../components/formulare/edit-form';
import { fetchBuchById } from '../../../../api/buch';




export default async function Page({ params }: { params: { id: number } }) {
  const id = params.id;
  const [{buch}] = await Promise.all([await fetchBuchById(id)]);

  if (!buch) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Bücher', href: '/buecher' },
          {
            label: 'Edit Invoice',
            href: `/buecher/${id}/edit`,
            active: true,
          },
        ]}
      />
      <UpdateBuchFormular buch={buch} />
    </main>
  );
}

