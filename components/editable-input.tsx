import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { SaveIcon, XIcon, EditIcon } from "lucide-react";

type EditableInputProps = {
  loading?: boolean;
  onSave: () => void;
  onCancel?: () => void;
  renderEditInput: () => ReactNode;
  renderViewInput: () => ReactNode;
};

function EditableInput({
  loading = false,
  onSave,
  onCancel,
  renderEditInput,
  renderViewInput,
}: EditableInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleSave = () => {
    onSave();
    setIsEditing(false);
  };

  const handleCancel = () => {
    setResetKey(k => k + 1); // forces renderEditInput to remount → defaultValue restored
    setIsEditing(false);
    onCancel?.();
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <>
          <div key={resetKey}>{renderEditInput()}</div>
          <Button variant="default" onClick={handleSave} disabled={loading} key="save">
            Save <SaveIcon />
          </Button>
          <Button variant="outline" onClick={handleCancel} disabled={loading} key="cancel">
            Cancel <XIcon />
          </Button>
        </>
      ) : (
        <>
          {renderViewInput()}
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} key="edit">
            <EditIcon />
          </Button>
        </>
      )}
    </div>
  );
}

export default EditableInput;
