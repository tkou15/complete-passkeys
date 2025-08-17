import CheckBox from './check-box';
import SelectBox from './select-box';

export default function RegisterOptions() {
  return (
    <div className="flex flex-col flex-wrap">
      {/* User Verification */}
      <div className="flex flex-col">
        <label className="d-label">User Verification</label>
        <SelectBox />
      </div>
      <div className="flex flex-col">
        <label className="d-label">Attachment</label>
        <SelectBox />
      </div>
      <div className="flex flex-col">
        <label className="d-label">Discoverable Credential</label>
        <SelectBox />
      </div>
      <div className="flex flex-col">
        <label className="d-label">Attestation</label>
        <SelectBox />
      </div>
      <div className="flex flex-row">
        <CheckBox title="aaaa" />
      </div>
    </div>
  );
}
