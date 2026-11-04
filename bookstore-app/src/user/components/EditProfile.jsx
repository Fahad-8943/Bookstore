import { useEffect, useState } from "react";
import { faPenToSquare, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateUserProfileAPI } from "../../services/allApi";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

function EditProfile({ user, onClose, onSaved }) {
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const currentPicture = user?.picture
    ? user.picture.startsWith("http")
      ? user.picture
      : `${axiosInstance.defaults.baseURL}/uploads/${user.picture.replace(/^\/+/, "").replace(/^uploads\//, "")}`
    : "";
  const profilePreview = previewUrl || currentPicture;

  const handlePictureChange = (event) => {
    const file = event.target.files?.[0] || null;
    setPicture(file);
    setPreviewUrl((previousUrl) => {
      if (previousUrl) URL.revokeObjectURL(previousUrl);
      return file ? URL.createObjectURL(file) : "";
    });
  };
  const [picture, setPicture] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const saveProfile = async (event) => {
    event.preventDefault();
    if (!user?._id || !sessionStorage.getItem("token")) {
      setSaveError("Please log in again before editing your profile.");
      return;
    }
    if (!username.trim()) {
      setSaveError("Username is required.");
      return;
    }
    if (password !== confirmPassword) {
      setSaveError("Passwords do not match.");
      return;
    }

    setSaving(true);
    setSaveError("");
    const formData = new FormData();
    formData.append("username", username.trim());
    formData.append("bio", bio.trim());
    if (password) formData.append("password", password);
    if (picture) formData.append("picture", picture);

    try {
      const result = await updateUserProfileAPI(user._id, formData);
      if (!result.status || result.status < 200 || result.status >= 300) {
        const error = result.response?.data?.message || result.response?.data;
        setSaveError(typeof error === "string" ? error : "Could not save your profile. Please try again.");
        return;
      }
      onSaved(result.data);
      toast.success("Profile updated successfully.");
    } catch (error) {
      setSaveError(error.response?.data?.message || "Could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="edit-profile-title" className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 id="edit-profile-title" className="text-2xl font-bold text-slate-900">Edit profile</h2>
            <p className="mt-1 text-sm text-slate-500">Update your name, password, bio, or profile picture.</p>
          </div>
          <button type="button" aria-label="Close edit profile" onClick={onClose} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <form onSubmit={saveProfile} className="space-y-5 p-6">
          <div className="flex justify-center">
            <div className="relative h-28 w-28">
              <div className="h-full w-full overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md">
                {profilePreview ? (
                  <img src={profilePreview} alt="Profile preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl text-slate-500">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                )}
              </div>
              <label htmlFor="edit-profile-picture" aria-label="Change profile picture" className="absolute bottom-0 right-0 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-blue-900 text-white shadow-md hover:bg-blue-800">
                <FontAwesomeIcon icon={faPenToSquare} />
              </label>
              <input id="edit-profile-picture" type="file" accept="image/*" onChange={handlePictureChange} className="sr-only" />
            </div>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Username
            <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} required maxLength="50" className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            New password <span className="font-normal text-slate-500">(leave blank to keep current)</span>
            <span className="relative mt-1.5 block">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 pr-12 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
              <button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? "Hide new password" : "Show new password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600">
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </span>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Confirm new password
            <span className="relative mt-1.5 block">
              <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 pr-12 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
              <button type="button" onClick={() => setShowConfirmPassword((shown) => !shown)} aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600">
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </span>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Bio
            <textarea value={bio} onChange={(event) => setBio(event.target.value)} rows="4" maxLength="500" placeholder="Tell readers a little about yourself" className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
          </label>
          {saveError && <p role="alert" className="text-sm text-red-600">{saveError}</p>}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default EditProfile;
