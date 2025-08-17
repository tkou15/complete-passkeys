export default function CheckBox({ title }: { title: string }) {
  return (
    <div className="d-form-control">
      <label className="d-label cursor-pointer">
        <input type="checkbox" defaultChecked className="d-checkbox" />
        <span className="d-label-text">{title}</span>
      </label>
    </div>
  );
}
