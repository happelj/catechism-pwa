import { Dialog } from "./Dialog";
import { kjvPassages } from "../data/kjvPassages";

type ProofDialogProps = {
  onDismiss: () => void;
  reference: string;
};

const passageByReference = new Map(kjvPassages.map((passage) => [passage.reference, passage]));

function normalizeLookupReference(reference: string) {
  return reference === "Ps. 92:1-2" ? "Ps. 92 title" : reference;
}

function normalizeTitle(title: string) {
  return title.replace(/^Psalms\b/, "Psalm");
}

export function ProofDialog({ onDismiss, reference }: ProofDialogProps) {
  const passage = passageByReference.get(normalizeLookupReference(reference));
  const title = normalizeTitle(passage?.titleReference ?? reference);

  return (
    <Dialog onDismiss={onDismiss} title={`${title} (KJV)`}>
      <div className="proof-passage">
        {passage?.body ?? "The Android reference data does not include a KJV passage for this proof."}
      </div>
      <div className="dialog-actions">
        <button onClick={onDismiss} type="button">Close</button>
      </div>
    </Dialog>
  );
}
