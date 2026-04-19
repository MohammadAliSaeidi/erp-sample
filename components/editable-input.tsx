import { ReactNode, useRef, useState } from "react";
import { Button } from "./ui/button";
import { SaveIcon, XIcon, EditIcon } from "lucide-react";

type EditableInputProps = {
  value: string;
  loading?: boolean;
  onSave: (newValue: string) => void;
  onCancel?: () => void;
  renderEditInput: (props: { ref: React.Ref<HTMLInputElement> }) => ReactNode;
  renderViewInput: (props: { value: string }) => ReactNode;
};

function EditableInput(props: EditableInputProps) {
  const {
    value,
    loading = false,
    onSave,
    onCancel,
    renderEditInput,
    renderViewInput,
  } = props;
  
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const newValue = inputRef.current?.value ?? value;
    if (newValue !== value) onSave(newValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (inputRef.current) inputRef.current.value = value;
    setIsEditing(false);
    onCancel?.();
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <>
          {renderEditInput({ ref: inputRef })}
          <Button
            key='save'
            variant="default"
            size="default"
            onClick={handleSave}
            disabled={loading}
          >
            Save
            <SaveIcon />
          </Button>
          <Button
            key='cancel'
            variant="outline"
            size="default"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel <XIcon />
          </Button>
        </>
      ) : (
        <>
          {renderViewInput({ value })}
          <Button
            key='edit'
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <EditIcon />
          </Button>
        </>
      )}
    </div>
  );
}

export default EditableInput;
