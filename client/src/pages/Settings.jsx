import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ name: form.name.trim(), email: form.email.trim() });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword(passwords);
      setPasswords({ currentPassword: "", newPassword: "" });
      toast.success("Password updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-muted">Manage identity for this ledger workspace.</p>
      </div>
      <form className="card space-y-4 p-6" onSubmit={submit}>
        <div>
          <label className="label">Full name</label>
          <input
            className="field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            className="field"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
      <form className="card space-y-4 p-6" onSubmit={submitPassword}>
        <div>
          <p className="text-sm font-semibold">Password</p>
          <p className="mt-1 text-sm text-muted">Requires your current password. A new JWT is issued on success.</p>
        </div>
        <div>
          <label className="label">Current password</label>
          <input
            className="field"
            type="password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
          />
        </div>
        <div>
          <label className="label">New password</label>
          <input
            className="field"
            type="password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            placeholder="At least 8 characters"
          />
        </div>
        <button type="submit" className="btn-primary" disabled={savingPassword}>
          {savingPassword ? "Updating…" : "Update password"}
        </button>
      </form>
      <div className="card p-6">
        <p className="text-sm font-semibold">Session</p>
        <p className="mt-1 text-sm text-muted">Sign out of this browser. Data stays on the server.</p>
        <button type="button" className="btn-secondary mt-4" onClick={logout}>
          Log out
        </button>
      </div>
    </div>
  );
}
