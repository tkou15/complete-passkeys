export default function SelectBox() {
  return (
    <div>
      <select className="d-select d-select-bordered w-full max-w-xs">
        <option disabled selected>
          Who shot first?
        </option>
        <option>Han Solo</option>
        <option>Greedo</option>
      </select>
    </div>
  );
}
