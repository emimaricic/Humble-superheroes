"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import AddSuperheroModal from "./add-superhero-modal";
import { useRouter } from "next/navigation";

interface Superhero {
  id: number;
  name: string;
  superpower: string;
  humilityScore: number;
}

interface SuperheroesListProps {
  initialData: Superhero[]
}

export default function SuperheroesList({ initialData }: SuperheroesListProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSuperheroAdded = () => {
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsModalOpen(true)}>Add Superhero</Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Superpower</TableHead>
                  <TableHead className="text-right">Humility Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialData.map((hero) => (
                  <TableRow key={hero.id}>
                    <TableCell className="font-medium">{hero.name}</TableCell>
                    <TableCell>{hero.superpower}</TableCell>
                    <TableCell className="text-right">
                      {hero.humilityScore}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddSuperheroModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={onSuperheroAdded}
      />
    </div>
  );
}