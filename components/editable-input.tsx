import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { SaveIcon, XIcon, EditIcon } from "lucide-react";
import { cn } from "@/features/shared/lib/utils";

type EditableInputProps = {
  loading?: boolean;
  onSave: () => void;
  onCancel?: () => void;
  renderEditInput: () => ReactNode;
  renderViewInput: () => ReactNode;
  hideEditButton?: boolean;
  editLayout?: "horizontal" | "vertical";
  viewLayout?: "horizontal" | "vertical";
  className?: string;
};

function EditableInput(props: EditableInputProps) {
  const {
    loading = false,
    onSave,
    onCancel,
    renderEditInput,
    renderViewInput,
    hideEditButton = false,
    className,
    editLayout = "horizontal",
    viewLayout = "horizontal",
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleSave = () => {
    onSave();
    setIsEditing(false);
  };

  const handleCancel = () => {
    setResetKey((k) => k + 1);
    setIsEditing(false);
    onCancel?.();
  };

  return (
    <div
      className={cn(
        "flex gap-2 w-full",

        isEditing &&
          editLayout === "horizontal" &&
          "flex-row flex-nowrap items-center",

        isEditing && editLayout === "vertical" && "flex-col",

        !isEditing && viewLayout === "vertical" && "flex-col",

        !isEditing &&
          viewLayout === "horizontal" &&
          "flex-row flex-nowrap items-center",

        className,
      )}
    >
      {isEditing ? (
        <>
          <div className="flex-1 min-w-0">{renderEditInput()}</div>
          <div className="flex gap-2 justify-end shrink-0">
            {" "}
            <Button variant="default" onClick={handleSave} disabled={loading}>
              Save <SaveIcon />
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel <XIcon />
            </Button>
          </div>
        </>
      ) : (
        <>
          {renderViewInput()}
          {!hideEditButton && (
            <div className="ms-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                key="edit"
              >
                <EditIcon />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EditableInput;
