import { Button, Modal } from "flowbite-react";
import React from "react";

import { IBeach } from "../../contexts/beaches/context";

export interface IDeleteBeachModalProps {
  show: boolean;
  beach: IBeach;
  onClose: () => void;
  onAccept: () => void;
}

const DeleteBeachModal: React.FC<IDeleteBeachModalProps> = ({
  beach,
  onAccept,
  onClose,
  show,
}) => {
  return (
    <Modal
      show={show}
      size="md"
      position="center"
      popup={true}
      onClose={onClose}
    >
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <svg
            className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>

          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to delete {beach.name}?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={onAccept}>
              Yes, I&apos;m sure
            </Button>
            <Button color="gray" onClick={onClose}>
              No, cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteBeachModal;
