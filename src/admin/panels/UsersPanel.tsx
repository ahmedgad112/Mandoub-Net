import { useEffect, useState, type FormEvent } from "react";
import {
  createUser,
  deleteUser,
  ensureUsersSeeded,
  getSessionUser,
  updateUser,
  useSite,
  type AdminRole,
  type AdminUser,
} from "@/store/siteStore";
import { Btn, Card, Field, Grid, Input, Select } from "../ui";
import { cn } from "@/utils/cn";

const roleLabel: Record<AdminRole, string> = {
  admin: "مدير",
  editor: "محرر",
};

type FormState = {
  username: string;
  name: string;
  role: AdminRole;
  password: string;
  password2: string;
};

const emptyForm: FormState = {
  username: "",
  name: "",
  role: "editor",
  password: "",
  password2: "",
};

export function UsersPanel() {
  const { admin } = useSite();
  const users = admin.users ?? [];
  const me = getSessionUser();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void ensureUsersSeeded();
  }, []);

  const canManage = !me || me.role === "admin";

  const startEdit = (u: AdminUser) => {
    setEditing(u);
    setForm({
      username: u.username,
      name: u.name,
      role: u.role,
      password: "",
      password2: "",
    });
    setMsg(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(emptyForm);
    setMsg(null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canManage) return;
    setBusy(true);
    setMsg(null);
    try {
      if (editing) {
        if (form.password && form.password !== form.password2) throw new Error("كلمتا المرور غير متطابقتين");
        await updateUser(editing.id, {
          username: form.username,
          name: form.name,
          role: form.role,
          password: form.password || undefined,
        });
        setMsg({ type: "ok", text: "تم تحديث المستخدم بنجاح" });
        cancelEdit();
      } else {
        if (form.password !== form.password2) throw new Error("كلمتا المرور غير متطابقتين");
        await createUser({
          username: form.username,
          name: form.name,
          role: form.role,
          password: form.password,
        });
        setMsg({ type: "ok", text: "تم إضافة المستخدم بنجاح" });
        setForm(emptyForm);
      }
    } catch (err) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "حدث خطأ" });
    } finally {
      setBusy(false);
    }
  };

  const onToggleActive = async (u: AdminUser) => {
    if (!canManage) return;
    try {
      await updateUser(u.id, { active: !u.active });
      setMsg({ type: "ok", text: u.active ? "تم تعطيل الحساب" : "تم تفعيل الحساب" });
    } catch (err) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "حدث خطأ" });
    }
  };

  const onDelete = (u: AdminUser) => {
    if (!canManage) return;
    if (!confirm(`حذف المستخدم «${u.username}» نهائيًا؟`)) return;
    try {
      deleteUser(u.id);
      if (editing?.id === u.id) cancelEdit();
      setMsg({ type: "ok", text: "تم حذف المستخدم" });
    } catch (err) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "حدث خطأ" });
    }
  };

  if (!canManage) {
    return (
      <Card title="المستخدمون" description="إدارة الحسابات متاحة للمديرين فقط.">
        <p className="text-sm text-slate-600">حسابك الحالي بدور محرر — تواصل مع المدير لإضافة مستخدمين جدد.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card
        title={editing ? `تعديل: ${editing.username}` : "إضافة مستخدم جديد"}
        description="كل مستخدم يدخل باسم مستخدم وكلمة مرور. المدير يدير كل شيء، والمحرر يعدّل المحتوى فقط."
        actions={
          editing ? (
            <Btn size="sm" variant="ghost" onClick={cancelEdit}>
              إلغاء التعديل
            </Btn>
          ) : null
        }
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Grid>
            <Field label="اسم المستخدم" hint="حروف إنجليزية صغيرة وأرقام فقط">
              <Input
                dir="ltr"
                autoComplete="off"
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                placeholder="editor1"
                required
              />
            </Field>
            <Field label="الاسم الظاهر">
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="أحمد"
              />
            </Field>
          </Grid>
          <Grid cols={3}>
            <Field label="الدور">
              <Select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as AdminRole }))}>
                <option value="admin">مدير — صلاحيات كاملة</option>
                <option value="editor">محرر — المحتوى فقط</option>
              </Select>
            </Field>
            <Field label={editing ? "كلمة مرور جديدة (اختياري)" : "كلمة المرور"}>
              <Input
                type="password"
                dir="ltr"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required={!editing}
                placeholder={editing ? "اتركها فارغة للإبقاء" : "••••••••"}
              />
            </Field>
            <Field label="تأكيد كلمة المرور">
              <Input
                type="password"
                dir="ltr"
                autoComplete="new-password"
                value={form.password2}
                onChange={(e) => setForm((f) => ({ ...f, password2: e.target.value }))}
                required={!editing || !!form.password}
                placeholder="••••••••"
              />
            </Field>
          </Grid>
          <Btn type="submit" variant="primary" disabled={busy}>
            {busy ? "جارٍ الحفظ…" : editing ? "حفظ التعديلات" : "+ إضافة مستخدم"}
          </Btn>
        </form>
      </Card>

      <Card title={`المستخدمون (${users.length})`} description="الحسابات التي يمكنها الدخول إلى لوحة التحكم.">
        {users.length === 0 ? (
          <p className="text-sm text-slate-500">لا يوجد مستخدمون بعد.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {users.map((u) => {
              const isMe = me?.id === u.id;
              return (
                <li key={u.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-display text-sm font-extrabold",
                        u.active ? "bg-brand-100 text-brand-800" : "bg-slate-100 text-slate-400"
                      )}
                    >
                      {(u.name || u.username).charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-ink-text">
                        {u.name}{" "}
                        {isMe && <span className="text-[10px] font-extrabold text-brand-700">(أنت)</span>}
                      </p>
                      <p className="ltr truncate text-xs text-slate-500">@{u.username}</p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            u.role === "admin" ? "bg-ink-900 text-white" : "bg-slate-200 text-slate-700"
                          )}
                        >
                          {roleLabel[u.role]}
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            u.active ? "bg-brand-100 text-brand-700" : "bg-rose-50 text-rose-600"
                          )}
                        >
                          {u.active ? "نشط" : "معطّل"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Btn size="sm" onClick={() => startEdit(u)}>
                      تعديل
                    </Btn>
                    <Btn size="sm" variant="ghost" onClick={() => onToggleActive(u)} disabled={isMe}>
                      {u.active ? "تعطيل" : "تفعيل"}
                    </Btn>
                    <Btn size="sm" variant="danger" onClick={() => onDelete(u)} disabled={isMe}>
                      حذف
                    </Btn>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {msg && (
        <p
          className={cn(
            "rounded-2xl px-4 py-3 text-sm font-medium",
            msg.type === "ok" ? "bg-brand-50 text-brand-800" : "bg-rose-50 text-rose-600"
          )}
          role="status"
        >
          {msg.text}
        </p>
      )}

      <p className="text-[11px] leading-relaxed text-amber-700/90 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
        ⚠️ الحسابات محفوظة في متصفح هذا الجهاز فقط (موقع ثابت بلا خادم). لنشر الحماية فعليًا على السيرفر تحتاج مصادقة خلفية.
      </p>
    </div>
  );
}
