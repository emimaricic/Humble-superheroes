import { getSuperheroes } from "@/actions/superhero/get-superheros";
import SuperheroesList from "./_components/superheroes-list";

export default async function Home() {
  const { superheroes } = await getSuperheroes()
  
  return (
    <main className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Humble Superheroes</h1>
          <p className="text-muted-foreground">
            Celebrating our team&apos;s everyday superheroes
          </p>
        </div>
        <SuperheroesList initialData={superheroes} />
      </div>
    </main>
  );
}