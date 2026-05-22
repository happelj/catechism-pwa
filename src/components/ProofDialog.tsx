import { Dialog } from "./Dialog";
import { kjvPassages } from "../data/kjvPassages";
import { getKjvVerses } from "../utils/kjvPassageFormatting";

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

function normalizeFormatterReference(reference: string) {
  return reference === "3 John 12" ? "3 John 1:12" : reference;
}

function buildDisplayBody(reference: string, body?: string) {
  if (reference !== "Ps. 92:1-2" || !body) {
    return body;
  }

  return `${body}\n\n\n\nTo shew forth thy lovingkindness in the morning, and thy faithfulness every night,`;
}

export function ProofDialog({ onDismiss, reference }: ProofDialogProps) {
  const passage = passageByReference.get(normalizeLookupReference(reference));
  const title = normalizeTitle(passage?.titleReference ?? reference);
  const verses = getKjvVerses(
    normalizeFormatterReference(reference),
    buildDisplayBody(reference, passage?.body),
  );

  return (
    <Dialog onDismiss={onDismiss} title={`${title} (KJV)`}>
      {verses.length > 0 ? (
        <div className="proof-passage">
          {verses.map((verse) => (
            <p className="proof-verse" key={`${reference}-${verse.verseNumber ?? "single"}`}>
              {verse.verseNumber !== null && <span className="proof-verse-number">{verse.verseNumber}</span>}
              {verse.verseText}
            </p>
          ))}
        </div>
      ) : (
        <p className="proof-unavailable">
          The Android reference data does not include a KJV passage for this proof.
        </p>
      )}
      <div className="dialog-actions">
        <button onClick={onDismiss} type="button">Close</button>
      </div>
    </Dialog>
  );
}
