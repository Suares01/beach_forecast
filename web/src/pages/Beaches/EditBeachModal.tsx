import { Button, Label, Modal } from "flowbite-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";

import ControlledInput from "../../components/ControlledInput";
import ControlledSelect from "../../components/ControlledSelect";
import { useBeaches } from "../../contexts/beaches";
import { IBeach } from "../../contexts/beaches/context";
import DeleteBeachModal from "./DeleteBeachModal";

interface IEditBeachModalProps {
  onClose: () => void;
  show: boolean;
  beach: IBeach;
}

interface IFormFields {
  name: string;
  lat: number;
  lng: number;
  position: "S" | "W" | "N" | "E";
}

const validationSchema: yup.SchemaOf<IFormFields> = yup.object({
  name: yup.string().required("Defina o nome da praia"),
  lat: yup.number().not([0], "Defina a latitude").required("Defina a latitude"),
  lng: yup
    .number()
    .not([0], "Defina a longitude")
    .required("Defina a longitude"),
  position: yup
    .string()
    .equals(["S", "W", "N", "E"], "Posição não aceita")
    .required("Defina a posição da praia"),
});

const EditBeachModal: React.FC<IEditBeachModalProps> = ({
  beach,
  onClose,
  show,
}) => {
  const { updateBeach, deleteBeach } = useBeaches();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const onOpenDeleteModal = () => setShowDeleteModal(true);
  const onCloseDeleteModal = () => setShowDeleteModal(false);
  const onAcceptDelete = async () => {
    await deleteBeach(beach.id);
    onCloseDeleteModal();
    onClose();
  };

  const { control, handleSubmit } = useForm<IFormFields>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: beach.name,
      lat: beach.lat,
      lng: beach.lng,
      position: beach.position,
    },
  });

  const handleUpdate = async (data: IFormFields) => {
    await updateBeach({ ...data, id: beach.id });
    onClose();
  };

  const selectOptions = [
    <option key="N" value="N">
      North
    </option>,
    <option key="S" value="S">
      South
    </option>,
    <option key="E" value="E">
      East
    </option>,
    <option key="W" value="W">
      West
    </option>,
  ];

  return (
    <>
      <Modal
        show={showDeleteModal ? false : show}
        position="center"
        size="md"
        onClose={onClose}
      >
        <Modal.Header>Edit {beach.name}</Modal.Header>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <Modal.Body className="flex flex-col gap-3">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium">
                Name
              </Label>
              <ControlledInput
                type="text"
                control={control}
                name="name"
                autoComplete="given-name"
              />
            </div>
            <div>
              <Label htmlFor="lat" className="block text-sm font-medium">
                Latitude
              </Label>
              <ControlledInput
                type="number"
                control={control}
                name="lat"
                autoComplete="123456"
              />
            </div>
            <div>
              <Label htmlFor="lng" className="block text-sm font-medium">
                Longitude
              </Label>
              <ControlledInput
                type="number"
                control={control}
                name="lng"
                autoComplete="123456"
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <Label htmlFor="position" className="block text-sm font-medium">
                Position
              </Label>
              <ControlledSelect
                name="position"
                control={control}
                autoComplete="given-position"
                options={selectOptions}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-between">
            <div className="flex flex-row gap-2">
              <Button type="submit">Update</Button>
              <Button type="button" color="failure" onClick={onOpenDeleteModal}>
                Delete
              </Button>
            </div>
            <Button type="button" color="gray" onClick={onClose}>
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <DeleteBeachModal
        show={showDeleteModal}
        beach={beach}
        onClose={onCloseDeleteModal}
        onAccept={onAcceptDelete}
      />
    </>
  );
};

export default EditBeachModal;
