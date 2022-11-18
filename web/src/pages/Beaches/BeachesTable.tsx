import { Table } from "flowbite-react";
import React, { useState } from "react";

import { IBeach } from "../../contexts/beaches/context";
import { handlePosition } from "../../utils/handlePosition";
import EditBeachModal from "./EditBeachModal";

export interface IBeachesTableProps {
  beaches: IBeach[];
}

const BeachesTable: React.FC<IBeachesTableProps> = ({ beaches }) => {
  const [modal, setModal] = useState<IBeach | null>(null);

  const onClose = () => setModal(null);
  const openModal = (beach: IBeach) => setModal(beach);

  return (
    <>
      <Table className="my-2" hoverable>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Latitude</Table.HeadCell>
          <Table.HeadCell>Longitude</Table.HeadCell>
          <Table.HeadCell>Position</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Action</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {beaches.map((beach) => (
            <Table.Row
              key={beach.id}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {beach.name}
              </Table.Cell>
              <Table.Cell>{beach.lat}</Table.Cell>
              <Table.Cell>{beach.lng}</Table.Cell>
              <Table.Cell>{handlePosition(beach.position)}</Table.Cell>
              <Table.Cell>
                <button
                  onClick={() => openModal(beach)}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Edit
                </button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {modal && (
        <EditBeachModal show={!!modal} onClose={onClose} beach={modal} />
      )}
    </>
  );
};

export default BeachesTable;
