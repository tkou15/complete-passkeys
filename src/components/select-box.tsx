export default function SelectBox() {
  return (
    <div className="w-full">
      <select className="d-select d-select-bordered w-full" defaultValue="">
        <option disabled value="">
          Who shot first?
        </option>
        <option>Han Solo</option>
        <option>Greedo</option>
      </select>
    </div>
  );
}
