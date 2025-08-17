import CheckBox from './check-box';
import SelectBox from './select-box';

export default function RegisterOptions() {
  return (
    <div className="w-full p-4 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
      </div>
      <div className="mt-4 sm:mt-6">
        <CheckBox title="aaaa" />
      </div>
    </div>
  );
}
