import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from "../components/Dialog";
import { useCatechizer } from "../state/CatechizerContext";

export function ProfilesScreen() {
  const navigate = useNavigate();
  const {
    createProfile,
    currentProfile,
    deleteProfile,
    markDeleteProfileHelpSeen,
    profiles,
    settings,
    switchProfile,
  } = useCatechizer();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteHelpOpen, setIsDeleteHelpOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [error, setError] = useState("");
  const sortedProfiles = useMemo(
    () => [...profiles].sort((left, right) => left.name.localeCompare(right.name)),
    [profiles],
  );

  function submitProfile() {
    const newProfile = createProfile(profileName);

    if (!newProfile) {
      setError(profileName.trim() ? "That profile already exists." : "Profile name cannot be empty.");
      return;
    }

    setIsCreateOpen(false);
    setProfileName("");
    setError("");

    if (!settings.hasSeenDeleteProfileHelp) {
      setIsDeleteHelpOpen(true);
    }
  }

  function selectProfile(profileId: string) {
    switchProfile(profileId);
    navigate("/");
  }

  function dismissDeleteHelp() {
    markDeleteProfileHelpSeen();
    setIsDeleteHelpOpen(false);
  }

  return (
    <main className="profiles-screen">
      <div className="secondary-actions">
        <button className="native-button" onClick={() => setIsCreateOpen(true)} type="button">
          Create Profile
        </button>
        <button className="text-action" onClick={() => navigate("/")} type="button">
          Questions
        </button>
      </div>
      <ul className="profile-list">
        {sortedProfiles.map((profile) => (
          <li key={profile.id}>
            <button
              className={profile.id === currentProfile?.id ? "selected" : ""}
              onClick={() => selectProfile(profile.id)}
              type="button"
            >
              {profile.name}
            </button>
            <button
              aria-label={`Delete ${profile.name}`}
              className="delete-profile"
              onClick={() => deleteProfile(profile.id)}
              type="button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {isCreateOpen && (
        <Dialog onDismiss={() => setIsCreateOpen(false)} title="Create New Profile">
          <label className="dialog-field">
            <span>Enter profile name</span>
            <input
              autoFocus
              onChange={(event) => setProfileName(event.target.value)}
              value={profileName}
            />
          </label>
          {error && <p className="dialog-error">{error}</p>}
          <div className="dialog-actions">
            <button onClick={() => setIsCreateOpen(false)} type="button">Cancel</button>
            <button onClick={submitProfile} type="button">Create</button>
          </div>
        </Dialog>
      )}
      {isDeleteHelpOpen && (
        <Dialog onDismiss={dismissDeleteHelp} title="Deleting a Profile">
          <p className="dialog-copy">
            To delete the user, press and hold the username, and then click Delete.
          </p>
          <div className="dialog-actions">
            <button onClick={dismissDeleteHelp} type="button">OK</button>
          </div>
        </Dialog>
      )}
    </main>
  );
}
